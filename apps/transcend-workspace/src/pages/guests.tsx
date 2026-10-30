import {useMemo,useState} from 'react';
import {Sparkles,Plus,Search,Download,ChevronRight,Mail,Utensils} from 'lucide-react';
import {useApp,csvEscape,download,type Row} from '../ctx';
import {catalog} from '../lib/catalog';
import {GUEST_CHECKS,guestGaps,fullName,blank} from '../lib/insights';
import {PageHead} from '../ui/kit';

export default function Guests({filter:initial}:{filter?:string}){
 const {linked,edit,importAi,ask,current}=useApp();
 const [q,setQ]=useState(''),[filter,setFilter]=useState(initial||'All');
 const guests=linked('guests');
 const filters=['All','Missing details',...GUEST_CHECKS.map(c=>c.label),'Dietary needs'];
 const count=(f:string)=>guests.filter(g=>match(g,f)).length;
 function match(g:Row,f:string){if(f==='All')return true;if(f==='Missing details')return guestGaps(g).some(x=>!['Details checked','Signed waiver'].includes(x));if(f==='Dietary needs')return !blank(g.dietary)||!blank(g.allergies);const c=GUEST_CHECKS.find(c=>c.label===f);return c?c.missing(g):true}
 const rows=useMemo(()=>guests.filter(g=>match(g,filter)&&(!q||JSON.stringify(g).toLowerCase().includes(q.toLowerCase()))).sort((a,b)=>String(a.lastName).localeCompare(String(b.lastName))),[guests,filter,q]);
 const complete=guests.filter(g=>!guestGaps(g).some(x=>!['Details checked','Signed waiver'].includes(x))).length;
 function exportCSV(){const fields=catalog.guests.fields;download('guests-'+(current?.name||'charter').replace(/\W+/g,'-').toLowerCase()+'.csv',[fields.map(f=>csvEscape(f.label)).join(','),...guests.map(r=>fields.map(f=>csvEscape(r[f.key])).join(','))].join('\r\n'),'text/csv')}
 return <div className="page">
  <PageHead kicker={current?.name} title="Guests" sub={guests.length?<><b>{complete}</b> of {guests.length} guests have their key details. Gaps are shown on each guest.</>:'Add guests one by one, or upload the client’s manifest and AI will organize it.'}>
   <button className="btn ghost" onClick={()=>ask('Find missing guest details. Group the guests by what is missing and draft a short, friendly email asking the client for those details.')}><Sparkles size={15}/>Find missing details</button>
   <button className="btn ai" onClick={()=>importAi({entities:['guests','cabins','reservations'],title:'Upload a guest manifest or rooming list'})}><Sparkles size={15}/>Upload manifest</button>
   <button className="btn primary" onClick={()=>edit('guests')}><Plus size={16}/>Add guest</button>
  </PageHead>
  {guests.length>0&&<div className="completeness"><div className="meter big"><span style={{width:Math.round(complete/guests.length*100)+'%'}}/></div><span>{Math.round(complete/guests.length*100)}% complete</span></div>}
  <div className="toolbar">
   <div className="chips scroll">{filters.map(f=>{const n=count(f);return (f==='All'||n>0)&&<button key={f} className={'chip toggle'+(filter===f?' on':'')} onClick={()=>setFilter(f)}>{f}<small>{n}</small></button>})}</div>
   <div className="row-gap"><label className="search"><Search size={16}/><input aria-label="Search guests" placeholder="Search guests" value={q} onChange={e=>setQ(e.target.value)}/></label><button className="icon-btn" title="Download CSV" aria-label="Download guests as CSV" onClick={exportCSV}><Download size={18}/></button></div>
  </div>
  <section className="card flush">
   {rows.length?<ul className="guest-list">{rows.map(g=>{const gaps=guestGaps(g).filter(x=>x!=='Details checked');return <li key={g.id}><button onClick={()=>edit('guests',g)}>
    <span className="avatar-i">{(g.firstName?.[0]||'')+(g.lastName?.[0]||'')}</span>
    <div className="g-main"><b>{fullName(g)||'Unnamed guest'}{g.preferredName?<small> “{g.preferredName}”</small>:null}</b><span>{!blank(g.email)?<><Mail size={12}/>{g.email}</>:<em className="dim">No email</em>}{!blank(g.dietary)&&<><Utensils size={12}/>{String(g.dietary).slice(0,40)}</>}</span></div>
    <div className="g-cabin">{blank(g.cabin)?<span className="dim">No cabin</span>:<><small>Cabin</small><b>{g.cabin}</b></>}</div>
    <div className="g-gaps">{gaps.length?gaps.map(x=><span className="gap" key={x}>{x}</span>):<span className="ok">Complete</span>}</div>
    <ChevronRight size={16} className="chev"/></button></li>})}</ul>:<p className="empty-line">{guests.length?'No guests match.':'No guests yet.'}</p>}
  </section>
 </div>;
}
