// AI ingest: turns pasted text or files (emails, CSV/Excel, Word, PDF, photos)
// into proposed workspace records. Nothing is saved until a person reviews it.
// The model runs in the /api/transcend-ingest serverless function.
import {catalog,type Field} from './catalog';

type Row=Record<string,any>;
export type Input={name:string,text?:string,sheets?:{name:string,rows:string[][]}[],attachment?:{type:'pdf'|'image',dataUrl:string,name:string}};
export type Proposal={key:string,entity:string,action:'create'|'update',matchId?:string,data:Row,custom:{label:string,value:string}[],note?:string,warnings:string[],include:boolean,source:string};
export type IngestResult={summary:string,proposals:Proposal[],warnings:string[],questions:string[]};

export const GLOBAL_ENTITIES=['clients','tours','products'];
// Evidence that a person checked something stays manual.
const PROTECTED:Record<string,Record<string,string[]>>={guests:{verification:['Verified'],waiverStatus:['Signed evidence uploaded']},contracts:{status:['Signed evidence uploaded']}};
const ROWS_PER_CHUNK=25,TEXT_LIMIT=45000,PDF_LIMIT=2.5*1024*1024;

export const recordLabel=(e:string,r:Row)=>{
 const n=r.name||[r.firstName,r.lastName].filter(Boolean).join(' ')||r.number||r.port||r.id;
 const extra=e==='guests'?r.email:e==='agenda'?[r.date,r.start].filter(Boolean).join(' '):e==='itinerary'?r.date:e==='cabins'?r.category:e==='contacts'?r.email:'';
 return String(n||'')+(extra?' · '+extra:'');
};

export function parseCSV(text:string,delimiter=','){let rows:string[][]=[],row:string[]=[],v='',quote=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quote&&text[i+1]==='"'){v+='"';i++}else quote=!quote;}else if(c===delimiter&&!quote){row.push(v);v=''}else if((c==='\n'||c==='\r')&&!quote){if(c==='\r'&&text[i+1]==='\n')i++;row.push(v);if(row.some(Boolean))rows.push(row);row=[];v=''}else v+=c;}row.push(v);if(row.some(Boolean))rows.push(row);if(quote)throw Error('The CSV contains an unclosed quote.');return rows;}

function readAs(file:Blob,how:'text'|'dataUrl'|'buffer'):Promise<any>{return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error);if(how==='text')r.readAsText(file);else if(how==='dataUrl')r.readAsDataURL(file);else r.readAsArrayBuffer(file)})}

async function shrinkImage(file:Blob):Promise<string>{
 const url=URL.createObjectURL(file);
 try{const img=await new Promise<HTMLImageElement>((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('That image could not be opened.'));i.src=url});
  const scale=Math.min(1,1600/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);c.getContext('2d')!.drawImage(img,0,0,c.width,c.height);return c.toDataURL('image/jpeg',0.85)}
 finally{URL.revokeObjectURL(url)}
}

const cell=(v:any)=>v==null?'':v instanceof Date?v.toISOString().slice(0,10):String(v).replace(/\u00a0/g,' ').trim();

