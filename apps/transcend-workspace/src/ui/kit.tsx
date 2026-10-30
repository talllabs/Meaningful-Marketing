import {useEffect,useState,type ReactNode} from 'react';
import {X,Sparkles,Loader2,Paperclip,ChevronDown,Download,Plus,Check,ChevronRight,Search} from 'lucide-react';
import {catalog,type Field} from '../lib/catalog';
import {ingest,readInput,ENTITY_HELP,type Input,type Proposal} from '../lib/ai';
import {downloadFile} from '../lib/store';
import {useApp,recordName,fmtDate,fmtTime,tone,type Row} from '../ctx';

export function Pill({children,kind}:{children:ReactNode,kind?:string}){return <span className={'pill '+(kind||tone(children))}>{children}</span>}

// The most useful fields show first; everything else sits under "More details".
const ESSENTIAL:Record<string,string[]>={
 guests:['firstName','lastName','preferredName','email','phone','cabin','dietary','allergies','accessibility','emergencyName','emergencyPhone','waiverStatus','waiverDocument','verification','notes'],
 departures:['name','clientId','vessel','status','startDate','endDate','startPort','endPort','groupSize','pricingBasis','dailyRate','passengerRate','currency','readinessDate','onboardPointOfContact','welcomeMessage','notes'],
 documents:['name','category','status','version','visibility','approvedBy','approvedDate','receivedByShip','notes'],
 agenda:['name','date','start','end','venue','type','foodBeverage','av','guestCount','visibility','notes'],
 cabins:['number','deck','category','capacity','bedType','status','notes'],
 contracts:['name','type','status','version','signer','signedDocument','notes'],
 payments:['name','payer','type','amount','currency','dueDate','status','notes'],
};
const essentials=(e:string)=>{const c=catalog[e];const keys=new Set(ESSENTIAL[e]||[...c.columns,...c.fields.filter(f=>f.required).map(f=>f.key),'visibility','notes']);return c.fields.filter(f=>keys.has(f.key))};

export function FieldInput({field:f,value,state,onChange,highlight}:{field:Field,value:any,state:Row,onChange:(v:any)=>void,highlight?:boolean}){
 const linkType:Row={client:'clients',tour:'tours',reservation:'reservations'};let input;
 if(f.type==='select'||linkType[f.type||'']){const options=linkType[f.type||'']?state[linkType[f.type!]].filter((r:Row)=>!r.archived).map((r:Row)=>({value:r.id,label:recordName(r)})):(f.options||[]).map(x=>({value:x,label:x}));input=<select value={value??''} onChange={e=>onChange(e.target.value)}><option value="">Choose…</option>{value&&!options.some((o:Row)=>o.value===value)&&<option value={value}>{value}</option>}{options.map((o:Row)=><option value={o.value} key={o.value}>{o.label}</option>)}</select>}
 else if(f.type==='textarea')input=<textarea rows={3} value={typeof value==='object'&&value?JSON.stringify(value,null,2):value??''} onChange={e=>onChange(e.target.value)}/>;
 else if(f.type==='checkbox')input=<span className="switch"><input type="checkbox" checked={Boolean(value)} onChange={e=>onChange(e.target.checked)}/><i/></span>;
 else input=<input type={f.type||'text'} step={f.type==='number'?'any':undefined} value={typeof value==='object'&&value?JSON.stringify(value):value??''} onChange={e=>onChange(e.target.value)}/>;
 return <label className={'field'+(f.type==='textarea'?' wide':'')+(highlight?' ai-filled':'')}><span>{f.label}{f.required&&<b className="req"> *</b>}{highlight&&<em className="ai-tag"><Sparkles size={10}/>AI</em>}</span>{input}</label>;
}

