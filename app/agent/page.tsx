import Link from 'next/link';
import ClientLauncher from '../ClientLauncher';
import HarnessMonitor from '../HarnessMonitor';

export const metadata={title:'Start LEAAID anywhere',robots:{index:false,follow:false}};

export default function AgentGuide(){return <main className="gateway-page connect-page">
 <nav aria-label="Gateway navigation"><Link href="/">← Learning path</Link><span>LEAAID · START ANYWHERE</span></nav>
 <header className="connect-hero">
  <p>LEAAID COHORT PATHWAY</p>
  <h1>Start where you<br/><em>already work.</em></h1>
  <p>Bring the same source-grounded learning path into your preferred AI assistant or team channel.</p>
  <a href="#connect">Choose a platform <span aria-hidden="true">↓</span></a>
 </header>
 <ClientLauncher/>
 <HarnessMonitor/>
 </main>}
