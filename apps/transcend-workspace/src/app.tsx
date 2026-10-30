import {useEffect,useState} from 'react';
import {LayoutDashboard,ShipWheel,Users,FolderOpen,BarChart3,Sparkles,AlertCircle,X,CheckCircle2,Lock,ChevronDown} from 'lucide-react';
import {catalog} from './lib/catalog';
import {loadWorkspace,initializeWorkspace,saveWorkspace,buildView,actor} from './lib/store';
import {applyProposals,type Proposal} from './lib/ai';
import {AppCtx,type Ctx,type Page,type Row,type ImportOpts} from './ctx';
import {Editor} from './ui/kit';
import {AiImport} from './ui/ai-import';
import {Assistant,type Msg} from './ui/assistant';
import Dashboard from './pages/dashboard';
import Charter,{ChartersList} from './pages/charter';
import Guests from './pages/guests';
import Documents from './pages/documents';
import Reports,{ReportView} from './pages/reports';

const NAV:[Page,string,any][]=[['dashboard','Dashboard',LayoutDashboard],['charters','Charters',ShipWheel],['guests','Guests',Users],['documents','Documents',FolderOpen],['reports','Reports',BarChart3]];
const GLOBAL=['clients','tours','products'];

export default function App(){
 const [s,setS]=useState<Row|null>(null),[revision,setRevision]=useState(0),[trip,setTrip]=useState(()=>{try{return localStorage.getItem('transcend-trip')||''}catch{return ''}});
 const [page,setPage]=useState<Page>('dashboard'),[sub,setSub]=useState(''),[filter,setFilter]=useState('');
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[toast,setToast]=useState(''),[loadError,setLoadError]=useState('');
 const [drawer,setDrawer]=useState<{entity:string,data:Row,file?:File,key:number}|null>(null);
 const [ai,setAi]=useState<ImportOpts|null>(null);
 const [chat,setChat]=useState(false),[messages,setMessages]=useState<Msg[]>([]),[pending,setPending]=useState('');
 const [view,setView]=useState<Row|null>(null);

 useEffect(()=>{(async()=>{try{apply((await loadWorkspace())||(await initializeWorkspace()))}catch(e:any){setLoadError(String(e.message||e))}})()},[]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),4000);return()=>clearTimeout(t)},[toast]);
 useEffect(()=>{try{localStorage.setItem('transcend-trip',trip)}catch{}},[trip]);
 useEffect(()=>{window.scrollTo({top:0})},[page,sub]);

 function apply(j:{state:Row,revision:number}){setS(j.state);setRevision(j.revision);setTrip(t=>j.state.departures.some((d:Row)=>d.id===t&&!d.archived)?t:(j.state.departures.find((d:Row)=>!d.archived)?.id||''))}
 async function save(next:Row,action:string){if(busy)return false;setBusy(true);setError('');try{if(next.snapshots?.some((v:Row)=>v.departureId===trip)&&!action.startsWith('Finalized'))next.departures=next.departures.map((d:Row)=>d.id===trip?{...d,amendmentPending:true}:d);apply(await saveWorkspace(next,revision,action));return true}catch(e:any){setError(String(e.message||e));return false}finally{setBusy(false)}}

 if(loadError)return <div className="splash"><img src={import.meta.env.BASE_URL+'transcend-logo-white.png'} alt="Transcend"/><p>{loadError}</p><button className="btn" onClick={()=>location.reload()}>Try again</button></div>;
 if(!s)return <div className="splash"><img src={import.meta.env.BASE_URL+'transcend-logo-white.png'} alt="Transcend"/><p>Opening your charter workspace…</p></div>;

 const current=s.departures.find((d:Row)=>d.id===trip);
 const linked=(e:string)=>(s[e]||[]).filter((r:Row)=>!r.archived&&(GLOBAL.includes(e)||r.departureId===trip));
 const ctx:Ctx={s,trip,current,busy,setTrip,save,
  quick:async(e,r,patch)=>{const next=structuredClone(s);next[e]=next[e].map((v:Row)=>v.id===r.id?{...v,...patch}:v);return save(next,'Updated '+catalog[e].singular.toLowerCase())},
  edit:(entity,row,defaults,file)=>setDrawer({entity,file,key:Date.now(),data:row?structuredClone(row):{id:crypto.randomUUID(),...(GLOBAL.includes(entity)?{}:{departureId:trip}),visibility:'Internal only',...(entity==='guests'?{waiverStatus:'Missing',verification:'Unverified'}:{}),...(entity==='tasks'?{status:'To do'}:{}),...(entity==='reservations'?{number:'TC-'+Date.now().toString().slice(-7),status:'Held'}:{}),...defaults}}),
  importAi:o=>setAi(o),
  ask:q=>{setChat(true);if(q)setPending(q+'#'+Date.now())},
  go:(p,sb,f)=>{setPage(p);setSub(sb||'');setFilter(f||'')},
  notify:setToast,fail:setError,linked,
  report:(mode,frozen)=>{try{setView(buildView(s,mode,trip,frozen))}catch(e:any){setError(String(e.message||e))}},
 };
 async function aiApply(list:Proposal[],source:string){const {next,count,newTrip}=applyProposals(s!,trip,list);if(!count)return false;const ok=await save(next,'AI import: saved '+count+' record'+(count===1?'':'s')+' from '+source);if(ok){if(newTrip){setTrip(newTrip);setPage('charter');setSub('overview')}setToast(count+' record'+(count===1?'':'s')+' saved')}return ok}
 const activeNav=page==='charter'?'charters':page;
 const initials=actor().split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();

 return <AppCtx.Provider value={ctx}>
  <div className={'shell'+(chat?' chat-open':'')}>
   <aside className="rail">
    <img className="logo" src={import.meta.env.BASE_URL+'transcend-logo-white.png'} alt="Transcend"/>
    <span className="rail-label">Charter workspace</span>
    <nav>{NAV.map(([id,label,Icon])=><button key={id} className={activeNav===id?'on':''} onClick={()=>ctx.go(id==='charters'&&current?'charter':id,id==='charters'?'overview':'')} aria-current={activeNav===id?'page':undefined}><Icon size={19} strokeWidth={1.7}/>{label}</button>)}</nav>
    <button className="rail-ask" onClick={()=>setChat(!chat)}><Sparkles size={18}/>Ask Transcend AI</button>
    <div className="rail-foot"><Lock size={13}/>Private pilot · saved in this browser</div>
   </aside>
   <div className="main">
    <header className="topbar">
     <label className="trip-switch"><span>Charter</span><select aria-label="Current charter" value={trip} onChange={e=>setTrip(e.target.value)}>{s.departures.filter((d:Row)=>!d.archived).map((d:Row)=><option key={d.id} value={d.id}>{d.name}</option>)}{!s.departures.length&&<option value="">No charters yet</option>}</select><ChevronDown size={15}/></label>
     <div className="top-right"><span className={'saved'+(busy?' saving':'')}>{busy?'Saving…':'All changes saved'}</span><button className="btn ai top-ask" onClick={()=>setChat(!chat)}><Sparkles size={16}/><span>Ask Transcend AI</span></button><span className="avatar" title={actor()}>{initials||'K'}</span></div>
    </header>
    {error&&<div className="banner" role="alert"><AlertCircle size={18}/><span>{error}</span><button className="icon-btn" aria-label="Dismiss" onClick={()=>setError('')}><X size={16}/></button></div>}
    <main>
     {page==='dashboard'&&<Dashboard/>}
     {page==='charters'&&<ChartersList/>}
     {page==='charter'&&<Charter sub={sub}/>}
     {page==='guests'&&<Guests key={filter} filter={filter}/>}
     {page==='documents'&&<Documents/>}
     {page==='reports'&&<Reports sub={sub}/>}
    </main>
   </div>
   <nav className="tabbar" aria-label="Sections">{NAV.map(([id,label,Icon])=><button key={id} className={activeNav===id?'on':''} onClick={()=>ctx.go(id==='charters'&&current?'charter':id,id==='charters'?'overview':'')}><Icon size={20} strokeWidth={1.7}/>{label}</button>)}</nav>
   {!chat&&<button className="ask-fab" aria-label="Ask Transcend AI" onClick={()=>setChat(true)}><Sparkles size={22}/></button>}
   {chat&&<Assistant messages={messages} setMessages={setMessages} pending={pending} onClose={()=>setChat(false)}/>}
  </div>
  {drawer&&<Editor key={drawer.key} entity={drawer.entity} data={drawer.data} file={drawer.file} onClose={()=>setDrawer(null)}/>}
  {ai&&<AiImport {...ai} state={s} trip={trip} onClose={()=>setAi(null)} onApply={aiApply}/>}
  {view&&<ReportView data={view} onClose={()=>setView(null)}/>}
  {toast&&<div className="toast" role="status"><CheckCircle2 size={18}/>{toast}</div>}
 </AppCtx.Provider>;
}
