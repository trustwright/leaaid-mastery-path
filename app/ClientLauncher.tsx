'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';

const origin='https://leaaid-mastery-path.nexus-8198.chatgpt.site';
const starter='You are the LEAAID Cohort Pathway facilitator. Create an anonymous session, launch the requested unlocked module, present one decision at a time, and use the validator result before advancing. Never reveal an answer before submission or bypass a mastery gate.';
type Client={id:string;label:string;short:string;endpoint:string;open:string;openLabel:string;instruction:string;note?:string};
const clients:Client[]=[
 {id:'openai',label:'ChatGPT',short:'C',endpoint:`${origin}/openapi.json`,open:'https://chatgpt.com/gpts/editor',openLabel:'Open ChatGPT builder',instruction:'Paste the copied setup when the builder asks you to add an Action.'},
 {id:'claude',label:'Claude',short:'A',endpoint:`${origin}/api/mcp`,open:'https://claude.ai/settings/connectors',openLabel:'Open Claude connectors',instruction:'Choose Add custom connector, then paste the copied setup.'},
 {id:'gemini',label:'Gemini',short:'G',endpoint:`${origin}/client-kits/gemini-function-tool.json`,open:'https://aistudio.google.com/',openLabel:'Open Google AI Studio',instruction:'Use the copied setup in a function-enabled AI Studio or enterprise workflow.'},
 {id:'slack',label:'Slack',short:'S',endpoint:`${origin}/slack-app-manifest.json`,open:'https://api.slack.com/apps',openLabel:'Open Slack app setup',instruction:'Create an app from a manifest, then use the copied configuration.',note:'A Slack workspace administrator must approve the app and provide its signing secret.'},
];

export default function ClientLauncher(){
 const[key,setKey]=useState(''); const[activeId,setActiveId]=useState('openai'); const[copied,setCopied]=useState(false);
 const active=useMemo(()=>clients.find(client=>client.id===activeId)??clients[0],[activeId]);
 const select=(id:string)=>{setActiveId(id);setCopied(false)};
 const bundle=JSON.stringify({name:'LEAAID Cohort Pathway',platform:active.label,connection:active.endpoint,authentication:{header:'X-LEAAID-Access-Key',value:key||'<ACCESS_CODE>'},instruction:starter,achievement_verification:`${origin}/verify`},null,2);
 const copy=async()=>{await navigator.clipboard.writeText(bundle);setCopied(true)};
 return <section className="connection-runway" id="connect" aria-labelledby="connect-title">
  <div className="runway-heading"><p>CONNECT YOUR PLATFORM</p><h2 id="connect-title">One setup. One handoff.</h2><span>Choose where you want to learn.</span></div>
  <div className="platform-tabs" role="tablist" aria-label="Choose a platform">{clients.map(client=><button key={client.id} type="button" role="tab" aria-selected={active.id===client.id} aria-controls="connection-panel" onClick={()=>select(client.id)}><i aria-hidden="true">{client.short}</i><span>{client.label}</span></button>)}</div>
  <div className="connection-panel" id="connection-panel" role="tabpanel">
   <div className="connection-map" aria-label={`${active.label} connects to the LEAAID learning harness, then launches live training`}><div className="map-node selected-node"><b>{active.short}</b><span>{active.label}</span></div><div className="map-link"><i/><i/><i/></div><div className="map-node harness-node"><b aria-hidden="true">◇</b><span>LEAAID harness</span></div><div className="map-link active-link"><i/><i/><i/></div><div className="map-node training-node"><b aria-hidden="true">✓</b><span>Live training</span></div></div>
   <div className="handoff-grid"><div className="handoff-copy"><p>READY FOR {active.label.toUpperCase()}</p><h3>{active.instruction}</h3><span>{copied?`Setup copied. Open ${active.label} and paste it to finish.`:'Your connection and learning instruction are packaged together.'}</span>{active.note&&<small>{active.note}</small>}</div><div className="handoff-actions"><label htmlFor="access-code">Access code <span>from your facilitator</span></label><input id="access-code" value={key} onChange={event=>{setKey(event.target.value);setCopied(false)}} type="password" autoComplete="off" placeholder="Paste access code"/><button className={copied?'copy-action complete':'copy-action'} type="button" onClick={copy}><span>{copied?'Copied':'Copy setup'}</span><i aria-hidden="true">{copied?'✓':'→'}</i></button><a className={copied?'open-action ready':'open-action'} href={active.open} target="_blank" rel="noreferrer"><span>{active.openLabel}</span><i aria-hidden="true">↗</i></a><p aria-live="polite">{copied?`Ready to continue in ${active.label}.`:'Copy first, then open your platform.'}</p></div></div>
  </div>
  <div className="visual-option"><span>OR</span><Link href="/">Launch the visual learning experience <i aria-hidden="true">→</i></Link></div>
  <details className="implementation-kit"><summary>Downloads and administrator tools</summary><div><a href="/verify">Verify an achievement</a><a href="/leaaid-operating-harness.json" download>Operating harness</a><a href="/client-kits/harness-runner.mjs" download>Runnable connector</a><a href="/LEAAID-COHORT-PATHWAY-SETUP.md" download>Student guide</a><a href="/operating-sbom.json" download>Operating inventory</a><a href="/context-sbom.json" download>Context inventory</a><a href="/sbom.spdx.json" download>Software inventory</a></div></details>
  <p className="consent-note">You approve the connection in the selected service. Nothing is installed or connected silently. The access code remains in this page until you copy the setup.</p>
 </section>
}
