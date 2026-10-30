import {useMemo,useState} from 'react';
import {Sparkles,Plus,Pencil,MapPin,Anchor,ChevronDown,Check,AlertTriangle,List,LayoutGrid,ArrowRight,Ship,FileText} from 'lucide-react';
import {useApp,fmtDate,fmtTime,fmtMoney,recordName,type Row} from '../ctx';
import {pricing} from '../lib/validation';
import {attention,progress,rooming,forTrip,fullName,scheduleConflicts,blank,type RoomMatch} from '../lib/insights';
import {Pill,RecordList,PageHead} from '../ui/kit';
import {AttentionList,newCharterImport} from './dashboard';

export function ChartersList(){
 const {s,setTrip,go,edit,importAi}=useApp();
 const list=s.departures.filter((d:Row)=>!d.archived).sort((a:Row,b:Row)=>String(a.startDate||'9').localeCompare(String(b.startDate||'9')));
 return <div className="page">
  <PageHead kicker="Charters" title="Every charter, in one place" sub="Open a charter to see its plan, guests, cabins and payments together.">
   <button className="btn ai" onClick={()=>importAi(newCharterImport)}><Sparkles size={16}/>From an email</button>
   <button className="btn primary" onClick={()=>edit('departures',undefined,{status:'Inquiry',vessel:'Transcend Connect'})}><Plus size={16}/>New charter</button>
  </PageHead>
  <div className="charter-grid">{list.map((d:Row)=>{const p=progress(s,d.id),a=attention(s,d.id),client=s.clients.find((c:Row)=>c.id===d.clientId);return <button key={d.id} className="charter-tile" onClick={()=>{setTrip(d.id);go('charter','overview')}}>
   <div className="tile-img"><span className="tile-status"><Pill>{d.status||'Inquiry'}</Pill></span></div>
   <div className="tile-body"><span className="kicker">{client?.name||'Client to confirm'}</span><h3>{d.name}</h3><p>{d.startDate?fmtDate(d.startDate,{month:'short',day:'numeric'})+' – '+fmtDate(d.endDate):'Dates to confirm'}{d.startPort?' · '+d.startPort:''}</p>
    <div className="meter"><span style={{width:p.percent+'%'}}/></div><div className="tile-foot"><span>{p.percent}% ready</span><span>{forTrip(s,'guests',d.id).length} guests · {a.length} to review</span></div></div>
  </button>})}</div>
 </div>;
}

const VIEWS=[['overview','Overview'],['schedule','Day by day'],['cabins','Cabins & rooming'],['money','Money & contracts']];

export default function Charter({sub}:{sub:string}){
 const {current,edit,go,importAi,ask,report}=useApp();
 const view=VIEWS.some(v=>v[0]===sub)?sub:'overview';
 if(!current)return <ChartersList/>;
 return <div className="page">
  <div className="charter-head">
   <div><button className="crumb" onClick={()=>go('charters')}>Charters</button><h1>{current.name}</h1><p className="meta-line"><span><Ship size={14}/>{current.vessel||'Ship to confirm'}</span><span><Anchor size={14}/>{current.startDate?fmtDate(current.startDate,{weekday:'short',month:'short',day:'numeric'})+' – '+fmtDate(current.endDate,{weekday:'short',month:'short',day:'numeric',year:'numeric'}):'Dates to confirm'}</span>{current.startPort&&<span><MapPin size={14}/>{current.startPort}{current.endPort&&current.endPort!==current.startPort?' → '+current.endPort:''}</span>}<Pill>{current.status||'Inquiry'}</Pill></p></div>
   <div className="row-gap wrap"><button className="btn ghost" onClick={()=>ask('Summarize this charter')}><Sparkles size={15}/>Summarize</button><button className="btn ghost" onClick={()=>report('client')}><FileText size={15}/>Client guide</button><button className="btn primary" onClick={()=>edit('departures',current)}><Pencil size={15}/>Edit charter</button></div>
  </div>
  <nav className="segmented" aria-label="Charter views">{VIEWS.map(([k,l])=><button key={k} className={view===k?'on':''} onClick={()=>go('charter',k)}>{l}</button>)}</nav>
  {view==='overview'&&<Overview/>}
  {view==='schedule'&&<Schedule/>}
  {view==='cabins'&&<Cabins/>}
  {view==='money'&&<Money/>}
  {current.amendmentPending&&<p className="callout warn inline">Changed since the last final handoff. The final version stays unchanged until you finalize again in Reports.</p>}
  <button className="fab-import" onClick={()=>importAi({entities:view==='cabins'?['cabins','guests']:view==='money'?['payments','contracts','tasks']:view==='schedule'?['agenda','itinerary','excursions','operations','av']:['departures','contacts','tasks','notes','agenda','guests'],title:'Add information to this charter'})}><Sparkles size={16}/>Add information with AI</button>
 </div>;
}

