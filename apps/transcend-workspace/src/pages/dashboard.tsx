import {useState} from 'react';
import {Sparkles,ArrowRight,UploadCloud,Plus,CalendarDays,Users,BedDouble,ShipWheel,CheckCircle2,User,Clock} from 'lucide-react';
import {useApp,fmtDate,type Row} from '../ctx';
import {attention,progress,forTrip,type Attention} from '../lib/insights';
import {actor} from '../lib/store';
import {Pill} from '../ui/kit';

const greeting=()=>{const h=new Date().getHours();return h<12?'Good morning':h<18?'Good afternoon':'Good evening'};
export const newCharterImport={entities:['clients','departures','contacts','itinerary','agenda','excursions','tasks','notes'],title:'Create a charter from an email or brief',instructions:'This is a new charter inquiry. Create one new charter (departures) record, plus the client, contacts, port days, schedule items and follow-up tasks it mentions.'};

export function useAttentionAction(){const {go,edit,s}=useApp();return (a:Attention)=>{if(a.action.edit){const r=s[a.action.edit.entity].find((x:Row)=>x.id===a.action.edit!.id);if(r){edit(a.action.edit.entity,r);return}}go(a.action.page as any,a.action.sub,a.action.filter)}}

export function AttentionList({items,limit=6}:{items:Attention[],limit?:number}){
 const act=useAttentionAction();const [all,setAll]=useState(false);
 if(!items.length)return <div className="all-clear"><CheckCircle2 size={22}/><div><b>All clear</b><p>Nothing needs attention on this charter.</p></div></div>;
 return <><ul className="attention">{(all?items:items.slice(0,limit)).map(a=><li key={a.id}><button onClick={()=>act(a)}><span className={'dot '+a.level}/><div className="att-main"><b>{a.title}</b>{a.detail&&<small>{a.detail}</small>}</div><div className="att-meta">{a.owner&&<span><User size={12}/>{a.owner}</span>}{a.due&&<span><Clock size={12}/>{fmtDate(a.due,{month:'short',day:'numeric'})}</span>}</div><ArrowRight size={16} className="go"/></button></li>)}</ul>{items.length>limit&&<button className="show-all" onClick={()=>setAll(!all)}>{all?'Show less':'Show all '+items.length}</button>}</>;
}

export default function Dashboard(){
 const {s,trip,ask,importAi,go,setTrip,edit,linked}=useApp();
 const [q,setQ]=useState('');
 const charters=s.departures.filter((d:Row)=>!d.archived&&d.status!=='Cancelled');
 const items=attention(s,trip);
 const name=actor().split(' ')[0];
 return <div className="page">
  <section className="hero">
   <div className="hero-inner">
    <span className="kicker light">{greeting()}{name&&name!=='Workspace'?', '+name:''}</span>
    <h1>What can I help you with?</h1>
    <form className="ask-bar" onSubmit={e=>{e.preventDefault();if(q.trim()){ask(q);setQ('')}}}>
     <Sparkles size={20} className="ask-icon"/>
     <input aria-label="Ask Transcend AI" placeholder="Ask a question, upload a client spreadsheet, or create a charter…" value={q} onChange={e=>setQ(e.target.value)}/>
     <button type="button" className="icon-btn light" title="Upload a file" aria-label="Upload a file" onClick={()=>importAi({entities:['guests','cabins','agenda','itinerary','contacts','tasks','documents'],title:'Upload and organize'})}><UploadCloud size={19}/></button>
     <button type="submit" className="send" aria-label="Ask" disabled={!q.trim()}><ArrowRight size={18}/></button>
    </form>
    <div className="hero-prompts">{['Summarize this charter','Find missing guest details','Draft client update'].map(p=><button key={p} onClick={()=>ask(p)}>{p}</button>)}<button onClick={()=>importAi(newCharterImport)}><Plus size={14}/>Create a charter from an email</button></div>
   </div>
  </section>

  <div className="stat-row">
   <button className="stat" onClick={()=>go('charters')}><ShipWheel size={20}/><b>{charters.length}</b><span>Active charter{charters.length===1?'':'s'}</span></button>
   <button className="stat" onClick={()=>go('guests')}><Users size={20}/><b>{linked('guests').length}</b><span>Guests</span></button>
   <button className="stat" onClick={()=>go('charter','cabins')}><BedDouble size={20}/><b>{linked('cabins').length}</b><span>Cabins recorded</span></button>
   <button className="stat" onClick={()=>go('charter','schedule')}><CalendarDays size={20}/><b>{linked('itinerary').length}</b><span>Itinerary days</span></button>
  </div>

  <div className="dash-grid">
   <section className="card">
    <div className="card-head"><h3>Needs attention<small>{items.length}</small></h3><button className="link-btn" onClick={()=>ask('What’s left before handoff? List by priority with owners and due dates.')}><Sparkles size={14}/>Ask AI to prioritize</button></div>
    <AttentionList items={items}/>
   </section>
   <section className="card">
    <div className="card-head"><h3>Your active charters</h3><button className="btn ghost sm" onClick={()=>edit('departures')}><Plus size={15}/>New</button></div>
    <div className="charter-cards">{charters.map((d:Row)=>{const p=progress(s,d.id);const top=attention(s,d.id).slice(0,2);return <button key={d.id} className={'charter-card'+(d.id===trip?' current':'')} onClick={()=>{setTrip(d.id);go('charter','overview')}}>
     <div className="cc-top"><b>{d.name}</b><Pill>{d.status||'Inquiry'}</Pill></div>
     <span className="cc-dates">{d.startDate?fmtDate(d.startDate,{month:'long',day:'numeric'})+' to '+fmtDate(d.endDate,{month:'long',day:'numeric',year:'numeric'}):'Dates to confirm'}{d.vessel?' · '+d.vessel:''}</span>
     <div className="meter" aria-label={p.percent+'% ready'}><span style={{width:p.percent+'%'}}/></div>
     <span className="cc-ready">{p.percent}% ready for handoff · {forTrip(s,'guests',d.id).length} guests</span>
     {top.length>0&&<ul className="cc-issues">{top.map(a=><li key={a.id}><span className={'dot '+a.level}/>{a.title}</li>)}</ul>}
    </button>})}
    {!charters.length&&<p className="empty-line">No charters yet. Create one from an email, or add it by hand.</p>}</div>
   </section>
  </div>
 </div>;
}
