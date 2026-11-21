'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import MasteryLandscape from '../MasteryLandscape';

type Platform='openai'|'gemini'|'slack';
type ConnectState='idle'|'checking'|'ready'|'error';
type HudState={moduleId:number;moduleScores:number[];mastered:number;total:number;questionIndex:number;answered:boolean;correct:boolean;secondsRemaining:number;active:boolean};

const PLATFORMS:Record<Platform,{label:string;mark:string;mode:string;asset:string;destination:string;copy:'url'|'body';requirement:string;steps:string[]}>={
 openai:{label:'ChatGPT',mark:'O',mode:'PRIVATE MCP',asset:'Launch Module 1.',destination:'https://chatgpt.com/space?artifact=plugins',copy:'url',requirement:'A private Site-created plugin connects ChatGPT to the LEAAID harness.',steps:['Plugins → Personal','Install LEAAID','Ask “Launch Module 1”']},
 gemini:{label:'Gemini AI Studio',mark:'G',mode:'FUNCTION CALLING',asset:'/client-kits/gemini-function-tool.json',destination:'https://aistudio.google.com/prompts/new_chat?model=gemini-3.8-flash',copy:'body',requirement:'Verified in AI Studio. Consumer Gems need a function-enabled executor to call the harness.',steps:['Open Gemini 3.8 Flash','Enable Function calling; paste the copied declaration','Add the guardrails; type “Launch Module 1”']},
 slack:{label:'Slack',mark:'S',mode:'WORKSPACE ADMIN',asset:'/slack-app-manifest.json',destination:'https://api.slack.com/apps',copy:'body',requirement:'A workspace owner approves one permission: slash commands.',steps:['Create an App → Paste a manifest','Select all sample JSON, then paste','Create and Install; type /leaaid start 1']},
};

const PLATFORM_PROOFS:Record<Platform,{state:string;title:string;detail:string;frames:{label:string;title:string;detail:string}[];link?:string}>={
 openai:{state:'MCP READY',title:'ChatGPT calls the harness.',detail:'The private plugin exposes LEAAID tools inside ChatGPT. It is not a custom GPT and is not publicly listed.',frames:[{label:'01',title:'Install plugin',detail:'Personal library'},{label:'02',title:'Approve tools',detail:'Private connection'},{label:'03',title:'Launch Module 1',detail:'Harness responds'}]},
 gemini:{state:'LIVE VERIFIED',title:'Gemini to Question 2.',detail:'Verified in Gemini AI Studio with Gemini 3.8 Flash on November 20, 2026.',frames:[{label:'01',title:'Paste function',detail:'One declaration'},{label:'02',title:'Launch Module 1',detail:'Session created'},{label:'03',title:'Answer + resume',detail:'Question 2 returned'}],link:'https://github.com/trustwright/leaaid-mastery-path/blob/main/docs/GEMINI-VERIFIED-WALKTHROUGH.md'},
 slack:{state:'LIVE VERIFIED',title:'Slack to Question 2.',detail:'Verified privately in the dsec workspace on November 20, 2026. Replies were visible only to the learner.',frames:[{label:'01',title:'Paste manifest',detail:'commands scope'},{label:'02',title:'/leaaid start 1',detail:'Question 1 returned'},{label:'03',title:'Answer + status',detail:'Question 2 resumed'}],link:'https://github.com/trustwright/leaaid-mastery-path/blob/main/docs/SLACK-VERIFIED-WALKTHROUGH.md'},
};

const MODULES=[
 {code:'M1',title:'Agentic AI Foundations',objective:'Goals, authority, policy, and stopping rules.'},
 {code:'M2',title:'Data & Architecture',objective:'Knowledge, tools, memory, evaluation, cost, and latency.'},
 {code:'M3',title:'Agentic AI Assurance',objective:'Identity, guardrails, threats, and containment.'},
 {code:'M4',title:'Strategy & Transformation',objective:'Value, governance, decision rights, and control planes.'},
 {code:'M5',title:'Applied Agentic Systems',objective:'Build, test, refine, and govern an agentic outcome.'},
];

const BADGES=[
 {code:'M1–M5',title:'Module mastery',rule:'10 of 10 source-grounded decisions per module'},
 {code:'LAB',title:'Applied Agent Builder',rule:'Seven governed build, refinement, and operating decisions'},
 {code:'◆',title:'Premier LEAAID Knowledge',rule:'Five module badges + applied lab + 10 of 10 final decisions'},
];