// Read a file into something the model can use.
export async function readInput(file:File):Promise<Input>{
 const n=file.name.toLowerCase(),type=file.type;
 if(/\.(csv|tsv)$/.test(n)||type==='text/csv'){const text=await readAs(file,'text');return {name:file.name,sheets:[{name:file.name,rows:parseCSV(text,n.endsWith('.tsv')?'\t':',')}]}}
 if(/\.(xlsx|xlsm)$/.test(n)){const {default:readXlsxFile}=await import('read-excel-file/browser');const sheets=await readXlsxFile(file);return {name:file.name,sheets:sheets.map(s=>({name:s.sheet,rows:s.data.map(r=>r.map(cell)).filter(r=>r.some(Boolean))})).filter(s=>s.rows.length)}}
 if(/\.xls$/.test(n))throw Error('Older .xls files can’t be read. Open it in Excel and save as .xlsx or .csv.');
 if(/\.docx$/.test(n)){const mammoth:any=await import('mammoth/mammoth.browser.js');const r=await (mammoth.default||mammoth).extractRawText({arrayBuffer:await readAs(file,'buffer')});return {name:file.name,text:r.value}}
 if(/\.pdf$/.test(n)||type==='application/pdf'){if(file.size>PDF_LIMIT)throw Error('PDFs need to be under 2.5 MB for AI reading. Try splitting it or copy-pasting the text.');return {name:file.name,attachment:{type:'pdf',dataUrl:await readAs(file,'dataUrl'),name:file.name}}}
 if(type.startsWith('image/'))return {name:file.name,attachment:{type:'image',dataUrl:await shrinkImage(file),name:file.name}};
 if(/\.(txt|md|eml|json|html?|xml|ics|vcf)$/.test(n)||type.startsWith('text/')){let text:string=await readAs(file,'text');if(/\.html?$/.test(n))text=new DOMParser().parseFromString(text,'text/html').body.innerText;return {name:file.name,text}}
 throw Error('This file type can’t be read yet. Try CSV, Excel, Word, PDF, an image, or paste the text.');
}

const compactField=(f:Field)=>{const a:any[]=[f.key,f.label,f.type||'text'];if(f.options)a.push(f.options);return a};

function context(state:Row,trip:string,entities:string[]){
 const d=state.departures.find((v:Row)=>v.id===trip)||{};
 const existing:Row={};
 for(const e of entities){const rows=(state[e]||[]).filter((r:Row)=>!r.archived&&(GLOBAL_ENTITIES.includes(e)||r.departureId===trip));if(rows.length)existing[e]=rows.slice(0,250).map((r:Row)=>[r.id,recordLabel(e,r).slice(0,90)])}
 return {today:new Date().toISOString().slice(0,10),charter:{name:d.name,vessel:d.vessel,startDate:d.startDate,endDate:d.endDate,startPort:d.startPort,endPort:d.endPort,currency:d.currency},existing};
}

