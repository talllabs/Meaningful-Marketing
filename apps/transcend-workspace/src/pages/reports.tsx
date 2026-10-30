import {useEffect,useState} from 'react';
import {Ship,Users,Sparkles,Download,Upload,RotateCcw,Lock,AlertTriangle,Plug,Search,ChevronDown,Check} from 'lucide-react';
import {useApp,fmtDate,download,type Row} from '../ctx';
import {entityKeys} from '../lib/catalog';
import {actor,setActor,restoreBackup,resetWorkspace} from '../lib/store';
import {progress,scheduleConflicts} from '../lib/insights';
import {PageHead,Pill} from '../ui/kit';

const DRAFTS=[['Charter summary','Write a one-page charter summary for the internal team: key facts, guests, daily highlights, open issues with owners.'],['Client update email','Draft client update'],['Event order overview','Draft an event order overview for the ship team, day by day, with times, venues, food and beverage and AV notes.'],['Crew briefing','Draft a crew briefing for day 1'],['Guest details request','Find missing guest details. Draft a friendly email to the client asking for them, grouped by guest.']];

export default function Reports({sub}:{sub?:string}){
 const {s,trip,current,report,ask,save,linked,notify,fail}=useApp();
 const [who,setWho]=useState(actor());
 const snaps=(s.snapshots||[]).filter((v:Row)=>v.departureId===trip);
 const p=progress(s,trip);
 useEffect(()=>{if(sub==='source')document.getElementById('source')?.scrollIntoView({behavior:'smooth'})},[sub]);
 async function finalize(){const missing=p.checks.reduce((n,r)=>n+r.missing,0);const contract=linked('contracts').some((r:Row)=>r.status==='Signed evidence uploaded'&&r.signedDocument);if(missing||scheduleConflicts(s,trip).length||!contract){fail('The final handoff needs every guest checked, cabins assigned, waiver evidence, documents approved, tasks done, a signed contract and no schedule clashes. Use the draft previews until then.');return}if(!confirm('Create a frozen handoff version? Later edits will need another review.'))return;const next=structuredClone(s);const version=snaps.length+1;const snapshot:Row={};entityKeys.forEach(k=>snapshot[k]=structuredClone(next[k]));next.snapshots.push({id:crypto.randomUUID(),departureId:trip,version:'Final '+version,at:new Date().toISOString(),state:snapshot});next.departures=next.departures.map((d:Row)=>d.id===trip?{...d,status:'Final',eventVersion:'Final '+version,amendmentPending:false}:d);if(await save(next,'Finalized Event Order version '+version))notify('Final version '+version+' saved')}
 async function restore(f:File){try{await restoreBackup(JSON.parse(await f.text()));location.reload()}catch(e:any){fail(String(e.message||e))}}
 async function reset(empty:boolean){if(!confirm(empty?'Start an empty workspace? Download a backup first to keep this one.':'Reload the original Event Order? This replaces everything saved in this browser. Download a backup first to keep it.'))return;await resetWorkspace(empty);location.reload()}
 return <div className="page">
  <PageHead kicker={current?.name} title="Reports" sub="Share-ready guides, AI drafts and the final handoff."/>
  <div className="report-tiles">
   <button className="report-tile" onClick={()=>report('client')}><Users size={24}/><b>Client guide</b><span>Itinerary, daily plan, contacts and approved documents. No internal notes or prices.</span></button>
   <button className="report-tile navy" onClick={()=>report('ship')}><Ship size={24}/><b>Ship report</b><span>Operational plan with rooming, dietary and accessibility needs for the ship team.</span></button>
  </div>
  <section className="card"><div className="card-head"><h3><Sparkles size={16}/>Draft with AI</h3><span className="dim small">Opens in the assistant. Nothing is sent.</span></div><div className="draft-grid">{DRAFTS.map(([t,q])=><button key={t} onClick={()=>ask(q)}><Sparkles size={15}/>{t}</button>)}</div></section>
  <section className="card"><div className="card-head"><div><h3><Lock size={16}/>Final handoff</h3><p className="dim">Freeze a reviewed copy before sending it to the ship. Later edits never change a final copy.</p></div><button className="btn primary" onClick={finalize}>Finalize ({p.percent}% ready)</button></div>{snaps.length?<ul className="plain-list">{snaps.map((v:Row)=><li key={v.id}><b>{v.version}</b><span className="dim">{new Date(v.at).toLocaleString()}</span><button className="link-btn" onClick={()=>report('ship',true)}>Open</button></li>)}</ul>:<p className="empty-line">No final versions yet.</p>}</section>
  <details className="card more-section"><summary><ChevronDown size={16}/>Activity history <small>{(s.audit||[]).length}</small></summary><ul className="history">{(s.audit||[]).slice(0,80).map((r:Row)=><li key={r.id}><span className="dot low"/><div><b>{r.action}</b><small>{r.actor} · {new Date(r.at).toLocaleString()}</small></div></li>)}</ul></details>
  <section className="card storage"><div><h3>Where your work is saved</h3><p className="dim">Everything, including uploaded files, is saved in this web browser on this computer. Download a backup to keep a copy or open it on another computer.</p><label className="field"><span>Your name (shown in the history and greeting)</span><input value={who} onChange={e=>setWho(e.target.value)} onBlur={()=>setActor(who||'Kim')}/></label></div>
   <div className="row-gap wrap"><button className="btn" onClick={()=>download('transcend-workspace-backup-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(s,null,2))}><Download size={16}/>Download backup</button><label className="btn"><Upload size={16}/>Restore backup<input type="file" hidden accept=".json,application/json" onChange={e=>{if(e.target.files?.[0])restore(e.target.files[0]);e.target.value=''}}/></label><button className="btn ghost" onClick={()=>reset(false)}><RotateCcw size={15}/>Reload original Event Order</button><button className="btn ghost danger" onClick={()=>reset(true)}>Start empty</button></div></section>
  <Connections/>
  <SourceWorkbook/>
 </div>;
}

function Connections(){
 const {s,save,notify}=useApp();
 const [c,setC]=useState(s.sharepoint||{siteUrl:'',library:'Charter Documents',lists:'Clients, Charters, Guests, Cabins, Itinerary, Schedule, Payments, Tasks'});
 return <details className="card more-section"><summary><ChevronDown size={16}/>Connections & SharePoint</summary>
  <div className="connections"><div><p className="dim">The plan is for SharePoint to stay the team’s home for records: changes here would update SharePoint, and SharePoint changes would appear here. That sync still needs Microsoft access and testing before it’s switched on.</p>
   <div className="form-grid"><label className="field"><span>SharePoint site URL</span><input value={c.siteUrl} onChange={e=>setC({...c,siteUrl:e.target.value})}/></label><label className="field"><span>Document library</span><input value={c.library} onChange={e=>setC({...c,library:e.target.value})}/></label><label className="field wide"><span>Lists to connect</span><input value={c.lists} onChange={e=>setC({...c,lists:e.target.value})}/></label></div>
   <button className="btn" onClick={async()=>{if(await save({...s,sharepoint:c},'Updated SharePoint plan'))notify('SharePoint plan saved')}}><Check size={15}/>Save plan</button></div>
   <ul className="plain-list">{[['Transcend AI','Reads files, answers questions, drafts updates',true],['SharePoint','Two-way sync of records and files',false],['HubSpot','Clients and sales stages',false],['Docusign','Signatures',false],['Microsoft sign-in','Staff and client access',false],['Payments / NetSuite','Collection and accounting',false]].map(([n,d,on])=><li key={n as string}><Plug size={16}/><div><b>{n}</b><small>{d}</small></div><Pill kind={on?'good':'neutral'}>{on?'Connected':'Not yet'}</Pill></li>)}</ul></div>
 </details>;
}

function SourceWorkbook(){
 const {s}=useApp();
 const [src,setSrc]=useState<Row|null>(null),[tab,setTab]=useState('Itinerary'),[q,setQ]=useState(''),[open,setOpen]=useState(false);
 useEffect(()=>{if(open&&!src)fetch(import.meta.env.BASE_URL+'source-workbook.json').then(r=>r.json()).then(setSrc).catch(()=>setSrc({tabs:[]}))},[open]);
 const sel=src?.tabs?.find((t:Row)=>t.name===tab);
 return <details id="source" className="card more-section" onToggle={e=>setOpen((e.target as HTMLDetailsElement).open)} open={open}><summary><ChevronDown size={16}/>Original Event Order workbook <small>17 tabs</small></summary>
  {(s.sourceIssues||[]).length>0&&<ul className="issue-list">{s.sourceIssues.map((i:Row)=><li key={i.id}><AlertTriangle size={15}/><span><b>{i.area}</b> {i.summary}</span></li>)}</ul>}
  <div className="toolbar"><select aria-label="Workbook tab" value={tab} onChange={e=>setTab(e.target.value)}>{src?.tabs?.map((t:Row)=><option key={t.name}>{t.name}</option>)}</select><label className="search"><Search size={16}/><input placeholder="Search this tab" value={q} onChange={e=>setQ(e.target.value)}/></label></div>
  <div className="source-rows">{!src?<p className="empty-line">Loading…</p>:sel?.rows.filter((r:Row)=>!q||JSON.stringify(r).toLowerCase().includes(q.toLowerCase())).slice(0,300).map((r:Row)=><div className="source-row" key={r.row}><span>{r.row}</span><div>{r.cells.map((c:Row)=><p key={c.column}><small>{c.column}</small>{typeof c.value==='object'?JSON.stringify(c.value):String(c.value??'')}</p>)}</div></div>)}</div>
 </details>;
}

export function ReportView({data:d,onClose}:{data:Row,onClose:()=>void}){
 return <div className="report-overlay"><header className="report-bar"><button className="btn ghost" onClick={onClose}>← Back</button><span>{d.mode==='client'?'Client guide':'Ship report'} · {d.version}</span><button className="btn primary" onClick={()=>window.print()}><Download size={16}/>Print / save PDF</button></header>
  <article className="report-sheet"><img className="report-logo" src={import.meta.env.BASE_URL+'transcend-logo-navy.png'} alt="Transcend"/><span className="kicker">{d.mode==='client'?'Client guide':'Ship report'} · {d.version}</span><h1>{d.departure.name}</h1><p className="sub">{d.departure.vessel} · {fmtDate(d.departure.startDate,{month:'long',day:'numeric'})} – {fmtDate(d.departure.endDate,{month:'long',day:'numeric',year:'numeric'})}</p>{d.departure.welcomeMessage&&<p className="welcome">{d.departure.welcomeMessage}</p>}
   <h2>Itinerary</h2><table><thead><tr><th>Date</th><th>Port</th><th>Arrive</th><th>Depart</th><th>Dock</th></tr></thead><tbody>{d.itinerary.map((r:Row,i:number)=><tr key={i}><td>{fmtDate(r.date,{weekday:'short',month:'short',day:'numeric'})}</td><td>{r.port}</td><td>{String(r.arrival||'').slice(0,5)}</td><td>{String(r.departure||'').slice(0,5)}</td><td>{r.dock}</td></tr>)}</tbody></table>
   <h2>Daily plan</h2><table><thead><tr><th>When</th><th>What</th><th>Where & details</th></tr></thead><tbody>{d.agenda.map((r:Row,i:number)=><tr key={i}><td>{fmtDate(r.date,{month:'short',day:'numeric'})}<br/>{String(r.start||'').slice(0,5)}{r.end?'–'+String(r.end).slice(0,5):''}</td><td>{r.name}</td><td>{r.venue}{r.foodBeverage?<><br/>{r.foodBeverage}</>:null}</td></tr>)}</tbody></table>
   {d.guests?.length>0&&<><h2>Guests</h2><table><thead><tr><th>Guest</th><th>Cabin</th><th>Dietary · allergies · access</th></tr></thead><tbody>{d.guests.map((r:Row,i:number)=><tr key={i}><td>{r.firstName} {r.lastName}</td><td>{r.cabin||'To assign'}</td><td>{[r.dietary,r.allergies,r.accessibility].filter(Boolean).join(' · ')}</td></tr>)}</tbody></table></>}
   <h2>Approved documents</h2>{d.documents.length?d.documents.map((r:Row,i:number)=><p key={i}>{r.name} · {r.version} · {r.status}</p>):<p className="dim">None approved for this audience yet.</p>}
   <h2>Contacts</h2>{d.contacts.map((r:Row,i:number)=><p key={i}><b>{r.name}</b> {r.role}<br/>{r.email} {r.phone}</p>)}
   <footer>{d.mode==='ship'?'Confidential. For authorized ship operations.':'Prepared for this charter’s planning team.'} Generated {new Date().toLocaleString()}</footer></article></div>;
}
