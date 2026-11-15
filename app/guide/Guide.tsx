'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import MasteryLandscape from '../MasteryLandscape';

type Platform='openai'|'gemini'|'claude'|'slack';
type ConnectState='idle'|'approval'|'testing'|'ready';

const PLATFORMS:Record<Platform,{label:string;mark:string;mode:string;asset:string;destination:string;copy:'url'|'body';approval:string}>={
 openai:{label:'OpenAI',mark:'O',mode:'GPT Action',asset:'https://leaaid-mastery-path.nexus-8198.chatgpt.site/openapi.json',destination:'https://chatgpt.com/gpts/editor',copy:'url',approval:'Import the copied URL. Choose None for authentication.'},
 gemini:{label:'Gemini',mark:'G',mode:'Function tool',asset:'/client-kits/gemini-function-tool.json',destination:'https://aistudio.google.com/',copy:'body',approval:'Paste the copied function declaration into a function-enabled project.'},
 claude:{label:'Claude',mark:'C',mode:'MCP connector',asset:'https://leaaid-mastery-path.nexus-8198.chatgpt.site/api/mcp',destination:'https://claude.ai/settings/connectors',copy:'url',approval:'Add the copied MCP URL and approve the connector.'},
 slack:{label:'Slack',mark:'S',mode:'Slash command',asset:'/slack-app-manifest.json',destination:'https://api.slack.com/apps',copy:'body',approval:'Create an app from a manifest. Paste, review, and install.'},
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
 const[loading,setLoading]=useState(false);
 const[error,setError]=useState('');
 const[connectState,setConnectState]=useState<ConnectState>('idle');
 const[connectionNote,setConnectionNote]=useState('');
 const[completed,setCompleted]=useState(0);
 const active=PLATFORMS[platform];
 useEffect(()=>{queueMicrotask(()=>{try{const saved=JSON.parse(localStorage.getItem('leaaid-mastery-v1')||'{}');setCompleted(Array.isArray(saved.completed)?saved.completed.length:0)}catch{}})},[]);
 const call=async(body:Record<string,unknown>)=>{const response=await fetch('/api/agent',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const result=await response.json();if(!response.ok)throw new Error(result.error||'The harness could not complete the action.');return result};
 const copy=async(text:string,label:string)=>{await navigator.clipboard.writeText(text);setCopied(label);setTimeout(()=>setCopied(''),1400)};
 const connect=async(key:Platform)=>{const item=PLATFORMS[key];setPlatform(key);setError('');setConnectState('approval');setConnectionNote('Opening…');window.open(item.destination,'_blank','noopener,noreferrer');try{const payload=item.copy==='body'?await fetch(item.asset).then(response=>{if(!response.ok)throw new Error('Setup file unavailable.');return response.text()}):item.asset;await navigator.clipboard.writeText(payload);setConnectionNote(item.approval)}catch(reason){setConnectState('idle');setConnectionNote('');setError(reason instanceof Error?reason.message:'Setup could not be copied.')}};
 const testConnection=async()=>{setConnectState('testing');setLoading(true);setError('');try{const session=await call({action:'create_session'}) as {session_id:string};await call({action:'launch_multi_agent_training',session_id:session.session_id,module_id:1});setConnectState('ready');setConnectionNote('Harness online. Module 1 is ready.')}catch(reason){setConnectState('approval');setError(reason instanceof Error?reason.message:'Harness test failed.')}finally{setLoading(false)}};
 return <main className="guide-shell">
  <nav className="guide-nav"><Link href="/" className="guide-brand"><span>CMU</span><b>LEAAID</b><small>Learning Harness Guide</small></Link><div><a href="#platforms">Set up</a><a href="#learn">Learning path</a><Link className="guide-launch" href="/">Launch training <i>→</i></Link></div></nav>
  <header className="guide-hero"><div><p className="eyebrow">LEAAID LEARNING HARNESS</p><h1>Connect once.<br/><em>Learn anywhere.</em></h1><p>One governed harness. Four AI platforms. Five mastery gates.</p><div><a href="#platforms">Choose a platform <span>↓</span></a><Link href="/">Launch training <span>→</span></Link></div></div><MasteryLandscape completed={completed} moduleId={Math.min(5,completed+1)} mastered={0} total={10}/></header>

  <section className="platform-section" id="platforms"><div className="guide-heading"><div><p className="eyebrow">ONE-CLICK SETUP</p><h2>Choose. Connect.</h2></div><p>Setup copied. Service opened. You approve.</p></div>
   <div className="one-click-grid" aria-label="Connect an AI platform">{(Object.keys(PLATFORMS) as Platform[]).map(key=><button key={key} className={platform===key&&connectState!=='idle'?'active':''} onClick={()=>void connect(key)}><span>{PLATFORMS[key].mark}</span><small>{PLATFORMS[key].mode}</small><b>Connect {PLATFORMS[key].label}</b><i>↗</i></button>)}</div>
   {connectState!=='idle'&&<article className={`connection-dock ${connectState}`} aria-live="polite"><div className="connection-rail" aria-label="Setup progress"><span className="done"><i>✓</i> COPY</span><b/><span className={connectState==='approval'?'current':'done'}><i>{connectState==='approval'?'2':'✓'}</i> APPROVE</span><b/><span className={connectState==='testing'?'current':connectState==='ready'?'done':''}><i>{connectState==='ready'?'✓':'3'}</i> TEST</span><b/><span className={connectState==='ready'?'current':''}><i>4</i> LAUNCH</span></div><div className="connection-message"><span className="platform-mark">{active.mark}</span><div><small>{active.label.toUpperCase()} · {active.mode.toUpperCase()}</small><h3>{connectionNote}</h3></div></div><div className="connection-actions"><a href={active.destination} target="_blank" rel="noreferrer">Open again <i>↗</i></a>{connectState!=='ready'?<button onClick={()=>void testConnection()} disabled={loading}>{connectState==='testing'?'Testing…':'Test harness'} <i>→</i></button>:<button onClick={()=>void copy('Launch Module 1.','prompt')}>{copied==='prompt'?'Copied':'Copy “Launch Module 1”'} <i>+</i></button>}</div>{error&&<p className="connection-error" role="alert">{error}</p>}</article>}
   <details className="developer-details"><summary>Developer details</summary><div><a href="/openapi.json">OpenAPI</a><a href="/client-kits/gemini-function-tool.json">Gemini function</a><a href="/api/mcp">MCP</a><a href="/slack-app-manifest.json">Slack manifest</a><a href="/leaaid-agent-package.zip">Full package</a></div></details>
  </section>

  <section className="learner-section" id="learn"><div className="guide-heading"><div><p className="eyebrow">LEARNER GUIDE</p><h2>Five modules. Full mastery.</h2></div><p>10/10 unlocks the next gate. Retries do not affect awards.</p></div><div className="module-map">{MODULES.map((module,index)=><article key={module.code}><span>{module.code}</span><i>{index<4?'→':'◆'}</i><h3>{module.title}</h3><p>{module.objective}</p><small>10 decisions · 100%</small></article>)}</div>
   <div className="achievement-guide"><div><p className="eyebrow">ACHIEVEMENTS</p><h2>Earn. Verify. Share.</h2><p>Pseudonymous receipts prove harness outcomes—not identity or certification.</p><a href="/verify">Verify an achievement <span>→</span></a></div><div className="badge-guide">{BADGES.map((badge,index)=><article key={badge.title}><span className={`badge-prism badge-prism-${index}`}>{badge.code}</span><div><b>{badge.title}</b><p>{badge.rule}</p></div></article>)}</div></div>
  </section>

  <footer className="guide-footer"><div><b>LEAAID</b><span>Source-grounded agentic AI mastery</span></div><nav><a href="https://github.com/trustwright/leaaid-mastery-path" target="_blank" rel="noreferrer">GitHub ↗</a><a href="/leaaid-agent-package.zip">Agent package ↓</a><Link href="/">Learning path →</Link></nav></footer>
 </main>
}
