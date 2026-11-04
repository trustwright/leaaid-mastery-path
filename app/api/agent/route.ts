import {env} from 'cloudflare:workers';
import {AgentError,describeProgram,dispatchAgentAction} from '../../../lib/agent-service';

export const runtime='edge';
type AgentEnv={DB?:D1Database;LEAAID_AGENT_ACCESS_KEY?:string};
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type, X-LEAAID-Access-Key, Authorization','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:cors});
const bindings=()=>env as unknown as AgentEnv;
const bearer=(request:Request)=>request.headers.get('Authorization')?.replace(/^Bearer\s+/i,'');

function authorized(request:Request){const expected=bindings().LEAAID_AGENT_ACCESS_KEY;const supplied=request.headers.get('X-LEAAID-Access-Key')||bearer(request);return Boolean(expected&&supplied&&expected===supplied)}
export function OPTIONS(){return new Response(null,{status:204,headers:cors})}
export function GET(){return json({...describeProgram(),access:'Invitation key required for session and training actions.',openapi:'/openapi.json',mcp:'/api/mcp',guide:'/agent'})}

export async function POST(request:Request){
 if(!authorized(request))return json({error:'A valid LEAAID invitation key is required.'},401);
 const db=bindings().DB;if(!db)return json({error:'Agent session storage is not configured.'},503);
 try{const input=await request.json() as Record<string,unknown>;return json(await dispatchAgentAction(db,input))}
 catch(error){if(error instanceof AgentError)return json({error:error.message},error.status);return json({error:'The agent could not complete this action.'},500)}
}
