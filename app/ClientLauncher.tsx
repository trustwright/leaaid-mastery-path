'use client';
import {useState} from 'react';

const origin='https://leaaid-mastery-path.nexus-8198.chatgpt.site';
const starter='You are the LEAAID Cohort Pathway facilitator. Create an anonymous session, launch the requested unlocked module, present one decision at a time, and use the validator result before advancing. Never reveal an answer before submission or bypass a mastery gate.';

type Client={id:string;label:string;mode:string;endpoint:string;open:string;openLabel:string;note:string};
const clients:Client[]=[
 {id:'openai',label:'OpenAI',mode:'OpenAPI action',endpoint:`${origin}/openapi.json`,open:'https://chatgpt.com/gpts/editor',openLabel:'Open builder',note:'Import the schema, choose API-key authentication, and name the header X-LEAAID-Access-Key.'},
 {id:'claude',label:'Claude',mode:'Remote MCP',endpoint:`${origin}/api/mcp`,open:'https://claude.ai/settings/connectors',openLabel:'Open connectors',note:'Add a custom connector. Team and Enterprise workspaces may require owner approval.'},
 {id:'gemini',label:'Gemini',mode:'Function calling',endpoint:`${origin}/client-kits/gemini-function-tool.json`,open:'https://aistudio.google.com/',openLabel:'Open AI Studio',note:'Download the function declarations and connect them to the REST endpoint in a Gemini developer workflow.'},
 {id:'slack',label:'Slack',mode:'App manifest',endpoint:`${origin}/slack-app-manifest.json`,open:'https://api.slack.com/apps',openLabel:'Create Slack app',note:'Create from manifest, install with workspace consent, then set the returned signing secret on this deployment.'},
];

export default function ClientLauncher(){
 const[key,setKey]=useState('');const[copied,setCopied]=useState('');
 const copy=async(id:string,value:string)=>{await navigator.clipboard.writeText(value);setCopied(id);setTimeout(()=>setCopied(''),1800)};
 const bundle=(client:Client)=>JSON.stringify({name:'LEAAID Cohort Pathway',client:client.label,endpoint:client.endpoint,authentication:{type:'api_key',header:'X-LEAAID-Access-Key',value:key||'<INVITATION_KEY>'},instructions:starter},null,2);
 return <section className="connect-suite" aria-labelledby="connect-title"><div className="connect-heading"><div><p className="gateway-kicker">CONSENT-BASED QUICK CONNECT</p><h2 id="connect-title">Copy. Connect. Launch.</h2></div><label>Invitation key<input value={key} onChange={event=>setKey(event.target.value)} type="password" autoComplete="off" placeholder="Paste privately shared key"/><small>Used only to generate your copied setup; it is not stored by this page.</small></label></div><div className="connect-grid">{clients.map(client=><article key={client.id}><div><b>{client.label}</b><span>{client.mode}</span></div><code>{client.endpoint}</code><p>{client.note}</p><div><button onClick={()=>copy(client.id,bundle(client))}>{copied===client.id?'Copied setup ✓':'Copy setup'}</button><a href={client.open} target="_blank" rel="noreferrer">{client.openLabel} ↗</a></div></article>)}</div><div className="download-row"><a href="/leaaid-cohort-pathway-agent.json" download>Download agent package</a><a href="/LEAAID-COHORT-PATHWAY-SETUP.md" download>Download student setup guide</a><a href="/slack-app-manifest.json" download>Download Slack manifest</a><button onClick={()=>copy('prompt',starter)}>{copied==='prompt'?'Starter copied ✓':'Copy starter instruction'}</button></div><p className="consent-note">Connection is completed by the learner or workspace administrator in the destination platform. No credential or external account is silently installed.</p></section>
}
