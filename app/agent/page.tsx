import Link from 'next/link';
import ClientLauncher from '../ClientLauncher';

export const metadata={title:'Start LEAAID anywhere',robots:{index:false,follow:false}};
const origin='https://leaaid-mastery-path.nexus-8198.chatgpt.site';

export default function AgentGuide(){return <main className="gateway-page connect-page">
 <nav aria-label="Gateway navigation"><Link href="/">← Learning path</Link><span>LEAAID · START ANYWHERE</span></nav>
 <header className="connect-hero">
  <p>LEAAID COHORT PATHWAY</p>
  <h1>Start where you<br/><em>already work.</em></h1>
  <p>Bring the same source-grounded learning path into your preferred AI assistant or team channel.</p>
  <a href="#connect">Choose a platform <span aria-hidden="true">↓</span></a>
 </header>
 <ClientLauncher/>
 <section className="trust-line" aria-label="Learning assurance">
  <span><i aria-hidden="true"/>Source grounded</span><span><i aria-hidden="true"/>Authored validation</span><span><i aria-hidden="true"/>Verifiable achievements</span>
 </section>
 <details className="harness-explainer">
  <summary>How the learning harness works</summary>
  <div className="harness-roles"><article><b>01</b><span>Orchestrator</span><p>Maintains the module sequence and delegates each decision.</p></article><article><b>02</b><span>Testing agent</span><p>Selects a non-repeating authored question without exposing its answer.</p></article><article><b>03</b><span>Validator</span><p>Checks the submitted option against the authored key and returns source coaching.</p></article></div>
  <p className="ethics-line">Validation excludes identity, demographics, timing, attempts, writing style, and inferred ability.</p>
  <details className="technical-reference"><summary>Administrator endpoints</summary><div className="endpoint-list"><p><b>ChatGPT</b><code>{origin}/openapi.json</code></p><p><b>Claude</b><code>{origin}/api/mcp</code></p><p><b>Gemini</b><code>{origin}/api/agent</code></p><p><b>Slack</b><code>{origin}/api/slack</code></p></div></details>
 </details>
 <footer><b>Minimal session data</b><p>No name, email, transcript, or learner profile is requested. Sessions expire after seven days. Achievement receipts use a random learner-held verification code.</p></footer>
 </main>}
