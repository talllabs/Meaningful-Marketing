// Works out what needs attention on a charter, plus suggested rooming-list
// matches. Everything here is calculated from the saved records, so the
// dashboard, guest list and assistant all agree.
import {pricing,readiness} from './validation';

type Row=Record<string,any>;

export const blank=(v:any)=>{const s=String(v??'').replace(/ /g,' ').trim();return !s||/^([-–—?]|n\/?a|tbc|tba|none provided)$/i.test(s)};
export const fullName=(g:Row)=>[g.firstName,g.lastName].filter(Boolean).join(' ').replace(/ /g,' ').trim();
export const forTrip=(s:Row,e:string,trip:string)=>(s[e]||[]).filter((r:Row)=>!r.archived&&r.departureId===trip);

// The guest details the ship and client team need before handoff.
export const GUEST_CHECKS:{key:string,label:string,missing:(g:Row)=>boolean}[]=[
 {key:'cabin',label:'Cabin',missing:g=>blank(g.cabin)},
 {key:'email',label:'Email',missing:g=>blank(g.email)},
 {key:'emergency',label:'Emergency contact',missing:g=>blank(g.emergencyName)||blank(g.emergencyPhone)},
 {key:'waiver',label:'Signed waiver',missing:g=>g.waiverStatus!=='Signed evidence uploaded'||!g.waiverDocument},
 {key:'verified',label:'Details checked',missing:g=>g.verification!=='Verified'},
];
export const guestGaps=(g:Row)=>GUEST_CHECKS.filter(c=>c.missing(g)).map(c=>c.label);

export type Attention={id:string,title:string,detail:string,level:'high'|'medium'|'low',owner?:string,due?:string,action:{page:string,sub?:string,filter?:string,edit?:{entity:string,id?:string}}};

function conflicts(s:Row,trip:string){
 const a=forTrip(s,'agenda',trip).filter((r:Row)=>r.start&&r.end&&r.venue&&!/^tba|tbc$/i.test(r.venue));const out:string[]=[];
 const start=(r:Row)=>Date.parse(r.date+'T'+String(r.start).slice(0,5));
 const end=(r:Row)=>{const n=Date.parse((r.endDate||r.date)+'T'+String(r.end).slice(0,5));return n<=start(r)?n+86400000:n};
 for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++){const x=a[i],y=a[j];if(String(x.venue).toLowerCase()===String(y.venue).toLowerCase()&&start(x)<end(y)&&start(y)<end(x))out.push(x.name+' and '+y.name+' overlap in '+x.venue)}
 return out;
}
export {conflicts as scheduleConflicts};

const addDays=(d:string,n:number)=>{if(!d)return undefined;const t=new Date(d+'T12:00:00');t.setDate(t.getDate()+n);return t.toISOString().slice(0,10)};

