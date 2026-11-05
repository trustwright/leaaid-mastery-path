'use client';
import {useCallback,useEffect,useMemo,useState} from 'react';

type Question={id:string;index:number;total:number;scenario:string;prompt:string;options:string[];difficulty:number;module_id:number;module_code:string};
type AgentWorkflow={agents:Array<{id:string;state:string}>};
type AgentResult={session_id?:string;state?:string;correct?:boolean;question?:Question;feedback?:string;source_coaching?:{cue:string};agent_workflow?:AgentWorkflow;completed_modules?:number[];next_action?:{module_id?:number};achievement?:unknown};
type Traffic={id:string;requestId:string;actor:'gateway'|'orchestrator'|'question'|'reviewer'|'register';action:string;input:number;output:number;ttft:number;total:number;ok:boolean;at:string};
type ServiceState='checking'|'live'|'error';
type RunState='idle'|'starting'|'awaiting'|'validating'|'advance'|'recovery'|'mastered'|'error';

const tokenEstimate=(value:string)=>Math.max(1,Math.ceil(new TextEncoder().encode(value).length/4));
const stamp=()=>new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit',second:'2-digit'});

async function callAgent(body:Record<string,unknown>){
 const requestId=crypto.randomUUID();const raw=JSON.stringify(body);const started=performance.now();
 const response=await fetch('/api/agent',{method:'POST',headers:{'content-type':'application/json'},body:raw,cache:'no-store'});
 const headersAt=performance.now();const text=await response.text();const finished=performance.now();
 let data:AgentResult&{error?:string}={};try{data=JSON.parse(text) as AgentResult&{error?:string}}catch{}
 return{requestId,response,data,raw,text,ttft:Math.round(headersAt-started),total:Math.round(finished-started)};
}

