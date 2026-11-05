import {env} from 'cloudflare:workers';
import {AgentError,describeProgram,dispatchHarnessAction} from '../../../lib/agent-service';

export const runtime='edge';
type AgentEnv={DB?:D1Database};
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:cors});
const bindings=()=>env as unknown as AgentEnv;
export function OPTIONS(){return new Response(null,{status:204,headers:cors})}
export function GET(){return json({...describeProgram(),access:'Anonymous learning sessions; no learner account or access code required.',openapi:'/openapi.json',mcp:'/api/mcp',guide:'/agent'})}

export async function POST(request:Request){
 if(Number(request.headers.get('content-length')||0)>16384)return json({error:'Request is too large.'},413);
 const db=bindings().DB;if(!db)return json({error:'Agent session storage is not configured.'},503);
 try{const input=await request.json() as Record<string,unknown>;return json(await dispatchHarnessAction(db,input))}
 catch(error){if(error instanceof AgentError)return json({error:error.message},error.status);return json({error:'The agent could not complete this action.'},500)}
}