function Overview(){
 const {s,trip,current,linked,edit,ask}=useApp();
 const p=progress(s,trip),price=pricing(s,trip),client=s.clients.find((c:Row)=>c.id===current.clientId);
 const facts:[string,any][]=[['Client',client?.name],['Account owner',client?.accountOwner],['Onboard contact',current.onboardPointOfContact],['Guests',linked('guests').length+(current.groupSize?' of '+current.groupSize+' planned':'')],['Charter value',price.amount?fmtMoney(price.amount,price.currency):null],['Final review',current.readinessDate?fmtDate(current.readinessDate):null]];
 return <div className="two-col">
  <div className="col">
   <section className="card"><div className="card-head"><h3>Needs attention</h3><button className="link-btn" onClick={()=>ask('What’s left before handoff? List by priority with owners and due dates.')}><Sparkles size={14}/>Prioritize with AI</button></div><AttentionList items={attention(s,trip)} limit={5}/></section>
   <RecordList title="" entity="tasks" rows={linked('tasks').filter((t:Row)=>!['Done','Waived'].includes(t.status))} columns={['name','owner','dueDate','status']} limit={6} empty="No open tasks."/>
   <RecordList title="" entity="notes" rows={linked('notes')} columns={['name','category','status']} limit={5}/>
  </div>
  <div className="col">
   <section className="card ready-card"><div className="ring" style={{['--p' as any]:p.percent}}><b>{p.percent}%</b><small>ready</small></div><div><h3>Ready for the ship?</h3><ul className="checks">{p.checks.map(c=><li key={c.name} className={c.missing?'':'done'}>{c.missing?<span className="dot medium"/>:<Check size={14}/>}{c.name}<small>{c.missing?c.missing+' to go':'Done'}</small></li>)}</ul></div></section>
   <section className="card"><div className="card-head"><h3>Key details</h3><button className="link-btn" onClick={()=>edit('departures',current)}>Edit</button></div><dl className="facts">{facts.map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v||<button className="link-btn add" onClick={()=>edit('departures',current)}>Add</button>}</dd></div>)}</dl>{current.welcomeMessage&&<p className="quote">“{current.welcomeMessage}”</p>}</section>
   <RecordList title="" entity="contacts" rows={linked('contacts')} columns={['name','role','email']} limit={5}/>
  </div>
 </div>;
}

function Schedule(){
 const {s,trip,linked,edit}=useApp();
 const ports=linked('itinerary'),agenda=linked('agenda'),excursions=linked('excursions');
 const days=useMemo(()=>Array.from(new Set([...ports,...agenda].map((r:Row)=>r.date).filter(Boolean))).sort() as string[],[s,trip]);
 const [day,setDay]=useState<string>('');
 const clash=scheduleConflicts(s,trip);
 const shown=day?[day]:days;
 return <div>
  <div className="day-strip">{days.map((d,i)=>{const port=ports.find((p:Row)=>p.date===d);return <button key={d} className={day===d?'on':''} onClick={()=>setDay(day===d?'':d)}><small>Day {i+1}</small><b>{fmtDate(d,{weekday:'short',day:'numeric'})}</b><span>{port?.port||'At sea'}</span></button>})}</div>
  {clash.length>0&&<p className="callout warn inline"><AlertTriangle size={16}/>{clash.length} possible clash{clash.length===1?'':'es'}: {clash.slice(0,2).join('; ')}</p>}
  <div className="timeline">{shown.map(d=>{const port=ports.find((p:Row)=>p.date===d);const items=agenda.filter((a:Row)=>a.date===d).sort((a:Row,b:Row)=>String(a.start||'99').localeCompare(String(b.start||'99')));const ex=excursions.filter((e:Row)=>e.date===d);return <section className="day" key={d}>
   <header><div><span className="kicker">Day {days.indexOf(d)+1} · {fmtDate(d,{weekday:'long',month:'long',day:'numeric'})}</span><h3>{port?.port||'Cruising'}</h3>{port&&<p className="dim">{[port.dock&&'Dock: '+port.dock,port.arrival&&'Arrive '+fmtTime(port.arrival),port.departure&&'Depart '+fmtTime(port.departure)].filter(Boolean).join(' · ')}</p>}</div><div className="row-gap">{port&&<button className="btn ghost sm" onClick={()=>edit('itinerary',port)}>Port details</button>}<button className="btn ghost sm" onClick={()=>edit('agenda',undefined,{date:d,visibility:'Client and ship'})}><Plus size={14}/>Add</button></div></header>
   <ol className="events">{items.map((a:Row)=><li key={a.id}><button onClick={()=>edit('agenda',a)}><time>{fmtTime(a.start)||'—'}{a.end?<small>{fmtTime(a.end)}</small>:null}</time><div><b>{a.name}</b><span>{[a.venue&&!/^tba$/i.test(a.venue)?a.venue:'',a.foodBeverage].filter(Boolean).join(' · ').slice(0,120)}</span></div>{a.visibility==='Internal only'&&<Pill kind="neutral">Internal</Pill>}</button></li>)}
    {ex.map((e:Row)=><li key={e.id} className="excursion"><button onClick={()=>edit('excursions',e)}><time>Tour</time><div><b>{e.name}</b><span>{e.port}</span></div><Pill>{e.status}</Pill></button></li>)}
    {!items.length&&!ex.length&&<li className="empty-line">Nothing scheduled yet.</li>}</ol>
  </section>})}{!days.length&&<p className="empty-line">No itinerary yet. Add port days, or paste the itinerary with AI.</p>}</div>
  <details className="more-section"><summary><ChevronDown size={16}/>Transfers, VIPs and tech <small>{linked('operations').length+linked('av').length} items</small></summary><div className="col"><RecordList title="" entity="operations" rows={linked('operations')} limit={6}/><RecordList title="" entity="av" rows={linked('av')} limit={6}/><RecordList title="" entity="excursions" rows={excursions} limit={6}/></div></details>
 </div>;
}

