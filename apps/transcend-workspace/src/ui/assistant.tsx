import {useEffect,useRef,useState} from 'react';
import {X,Sparkles,ArrowUp,Paperclip,Copy,Check,RotateCcw} from 'lucide-react';
import {askAssistant} from '../lib/ai';
import {snapshot} from '../lib/insights';
import {useApp} from '../ctx';
import {Markdown} from './kit';

export type Msg={role:'user'|'assistant',content:string,error?:boolean};
export const PROMPTS=['Summarize this charter','Find missing guest details','Draft client update','What’s left before handoff?','Which cabins are still available?','Draft a crew briefing for day 1'];

export function Assistant({messages,setMessages,pending,onClose}:{messages:Msg[],setMessages:(f:(m:Msg[])=>Msg[])=>void,pending:string,onClose:()=>void}){
 const {s,trip,current,importAi}=useApp();
 const [text,setText]=useState(''),[thinking,setThinking]=useState(false),[copied,setCopied]=useState(-1);
 const end=useRef<HTMLDivElement>(null),sent=useRef('');
 useEffect(()=>{end.current?.scrollIntoView({behavior:'smooth',block:'end'})},[messages,thinking]);
 useEffect(()=>{if(pending&&pending!==sent.current){sent.current=pending;send(pending.replace(/#\d+$/,''))}},[pending]);
 async function send(q:string){q=q.trim();if(!q||thinking)return;setText('');const history=messages.filter(m=>!m.error).slice(-8).map(({role,content})=>({role,content}));setMessages(m=>[...m,{role:'user',content:q}]);setThinking(true);try{const a=await askAssistant(q,snapshot(s,trip),history);setMessages(m=>[...m,{role:'assistant',content:a}])}catch(e:any){setMessages(m=>[...m,{role:'assistant',content:String(e.message||e),error:true}])}finally{setThinking(false)}}
 return <aside className="assistant" role="dialog" aria-label="Ask Transcend AI">
  <header><div className="orb sm"><Sparkles size={16}/></div><div><h2>Transcend AI</h2><p>{current?.name||'Your workspace'}</p></div>{messages.length>0&&<button className="icon-btn" title="New conversation" aria-label="New conversation" onClick={()=>setMessages(()=>[])}><RotateCcw size={17}/></button>}<button className="icon-btn" aria-label="Close assistant" onClick={onClose}><X size={20}/></button></header>
  <div className="chat">
   {!messages.length&&<div className="chat-empty"><h3>What can I help with?</h3><p>I know everything saved for this charter: guests, cabins, schedule, documents and tasks. I can answer questions and draft updates. I never send anything for you.</p><div className="prompt-list">{PROMPTS.map(p=><button key={p} onClick={()=>send(p)}>{p}</button>)}<button onClick={()=>importAi({entities:['guests','cabins','agenda','itinerary','contacts','tasks'],title:'Upload client information'})}><Paperclip size={14}/>Upload a client spreadsheet</button></div></div>}
   {messages.map((m,i)=><div key={i} className={'msg '+(m.role==='user'?'mine':'ai')+(m.error?' error':'')}>{m.role==='assistant'?<><Markdown text={m.content}/>{!m.error&&<button className="copy" onClick={()=>{navigator.clipboard?.writeText(m.content);setCopied(i);setTimeout(()=>setCopied(-1),1500)}}>{copied===i?<Check size={13}/>:<Copy size={13}/>}{copied===i?'Copied':'Copy'}</button>}</>:<p>{m.content}</p>}</div>)}
   {thinking&&<div className="msg ai thinking"><span/><span/><span/></div>}
   <div ref={end}/>
  </div>
  {messages.length>0&&<div className="prompt-row">{PROMPTS.slice(0,4).map(p=><button key={p} onClick={()=>send(p)} disabled={thinking}>{p}</button>)}</div>}
  <form className="composer" onSubmit={e=>{e.preventDefault();send(text)}}>
   <button type="button" className="icon-btn" title="Upload a file for AI to organize" aria-label="Upload a file" onClick={()=>importAi({entities:['guests','cabins','agenda','itinerary','contacts','tasks','documents'],title:'Upload and organize'})}><Paperclip size={18}/></button>
   <textarea rows={1} placeholder="Ask a question or request a draft…" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(text)}}}/>
   <button type="submit" className="send" aria-label="Send" disabled={!text.trim()||thinking}><ArrowUp size={18}/></button>
  </form>
 </aside>;
}
