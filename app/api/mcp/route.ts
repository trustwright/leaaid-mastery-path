import {env} from 'cloudflare:workers';
import {AgentError,dispatchAgentAction} from '../../../lib/agent-service';

export const runtime='edge';
type McpEnv={DB?:D1Database;LEAAID_AGENT_ACCESS_KEY?:string};
const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type, Authorization, X-LEAAID-Access-Key, Mcp-Session-Id','Access-Control-Allow-Methods':'POST, OPTIONS','Cache-Control':'no-store'};
const bindings=()=>env as unknown as McpEnv;
const tools=[
 {name:'leaaid_program',description:'Describe the source-grounded LEAAID curriculum and available training actions.',inputSchema:{type:'object',properties:{}}},
 {name:'leaaid_create_session',description:'Create an anonymous seven-day LEAAID training session.',inputSchema:{type:'object',properties:{}}},
 {name:'leaaid_coach',description:'Build a three-step, source-grounded coaching chain for a module and goal.',inputSchema:{type:'object',required:['module_id'],properties:{session_id:{type:'string'},module_id:{type:'integer',minimum:1,maximum:5},goal:{type:'string',enum:['understand','apply','prepare']}}}},
 {name:'launch_training_challenge',description:'Launch a sequential 10-decision mastery round. Module 1 starts unlocked.',inputSchema:{type:'object',required:['session_id','module_id'],properties:{session_id:{type:'string'},module_id:{type:'integer',minimum:1,maximum:5}}}},
 {name:'launch_applied_agent_lab',description:'After M5 knowledge mastery, launch the seven-decision Northstar agent-build simulation.',inputSchema:{type:'object',required:['session_id'],properties:{session_id:{type:'string'}}}},
 {name:'submit_applied_lab_choice',description:'Submit a zero-based choice for the active applied lab stage.',inputSchema:{type:'object',required:['session_id','option_index'],properties:{session_id:{type:'string'},option_index:{type:'integer',minimum:0,maximum:3}}}},
 {name:'launch_premier_challenge',description:'Launch the final 10-decision cross-module challenge after all five module badges are earned.',inputSchema:{type:'object',required:['session_id'],properties:{session_id:{type:'string'}}}},
 {name:'submit_training_answer',description:'Submit a zero-based answer option. Incorrect concepts remain in focused recovery.',inputSchema:{type:'object',required:['session_id','option_index'],properties:{session_id:{type:'string'},option_index:{type:'integer',minimum:0,maximum:3}}}},
 {name:'leaaid_session_status',description:'Resume an anonymous training session and return its active question and mastery state.',inputSchema:{type:'object',required:['session_id'],properties:{session_id:{type:'string'}}}},
];
const actionFor:Record<string,string>={leaaid_program:'describe_program',leaaid_create_session:'create_session',leaaid_coach:'coach',launch_training_challenge:'launch_training_challenge',launch_applied_agent_lab:'launch_applied_lab',submit_applied_lab_choice:'submit_lab_choice',launch_premier_challenge:'launch_premier_challenge',submit_training_answer:'submit_answer',leaaid_session_status:'get_session'};
const response=(id:unknown,result:unknown,status=200)=>Response.json({jsonrpc:'2.0',id,result},{status,headers});
const failure=(id:unknown,code:number,message:string,status=200)=>Response.json({jsonrpc:'2.0',id,error:{code,message}},{status,headers});
export function OPTIONS(){return new Response(null,{status:204,headers})}

export async function POST(request:Request){
 const config=bindings();const supplied=request.headers.get('X-LEAAID-Access-Key')||request.headers.get('Authorization')?.replace(/^Bearer\s+/i,'');
 if(!config.LEAAID_AGENT_ACCESS_KEY||supplied!==config.LEAAID_AGENT_ACCESS_KEY)return failure(null,-32001,'A valid LEAAID invitation key is required.',401);
 let body:{jsonrpc?:string;id?:unknown;method?:string;params?:{name?:string;arguments?:Record<string,unknown>}};
 try{body=await request.json()}catch{return failure(null,-32700,'Parse error',400)}
 if(body.method==='initialize')return response(body.id,{protocolVersion:'2025-03-26',capabilities:{tools:{listChanged:false}},serverInfo:{name:'leaaid-mastery-agent',version:'1.0.0'}});
 if(body.method==='notifications/initialized')return new Response(null,{status:202,headers});
 if(body.method==='tools/list')return response(body.id,{tools});
 if(body.method!=='tools/call'||!body.params?.name)return failure(body.id,-32601,'Method not found');
 const action=actionFor[body.params.name];if(!action)return failure(body.id,-32602,'Unknown tool');if(!config.DB)return failure(body.id,-32002,'Agent session storage is not configured.',503);
 try{const result=await dispatchAgentAction(config.DB,{...(body.params.arguments||{}),action});return response(body.id,{content:[{type:'text',text:JSON.stringify(result)}],structuredContent:result})}
 catch(error){return failure(body.id,error instanceof AgentError?-32010:-32603,error instanceof Error?error.message:'Agent action failed')}
}