export function Editor({entity,data:initial,file,onClose}:{entity:string,data:Row,file?:File,onClose:()=>void}){
 const {s,save,importAi,fail,trip}=useApp();
 const [data,setData]=useState<Row>(initial),[more,setMore]=useState(false),[find,setFind]=useState(''),[aiKeys,setAiKeys]=useState<string[]>([]),[reading,setReading]=useState(!!file),[saving,setSaving]=useState(false),[err,setErr]=useState('');
 const c=catalog[entity],exists=s[entity].some((r:Row)=>r.id===data.id),dirty=JSON.stringify(data)!==JSON.stringify(initial);
 useEffect(()=>{if(!file)return;(async()=>{try{const r=await ingest({inputs:[await readInput(file)],entities:['documents'],state:s,trip,single:{entity:'documents',record:{name:file.name}},instructions:'Suggest the document name, category, version, format, intended usage, caption and a one-line note describing the file. Do not change the status or approval fields.'});const p=r.proposals[0];if(p){const keep=Object.fromEntries(Object.entries(p.data).filter(([k])=>!['status','approvedBy','approvedDate','receivedByShip'].includes(k)));setData(d=>({...d,...keep}));setAiKeys(Object.keys(keep))}}catch{}finally{setReading(false)}})()},[]);
 const essential=essentials(entity),rest=c.fields.filter(f=>!essential.includes(f));
 const shown=find?c.fields.filter(f=>f.label.toLowerCase().includes(find.toLowerCase())):essential;
 const set=(k:string,v:any)=>setData(d=>({...d,[k]:v}));
 async function submit(){for(const f of c.fields)if(f.required&&!String(data[f.key]??'').trim()){setErr(f.label+' is required.');return}setSaving(true);setErr('');const next=structuredClone(s);const i=next[entity].findIndex((r:Row)=>r.id===data.id);if(i<0)next[entity].push(data);else next[entity][i]=data;const ok=await save(next,(i<0?'Added ':'Updated ')+c.singular.toLowerCase()+': '+recordName(data));setSaving(false);if(ok)onClose()}
 async function archive(){if(!confirm('Archive this '+c.singular.toLowerCase()+'? It stays in backups and history.'))return;const next=structuredClone(s);next[entity]=next[entity].map((r:Row)=>r.id===data.id?{...r,archived:true}:r);if(await save(next,'Archived '+recordName(data)))onClose()}
 const close=()=>{if(!dirty||confirm('Close without saving your changes?'))onClose()};
 return <div className="scrim" onClick={close}><aside className="drawer" role="dialog" aria-label={'Edit '+c.singular} onClick={e=>e.stopPropagation()}>
  <header><div><span className="kicker">{exists?c.singular:'New '+c.singular.toLowerCase()}</span><h2>{exists||recordName(data)!=='Untitled'?recordName(data):'New '+c.singular.toLowerCase()}</h2></div><button className="icon-btn" aria-label="Close" onClick={close}><X size={20}/></button></header>
  <div className="drawer-body">
   {reading?<div className="ai-fill"><p className="ai-status"><Loader2 size={15} className="spin"/>Transcend AI is reading the file to fill in the details…</p></div>:<AiFill entity={entity} record={data} onFill={(d,keys)=>{setData(x=>({...x,...d}));setAiKeys(keys)}}/>}
   {file&&<button className="link-btn pull" onClick={()=>importAi({entities:['guests','agenda','itinerary','contacts','tasks','notes','operations','excursions'],title:'Pull charter details from '+file.name,files:[file]})}><Sparkles size={14}/>Also pull guests, schedule and tasks from this file<ChevronRight size={14}/></button>}
   {err&&<p className="form-error" role="alert">{err}</p>}
   <div className="find"><Search size={15}/><input placeholder={'Find any of the '+c.fields.length+' fields…'} value={find} onChange={e=>setFind(e.target.value)}/></div>
   <div className="form-grid">{shown.map(f=><FieldInput key={f.key} field={f} value={data[f.key]} state={s} highlight={aiKeys.includes(f.key)} onChange={v=>set(f.key,v)}/>)}</div>
   {!find&&rest.length>0&&<><button className="more-toggle" onClick={()=>setMore(!more)}><ChevronDown size={16} className={more?'flip':''}/>{more?'Hide':'Show'} more details <small>{rest.length} fields{rest.filter(f=>data[f.key]!=null&&data[f.key]!=='').length?' · '+rest.filter(f=>data[f.key]!=null&&data[f.key]!=='').length+' filled':''}</small></button>
    {more&&<div className="form-grid">{rest.map(f=><FieldInput key={f.key} field={f} value={data[f.key]} state={s} highlight={aiKeys.includes(f.key)} onChange={v=>set(f.key,v)}/>)}</div>}</>}
   {!find&&<div className="extra"><h4>Your own fields</h4>{(data.customFields||[]).map((x:Row,i:number)=><div className="extra-row" key={i}><input aria-label="Field name" placeholder="Field name" value={x.label} onChange={e=>set('customFields',data.customFields.map((y:Row,j:number)=>j===i?{...y,label:e.target.value}:y))}/><input aria-label="Value" placeholder="Value" value={x.value} onChange={e=>set('customFields',data.customFields.map((y:Row,j:number)=>j===i?{...y,value:e.target.value}:y))}/><button className="icon-btn" aria-label="Remove field" onClick={()=>set('customFields',data.customFields.filter((_:Row,j:number)=>j!==i))}><X size={14}/></button></div>)}<button className="link-btn" onClick={()=>set('customFields',[...(data.customFields||[]),{label:'',value:''}])}><Plus size={14}/>Add a field</button></div>}
   {data.source&&<p className="source-ref"><b>Came from</b>{data.source}</p>}
   {data.fileId&&<button className="btn" onClick={()=>downloadFile(data.fileId).catch(e=>fail(String(e.message||e)))}><Download size={16}/>Download the file</button>}
  </div>
  <footer>{exists&&<button className="btn ghost danger" onClick={archive}>Archive</button>}<span/><button className="btn ghost" onClick={close}>Cancel</button><button className="btn primary" disabled={saving} onClick={submit}>{saving?'Saving…':'Save'}<Check size={16}/></button></footer>
 </aside></div>;
}