export default function HarnessMonitor(){
 const[service,setService]=useState<ServiceState>('checking');const[runState,setRunState]=useState<RunState>('idle');const[sessionId,setSessionId]=useState('');const[moduleId,setModuleId]=useState(1);const[question,setQuestion]=useState<Question|null>(null);const[traffic,setTraffic]=useState<Traffic[]>([]);const[selected,setSelected]=useState<number|null>(null);const[message,setMessage]=useState('');const[shared,setShared]=useState(false);
 const capture=useCallback((actor:Traffic['actor'],action:string,result:Awaited<ReturnType<typeof callAgent>>)=>{const row:Traffic={id:`${result.requestId}-${actor}`,requestId:result.requestId,actor,action,input:tokenEstimate(result.raw),output:tokenEstimate(result.text),ttft:result.ttft,total:result.total,ok:result.response.ok,at:stamp()};setTraffic(current=>[...current,row].slice(-12));return row},[]);
 useEffect(()=>{let current=true;fetch('/api/agent',{cache:'no-store'}).then(response=>{if(!response.ok)throw new Error();if(current)setService('live')}).catch(()=>{if(current)setService('error')});return()=>{current=false}},[]);

 const launch=async(nextModule=moduleId)=>{setRunState('starting');setSelected(null);setMessage('');try{
  let activeSession=sessionId;
  if(!activeSession){const created=await callAgent({action:'create_session'});capture('gateway','SESSION',created);if(!created.response.ok||!created.data.session_id)throw new Error(created.data.error||'Session failed');activeSession=created.data.session_id;setSessionId(activeSession)}
  const launched=await callAgent({action:'launch_multi_agent_training',session_id:activeSession,module_id:nextModule});capture('orchestrator','ROUTE',launched);const testing=launched.data.agent_workflow?.agents.find(agent=>agent.id==='testing_agent');if(testing)capture('question',testing.state.toUpperCase(),launched);if(!launched.response.ok||!launched.data.question||!testing)throw new Error(launched.data.error||'Launch failed');setModuleId(nextModule);setQuestion(launched.data.question);setRunState('awaiting');
 }catch(error){setRunState('error');setMessage(error instanceof Error?error.message:'Harness unavailable')}};

 const answer=async(option:number)=>{if(!question||!sessionId||runState==='validating')return;setSelected(option);setRunState('validating');setMessage('');try{
  const reviewed=await callAgent({action:'validate_training_response',session_id:sessionId,option_index:option});const validator=reviewed.data.agent_workflow?.agents.find(agent=>agent.id==='validator_agent');capture('reviewer',validator?.state.toUpperCase()||'REVIEW',reviewed);if(!reviewed.response.ok||!validator)throw new Error(reviewed.data.error||'Review failed');
  if(reviewed.data.state==='module_mastered'&&reviewed.data.achievement){capture('register','ISSUED',reviewed);setQuestion(null);setRunState('mastered');setMessage('100%');return}
  setQuestion(reviewed.data.question||question);setRunState(reviewed.data.correct?'advance':'recovery');setMessage(reviewed.data.correct?'VERIFIED':reviewed.data.source_coaching?.cue||'RECOVERY');window.setTimeout(()=>{setSelected(null);setMessage('');setRunState('awaiting')},1100);
 }catch(error){setRunState('error');setMessage(error instanceof Error?error.message:'Review unavailable')}};

 const requests=useMemo(()=>[...new Map(traffic.map(item=>[item.requestId,item])).values()],[traffic]);const totals=useMemo(()=>requests.reduce((sum,item)=>({input:sum.input+item.input,output:sum.output+item.output}),{input:0,output:0}),[requests]);
 const latest=traffic.at(-1);const decisions=traffic.filter(item=>item.actor==='reviewer').length;const completed=runState==='mastered';const nextModule=Math.min(5,moduleId+1);const activeActor=runState==='starting'?'orchestrator':runState==='validating'?'reviewer':runState==='mastered'?'register':question?'question':'gateway';
 const share=async()=>{const value=`LEAAID live harness · M${moduleId} · ${question?`${question.index}/${question.total}`:'complete'} · ${traffic.length} agent events · ${requests.length} API calls · ${decisions} decisions · ${latest?.ttft||0} ms first byte · 0 model calls`;try{await navigator.clipboard.writeText(value);setShared(true);window.setTimeout(()=>setShared(false),1600)}catch{setShared(false)}};
 const agentClass=(id:Traffic['actor'])=>`${traffic.some(item=>item.actor===id)?'done':''} ${activeActor===id?'current':''}`;

 return <section className="harness-console" id="harness" aria-labelledby="harness-title">
  <header className="harness-head"><div><p>LEAAID · LIVE</p><h2 id="harness-title">Learning harness</h2></div><div className="harness-session"><b className={service}><i/>{service==='checking'?'SYNC':service==='live'?'ONLINE':'OFFLINE'}</b><span>{sessionId?`M${moduleId} · ${question?`${String(question.index).padStart(2,'0')}/${question.total}`:'10/10'}`:'NO SESSION'}</span></div></header>
  <div className="console-body">
   <div className="agent-flow" aria-label="Live gateway, orchestrator, question agent, reviewing agent, and achievement register"><div className={`flow-unit gateway ${agentClass('gateway')}`}><i>↳</i><b>Gateway</b></div><span/><div className={`flow-unit ${agentClass('orchestrator')}`}><i>O</i><b>Orchestrator</b></div><span/><div className={`flow-unit ${agentClass('question')}`}><i>Q</i><b>Question</b></div><span/><div className={`flow-unit ${agentClass('reviewer')}`}><i>R</i><b>Review</b></div><span/><div className={`flow-unit register ${agentClass('register')}`}><i>◆</i><b>Receipt</b></div></div>
   <div className="telemetry six" aria-label="Live harness telemetry"><div><span>FIRST BYTE</span><strong>{latest?latest.ttft:'—'}</strong><small>ms · latest</small></div><div><span>END TO END</span><strong>{latest?latest.total:'—'}</strong><small>ms · latest</small></div><div><span>AGENT EVENTS</span><strong>{traffic.length||'—'}</strong><small>{requests.length||0} API calls</small></div><div><span>DECISIONS</span><strong>{decisions||'—'}</strong><small>reviewed</small></div><div><span>INFERENCE</span><strong>0</strong><small>$0 · TTFT n/a</small></div><div><span>GHOST TOKENS</span><strong>0</strong><small>no model context</small></div></div>
   <div className="harness-live-grid">
    <section className="live-decision" aria-label="Active source-grounded decision">
     <div className="decision-head"><span>{question?`${question.module_code} · ${String(question.index).padStart(2,'0')}/${question.total}`:`M${moduleId}`}</span><b className={runState}>{runState==='idle'?'READY':runState.toUpperCase()}</b></div>
     {!question&&!completed&&<div className="decision-launch"><i>◇</i><button onClick={()=>void launch(moduleId)} disabled={service!=='live'||runState==='starting'}>{runState==='starting'?'CONNECTING':'START M1'} <span>→</span></button></div>}
     {question&&<><p>{question.scenario}</p><h3>{question.prompt}</h3><div className="harness-answers">{question.options.map((option,index)=><button key={option} className={selected===index?'selected':''} disabled={runState==='validating'||runState==='advance'||runState==='recovery'} onClick={()=>void answer(index)}><span>{String.fromCharCode(65+index)}</span>{option}</button>)}</div></>}
     {completed&&<div className="decision-complete"><i>◆</i><strong>M{moduleId} · 100%</strong>{moduleId<5&&<button onClick={()=>void launch(nextModule)}>START M{nextModule} →</button>}</div>}
     {message&&<div className={`harness-message ${runState}`} role="status">{message}</div>}
    </section>
    <section className="traffic-stream" aria-label="Live agent traffic"><div className="stream-head"><span>TRAFFIC</span><b>↓ {totals.input} · ↑ {totals.output}</b></div><div>{traffic.length===0?<p className="stream-empty">AWAITING ACTIVITY</p>:traffic.toReversed().map(item=><article key={item.id} className={item.ok?'ok':'bad'}><i/><b>{item.action}</b><span>{item.at}</span><small>{item.actor.toUpperCase()} · ↓{item.input} ↑{item.output} · {item.ttft}/{item.total} ms</small></article>)}</div></section>
   </div>
   <div className="control-grid"><section><p>GATES</p><ul><li><i/>Allowlist</li><li><i/>Typed input</li><li><i/>Source boundary</li><li><i/>Answer sealed</li><li><i/>Exact key</li></ul></section><section><p>SESSION</p><dl><div><dt>Group</dt><dd>LEAAID</dd></div><div><dt>Pack</dt><dd>Foundations</dd></div><div><dt>Mastery</dt><dd>100%</dd></div><div><dt>Identity</dt><dd>Off</dd></div><div><dt>TTL</dt><dd>7 days</dd></div></dl></section><section><p>RUNTIME</p><dl><div><dt>REST</dt><dd className={service==='live'?'ok':'bad'}>{service==='live'?'Live':'Down'}</dd></div><div><dt>Scoring</dt><dd>Deterministic</dd></div><div><dt>Inference</dt><dd>None</dd></div><div><dt>Last event</dt><dd>{latest?.at||'—'}</dd></div></dl></section></div>
   <div className="pack-target"><div><span>ACTIVE PACK</span><b>LEAAID Foundations</b></div><i>→</i><div><span>PORTABLE CONTRACT</span><b>Specialist learning packs</b></div><a href="/learning-pack.schema.json" target="_blank" rel="noreferrer">CONTRACT ↗</a><small>Runtime loading remains disabled</small></div>
   <div className="harness-foot"><button onClick={()=>void share()} disabled={!traffic.length}>{shared?'COPIED':'SHARE TRACE'}</button><p>Transport estimates are not billable inference tokens. Connected AI platforms meter their own model context and cost.</p></div>
  </div>
 </section>
}
