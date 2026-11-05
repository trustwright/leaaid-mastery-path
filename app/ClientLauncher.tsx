'use client';
import {useState} from 'react';

const origin='https://leaaid-mastery-path.nexus-8198.chatgpt.site';
const starter='You are the LEAAID Cohort Pathway facilitator. Create an anonymous session, launch the requested unlocked module, present one decision at a time, and use the validator result before advancing. Never reveal an answer before submission or bypass a mastery gate.';

type Client={id:string;label:string;mode:string;endpoint:string;open:string;openLabel:string;note:string};
const clients:Client[]=[
 {id:'openai',label:'ChatGPT',mode:'AI ASSISTANT',endpoint:`${origin}/openapi.json`,open:'https://chatgpt.com/gpts/editor',openLabel:'Continue in ChatGPT',note:'Copy the prepared connection, open the assistant builder, and paste it when asked to add an action.'},
 {id:'claude',label:'Claude',mode:'AI ASSISTANT',endpoint:`${origin}/api/mcp`,open:'https://claude.ai/settings/connectors',openLabel:'Continue in Claude',note:'Copy the prepared connection, open Connectors, choose Add custom connector, and paste it.'},
 {id:'gemini',label:'Gemini',mode:'AI DEVELOPMENT',endpoint:`${origin}/client-kits/gemini-function-tool.json`,open:'https://aistudio.google.com/',openLabel:'Continue in Gemini',note:'Copy the prepared connection for an AI Studio or enterprise function-enabled workflow.'},
 {id:'slack',label:'Slack',mode:'TEAM CHANNEL',endpoint:`${origin}/slack-app-manifest.json`,open:'https://api.slack.com/apps',openLabel:'Start Slack setup',note:'Download or copy the ready-made Slack configuration, then approve it for your workspace.'},
];

export default function ClientLauncher(){
 const[key,setKey]=useState('');const[copied,setCopied]=useState('');
 const copy=async(id:string,value:string)=>{await navigator.clipboard.writeText(value);setCopied(id);setTimeout(()=>setCopied(''),1800)};
 const bundle=(client:Client)=>JSON.stringify({name:'LEAAID Cohort Pathway',client:client.label,endpoint:client.endpoint,authentication:{type:'api_key',header:'X-LEAAID-Access-Key',value:key||'<INVITATION_KEY>'},instructions:starter},null,2);
 return <section className="connect-suite" id="connect" aria-labelledby="connect-title"><div className="connect-heading"><div><p className="gateway-kicker">CHOOSE WHERE TO LEARN</p><h2 id="connect-title">Connect in two steps.</h2><p className="connect-lead">1. Enter the private access code. 2. Choose your service and follow the prepared handoff.</p></div><label>Private access code<input value={key} onChange={event=>setKey(event.target.value)} type="password" autoComplete="off" placeholder="Paste the code from your facilitator"/><small>The code stays in this browser field and is only placed into the setup you copy.</small></label></div><div className="connect-grid">{clients.map(client=><article key={client.id}><div><b>{client.label}</b><span>{client.mode}</span></div><p>{client.note}</p><div><button onClick={()=>copy(client.id,bundle(client))}>{copied===client.id?'Connection copied ✓':'Copy connection'}</button><a href={client.open} target="_blank" rel="noreferrer">{client.openLabel} ↗</a></div></article>)}</div><div className="download-row"><a href="/leaaid-operating-harness.json" download>Download operating harness</a><a href="/client-kits/harness-runner.mjs" download>Download runnable connector</a><a href="/LEAAID-COHORT-PATHWAY-SETUP.md" download>Download student guide</a><button onClick={()=>copy('prompt',starter)}>{copied==='prompt'?'Learning instruction copied ✓':'Copy learning instruction'}</button></div><p className="consent-note">You or your workspace administrator approve the connection in the selected service. Nothing is installed silently.</p></section>
}
