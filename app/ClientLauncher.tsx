'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';

const origin='https://leaaid-mastery-path.nexus-8198.chatgpt.site';
type Client={id:string;label:string;short:string;endpoint:string;open:string;openLabel:string;copyLabel:string;instruction:string;copyDocument?:boolean;note?:string};
const clients:Client[]=[
 {id:'openai',label:'ChatGPT',short:'C',endpoint:`${origin}/openapi.json`,open:'https://chatgpt.com/gpts/editor',openLabel:'Open ChatGPT builder',copyLabel:'Copy Action URL',instruction:'In Configure, select Create new action, choose Import from URL, then paste.'},
 {id:'claude',label:'Claude',short:'A',endpoint:`${origin}/api/mcp`,open:'https://claude.ai/settings/connectors',openLabel:'Open Claude connectors',copyLabel:'Copy connector URL',instruction:'Choose Add custom connector, paste the copied URL, and confirm.'},
 {id:'gemini',label:'Gemini',short:'G',endpoint:`${origin}/client-kits/gemini-function-tool.json`,open:'https://aistudio.google.com/',openLabel:'Open Google AI Studio',copyLabel:'Copy function setup',instruction:'Use the copied function declaration in AI Studio or your Gemini application.',copyDocument:true,note:'Consumer Gems cannot call external tools; use AI Studio or a function-enabled enterprise workflow.'},
 {id:'slack',label:'Slack',short:'S',endpoint:`${origin}/slack-app-manifest.json`,open:'https://api.slack.com/apps',openLabel:'Open Slack app setup',copyLabel:'Copy Slack manifest',instruction:'Choose Create New App, select From a manifest, then paste.',copyDocument:true,note:'A Slack workspace owner must approve installation. Slack—not LEAAID—requires this permission.'},
];

export default function ClientLauncher(){
 const[activeId,setActiveId]=useState('openai'); const[copied,setCopied]=useState(false); const[copyError,setCopyError]=useState(false); const[connection,setConnection]=useState<'checking'|'live'|'error'>('checking');
 const active=useMemo(()=>clients.find(client=>client.id===activeId)??clients[0],[activeId]);
 useEffect(()=>{let current=true;fetch('/api/agent',{cache:'no-store'}).then(response=>{if(!response.ok)throw new Error();if(current)setConnection('live')}).catch(()=>{if(current)setConnection('error')});return()=>{current=false}},[]);
 const select=(id:string)=>{setActiveId(id);setCopied(false);setCopyError(false)};
 const copy=async()=>{try{let value=active.endpoint;if(active.copyDocument){const response=await fetch(active.endpoint);if(!response.ok)throw new Error();value=JSON.stringify(await response.json(),null,2)}await navigator.clipboard.writeText(value);setCopied(true);setCopyError(false)}catch{setCopied(false);setCopyError(true)}};
 return <section className="connection-runway" id="connect" aria-labelledby="connect-title">
  <div className="runway-heading"><p>CONNECT YOUR PLATFORM</p><h2 id="connect-title">Choose. Copy. Open.</h2><span>No account or access code required.</span></div>
  <div className="platform-tabs" role="tablist" aria-label="Choose a platform">{clients.map(client=><button key={client.id} type="button" role="tab" aria-selected={active.id===client.id} aria-controls="connection-panel" onClick={()=>select(client.id)}><i aria-hidden="true">{client.short}</i><span>{client.label}</span></button>)}</div>
  <div className="connection-panel" id="connection-panel" role="tabpanel">
   <div className="connection-map" aria-label={`${active.label} connects to the LEAAID learning harness, then launches live training`}><div className="map-node selected-node"><b>{active.short}</b><span>{active.label}</span></div><div className="map-link"><i/><i/><i/></div><div className="map-node harness-node"><b aria-hidden="true">◇</b><span>LEAAID harness</span></div><div className="map-link active-link"><i/><i/><i/></div><div className="map-node training-node"><b aria-hidden="true">✓</b><span>Live training</span></div></div>
   <div className="handoff-grid"><div className="handoff-copy"><p>READY FOR {active.label.toUpperCase()}</p><h3>{active.instruction}</h3><span>{copied?`Copied. Continue in ${active.label}.`:'Ready to copy.'}</span>{active.note&&<small>{active.note}</small>}</div><div className="handoff-actions"><div className={`live-check ${connection}`} role="status"><i/>{connection==='live'?'Training service is live':connection==='error'?'Service check failed':'Checking training service…'}</div><button className={copied?'copy-action complete':'copy-action'} type="button" onClick={()=>void copy()} disabled={connection!=='live'}><span>{copied?'Copied':active.copyLabel}</span><i aria-hidden="true">{copied?'✓':'→'}</i></button><a className={copied?'open-action ready':'open-action'} href={active.open} target="_blank" rel="noreferrer"><span>{active.openLabel}</span><i aria-hidden="true">↗</i></a><p className={copyError?'copy-error':''} aria-live="polite">{copyError?'Copy blocked. Open the setup guide.':copied?`Ready for ${active.label}.`:'Copy, then open.'}</p></div></div>
  </div>
  <div className="visual-option"><span>OR</span><Link href="#harness">Launch training now <i aria-hidden="true">→</i></Link></div>
  <details className="implementation-kit"><summary>Downloads and administrator tools</summary><div><a href="/verify">Verify an achievement</a><a href="/leaaid-operating-harness.json" download>Operating harness</a><a href="/client-kits/harness-runner.mjs" download>Runnable connector</a><a href="/LEAAID-COHORT-PATHWAY-SETUP.md" download>Setup guide</a><a href="/operating-sbom.json" download>Operating inventory</a><a href="/context-sbom.json" download>Context inventory</a><a href="/sbom.spdx.json" download>Software inventory</a></div></details>
  <p className="consent-note">Training sessions are anonymous and expire after seven days. External platforms may ask you or a workspace owner to approve tools under their own policies.</p>
 </section>
}
