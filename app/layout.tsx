import type {Metadata} from 'next';
import './globals.css';
import './agent.css';
import './accessibility.css';
import './gateway.css';
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL??'https://leaaid-mastery.chatgpt.site'),title:'LEAAID Mastery Path',description:'Source-grounded Carnegie Mellon LEAAID training across five sequential agentic AI modules.',openGraph:{title:'LEAAID Mastery Path',description:'Five modules. Complete comprehension. Premier knowledge.',type:'website',images:[{url:'/og.png',width:1536,height:1024,alt:'LEAAID Mastery Path'}]},twitter:{card:'summary_large_image',title:'LEAAID Mastery Path',description:'Five modules. Complete comprehension. Premier knowledge.',images:['/og.png']}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
