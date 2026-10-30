import {useState} from 'react';
import {UploadCloud,FileText,Image,FileSpreadsheet,ChevronRight,Ship} from 'lucide-react';
import {useApp,fmtDate,type Row} from '../ctx';
import {putFile} from '../lib/store';
import {Pill,RecordList,PageHead} from '../ui/kit';

const icon=(r:Row)=>/photo|logo/i.test(r.category)||/image/.test(r.format||'')?Image:/manifest/i.test(r.category)||/sheet|csv|excel/i.test(r.format||'')?FileSpreadsheet:FileText;

export default function Documents(){
 const {linked,edit,current,fail}=useApp();
 const [drag,setDrag]=useState(false),[busy,setBusy]=useState(false);
 const docs=linked('documents');
 const waiting=docs.filter(d=>!['Approved','Final'].includes(d.status)),done=docs.filter(d=>['Approved','Final'].includes(d.status));
 async function upload(files:FileList|null){if(!files?.length)return;setBusy(true);try{const f=files[0];const j=await putFile(f);edit('documents',undefined,{name:j.name,fileId:j.id,size:j.size,format:j.type,version:'1',status:'Needs review',category:'Other',receivedByShip:'Not sent'},f)}catch(e:any){fail(String(e.message||e))}finally{setBusy(false)}}
 const Card=({r}:{r:Row})=>{const I=icon(r);return <li><button onClick={()=>edit('documents',r)}><span className="doc-icon"><I size={20}/></span><div><b>{r.name}</b><small>{[r.category,r.version&&'v'+String(r.version).replace(/^v/i,''),r.approvedBy&&'Approved by '+r.approvedBy,r.approvedDate&&fmtDate(r.approvedDate)].filter(Boolean).join(' · ')}</small></div><span className="doc-ship" title="Ship receipt"><Ship size={13}/>{r.receivedByShip||'Not sent'}</span><Pill>{r.status||'Draft'}</Pill><ChevronRight size={16} className="chev"/></button></li>};
 return <div className="page">
  <PageHead kicker={current?.name} title="Documents" sub="Contracts, menus, logos, manifests and approvals. Drop a file and AI fills in the details."/>
  <label className={'drop big'+(drag?' over':'')} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);upload(e.dataTransfer.files)}}>
   <UploadCloud size={32} strokeWidth={1.5}/><b>{busy?'Saving…':'Drop a document here'}</b><span>AI reads it, suggests a name and category, and can pull guests, schedule and tasks out of it.</span>
   <input type="file" hidden onChange={e=>{upload(e.target.files);e.target.value=''}}/>
  </label>
  <div className="two-col">
   <section className="card"><div className="card-head"><h3>Waiting for approval<small>{waiting.length}</small></h3></div>{waiting.length?<ul className="doc-list">{waiting.map(r=><Card key={r.id} r={r}/>)}</ul>:<p className="empty-line">Nothing waiting.</p>}</section>
   <section className="card"><div className="card-head"><h3>Approved<small>{done.length}</small></h3></div>{done.length?<ul className="doc-list">{done.map(r=><Card key={r.id} r={r}/>)}</ul>:<p className="empty-line">Approved documents appear here, ready for the client guide and ship report.</p>}</section>
  </div>
  <RecordList title="" entity="contracts" rows={linked('contracts')} empty="No contracts yet. Upload the signed agreement above, then record it here."/>
 </div>;
}