function Cabins(){
 const {s,trip,linked,edit,save,notify}=useApp();
 const [mode,setMode]=useState<'map'|'list'>('map');
 const cabins=[...linked('cabins')].sort((a:Row,b:Row)=>String(a.number).localeCompare(String(b.number),undefined,{numeric:true}));
 const guests=linked('guests');
 const occupants=(c:Row)=>guests.filter((g:Row)=>String(g.cabin)===String(c.number));
 const decks=Array.from(new Set(cabins.map((c:Row)=>c.deck||String(c.number)[0]))).sort();
 const r=rooming(s,trip);
 const state=(c:Row)=>['Blocked','Out of service'].includes(c.status)?'blocked':occupants(c).length?'taken':r.matches.some(m=>m.cabin===String(c.number)&&m.status==='suggested')?'suggested':'free';
 const counts={free:cabins.filter((c:Row)=>state(c)==='free').length,taken:cabins.filter((c:Row)=>state(c)==='taken').length,suggested:cabins.filter((c:Row)=>state(c)==='suggested').length,blocked:cabins.filter((c:Row)=>state(c)==='blocked').length};
 async function accept(list:RoomMatch[]){const next=structuredClone(s);for(const m of list)next.guests=next.guests.map((g:Row)=>g.id===m.guest!.id?{...g,cabin:m.cabin}:g);if(await save(next,'Confirmed '+list.length+' rooming match'+(list.length===1?'':'es')))notify(list.length+' cabin'+(list.length===1?'':'s')+' assigned')}
 const confident=r.suggested.filter(m=>m.confidence>=.85);
 return <div>
  <div className="cabin-summary">
   <div className="legend"><span><i className="free"/>Available <b>{counts.free}</b></span><span><i className="taken"/>Assigned <b>{counts.taken}</b></span><span><i className="suggested"/>Suggested <b>{counts.suggested}</b></span><span><i className="blocked"/>Blocked <b>{counts.blocked}</b></span></div>
   <div className="seg-mini"><button className={mode==='map'?'on':''} onClick={()=>setMode('map')} aria-label="Deck map"><LayoutGrid size={15}/>Map</button><button className={mode==='list'?'on':''} onClick={()=>setMode('list')} aria-label="Full list"><List size={15}/>Full list</button></div>
  </div>
  {r.hasSource&&(r.suggested.length>0||r.conflicts.length>0||r.unmatched.length>0)&&<section className="card rooming-card">
   <div className="card-head"><div><h3><Sparkles size={16}/>Rooming list matches</h3><p className="dim">Names from the client’s rooming list, matched to your guest list. Confirm before cabins are assigned.</p></div>{confident.length>0&&<button className="btn primary" onClick={()=>accept(confident)}><Check size={15}/>Confirm {confident.length} strong match{confident.length===1?'':'es'}</button>}</div>
   {(s.sourceIssues||[]).some((i:Row)=>i.area==='Rooming')&&<p className="callout warn inline"><AlertTriangle size={15}/>{s.sourceIssues.find((i:Row)=>i.area==='Rooming').summary}</p>}
   <ul className="matches">{[...r.suggested,...r.conflicts,...r.unmatched].slice(0,60).map((m,i)=><li key={i} className={m.status}><span className="cabin-no">{m.cabin}</span><div><b>{m.name}</b><small>{m.guest&&m.status!=='unmatched'?'→ '+fullName(m.guest)+' · ':''}{m.reason}</small></div>{m.status==='suggested'?<button className="btn ghost sm" onClick={()=>accept([m])}><Check size={14}/>Confirm</button>:m.status==='conflict'?<button className="btn ghost sm" onClick={()=>edit('guests',m.guest)}>Review</button>:<Pill kind="warn">Not on guest list</Pill>}</li>)}</ul>
   {r.notOnRooming.length>0&&<p className="dim small">{r.notOnRooming.length} guest{r.notOnRooming.length===1?' is':'s are'} on the guest list but not the rooming list: {r.notOnRooming.slice(0,6).map(fullName).join(', ')}{r.notOnRooming.length>6?'…':''}</p>}
  </section>}
  {mode==='map'?<div className="decks">{decks.map(d=><section className="card deck" key={d}><div className="card-head"><h3>Deck {d}</h3><small className="dim">{cabins.filter((c:Row)=>(c.deck||String(c.number)[0])===d).length} cabins</small></div><div className="cabin-grid">{cabins.filter((c:Row)=>(c.deck||String(c.number)[0])===d).map((c:Row)=>{const o=occupants(c);const st=state(c);const sug=r.matches.find(m=>m.cabin===String(c.number)&&m.status==='suggested');return <button key={c.id} className={'cabin '+st} onClick={()=>edit('cabins',c)} title={o.map(fullName).join(', ')||c.status}><b>{c.number}</b><span>{o.length?o.map((g:Row)=>g.lastName||g.firstName).join(' & '):st==='suggested'?sug?.name:st==='blocked'?c.status:'Open'}</span><small>{[c.category!=='Unconfirmed'&&c.category,c.bedType?.split(' ')[0]].filter(Boolean).join(' · ')}</small></button>})}</div></section>)}{!cabins.length&&<p className="empty-line">No cabins yet. Upload the cabin allotment or rooming list with AI.</p>}</div>
  :<RecordList entity="cabins" rows={cabins} limit={200} columns={['number','category','bedType','status']}/>}
 </div>;
}

