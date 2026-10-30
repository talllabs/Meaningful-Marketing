// Browser storage for the workspace. Replaces the original Cloudflare D1/R2 API
// routes: the workspace and uploaded files are kept in this browser's IndexedDB.
// The same save rules apply (validation, revision checks between tabs, frozen
// final versions, activity history).
import {entityKeys} from './catalog';
import {validateState,readiness} from './validation';

type Row=Record<string,any>;
export type Saved={state:Row,revision:number,updatedAt:string};

const DB_NAME='transcend-charter-workspace';
const ACTOR_KEY='transcend-workspace-actor';

function openDb():Promise<IDBDatabase>{
 return new Promise((resolve,reject)=>{
  const req=indexedDB.open(DB_NAME,1);
  req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains('kv'))db.createObjectStore('kv');if(!db.objectStoreNames.contains('files'))db.createObjectStore('files')};
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>reject(req.error||Error('This browser blocked local storage. Try a normal (not private) window.'));
 });
}
async function tx<T>(store:string,mode:IDBTransactionMode,fn:(s:IDBObjectStore)=>IDBRequest):Promise<T>{
 const db=await openDb();
 return new Promise((resolve,reject)=>{const t=db.transaction(store,mode);const r=fn(t.objectStore(store));t.oncomplete=()=>resolve(r.result as T);t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||Error('Storage is full. Download a backup and remove large files.'))});
}

export function actor(){try{return localStorage.getItem(ACTOR_KEY)||'Kim'}catch{return 'Kim'}}
export function setActor(v:string){try{localStorage.setItem(ACTOR_KEY,v.trim().slice(0,60))}catch{}}

export async function loadWorkspace():Promise<Saved|null>{return (await tx<Saved|undefined>('kv','readonly',s=>s.get('workspace')))||null}

async function write(saved:Saved){await tx('kv','readwrite',s=>s.put(saved,'workspace'));try{localStorage.setItem('transcend-workspace-rev',String(saved.revision))}catch{}}

export async function initializeWorkspace(empty=false):Promise<Saved>{
 const {initialState}=await import('./seed');
 const state:Row=empty?Object.fromEntries(entityKeys.map(k=>[k,[]])):initialState();
 if(empty)Object.assign(state,{contracts:[],audit:[],snapshots:[],sourceIssues:[],schemaVersion:1});
 const now=new Date().toISOString();
 state.audit=[{id:crypto.randomUUID(),at:now,actor:actor(),action:empty?'Started an empty workspace':'Opened the workspace with the supplied Event Order'}];
 const saved={state,revision:1,updatedAt:now};await write(saved);return saved;
}

export async function saveWorkspace(state:Row,revision:number,action:string):Promise<Saved>{
 const error=validateState(state);if(error)throw Error(error);
 const current=await loadWorkspace();
 if(!current)throw Error('Reload before saving.');
 if(current.revision!==revision)throw Error('This workspace changed in another tab. Reload to keep those changes.');
 const oldSnapshots=current.state.snapshots||[];
 if(JSON.stringify((state.snapshots||[]).slice(0,oldSnapshots.length))!==JSON.stringify(oldSnapshots))throw Error('Saved final versions cannot be changed.');
 for(const snap of (state.snapshots||[]).slice(oldSnapshots.length)){if(readiness(state,snap.departureId).some((x:any)=>x.missing)||!state.contracts.some((c:any)=>c.departureId===snap.departureId&&c.status==='Signed evidence uploaded'&&c.signedDocument))throw Error('Complete the handoff checks and signed contract evidence before finalizing.')}
 const now=new Date().toISOString();
 const next={...state,audit:[{id:crypto.randomUUID(),at:now,actor:actor(),action:String(action||'Updated workspace').slice(0,200)},...(current.state.audit||[])].slice(0,1000)};
 const saved={state:next,revision:revision+1,updatedAt:now};await write(saved);return saved;
}

export async function restoreBackup(json:Row):Promise<Saved>{
 const state=json?.state&&Array.isArray(json.state.departures)?json.state:json;
 const error=validateState(state);if(error)throw Error('That backup could not be restored: '+error);
 const current=await loadWorkspace();const now=new Date().toISOString();
 state.audit=[{id:crypto.randomUUID(),at:now,actor:actor(),action:'Restored a workspace backup'},...(state.audit||[])].slice(0,1000);
 const saved={state,revision:(current?.revision||0)+1,updatedAt:now};await write(saved);return saved;
}

export async function resetWorkspace(empty=false){await tx('kv','readwrite',s=>s.delete('workspace'));return initializeWorkspace(empty)}

// Files: stored as blobs in IndexedDB, same 20 MB limit as the original.
export async function putFile(file:File){
 if(file.size>20*1024*1024)throw Error('Choose a file smaller than 20 MB.');
 const id=crypto.randomUUID(),name=file.name.replace(/[\r\n"\\/]/g,'_');
 await tx('files','readwrite',s=>s.put({id,name,size:file.size,type:file.type||'application/octet-stream',createdAt:new Date().toISOString(),blob:file},id));
 return {id,name,size:file.size,type:file.type};
}
export async function getFile(id:string):Promise<{name:string,blob:Blob,type:string}|null>{return (await tx<any>('files','readonly',s=>s.get(id)))||null}
export async function downloadFile(id:string){const f=await getFile(id);if(!f)throw Error('This file is not stored in this browser. It may have been uploaded on another computer.');const url=URL.createObjectURL(f.blob);const a=document.createElement('a');a.href=url;a.download=f.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}

// Client Guide / Ship Report data, with the same audience filtering as the original server view.
const pick=(o:any,keys:string[])=>Object.fromEntries(keys.filter(k=>o[k]!=null).map(k=>[k,o[k]]));
export function buildView(state:Row,mode:string,id:string,useFrozen=false){
 if(!['client','ship'].includes(mode))throw Error('Invalid view.');
 let s=state,d=s.departures.find((v:any)=>v.id===id);if(!d)throw Error('Departure not found');
 const frozen=(s.snapshots||[]).filter((v:any)=>v.departureId===id).at(-1);
 if(useFrozen&&frozen){s=frozen.state;d=s.departures.find((v:any)=>v.id===id)}
 const filter=(key:string)=>s[key].filter((v:any)=>v.departureId===id&&!v.archived&&((mode==='client'&&v.visibility==='Client and ship')||(mode==='ship'&&v.visibility!=='Internal only')));
 return {mode,version:frozen&&useFrozen?frozen.version:'Working draft',
  departure:pick(d,['id','name','vessel','startDate','endDate','startPort','endPort','inclusions','exclusions','welcomeMessage']),
  itinerary:filter('itinerary').map((v:any)=>pick(v,['date','port','arrival','departure','dock','mapUrl'])),
  agenda:filter('agenda').map((v:any)=>pick(v,['date','start','end','name','venue','foodBeverage','transport','accessibility','contingency'])),
  contacts:filter('contacts').map((v:any)=>pick(v,['name','role','email','phone'])),
  documents:filter('documents').filter((v:any)=>['Approved','Final'].includes(v.status)).map((v:any)=>pick(v,['name','category','version','status'])),
  guests:mode==='ship'?s.guests.filter((v:any)=>v.departureId===id&&!v.archived).map((v:any)=>pick(v,['firstName','lastName','preferredName','cabin','bedPreference','dietary','allergies','accessibility','embarkation','disembarkation'])):[]};
}
