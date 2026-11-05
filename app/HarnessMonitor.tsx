'use client';
import {useCallback,useEffect,useState} from 'react';

const origin='https://leaaid-mastery-path.nexus-8198.chatgpt.site';
type Probe={state:'checking'|'live'|'error';rest:boolean;mcp:boolean;input:number;output:number;latency:number;checked:string};
const initial:Probe={state:'checking',rest:false,mcp:false,input:0,output:0,latency:0,checked:''};
const approxTokens=(value:string)=>Math.max(1,Math.ceil(new TextEncoder().encode(value).length/4));

export default function HarnessMonitor(){
 const[probe,setProbe]=useState<Probe>(initial);
 const run=useCallback(async()=>{
  setProbe(current=>({...current,state:'checking'}));
  const started=performance.now();
  const restBody=JSON.stringify({action:'describe_program'});
  const mcpBody=JSON.stringify({jsonrpc:'2.0',id:1,method:'initialize',params:{}});
  try{
   const[rest,mcp]=await Promise.all([
    fetch('/api/agent',{method:'POST',headers:{'content-type':'application/json'},body:restBody,cache:'no-store'}),
    fetch('/api/mcp',{method:'POST',headers:{'content-type':'application/json'},body:mcpBody,cache:'no-store'}),
   ]);
   const[restText,mcpText]=await Promise.all([rest.text(),mcp.text()]);
   const restOK=rest.ok;const mcpOK=mcp.ok;
   setProbe({state:restOK&&mcpOK?'live':'error',rest:restOK,mcp:mcpOK,input:approxTokens(restBody)+approxTokens(mcpBody),output:approxTokens(restText)+approxTokens(mcpText),latency:Math.round(performance.now()-started),checked:new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit',second:'2-digit'})});
  }catch{setProbe(current=>({...current,state:'error',latency:Math.round(performance.now()-started),checked:new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit',second:'2-digit'})}))}
 },[]);
 useEffect(()=>{const timer=window.setTimeout(()=>{void run()},0);return()=>window.clearTimeout(timer)},[run]);
 const live=probe.state==='live';
 return <details className="harness-console">
  <summary><span>Learning harness</span><b className={probe.state}><i/>{probe.state==='checking'?'Checking':live?'Live':'Check failed'}</b></summary>
  <div className="console-body">
   <div className="console-top"><div><p>LIVE EXECUTION PATH</p><h2>Request → controlled result</h2></div><button onClick={()=>void run()} disabled={probe.state==='checking'}>{probe.state==='checking'?'Checking…':'Run live check'}</button></div>
   <div className="agent-flow" aria-label="Gateway, orchestrator, testing agent, validator, and achievement register">
    <div className="flow-unit gateway"><i>↳</i><b>Gateway</b><small>Typed input</small></div><span/>
    <div className="flow-unit"><i>O</i><b>Orchestrator</b><small>Sequence</small></div><span/>
    <div className="flow-unit"><i>T</i><b>Test agent</b><small>Authored item</small></div><span/>
    <div className="flow-unit"><i>V</i><b>Validator</b><small>Exact key</small></div><span/>
    <div className="flow-unit receipt"><i>◆</i><b>Receipt</b><small>Mastery gate</small></div>
   </div>
   <div className="telemetry" aria-label="Live harness telemetry">
    <div><span>INPUT</span><strong>{probe.input}</strong><small>≈ tokens</small></div>
    <div><span>OUTPUT</span><strong>{probe.output}</strong><small>≈ tokens</small></div>
    <div><span>MODEL SCORING</span><strong>0</strong><small>inference calls</small></div>
    <div><span>ROUNDTRIP</span><strong>{probe.latency||'—'}</strong><small>ms</small></div>
   </div>
   <div className="control-grid">
    <section><p>GUARDRAIL GATEWAY</p><ul><li><i/>Action allowlist</li><li><i/>Typed input</li><li><i/>Source boundary</li><li><i/>Answer sealed</li><li><i/>Deterministic gate</li></ul></section>
    <section><p>OPERATING POLICY</p><dl><div><dt>Manifest</dt><dd>v1.2</dd></div><div><dt>Mastery</dt><dd>100%</dd></div><div><dt>Identity</dt><dd>Off</dd></div><div><dt>Transcript</dt><dd>Off</dd></div><div><dt>Session</dt><dd>7 days</dd></div></dl></section>
    <section><p>ENDPOINT STATUS</p><dl><div><dt>REST / OpenAPI</dt><dd className={probe.rest?'ok':'bad'}>{probe.rest?'Live':'Down'}</dd></div><div><dt>MCP connector</dt><dd className={probe.mcp?'ok':'bad'}>{probe.mcp?'Live':'Down'}</dd></div><div><dt>Validator</dt><dd className="ok">Authored</dd></div><div><dt>Checked</dt><dd>{probe.checked||'—'}</dd></div></dl></section>
   </div>
   <details className="endpoint-drawer"><summary>Connection details</summary><div><p><b>ChatGPT</b><code>{origin}/openapi.json</code></p><p><b>Claude</b><code>{origin}/api/mcp</code></p><p><b>Gemini</b><code>{origin}/api/agent</code></p><p><b>Slack</b><code>{origin}/api/slack</code></p></div></details>
   <p className="meter-note">Token counts estimate this live probe from UTF-8 bytes. Connected AI platforms report their own model usage separately.</p>
  </div>
 </details>
}