function Money(){
 const {s,trip,current,linked,edit}=useApp();
 const price=pricing(s,trip),payments=linked('payments');
 const cur=current.currency||'EUR';
 const due=payments.filter((p:Row)=>p.status!=='Cancelled'&&p.type!=='Credit'&&p.type!=='Refund').reduce((n:number,p:Row)=>n+Number(p.amount||0),0);
 const paid=payments.filter((p:Row)=>p.status==='Paid'&&(p.type||'Charge')==='Charge').reduce((n:number,p:Row)=>n+Number(p.amount||0),0);
 return <div>
  <div className="money-row">
   <div className="card money"><span>Charter value</span><b>{price.amount?fmtMoney(price.amount,price.currency):'Not set'}</b><small>{price.basis} · {price.basis==='Per passenger'?price.count+' guests':price.days+' itinerary days'}</small>{!price.amount&&<button className="link-btn" onClick={()=>edit('departures',current)}>Enter rates <ArrowRight size={14}/></button>}</div>
   <div className="card money"><span>Scheduled</span><b>{fmtMoney(due,cur)}</b><small>{payments.length} payment{payments.length===1?'':'s'}</small></div>
   <div className="card money"><span>Received</span><b>{fmtMoney(paid,cur)}</b><small>Recorded manually</small></div>
   <div className="card money accent"><span>Balance</span><b>{fmtMoney(Math.max(due-paid,0),cur)}</b><small>Still to collect</small></div>
  </div>
  <div className="col">
   <RecordList title="" entity="payments" rows={payments} addDefaults={{type:'Charge',currency:cur,status:'Scheduled'}} empty="No payment schedule yet. Add the deposit and balance dates, or upload the contract with AI."/>
   <RecordList title="" entity="contracts" rows={linked('contracts')} empty="No contracts yet."/>
   {current.clientId&&<section className="card"><div className="card-head"><h3>Client</h3><button className="link-btn" onClick={()=>edit('clients',s.clients.find((c:Row)=>c.id===current.clientId))}>Open client record</button></div><p className="dim">{recordName(s.clients.find((c:Row)=>c.id===current.clientId)||{})} · {blank(s.clients.find((c:Row)=>c.id===current.clientId)?.salesStage)?'Sales stage not set':s.clients.find((c:Row)=>c.id===current.clientId).salesStage}</p></section>}
  </div>
 </div>;
}
