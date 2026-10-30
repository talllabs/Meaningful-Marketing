import imported from '../data/imported-seed.json';
import {entityKeys} from './catalog';
const clean=(v:any):string=>v==null?'':String(v).replace(/\u00a0/g,' ').trim();
const note=(v:any)=>typeof v==='object'?JSON.stringify(v,null,2):clean(v);
export function initialState(){
 const x:any=imported;const state:any={};for(const k of entityKeys)state[k]=[];
 const trip='departure-global-traveler';const base={departureId:trip,visibility:'Internal only'};
 state.clients=[{id:'client-global-traveler',name:'Global Traveler',clientType:'Groups',accountOwner:'Anita Gonsalves',notes:x.profiles.charterProfile,source:'Profiles tab'}];
 state.tours=[{id:'tour-global-traveler',clientId:'client-global-traveler',name:'Global Traveler and Group Allotment',description:x.profiles.eventProfile,pricingBasis:'Per charter day',currency:'EUR'}];
 state.departures=[{id:trip,name:'Global Traveler and Group Allotment',clientId:'client-global-traveler',tourId:'tour-global-traveler',vessel:'Transcend Connect',startDate:'2026-10-29',endDate:'2026-11-05',startPort:'Brussels',endPort:'Brussels',status:'Planning',deliveryStage:'In Delivery',currency:'EUR',pricingBasis:'Per charter day',eventVersion:'Draft 1',notes:'Imported Event Order. Operational and traveler records require staff review. Contract, waiver evidence and financial totals were not supplied.',source:x.source.file}];
 state.itinerary=x.itinerary.map((r:any)=>({...base,...r,visibility:'Client and ship',source:'Itinerary row '+r.sourceRow}));
 state.guests=x.guests.map((r:any)=>({...base,...r,dietary:r.dietaryNeeds,waiverStatus:'Needs evidence review',verification:'Unverified',notes:[r.notes,r.flightInformation,r.arrival,r.packageName?('Package: '+r.packageName):''].filter(Boolean).join('\n'),source:'Passenger Manifest row '+r.sourceRow}));
 state.agenda=x.agendas.map((r:any)=>({...base,...r,name:r.event||'Planning note / milestone',visibility:r.event?'Client and ship':'Internal only',source:r.sourceSheet+' row '+r.sourceRow}));
 state.contacts=x.contacts.map((r:any)=>({...base,...r,visibility:'Ship team',source:r.sourceSheet+' row '+r.sourceRow}));
 state.notes=x.notes.map((r:any)=>({...base,...r,name:clean(r.text).slice(0,85),details:r.text,category:'General',status:'Open',source:r.sourceSheet+' row '+r.sourceRow}));
 state.cabins=x.rooming.map((r:any)=>({...base,id:r.id,number:clean(r.stateroom),deck:clean(r.stateroom).slice(0,1),category:r.roomType==='click ▼'?'Unconfirmed':clean(r.roomType),capacity:2,bedType:r.bedType==='FOLDABLE'?'Convertible king / twin':'Fixed double',status:'Available',notes:'Source rooming list requires date and identity reconciliation. Listed names: '+[r.guest1FirstName,r.guest1LastName,'/',r.guest2FirstName,r.guest2LastName].map(clean).join(' '),source:'Stateroom Manifest row '+r.sourceRow}));
 state.excursions=x.excursions.map((r:any)=>({...base,...r,status:'Needs review',notes:[r.notes,r.timeOrCount,r.guestsOrTime].filter(Boolean).join('\n'),source:'SHOREX row '+r.sourceRow}));
 for(const [key,category]of Object.entries({switches:'Charter settings',checklist:'Checklist',dailyPlan:'Daily AV schedule',venues:'Venue channels',screens:'Screens',vendors:'Vendor / performer'})){
  const rows=x.av[key]||[];rows.forEach((r:any,i:number)=>state.av.push({...base,...r,id:'av-'+key+'-'+i,name:clean(r.label||r.event||r.venue||r.screen||r.companyOrName||r.name||r.vendor||category),enabled:r.value,checked:r.value,start:r.time,avRequirements:r.av,screen:r.screen,vendor:r.companyOrName,vendorContact:r.phoneOrEmail,category,status:'Needs review',notes:note(r),source:'IT - AV row '+r.sourceRow}));
 }
 state.operations=x.flights.map((r:any)=>({...base,...r,id:r.id,name:[r.flight,r.airline,r.date].filter(Boolean).join(' '),category:'Transfer',requirements:note(r),status:'Needs review',source:'Flight Information row '+r.sourceRow}));
 for(const [i,v]of (x.profiles.vips||[]).entries())state.operations.push({...base,id:'vip-'+i,name:v.name,category:'VIP',requirements:v.notes,status:'Needs review',source:'Profiles'});
 state.tasks=x.issues.map((r:any)=>({...base,...r,name:r.summary,notes:'Source data review: '+r.area,status:'To do',owner:'To assign'}));
 state.tasks.push({...base,id:'task-menu',name:'Upload approved menus and confirm ship receipt',status:'To do',owner:'Account management'});
 state.contracts=[];state.audit=[];state.snapshots=[];state.sourceIssues=x.issues;state.sourceStats=x.stats;state.roomingSource=x.rooming;state.profileSource=x.profiles;state.schemaVersion=1;return state;
}