export function attention(s:Row,trip:string):Attention[]{
 const d=s.departures.find((r:Row)=>r.id===trip);if(!d)return [];
 const client=s.clients.find((c:Row)=>c.id===d.clientId);
 const lead=d.onboardPointOfContact||client?.accountOwner||undefined;
 const finalDue=d.readinessDate||addDays(d.startDate,-14);
 const guests=forTrip(s,'guests',trip),items:Attention[]=[];
 const room=rooming(s,trip);
 if(room.suggested.length||room.unmatched.length)items.push({id:'rooming',title:'Rooming list needs review',detail:(room.suggested.length?room.suggested.length+' suggested matches ready to confirm':'')+(room.suggested.length&&room.unmatched.length?' · ':'')+(room.unmatched.length?room.unmatched.length+' names not on the guest list':''),level:'high',owner:lead,due:finalDue,action:{page:'charter',sub:'cabins'}});
 const price=pricing(s,trip);
 if(!price.amount)items.push({id:'rates',title:'Charter rates not entered',detail:'Add the day rate or per-guest rate to see the charter value.',level:'medium',owner:client?.accountOwner,due:d.finalPaymentDate,action:{page:'charter',sub:'money',edit:{entity:'departures',id:trip}}});
 for(const c of GUEST_CHECKS.filter(c=>!['cabin','verified','waiver'].includes(c.key))){const n=guests.filter(c.missing).length;if(n)items.push({id:'guest-'+c.key,title:n+' guest'+(n===1?' is':'s are')+' missing '+c.label.toLowerCase(),detail:'Ask AI to draft a request, or import an updated manifest.',level:'medium',owner:lead,due:finalDue,action:{page:'guests',filter:c.label}})}
 const noCabin=guests.filter((g:Row)=>blank(g.cabin)).length;
 if(noCabin)items.push({id:'guest-cabin',title:noCabin+' guest'+(noCabin===1?' has':'s have')+' no cabin yet',detail:'Confirm the suggested rooming matches to assign cabins.',level:'high',owner:lead,due:finalDue,action:{page:'charter',sub:'cabins'}});
 const waivers=guests.filter(GUEST_CHECKS[3].missing).length;
 if(waivers)items.push({id:'waivers',title:waivers+' signed waiver'+(waivers===1?'':'s')+' outstanding',detail:'Required for every guest before the final handoff.',level:'medium',owner:lead,due:finalDue,action:{page:'guests',filter:'Signed waiver'}});
 const docs=forTrip(s,'documents',trip).filter((r:Row)=>!['Approved','Final'].includes(r.status));
 if(docs.length)items.push({id:'docs',title:docs.length+' document'+(docs.length===1?'':'s')+' awaiting approval',detail:docs.slice(0,3).map((r:Row)=>r.name).join(', '),level:'medium',owner:lead,due:finalDue,action:{page:'documents'}});
 if(!forTrip(s,'contracts',trip).some((c:Row)=>c.status==='Signed evidence uploaded'&&c.signedDocument))items.push({id:'contract',title:'No signed contract on file',detail:'Upload the signed charter agreement to finalize the handoff.',level:'high',owner:client?.accountOwner,due:d.startDate&&addDays(d.startDate,-60),action:{page:'documents'}});
 const clash=conflicts(s,trip);
 if(clash.length)items.push({id:'conflicts',title:clash.length+' schedule clash'+(clash.length===1?'':'es'),detail:clash[0],level:'medium',owner:lead,action:{page:'charter',sub:'schedule'}});
 const issues=(s.sourceIssues||[]).filter((i:Row)=>i.status!=='Resolved');
 if(issues.length&&trip==='departure-global-traveler')items.push({id:'source',title:issues.length+' conflicts in the original workbook',detail:issues.map((i:Row)=>i.area).join(', '),level:'low',action:{page:'reports',sub:'source'}});
 const today=new Date().toISOString().slice(0,10);
 for(const t of forTrip(s,'tasks',trip).filter((t:Row)=>!['Done','Waived'].includes(t.status)).sort((a:Row,b:Row)=>String(a.dueDate||'9').localeCompare(String(b.dueDate||'9'))).slice(0,6))
  items.push({id:'task-'+t.id,title:t.name,detail:t.dueDate&&t.dueDate<today?'Overdue':'Task',level:t.dueDate&&t.dueDate<today?'high':'low',owner:blank(t.owner)||t.owner==='To assign'?undefined:t.owner,due:t.dueDate,action:{page:'charter',edit:{entity:'tasks',id:t.id}}});
 const rank={high:0,medium:1,low:2};
 return items.sort((a,b)=>rank[a.level]-rank[b.level]);
}

export function progress(s:Row,trip:string){const r=readiness(s,trip);const guests=Math.max(forTrip(s,'guests',trip).length,1);const total=r.length;const done=r.filter(x=>!x.missing).length;const partial=r.reduce((n,x)=>n+(x.missing?Math.max(0,1-x.missing/guests):1),0);return {checks:r,done,total,percent:Math.round(partial/total*100)}}

// ---------- Rooming list matching ----------
const norm=(v:any)=>String(v??'').replace(/ /g,' ').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z ]/g,'').replace(/\s+/g,' ').trim();
function distance(a:string,b:string){const m=a.length,n=b.length;if(Math.abs(m-n)>2)return 9;const d=Array.from({length:m+1},(_,i)=>[i,...Array(n).fill(0)]);for(let j=1;j<=n;j++)d[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n]}

export type RoomMatch={cabin:string,name:string,guest?:Row,confidence:number,reason:string,status:'confirmed'|'suggested'|'conflict'|'unmatched'};

export function rooming(s:Row,trip:string){
 const cabins=new Map(forTrip(s,'cabins',trip).map((c:Row)=>[c.id,c]));
 const rows=(s.roomingSource||[]).filter((r:Row)=>cabins.has(r.id));
 const guests=forTrip(s,'guests',trip);
 const matches:RoomMatch[]=[];const used=new Set<string>();
 for(const r of rows)for(const [f,l] of [[r.guest1FirstName,r.guest1LastName],[r.guest2FirstName,r.guest2LastName]]){
  const first=norm(f),last=norm(l),name=[f,l].map(v=>String(v??'').replace(/ /g,' ').trim()).filter(Boolean).join(' ');
  if(!first&&!last)continue;
  const cabin=String(r.stateroom);let best:Row|undefined,score=0,reason='';
  for(const g of guests){const gf=norm(g.firstName),gl=norm(g.lastName);let sc=0,why='';
   if(gf===first&&gl===last){sc=1;why='Exact name match'}
   else if(gl===last&&first&&gf[0]===first[0]){sc=.85;why='Same last name and first initial'}
   else if(gl&&last&&distance(gf+' '+gl,first+' '+last)<=2){sc=.75;why='Very similar spelling'}
   else if(gl===last&&!first){sc=.6;why='Last name only'}
   if(sc>score||(sc===score&&sc>0&&!used.has(g.id)&&best&&used.has(best.id))){score=sc;best=g;reason=why}}
  if(best&&score===.6&&guests.filter((g:Row)=>norm(g.lastName)===last).length>1){best=undefined;score=0}
  if(!best){matches.push({cabin,name,confidence:0,reason:'Not found on the guest list',status:'unmatched'});continue}
  used.add(best.id);
  const status=String(best.cabin||'')===cabin?'confirmed':!blank(best.cabin)?'conflict':'suggested';
  matches.push({cabin,name,guest:best,confidence:score,reason:status==='conflict'?'Guest list says cabin '+best.cabin:reason,status});
 }
 const roomed=new Set(matches.filter(m=>m.guest).map(m=>m.guest!.id));
 return {matches,suggested:matches.filter(m=>m.status==='suggested'),conflicts:matches.filter(m=>m.status==='conflict'),unmatched:matches.filter(m=>m.status==='unmatched'),notOnRooming:guests.filter((g:Row)=>!roomed.has(g.id)&&blank(g.cabin)),hasSource:rows.length>0};
}

