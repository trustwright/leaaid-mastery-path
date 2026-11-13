'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';

type Platform='openai'|'gemini'|'claude'|'slack';
type Question={prompt:string;scenario:string;options:string[];index:number;total:number;difficulty:number;module_code:string};
type HarnessResult={session_id?:string;state?:string;correct?:boolean;message?:string;feedback?:string;question?:Question;agent_workflow?:{agents:{id:string;state:string}[]}};

const PLATFORMS:Record<Platform,{label:string;mark:string;mode:string;summary:string;steps:string[];asset:string;action:string}>={
 openai:{label:'OpenAI',mark:'O',mode:'GPT Action',summary:'Import one action schema.',steps:['GPT builder → New Action.','Import openapi.json. Set authentication to None.','Add the system instruction. Test, then launch Module 1.'],asset:'https://leaaid-mastery-path.nexus-8198.chatgpt.site/openapi.json',action:'Open schema'},
 gemini:{label:'Gemini',mark:'G',mode:'Function tool',summary:'Register one function tool.',steps:['Open AI Studio or a function-enabled Gemini app.','Register operate_leaaid_agent.','Route arguments to /api/agent. Return the result.'],asset:'https://leaaid-mastery-path.nexus-8198.chatgpt.site/client-kits/gemini-function-tool.json',action:'Open function'},
 claude:{label:'Claude',mark:'C',mode:'MCP connector',summary:'Add one MCP connector.',steps:['Settings → Connectors → Add.','Paste the /api/mcp URL.','Approve, then launch Module 1.'],asset:'https://leaaid-mastery-path.nexus-8198.chatgpt.site/api/mcp',action:'Copy MCP URL'},
 slack:{label:'Slack',mark:'S',mode:'Slash command',summary:'Install one slash command.',steps:['Create an app from a manifest.','Import slack-app-manifest.json. Install.','Set the signing secret. Run /leaaid start 1.'],asset:'https://leaaid-mastery-path.nexus-8198.chatgpt.site/slack-app-manifest.json',action:'Open manifest'},
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

export default function Guide(){
 const[platform,setPlatform]=useState<Platform>('openai');
 const[copied,setCopied]=useState('');
 const[demo,setDemo]=useState<HarnessResult|null>(null);
 const[loading,setLoading]=useState(false);
 const[error,setError]=useState('');
 const active=PLATFORMS[platform];
 const agents=useMemo(()=>demo?.agent_workflow?.agents||[
  {id:'learning_orchestrator',state:demo?'delegated':'ready'},
  {id:'testing_agent',state:demo?.question?'active':'ready'},
  {id:'validator_agent',state:'waiting'},
 ],[demo]);
 const call=async(body:Record<string,unknown>)=>{const response=await fetch('/api/agent',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const result=await response.json();if(!response.ok)throw new Error(result.error||'The harness could not complete the action.');return result as HarnessResult};
 const launch=async()=>{setLoading(true);setError('');try{const session=await call({action:'create_session'});const result=await call({action:'launch_multi_agent_training',session_id:session.session_id,module_id:1});setDemo(result)}catch(reason){setError(reason instanceof Error?reason.message:'Unable to launch the demonstration.')}finally{setLoading(false)}};
 const answer=async(option_index:number)=>{if(!demo?.session_id)return;setLoading(true);setError('');try{setDemo(await call({action:'validate_training_response',session_id:demo.session_id,option_index}))}catch(reason){setError(reason instanceof Error?reason.message:'Unable to validate the response.')}finally{setLoading(false)}};
 const copy=async(text:string,label:string)=>{await navigator.clipboard.writeText(text);setCopied(label);setTimeout(()=>setCopied(''),1400)};
 return <main className="guide-shell">
  <nav className="guide-nav"><Link href="/" className="guide-brand"><span>CMU</span><b>LEAAID</b><small>Learning Harness Guide</small></Link><div><a href="#platforms">Set up</a><a href="#proof">Live proof</a><a href="#learn">Learner guide</a><Link className="guide-launch" href="/">Launch training <i>→</i></Link></div></nav>
  <header className="guide-hero"><div><p className="eyebrow">LEAAID LEARNING HARNESS</p><h1>Connect once.<br/><em>Learn anywhere.</em></h1><p>One governed harness. Four AI platforms. Five mastery gates.</p><div><a href="#platforms">Choose a platform <span>↓</span></a><a href="https://codespaces.new/trustwright/leaaid-mastery-path?quickstart=1" target="_blank" rel="noreferrer">Open workshop <span>↗</span></a></div></div><div className="guide-orbit" aria-label="Portable harness sequence"><span>HOST</span><i/><b>HARNESS</b><i/><span>LEARN</span><i/><span>VERIFY</span></div></header>

  <section className="platform-section" id="platforms"><div className="guide-heading"><div><p className="eyebrow">PLATFORM SETUP</p><h2>Choose your AI.</h2></div><p>Same curriculum. Same validator. Same mastery gates.</p></div>
   <div className="platform-tabs" role="tablist" aria-label="Agent platforms">{(Object.keys(PLATFORMS) as Platform[]).map(key=><button key={key} role="tab" aria-selected={platform===key} onClick={()=>setPlatform(key)}><span>{PLATFORMS[key].mark}</span><b>{PLATFORMS[key].label}</b><small>{PLATFORMS[key].mode}</small></button>)}</div>
   <article className="platform-walkthrough"><div className="walkthrough-intro"><span className="platform-mark">{active.mark}</span><p>{active.mode}</p><h3>{active.label}</h3><span>{active.summary}</span></div><ol>{active.steps.map((step,index)=><li key={step}><i>{String(index+1).padStart(2,'0')}</i><span>{step}</span></li>)}</ol><div className="walkthrough-actions">{platform==='claude'?<button onClick={()=>void copy(active.asset,'MCP')}>{copied==='MCP'?'Copied':'Copy MCP URL'} <i>↗</i></button>:<a href={active.asset} target="_blank" rel="noreferrer">{active.action} <i>↗</i></a>}<button onClick={()=>void copy('Launch Module 1.','prompt')}>{copied==='prompt'?'Copied':'Copy launch prompt'} <i>+</i></button></div></article>
  </section>

  <section className="proof-section" id="proof"><div className="proof-copy"><p className="eyebrow">LIVE PROOF</p><h2>Run the harness.</h2><p>Create a session. Watch ORCH → TEACH → REVIEW. Submit one real decision.</p><button onClick={()=>void launch()} disabled={loading}>{loading?'Starting…':demo?'Restart':'Run live proof'} <span>→</span></button>{error&&<p className="proof-error" role="alert">{error}</p>}</div><div className="proof-console"><div className="proof-flow" aria-label="Agent states">{agents.map((agent,index)=><div key={agent.id}><span className={agent.state}>{index===0?'◎':index===1?'◫':'◇'}</span><b>{agent.id==='learning_orchestrator'?'ORCH':agent.id==='testing_agent'?'TEACH':'REVIEW'}</b><small>{agent.state}</small>{index<agents.length-1&&<i/>}</div>)}</div>{!demo?.question?<div className="proof-empty"><b>Ready</b><span>Anonymous session · seven-day expiry</span></div>:<div className="proof-question"><small>{demo.question.module_code} · DECISION {demo.question.index}/{demo.question.total} · LEVEL {demo.question.difficulty}</small><p>{demo.question.scenario}</p><h3>{demo.question.prompt}</h3><div>{demo.question.options.map((option,index)=><button key={option} disabled={loading} onClick={()=>void answer(index)}><i>{String.fromCharCode(65+index)}</i>{option}</button>)}</div>{demo.correct!==undefined&&<strong className={demo.correct?'pass':'retry'}>{demo.correct?'Validated · next decision':'Recovery · retry concept'}</strong>}</div>}</div></section>

  <section className="learner-section" id="learn"><div className="guide-heading"><div><p className="eyebrow">LEARNER GUIDE</p><h2>Five modules. Full mastery.</h2></div><p>10/10 unlocks the next gate. Retries do not affect awards.</p></div><div className="module-map">{MODULES.map((module,index)=><article key={module.code}><span>{module.code}</span><i>{index<4?'→':'◆'}</i><h3>{module.title}</h3><p>{module.objective}</p><small>10 decisions · 100%</small></article>)}</div>
   <div className="achievement-guide"><div><p className="eyebrow">ACHIEVEMENTS</p><h2>Earn. Verify. Share.</h2><p>Pseudonymous receipts prove harness outcomes—not identity or certification.</p><a href="/verify">Verify an achievement <span>→</span></a></div><div className="badge-guide">{BADGES.map((badge,index)=><article key={badge.title}><span className={`badge-prism badge-prism-${index}`}>{badge.code}</span><div><b>{badge.title}</b><p>{badge.rule}</p></div></article>)}</div></div>
  </section>

  <footer className="guide-footer"><div><b>LEAAID</b><span>Source-grounded agentic AI mastery</span></div><nav><a href="https://github.com/trustwright/leaaid-mastery-path" target="_blank" rel="noreferrer">GitHub ↗</a><a href="/leaaid-agent-package.zip">Agent package ↓</a><Link href="/">Learning path →</Link></nav></footer>
 </main>
}