async function call(body:Row){
 const r=await fetch('/api/transcend-ingest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 const j:any=await r.json().catch(()=>({error:r.status===413?'That file is too large to send. Try a smaller file or paste the text.':'The AI service did not respond. Please try again.'}));
 if(!r.ok)throw Error(j.error||'The AI service did not respond. Please try again.');
 return j;
}

// Ask the model for records. Big spreadsheets are sent in chunks so each request stays fast.
export async function ingest(opts:{inputs:Input[],pasted?:string,instructions?:string,entities:string[],state:Row,trip:string,single?:{entity:string,record:Row},onProgress?:(done:number,total:number)=>void}):Promise<IngestResult>{
 const {state,trip,entities}=opts;
 const targets=entities.map(e=>({entity:e,name:catalog[e].singular,fields:catalog[e].fields.map(compactField)}));
 const ctx=context(state,trip,entities);
 if(opts.single)(ctx as Row).currentRecord=Object.fromEntries(Object.entries(opts.single.record).filter(([k,v])=>v!==''&&v!=null&&!['id','departureId','customFields'].includes(k)));
 const jobs:Row[]=[],warnings:string[]=[];
 const pasted=(opts.pasted||'').trim();
 if(pasted)jobs.push({sourceName:'Pasted text',text:pasted.slice(0,TEXT_LIMIT)});
 if(pasted.length>TEXT_LIMIT)warnings.push('The pasted text was long, so only the first '+TEXT_LIMIT.toLocaleString()+' characters were read.');
 for(const input of opts.inputs){
  if(input.attachment)jobs.push({sourceName:input.name,attachment:input.attachment});
  if(input.text!=null){if(input.text.length>TEXT_LIMIT)warnings.push(input.name+' was long, so only the first part was read.');jobs.push({sourceName:input.name,text:input.text.slice(0,TEXT_LIMIT)})}
  for(const sh of input.sheets||[]){
   const [header,...rows]=sh.rows;if(!header)continue;
   const toCsv=(rs:string[][])=>rs.map(r=>r.map(v=>/[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v).join(',')).join('\n');
   const per=opts.single?rows.length:ROWS_PER_CHUNK;
   for(let i=0;i<Math.max(rows.length,1);i+=per)jobs.push({sourceName:input.name+(input.sheets!.length>1?' › '+sh.name:'')+(rows.length>per?' (rows '+(i+2)+'–'+(Math.min(i+per,rows.length)+1)+')':''),text:'Spreadsheet "'+sh.name+'" from '+input.name+'. First line is the header row.\n'+toCsv([header,...rows.slice(i,i+per)]).slice(0,TEXT_LIMIT)});
  }
 }
 if(!jobs.length)throw Error('Paste some text or add a file first.');
 if(jobs.length>40)throw Error('That is a lot to read at once ('+jobs.length+' parts). Try fewer sheets or files.');
 const results:Row[]=new Array(jobs.length);let done=0,next=0;
 opts.onProgress?.(0,jobs.length);
 async function worker(){while(next<jobs.length){const i=next++;results[i]=await call({mode:opts.single?'fill':'records',targets,context:ctx,instructions:(opts.instructions||'').slice(0,1500),...jobs[i]}).then(r=>({...r,sourceName:jobs[i].sourceName})).catch(e=>({error:String(e.message||e),sourceName:jobs[i].sourceName}));opts.onProgress?.(++done,jobs.length)}}
 await Promise.all(Array.from({length:Math.min(4,jobs.length)},worker));
 const proposals:Proposal[]=[],summaries:string[]=[],questions:string[]=[];
 for(const r of results){
  if(r.error){warnings.push(r.sourceName+': '+r.error);continue}
  if(r.summary)summaries.push(r.summary);
  for(const q of r.questions||[])if(typeof q==='string')questions.push(q);
  for(const w of r.warnings||[])if(typeof w==='string')warnings.push(w);
  for(const raw of r.records||[]){const p=normalize(raw,state,trip,entities,r.sourceName,opts.single?.record);if(p)proposals.push(p)}
 }
 if(results.every(r=>r.error))throw Error(warnings.join(' · '));
 return {summary:Array.from(new Set(summaries)).join(' '),proposals:mergeUpdates(proposals),warnings,questions:Array.from(new Set(questions)).slice(0,8)};
}

function mergeUpdates(list:Proposal[]){const seen=new Map<string,Proposal>();const out:Proposal[]=[];for(const p of list){if(p.action==='update'&&p.matchId){const k=p.entity+'|'+p.matchId;const prev=seen.get(k);if(prev){Object.assign(prev.data,p.data);prev.custom.push(...p.custom);prev.warnings.push(...p.warnings);continue}seen.set(k,p)}out.push(p)}return out}

// Check every value against the field list: right keys, valid dates/numbers/options.
export function coerce(f:Field,v:any,state:Row,year=new Date().getFullYear()):{value?:any,warning?:string}{
 if(v==null||v==='')return {};
 const s=typeof v==='object'?JSON.stringify(v):String(v).trim();
 switch(f.type){
  case 'date':{if(/^\d{4}-\d{2}-\d{2}$/.test(s))return {value:s};const t=Date.parse(/\d{4}/.test(s)?s:s+' '+year);return isNaN(t)?{warning:f.label+': “'+s+'” is not a date, so it was skipped.'}:{value:new Date(t-new Date(t).getTimezoneOffset()*60000).toISOString().slice(0,10)}}
  case 'datetime-local':{const t=Date.parse(/\d{4}/.test(s)?s:s+' '+year);return isNaN(t)?{warning:f.label+': “'+s+'” is not a date/time.'}:{value:new Date(t-new Date(t).getTimezoneOffset()*60000).toISOString().slice(0,16)}}
  case 'time':{const m=s.match(/^(\d{1,2})(?:[:.h]?(\d{2}))?(?::\d{2})?\s*([ap])\.?m?\.?$/i)||s.match(/^(\d{1,2})(?:[:.h]?(\d{2}))?(?::\d{2})?()$/);let h=m?Number(m[1]):NaN;const min=m?.[2]||'00',ap=(m?.[3]||'').toLowerCase();if(ap==='p'&&h<12)h+=12;if(ap==='a'&&h===12)h=0;return m&&h<24&&Number(min)<60?{value:String(h).padStart(2,'0')+':'+min}:{value:s,warning:f.label+': kept “'+s+'” as written. Please check it.'}}
  case 'number':{const n=Number(s.replace(/[^0-9.\-]/g,''));return s.replace(/[^0-9]/g,'')===''||!Number.isFinite(n)?{warning:f.label+': “'+s+'” is not a number, so it was skipped.'}:{value:n}}
  case 'checkbox':return {value:typeof v==='boolean'?v:/^(true|yes|y|1|x|✓|checked)$/i.test(s)};
  case 'select':{const o=f.options?.find(o=>o.toLowerCase()===s.toLowerCase())||f.options?.find(o=>o.toLowerCase().startsWith(s.toLowerCase())||s.toLowerCase().startsWith(o.toLowerCase()));return o?{value:o}:{value:s,warning:f.label+': “'+s+'” is not one of the usual choices. Please check it.'}}
  case 'client':case 'tour':case 'reservation':{const key=({client:'clients',tour:'tours',reservation:'reservations'} as Row)[f.type];const rows=(state[key]||[]).filter((r:Row)=>!r.archived);const hit=rows.find((r:Row)=>r.id===s)||rows.find((r:Row)=>[r.name,r.number].filter(Boolean).some((x:string)=>String(x).toLowerCase()===s.toLowerCase()));return hit?{value:hit.id}:{warning:f.label+': no '+key.slice(0,-1)+' called “'+s+'” yet, so it wasn’t linked.'}}
  case 'email':return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)?{value:s}:{warning:f.label+': “'+s+'” doesn’t look like an email.'};
  case 'url':return {value:/^https?:\/\//i.test(s)?s:'https://'+s.replace(/^\/+/,'')};
  default:return {value:s.slice(0,8000)};
 }
}

function normalize(raw:any,state:Row,trip:string,allowed:string[],sourceName:string,single?:Row):Proposal|null{
 if(!raw||typeof raw!=='object'||!allowed.includes(raw.entity)||!catalog[raw.entity])return null;
 const e=raw.entity,fields=catalog[e].fields,warnings:string[]=[],data:Row={},custom:{label:string,value:string}[]=[];
 let action:'create'|'update'=raw.action==='update'?'update':'create';
 let matchId=typeof raw.matchId==='string'?raw.matchId:undefined;
 if(action==='update'&&!(state[e]||[]).some((r:Row)=>r.id===matchId&&!r.archived)){action='create';matchId=undefined}
 for(const [k,v] of Object.entries(raw.data||{})){
  const f=fields.find(f=>f.key===k)||fields.find(f=>f.label.toLowerCase()===k.toLowerCase());
  if(!f){if(v!==''&&v!=null&&!['id','departureId'].includes(k))custom.push({label:k.slice(0,80),value:(typeof v==='object'?JSON.stringify(v):String(v)).slice(0,2000)});continue}
  const c=coerce(f,v,state,Number(String(state.departures.find((d:Row)=>d.id===trip)?.startDate||'').slice(0,4))||undefined);if(c.warning)warnings.push(c.warning);if(c.value===undefined)continue;
  if(PROTECTED[e]?.[f.key]?.includes(c.value)){warnings.push(f.label+' must be confirmed by a person, so “'+c.value+'” was not applied.');continue}
  data[f.key]=c.value;
 }
 if(!Object.keys(data).length&&!custom.length)return null;
 const record=single||(action==='update'?state[e].find((r:Row)=>r.id===matchId):null);
 if(action==='create'&&!single)for(const f of fields)if(f.required&&!String(data[f.key]??'').trim())warnings.push(f.label+' is missing. Add it before saving.');
 if(record)for(const k of Object.keys(data))if(String(record[k]??'')===String(data[k]))delete data[k];
 if((action==='update'||single)&&!Object.keys(data).length&&!custom.length)return null;
 return {key:crypto.randomUUID(),entity:e,action,matchId,data,custom,note:typeof raw.note==='string'?raw.note.slice(0,300):undefined,warnings,include:true,source:sourceName};
}

// Turn the approved proposals into saved records. A newly created charter
// becomes the home for the other new trip records from the same import.
export function applyProposals(state:Row,trip:string,list:Proposal[]):{next:Row,count:number,newTrip?:string}{
 const next=structuredClone(state),stamp='AI import · '+new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
 const chosen=list.filter(p=>p.include);
 const newIds=new Map(chosen.filter(p=>p.action==='create').map(p=>[p.key,crypto.randomUUID()]));
 const firstNew=(e:string)=>chosen.find(p=>p.entity===e&&p.action==='create');
 const tripP=firstNew('departures'),clientP=firstNew('clients'),tourP=firstNew('tours');
 const homeTrip=tripP?newIds.get(tripP.key)!:trip;
 for(const p of chosen){
  const e=p.entity;
  if(p.action==='update'){next[e]=next[e].map((r:Row)=>r.id===p.matchId?{...r,...p.data,customFields:[...(r.customFields||[]),...p.custom]}:r);continue}
  const r:Row={id:newIds.get(p.key),visibility:'Internal only',...(GLOBAL_ENTITIES.includes(e)?{}:{departureId:homeTrip}),
   ...(e==='guests'?{waiverStatus:'Missing',verification:'Unverified'}:{}),
   ...(e==='payments'?{type:'Charge',currency:next.departures.find((d:Row)=>d.id===homeTrip)?.currency||'EUR',status:'Scheduled'}:{}),
   ...(e==='reservations'?{number:'TC-'+Math.random().toString().slice(2,9),status:'Held'}:{}),
   ...p.data,source:stamp+' from '+p.source+(p.note?'\n'+p.note:'')};
  if(p.custom.length)r.customFields=p.custom;
  if(e==='departures'&&clientP&&!r.clientId)r.clientId=newIds.get(clientP.key);
  if(e==='departures'&&tourP&&!r.tourId)r.tourId=newIds.get(tourP.key);
  if(e==='tours'&&clientP&&!r.clientId)r.clientId=newIds.get(clientP.key);
  if(e==='departures'&&!r.status)r.status='Inquiry';
  next[e].push(r);
 }
 return {next,count:chosen.length,newTrip:tripP?homeTrip:undefined};
}

// Match spreadsheet headers to guest fields (used by the passenger CSV import).
export async function mapColumns(headers:string[],sample:string[][],entity='guests'):Promise<string[]>{
 const j=await call({mode:'map',targets:[{entity,name:catalog[entity].singular,fields:catalog[entity].fields.map(compactField)}],headers:headers.slice(0,80),sample:sample.slice(0,3).map(r=>r.slice(0,80).map(v=>String(v).slice(0,60)))});
 const keys=new Set(catalog[entity].fields.map(f=>f.key));
 return headers.map((h,i)=>{const k=j.mapping?.[h]??j.mapping?.[i];return typeof k==='string'&&keys.has(k)?k:''});
}

export const ENTITY_HELP:Record<string,string>={clients:'client',tours:'tour',departures:'charter',itinerary:'port day',reservations:'reservation',guests:'guest',cabins:'cabin',contacts:'contact',agenda:'agenda item',excursions:'excursion',operations:'operations item',av:'AV item',documents:'document',contracts:'contract',payments:'payment',tasks:'task',products:'library item',notes:'note'};

// "Ask Transcend AI": questions, summaries and drafts from the open charter.
export async function askAssistant(question:string,snapshot:Row,history:{role:'user'|'assistant',content:string}[]){
 const j=await call({mode:'ask',targets:[],question,snapshot,history});
 return String(j.answer||'');
}
