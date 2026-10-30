import {createContext,useContext} from 'react';

export type Row=Record<string,any>;
export type Page='dashboard'|'charters'|'charter'|'guests'|'documents'|'reports';
export type ImportOpts={entities:string[],title:string,instructions?:string,files?:File[]};

export type Ctx={
 s:Row,trip:string,current:Row,busy:boolean,
 setTrip:(id:string)=>void,
 save:(next:Row,action:string)=>Promise<boolean>,
 quick:(entity:string,row:Row,patch:Row)=>Promise<boolean>,
 edit:(entity:string,row?:Row,defaults?:Row,file?:File)=>void,
 importAi:(o:ImportOpts)=>void,
 ask:(question?:string)=>void,
 go:(page:Page,sub?:string,filter?:string)=>void,
 notify:(msg:string)=>void,
 fail:(msg:string)=>void,
 linked:(entity:string)=>Row[],
 report:(mode:'client'|'ship',frozen?:boolean)=>void,
};

export const AppCtx=createContext<Ctx|null>(null);
export const useApp=()=>useContext(AppCtx)!;

export const recordName=(r:Row)=>r.name||[r.firstName,r.lastName].filter(Boolean).join(' ').replace(/ /g,' ').trim()||(r.number?'Cabin '+r.number:'')||r.port||'Untitled';
export const fmtDate=(v?:string,opts:Intl.DateTimeFormatOptions={month:'short',day:'numeric',year:'numeric'})=>v&&/^\d{4}-\d{2}-\d{2}/.test(v)?new Date(v.slice(0,10)+'T12:00:00').toLocaleDateString('en-US',opts):v||'';
export const fmtTime=(v?:string)=>v?String(v).slice(0,5):'';
export const fmtMoney=(n:number,c='EUR')=>new Intl.NumberFormat('en-US',{style:'currency',currency:c,maximumFractionDigits:0}).format(n);
export const tone=(v:any)=>/^(Approved|Final|Done|Verified|Paid|Received|Acknowledged|Signed evidence uploaded|Completed|Confirmed|Assigned|Resolved|Contracted)$/.test(v)?'good':/review|missing|due|failed|Unverified|Open|To do|Requested|Pending|Held|Inquiry|Proposal/i.test(v)?'warn':/Blocked|Out of service|Cancelled|Overdue/i.test(v)?'bad':'neutral';
export function download(filename:string,data:string,type='application/json'){const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
export const csvEscape=(v:any)=>{const s=String(v??'');return /[",\n\r]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};
