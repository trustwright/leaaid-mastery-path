import {env} from 'cloudflare:workers';
import {AgentError,verifyAchievement} from '../../../lib/agent-service';

export const runtime='edge';
type VerifyEnv={DB?:D1Database};
const headers={'Cache-Control':'public, max-age=60','Access-Control-Allow-Origin':'*','X-Content-Type-Options':'nosniff'};
export async function GET(request:Request){
 const db=(env as unknown as VerifyEnv).DB;if(!db)return Response.json({verified:false,error:'Verification storage is unavailable.'},{status:503,headers});
 try{const code=new URL(request.url).searchParams.get('code');const achievement=await verifyAchievement(db,code);return Response.json({verified:achievement.status==='verified',achievement},{headers})}
 catch(error){const status=error instanceof AgentError?error.status:500;return Response.json({verified:false,error:error instanceof Error?error.message:'Verification failed.'},{status,headers})}
}
