import {useEffect,useState} from 'react';
import {X,Sparkles,Loader2,Paperclip,ChevronDown,Check,ArrowLeft,UploadCloud,AlertCircle} from 'lucide-react';
import {catalog} from '../lib/catalog';
import {ingest,readInput,type Input,type Proposal,type IngestResult} from '../lib/ai';
import {FieldInput} from './kit';
import {recordName,type Row,type ImportOpts} from '../ctx';

// The everyday labels people choose from (the rest are under "More types").
const COMMON=['guests','agenda','itinerary','cabins','contacts','tasks','departures','clients','documents','payments'];

export function AiImport({entities:initial,title,instructions:presetNote,files:presetFiles,state,trip,onClose,onApply}:ImportOpts&{state:Row,trip:string,onClose:()=>void,onApply:(list:Proposal[],source:string)=>Promise<boolean>}){
 const [stage,setStage]=useState<'input'|'working'|'review'>('input'),[text,setText]=useState(''),[inputs,setInputs]=useState<Input[]>([]),[reading,setReading]=useState(0),[entities,setEntities]=useState<string[]>(initial),[note,setNote]=useState(presetNote||''),[progress,setProgress]=useState([0,0]),[result,setResult]=useState<IngestResult|null>(null),[err,setErr]=useState(''),[open,setOpen]=useState(''),[drag,setDrag]=useState(false),[saving,setSaving]=useState(false),[types,setTypes]=useState(false);
 useEffect(()=>{if(presetFiles?.length)addFiles(presetFiles)},[]);
 async function addFiles(list:FileList|File[]){setErr('');for(const f of Array.from(list)){setReading(n=>n+1);try{const i=await readInput(f);setInputs(a=>[...a,i])}catch(e:any){setErr(f.name+': '+String(e.message||e))}finally{setReading(n=>n-1)}}}
 async function run(){setErr('');if(!entities.length){setErr('Choose at least one kind of information.');return}setStage('working');try{const r=await ingest({inputs,pasted:text,instructions:note,entities,state,trip,onProgress:(d,t)=>setProgress([d,t])});setResult(r);setOpen('');setStage('review')}catch(e:any){setErr(String(e.message||e));setStage('input')}}
 const update=(key:string,patch:(p:Proposal)=>Partial<Proposal>)=>setResult(r=>r&&{...r,proposals:r.proposals.map(p=>p.key===key?{...p,...patch(p)}:p)});
 const chosen=result?.proposals.filter(p=>p.include)||[];
 const newTrip=chosen.find(p=>p.entity==='departures'&&p.action==='create');
 const tripName=state.departures.find((d:Row)=>d.id===trip)?.name;
 const missing=chosen.filter(p=>p.action==='create'&&catalog[p.entity].fields.some(f=>f.required&&!String(p.data[f.key]??'').trim()));
 const groups=result?Array.from(new Set(result.proposals.map(p=>p.entity))):[];
 const sourceLabel=[text.trim()?'pasted text':'',...inputs.map(i=>i.name)].filter(Boolean).join(', ').slice(0,120);
 async function save(){if(missing.length){setErr('A few records need a required field (marked *). Fill it in or untick them.');setOpen(missing[0].key);return}setSaving(true);const ok=await onApply(result!.proposals,sourceLabel||'AI import');setSaving(false);if(ok)onClose()}
 const titleOf=(p:Proposal)=>{const base=p.action==='update'?state[p.entity].find((r:Row)=>r.id===p.matchId)||{}:{};const n=recordName({...base,...p.data});return n==='Untitled'?'New '+catalog[p.entity].singular.toLowerCase():n};
 const shownTypes=types?Object.keys(catalog):Array.from(new Set([...COMMON,...entities]));
 return <div className="scrim center"><section className="modal" role="dialog" aria-label={title}>
  <header><div><span className="kicker ai-kicker"><Sparkles size={12}/>Transcend AI</span><h2>{stage==='review'?'Review before saving':title}</h2></div><button className="icon-btn" onClick={()=>{if(stage!=='review'||confirm('Close without saving?'))onClose()}} aria-label="Close"><X size={20}/></button></header>
  {err&&<p className="form-error" role="alert"><AlertCircle size={16}/>{err}</p>}
  {stage==='input'&&<div className="modal-body">
   <label className={'drop'+(drag?' over':'')} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);addFiles(e.dataTransfer.files)}}>
    <UploadCloud size={30} strokeWidth={1.5}/><b>Drop a spreadsheet, contract, rooming list or photo</b><span>Excel, CSV, Word, PDF, images or text · or click to browse</span>
    <input type="file" multiple hidden accept=".csv,.tsv,.xlsx,.xlsm,.docx,.pdf,.txt,.md,.eml,.json,.html,.htm,.ics,.vcf,image/*" onChange={e=>{if(e.target.files)addFiles(e.target.files);e.target.value=''}}/>
   </label>
   {(inputs.length>0||reading>0)&&<div className="chips">{inputs.map((i,n)=><span className="chip file" key={n}><Paperclip size={13}/>{i.name}<small>{i.sheets?i.sheets.reduce((a,s)=>a+Math.max(s.rows.length-1,0),0)+' rows':i.attachment?i.attachment.type.toUpperCase():Math.max(1,Math.round((i.text||'').length/1000))+'k chars'}</small><button aria-label={'Remove '+i.name} onClick={()=>setInputs(a=>a.filter((_,j)=>j!==n))}><X size={12}/></button></span>)}{reading>0&&<span className="chip"><Loader2 size={13} className="spin"/>Opening…</span>}</div>}
   <div className="or"><span>or paste it</span></div>
   <textarea className="paste" rows={5} placeholder="Paste an email, client brief, menu, flight list…" value={text} onChange={e=>setText(e.target.value)} onPaste={e=>{if(e.clipboardData.files.length){e.preventDefault();addFiles(e.clipboardData.files)}}}/>
   <div className="label-row"><span>Look for</span><button className="link-btn" onClick={()=>setTypes(!types)}>{types?'Fewer types':'More types'}</button></div>
   <div className="chips">{shownTypes.map(e=><button key={e} className={'chip toggle'+(entities.includes(e)?' on':'')} onClick={()=>setEntities(a=>a.includes(e)?a.filter(x=>x!==e):[...a,e])}>{entities.includes(e)&&<Check size={13}/>}{catalog[e].name}</button>)}</div>
   <label className="field wide note"><span>Anything AI should know? <em className="dim">optional</em></span><input value={note} placeholder="e.g. These guests are for the second sailing. Times are Brussels time." onChange={e=>setNote(e.target.value)}/></label>
  </div>}
  {stage==='working'&&<div className="modal-body working"><div className="orb"><Sparkles size={26}/></div><h3>Reading and organizing…</h3><p>{progress[1]>1?'Section '+Math.min(progress[0]+1,progress[1])+' of '+progress[1]:'Usually 10 to 40 seconds'}</p><div className="bar"><span style={{width:(progress[1]?Math.max(8,progress[0]/progress[1]*100):8)+'%'}}/></div></div>}
  {stage==='review'&&result&&<div className="modal-body">
   {result.summary&&<div className="ai-summary"><Sparkles size={16}/><p>{result.summary}</p></div>}
   {result.warnings.length>0&&<details className="callout warn" open={result.warnings.length<4}><summary>{result.warnings.length} thing{result.warnings.length===1?'':'s'} worth checking</summary><ul>{result.warnings.map((w,i)=><li key={i}>{w}</li>)}</ul></details>}
   {result.questions.length>0&&<details className="callout info"><summary>{result.questions.length} open question{result.questions.length===1?'':'s'}</summary><ul>{result.questions.map((w,i)=><li key={i}>{w}</li>)}</ul></details>}
   {!result.proposals.length?<div className="empty-state"><h3>Nothing to add</h3><p>AI didn’t find details for the types you chose. Go back and choose more types, or add a note about what’s in it.</p></div>:<>
   <div className="review-bar"><span>Saving <b>{chosen.length}</b> of {result.proposals.length} to <b>{newTrip?'a new charter, “'+(newTrip.data.name||'Untitled')+'”':tripName}</b></span><span className="row-gap"><button className="link-btn" onClick={()=>setResult({...result,proposals:result.proposals.map(p=>({...p,include:true}))})}>All</button><button className="link-btn" onClick={()=>setResult({...result,proposals:result.proposals.map(p=>({...p,include:false}))})}>None</button></span></div>
   {groups.map(g=>{const list=result.proposals.filter(p=>p.entity===g);const nNew=list.filter(p=>p.action==='create').length,nUp=list.length-nNew;return <div className="review-group" key={g}><h4>{catalog[g].name}<small>{[nNew&&nNew+' new',nUp&&nUp+' update'+(nUp===1?'':'s')].filter(Boolean).join(' · ')}</small></h4>
    {list.map(p=>{const existing=p.action==='update'?state[g].find((r:Row)=>r.id===p.matchId):null;const fields=catalog[g].fields.filter(f=>f.key in p.data||(p.action==='create'&&f.required));const isOpen=open===p.key;const n=Object.keys(p.data).length;return <div className={'review-item'+(p.include?'':' off')+(isOpen?' open':'')} key={p.key}>
     <div className="review-row"><input type="checkbox" aria-label={'Include '+titleOf(p)} checked={p.include} onChange={e=>update(p.key,()=>({include:e.target.checked}))}/><button onClick={()=>setOpen(isOpen?'':p.key)}><span className={'tag '+(p.action==='update'?'upd':'new')}>{p.action==='update'?'Update':'New'}</span><b>{titleOf(p)}</b><small>{n} detail{n===1?'':'s'}{p.warnings.length?' · check '+p.warnings.length:''}</small><ChevronDown size={15} className={isOpen?'flip':''}/></button></div>
     {isOpen&&<div className="review-detail">{p.note&&<p className="dim">{p.note}</p>}{p.warnings.length>0&&<ul className="warn-list">{p.warnings.map((w,i)=><li key={i}>{w}</li>)}</ul>}
      <div className="form-grid">{fields.map(f=><div key={f.key} className={f.type==='textarea'?'wide':''}><FieldInput field={f} value={p.data[f.key]} state={state} onChange={v=>update(p.key,q=>({data:{...q.data,[f.key]:v}}))}/>{existing&&<small className="was">Was: {existing[f.key]===''||existing[f.key]==null?'empty':String(existing[f.key]).slice(0,100)}</small>}</div>)}
      {p.custom.map((c,i)=><label className="field" key={'c'+i}><span>{c.label} <em className="dim">extra</em></span><input value={c.value} onChange={e=>update(p.key,q=>({custom:q.custom.map((x,j)=>j===i?{...x,value:e.target.value}:x)}))}/></label>)}</div><p className="dim small">From {p.source}</p></div>}
    </div>})}</div>})}</>}
  </div>}
  <footer>{stage==='review'?<><button className="btn ghost" onClick={()=>setStage('input')}><ArrowLeft size={16}/>Back</button><span/><button className="btn primary" disabled={saving||!chosen.length} onClick={save}>{saving?'Saving…':'Approve & save '+chosen.length}<Check size={16}/></button></>:<><span className="dim small hide-sm">Nothing is saved until you approve it.</span><span/><button className="btn ghost" onClick={onClose}>Cancel</button><button className="btn ai" disabled={stage==='working'||reading>0||(!text.trim()&&!inputs.length)} onClick={run}><Sparkles size={16}/>Organize with AI</button></>}</footer>
 </section></div>;
}