function AiFill({entity,record,onFill}:{entity:string,record:Row,onFill:(d:Row,keys:string[])=>void}){
 const {s,trip}=useApp();
 const [open,setOpen]=useState(false),[text,setText]=useState(''),[input,setInput]=useState<Input|null>(null),[working,setWorking]=useState(false),[msg,setMsg]=useState(''),[warn,setWarn]=useState<string[]>([]);
 async function run(){setWorking(true);setMsg('');setWarn([]);try{const r=await ingest({inputs:input?[input]:[],pasted:text,entities:[entity],state:s,trip,single:{entity,record}});const data:Row={},custom:Row[]=[];for(const p of r.proposals.filter((p:Proposal)=>p.entity===entity)){Object.assign(data,p.data);custom.push(...p.custom)}if(custom.length)data.customFields=[...(record.customFields||[]),...custom];const keys=Object.keys(data).filter(k=>k!=='customFields');onFill(data,keys);setWarn([...r.warnings,...r.proposals.flatMap((p:Proposal)=>p.warnings)]);setMsg(keys.length||custom.length?'Filled '+keys.length+' field'+(keys.length===1?'':'s')+'. They’re highlighted in gold. Check them, then save.':'No new details found for this '+catalog[entity].singular.toLowerCase()+'.');if(keys.length){setOpen(false);setText('');setInput(null)}}catch(e:any){setMsg(String(e.message||e))}finally{setWorking(false)}}
 if(!open)return <div className="ai-fill"><button className="btn ai" onClick={()=>setOpen(true)}><Sparkles size={15}/>Fill in with AI</button><span>Paste an email or add a file. AI fills the matching fields.</span>{msg&&<p className="ai-status">{msg}</p>}{warn.length>0&&<ul className="warn-list">{warn.slice(0,5).map((w,i)=><li key={i}>{w}</li>)}</ul>}</div>;
 return <div className="ai-fill open"><textarea autoFocus rows={4} placeholder={'Paste anything about this '+(ENTITY_HELP[entity]||'record')+': an email, a form reply, notes…'} value={text} onChange={e=>setText(e.target.value)}/><div className="row-end"><label className="btn ghost"><Paperclip size={15}/>{input?input.name:'Add a file'}<input type="file" hidden accept=".csv,.tsv,.xlsx,.docx,.pdf,.txt,.md,.eml,.json,.html,image/*" onChange={async e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;try{setInput(await readInput(f))}catch(x:any){setMsg(String(x.message||x))}}}/></label><span/><button className="btn ghost" onClick={()=>setOpen(false)}>Cancel</button><button className="btn ai" disabled={working||(!text.trim()&&!input)} onClick={run}>{working?<Loader2 size={15} className="spin"/>:<Sparkles size={15}/>}{working?'Reading…':'Fill fields'}</button></div>{msg&&<p className="ai-status">{msg}</p>}</div>;
}