// A compact picture of the charter for the assistant.
export function snapshot(s:Row,trip:string){
 const d=s.departures.find((r:Row)=>r.id===trip)||{};
 const pick=(r:Row,keys:string[])=>Object.fromEntries(keys.filter(k=>!blank(r[k])).map(k=>[k,typeof r[k]==='string'?r[k].slice(0,240):r[k]]));
 const room=rooming(s,trip),p=pricing(s,trip);
 return {
  today:new Date().toISOString().slice(0,10),
  charter:pick(d,['name','status','vessel','startDate','endDate','startPort','endPort','groupSize','capacity','pricingBasis','dailyRate','passengerRate','currency','deliveryStage','onboardPointOfContact','charterDecisionMaker','inclusions','exclusions','specialRequirements','eventProfile','notes']),
  client:pick(s.clients.find((c:Row)=>c.id===d.clientId)||{},['name','clientType','accountOwner','salesStage','notes']),
  charterValue:p.amount?p.amount+' '+p.currency:'rates not entered',
  readiness:progress(s,trip).checks,
  needsAttention:attention(s,trip).map(a=>a.title+(a.owner?' (owner: '+a.owner+')':'')+(a.due?' (due '+a.due+')':'')),
  rooming:{suggestedMatches:room.suggested.length,conflicts:room.conflicts.map(m=>m.name+' → '+m.cabin+': '+m.reason),namesNotOnGuestList:room.unmatched.map(m=>m.name+' (cabin '+m.cabin+')'),guestsWithoutCabin:room.notOnRooming.map(fullName)},
  itinerary:forTrip(s,'itinerary',trip).map((r:Row)=>pick(r,['date','port','arrival','departure','dock'])),
  schedule:forTrip(s,'agenda',trip).map((r:Row)=>[r.date,String(r.start||'').slice(0,5),String(r.end||'').slice(0,5),r.name,r.venue].filter(Boolean).join(' | ')).slice(0,220),
  guests:forTrip(s,'guests',trip).map((g:Row)=>({name:fullName(g),cabin:g.cabin||'',email:blank(g.email)?'':g.email,dietary:blank(g.dietary)?'':String(g.dietary).slice(0,80),missing:guestGaps(g)})),
  cabins:forTrip(s,'cabins',trip).map((c:Row)=>({number:c.number,category:c.category,status:c.status,bed:c.bedType,occupants:forTrip(s,'guests',trip).filter((g:Row)=>String(g.cabin)===String(c.number)).map(fullName)})),
  excursions:forTrip(s,'excursions',trip).map((r:Row)=>pick(r,['name','date','port','status'])),
  transfersAndVips:forTrip(s,'operations',trip).slice(0,40).map((r:Row)=>pick(r,['name','category','date','status'])),
  contacts:forTrip(s,'contacts',trip).map((r:Row)=>pick(r,['name','role','email','phone'])),
  documents:forTrip(s,'documents',trip).map((r:Row)=>pick(r,['name','category','status','receivedByShip'])),
  contracts:forTrip(s,'contracts',trip).map((r:Row)=>pick(r,['name','type','status'])),
  payments:forTrip(s,'payments',trip).map((r:Row)=>pick(r,['name','dueDate','amount','currency','status'])),
  tasks:forTrip(s,'tasks',trip).filter((t:Row)=>!['Done','Waived'].includes(t.status)).map((r:Row)=>pick(r,['name','owner','dueDate','status'])),
  notes:forTrip(s,'notes',trip).slice(0,40).map((r:Row)=>pick(r,['name','category','status'])),
  workbookIssues:(s.sourceIssues||[]).map((i:Row)=>i.area+': '+i.summary),
 };
}