const EMPTY_HUD:HudState={moduleId:1,moduleScores:[0,0,0,0,0],mastered:0,total:10,questionIndex:1,answered:false,correct:false,secondsRemaining:45,active:false};

export default function Guide(){
 const[platform,setPlatform]=useState<Platform>('openai');
 const[copied,setCopied]=useState('');
 const[loading,setLoading]=useState(false);
 const[error,setError]=useState('');
 const[connectState,setConnectState]=useState<ConnectState>('idle');
 const[connectionNote,setConnectionNote]=useState('');
 const[completed,setCompleted]=useState(0);
 const[hud,setHud]=useState<HudState>(EMPTY_HUD);
 const active=PLATFORMS[platform];
 const proof=PLATFORM_PROOFS[platform];
 useEffect(()=>{const read=()=>{try{const saved=JSON.parse(localStorage.getItem('leaaid-mastery-v1')||'{}');const count=Array.isArray(saved.completed)?saved.completed.length:0;setCompleted(count);const live=JSON.parse(localStorage.getItem('leaaid-live-hud-v1')||'null');if(live&&Array.isArray(live.moduleScores))setHud({...EMPTY_HUD,...live});else setHud({...EMPTY_HUD,moduleId:Math.min(5,count+1),moduleScores:Array.from({length:5},(_,index)=>index<count?100:0)})}catch{setHud(EMPTY_HUD)}};queueMicrotask(read);addEventListener('storage',read);addEventListener('focus',read);return()=>{removeEventListener('storage',read);removeEventListener('focus',read)}},[]);
 const call=async(body:Record<string,unknown>)=>{const response=await fetch('/api/agent',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const result=await response.json();if(!response.ok)throw new Error(result.error||'The harness could not complete the action.');return result};
 const copy=async(text:string,label:string)=>{await navigator.clipboard.writeText(text);setCopied(label);setTimeout(()=>setCopied(''),1400)};
 const testService=async()=>{setConnectState('checking');setLoading(true);try{const session=await call({action:'create_session'}) as {session_id:string};await call({action:'launch_multi_agent_training',session_id:session.session_id,module_id:1});setConnectState('ready')}catch(reason){setConnectState('error');setError(reason instanceof Error?reason.message:'Training service unavailable.')}finally{setLoading(false)}};
 const connect=async(key:Platform)=>{const item=PLATFORMS[key];setPlatform(key);setError('');setConnectionNote(key==='gemini'?'Function copied. Paste it in Function declarations.':key==='slack'?'Manifest copied. Replace Slack’s sample JSON.':'Launch prompt copied. Install the private LEAAID plugin.');window.open(item.destination,'_blank','noopener,noreferrer');try{let payload=item.copy==='body'?await fetch(item.asset).then(response=>{if(!response.ok)throw new Error('Setup file unavailable.');return response.text()}):item.asset;if(key==='gemini'){const parsed=JSON.parse(payload) as {function_declarations:unknown[]};payload=JSON.stringify(parsed.function_declarations,null,2)}await navigator.clipboard.writeText(payload);void testService()}catch(reason){setConnectState('error');setConnectionNote('Open the setup file below and copy it manually.');setError(reason instanceof Error?reason.message:'Setup could not be copied.')}};
 const copyGeminiInstructions=async()=>{try{const instructions=await fetch('/client-kits/leaaid-system-instructions.txt').then(response=>{if(!response.ok)throw new Error('Instruction file unavailable.');return response.text()});await copy(instructions,'gemini-instructions')}catch(reason){setError(reason instanceof Error?reason.message:'Instructions could not be copied.')}};
 return <main className="guide-shell">
  <nav className="guide-nav"><Link href="/" className="guide-brand"><span>CMU</span><b>LEAAID</b><small>Learning Harness Guide</small></Link><div><a href="#platforms">Set up</a><a href="#learn">Learning path</a><Link className="guide-launch" href="/">Launch training <i>→</i></Link></div></nav>
  <header className="guide-hero"><div><p className="eyebrow">CURRENT LEARNER</p><h1>Your mastery.<br/><em>Module by module.</em></h1><p>Progress saved on this device.</p><div><Link href="/">Start or continue <span>→</span></Link><a href="#platforms">Add to your AI <span>↓</span></a></div></div><MasteryLandscape completed={completed} moduleId={hud.moduleId} mastered={hud.mastered} total={hud.total} questionIndex={hud.questionIndex} answered={hud.answered} correct={hud.correct} moduleScores={hud.moduleScores} secondsRemaining={hud.secondsRemaining} active={hud.active}/></header>

  <section className="platform-section" id="platforms"><div className="guide-heading"><div><p className="eyebrow">RUN LEAAID</p><h2>Choose a platform.</h2></div></div>
   <div className="one-click-grid three" aria-label="Choose where to use LEAAID">{(Object.keys(PLATFORMS) as Platform[]).map(key=><button key={key} className={platform===key?'active':''} onClick={()=>void connect(key)}><span>{PLATFORMS[key].mark}</span><small>{PLATFORMS[key].mode}</small><b>{key==='openai'?'Open':'Connect'} {PLATFORMS[key].label}</b><i aria-hidden="true"/></button>)}</div>
   <p className="setup-requirement"><b>{active.label}:</b> {active.requirement}</p>
   <ol className="setup-flow" aria-label={`${active.label} setup steps`}>{active.steps.map((step,index)=><li key={step}><span>{index+1}</span><b>{step}</b></li>)}</ol>
   {connectState!=='idle'&&<article className={`connection-dock ${connectState}`} aria-live="polite"><div className="connection-message"><span className="platform-mark">{active.mark}</span><div><small>{active.label.toUpperCase()}</small><h3>{connectionNote}</h3><p className="service-state">{loading?'Checking service…':connectState==='ready'?'✓ Harness ready':connectState==='error'?'Service check failed':'Ready'}</p></div></div>{platform==='gemini'&&<div className="connection-actions"><button onClick={()=>void copyGeminiInstructions()}>{copied==='gemini-instructions'?'Guardrails copied':'Copy guardrails'}</button></div>}{error&&<p className="connection-error" role="alert">{error}</p>}</article>}
   <article className="platform-proof" aria-label={`${active.label} visual setup walkthrough`}><header><span>{active.mark}</span><div><small>{proof.state}</small><h3>{proof.title}</h3></div></header><div className="proof-frames">{proof.frames.map(frame=><section key={frame.label}><i>{frame.label}</i><b>{frame.title}</b><span>{frame.detail}</span></section>)}</div><footer><p>{proof.detail}</p>{proof.link&&<a href={proof.link} target="_blank" rel="noreferrer">Test record</a>}</footer></article>
   <a className="admin-kit" href="https://github.com/trustwright/leaaid-mastery-path/tree/main/agent-package" target="_blank" rel="noreferrer"><span>Administrator integration kit</span><b>OpenAPI · MCP · manifests</b></a>
   <details className="mcp-brief"><summary><span>Connect an agent host</span><b>MCP · Model Context Protocol</b></summary><div className="mcp-grid"><section><small>WHAT</small><strong>LEAAID tools for an AI host</strong><p>Session, coaching, questions, validation, progress, and achievements.</p></section><section><small>WHY</small><strong>One governed interface</strong><p>The host calls the same source-grounded harness used by the Site and Slack.</p></section><section><small>HOW</small><strong>Install → approve → launch</strong><p>Open Plugins, connect LEAAID, then ask: “Launch Module 1.”</p></section></div><footer><span>Learner using this Site or Slack?</span><b>Skip MCP.</b><a href="https://github.com/trustwright/leaaid-mastery-path/tree/main/agent-package" target="_blank" rel="noreferrer">Integration steps</a></footer></details>
  </section>

  <section className="learner-section" id="learn"><div className="guide-heading"><div><p className="eyebrow">MASTERY PATH</p><h2>Five modules. Full mastery.</h2></div><p>10/10 unlocks next.</p></div><div className="module-map">{MODULES.map((module,index)=><article key={module.code}><span>{module.code}</span><i>{index<4?'→':'◆'}</i><h3>{module.title}</h3><p>{module.objective}</p><small>10 decisions · 100%</small></article>)}</div>
   <div className="achievement-guide"><div><p className="eyebrow">ACHIEVEMENTS</p><h2>Earn. Verify. Share.</h2><a href="/verify">Verify a badge <span>→</span></a></div><div className="badge-guide">{BADGES.map((badge,index)=><article key={badge.title}><span className={`badge-prism badge-prism-${index}`}>{badge.code}</span><div><b>{badge.title}</b><p>{badge.rule}</p></div></article>)}</div></div>
  </section>

  <footer className="guide-footer"><div><b>LEAAID</b><span>Source-grounded agentic AI mastery</span></div><nav><a href="https://github.com/trustwright/leaaid-mastery-path" target="_blank" rel="noreferrer">GitHub ↗</a><a href="/leaaid-agent-package.zip">Agent package ↓</a><Link href="/">Learning path →</Link></nav></footer>
 </main>
}