// A clean list of records. Click a row to open it.
export function RecordList({entity,rows,columns,limit=8,empty,addDefaults,title,actions}:{entity:string,rows:Row[],columns?:string[],limit?:number,empty?:string,addDefaults?:Row,title?:string,actions?:ReactNode}){
 const {edit}=useApp();const [all,setAll]=useState(false);const c=catalog[entity];const cols=columns||c.columns;
 const label=(k:string)=>c.fields.find(f=>f.key===k)?.label||k;
 const show=(r:Row,k:string)=>{const v=r[k];const f=c.fields.find(f=>f.key===k);if(v==null||v==='')return <span className="dim">—</span>;if(/status/i.test(k))return <Pill>{v}</Pill>;if(f?.type==='date')return fmtDate(v);if(f?.type==='time')return fmtTime(v);return String(v).length>70?String(v).slice(0,70)+'…':String(v)};
 const list=all?rows:rows.slice(0,limit);
 return <section className="card list-card">
  {title!==undefined&&<div className="card-head"><h3>{title||c.name}<small>{rows.length}</small></h3><div className="row-gap">{actions}<button className="btn ghost sm" onClick={()=>edit(entity,undefined,addDefaults)}><Plus size={15}/>Add</button></div></div>}
  {rows.length?<div className="table-wrap"><table className="table"><thead><tr>{cols.map(k=><th key={k}>{label(k)}</th>)}<th aria-label="Open"/></tr></thead><tbody>{list.map(r=><tr key={r.id} tabIndex={0} onClick={()=>edit(entity,r)} onKeyDown={e=>{if(e.key==='Enter')edit(entity,r)}}>{cols.map((k,i)=><td key={k} data-label={label(k)} className={i===0?'strong':''}>{show(r,k)}</td>)}<td className="chev"><ChevronRight size={16}/></td></tr>)}</tbody></table></div>:<p className="empty-line">{empty||'Nothing here yet.'}</p>}
  {rows.length>limit&&<button className="show-all" onClick={()=>setAll(!all)}>{all?'Show less':'Show all '+rows.length}</button>}
 </section>;
}

// Safe, minimal formatting for AI answers: headings, bullets, bold.
export function Markdown({text}:{text:string}){
 const inline=(t:string,k:number)=>t.split(/(\*\*[^*]+\*\*)/g).map((p,i)=>p.startsWith('**')&&p.endsWith('**')?<strong key={k+'-'+i}>{p.slice(2,-2)}</strong>:<span key={k+'-'+i}>{p}</span>);
 const out:ReactNode[]=[];let list:ReactNode[]=[];let ordered=false;
 const flush=()=>{if(list.length){out.push(ordered?<ol key={'l'+out.length}>{list}</ol>:<ul key={'l'+out.length}>{list}</ul>);list=[]}};
 text.split('\n').forEach((line,i)=>{const t=line.trim();let m;
  if((m=t.match(/^[-*•]\s+(.*)/))){if(ordered)flush();ordered=false;list.push(<li key={i}>{inline(m[1],i)}</li>);return}
  if((m=t.match(/^\d+[.)]\s+(.*)/))){if(!ordered)flush();ordered=true;list.push(<li key={i}>{inline(m[1],i)}</li>);return}
  flush();
  if(!t)return;
  if((m=t.match(/^#{1,4}\s+(.*)/))){out.push(<h4 key={i}>{inline(m[1],i)}</h4>);return}
  out.push(<p key={i}>{inline(t,i)}</p>);
 });flush();
 return <div className="md">{out}</div>;
}

export function PageHead({kicker,title,children,sub}:{kicker?:string,title:ReactNode,children?:ReactNode,sub?:ReactNode}){return <div className="page-head"><div>{kicker&&<span className="kicker">{kicker}</span>}<h1>{title}</h1>{sub&&<p>{sub}</p>}</div>{children&&<div className="row-gap wrap">{children}</div>}</div>}
