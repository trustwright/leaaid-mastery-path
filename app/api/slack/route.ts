import {env} from 'cloudflare:workers';
import {channelSession,coach,launchMultiAgentTraining,launchAppliedLab,submitLabChoice,launchPremierChallenge,validateTrainingResponse,getSession} from '../../../lib/agent-service';

export const runtime='edge';
type SlackEnv={DB?:D1Database;SLACK_SIGNING_SECRET?:string};
const encoder=new TextEncoder();const bindings=()=>env as unknown as SlackEnv;
const slack=(text:string,blocks?:unknown[])=>Response.json({response_type:'ephemeral',text,...(blocks?{blocks}:{})},{headers:{'Cache-Control':'no-store'}});
const hex=(bytes:ArrayBuffer)=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
async function hmac(secret:string,value:string){const key=await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return hex(await crypto.subtle.sign('HMAC',key,encoder.encode(value)))}
const safeEqual=(a:string,b:string)=>{if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0};

export async function POST(request:Request){
 const config=bindings();if(!config.SLACK_SIGNING_SECRET||!config.DB)return slack('LEAAID Slack integration is not configured yet.');
 const raw=await request.text();const ts=request.headers.get('X-Slack-Request-Timestamp')||'';const signature=request.headers.get('X-Slack-Signature')||'';
 if(!/^\d+$/.test(ts)||Math.abs(Date.now()/1000-Number(ts))>300)return slack('Request expired. Please try the command again.');
 const expected=`v0=${await hmac(config.SLACK_SIGNING_SECRET,`v0:${ts}:${raw}`)}`;if(!safeEqual(signature,expected))return new Response('Invalid signature',{status:401});
 const form=new URLSearchParams(raw);const routeKey=await hmac(config.SLACK_SIGNING_SECRET,`${form.get('team_id')}:${form.get('channel_id')}:${form.get('user_id')}`);const sessionId=await channelSession(config.DB,routeKey);
 const [command='help',first,second]=String(form.get('text')||'help').trim().toLowerCase().split(/\s+/);
 try{
  if(command==='help')return slack('*LEAAID Agent commands*\n`/leaaid coach 2 apply` · `/leaaid start 1` · `/leaaid answer B` · `/leaaid lab` · `/leaaid choose B` · `/leaaid final` · `/leaaid status`');
  if(command==='coach'){const result=await coach(config.DB,{session_id:sessionId,module_id:Number(first||1),goal:second||'understand'});return slack(`*${result.module} · ${result.goal}*\n${result.reasoning_chain.map(step=>`${step.step}. *${step.stage}* — ${step.content}`).join('\n')}\n_Next: /leaaid start ${result.module_id}_`)}
  if(command==='start'){const result=await launchMultiAgentTraining(config.DB,{session_id:sessionId,module_id:Number(first||1)});return slack(`*${result.module} · ${result.mastery_target}*\n_Orchestrator → Testing Agent → Validator waiting_\n${formatQuestion(result.question)}`)}
  if(command==='lab'){const result=await launchAppliedLab(config.DB,{session_id:sessionId});return slack(`*${result.lab}*\n${result.objective}\n${formatLabStep(result.step)}`)}
  if(command==='choose'){const option='abcd'.indexOf(String(first||'').charAt(0));const result=await submitLabChoice(config.DB,{session_id:sessionId,option_index:option});if(result.state==='applied_lab_mastered')return slack(`✓ *Applied Agent Builder achieved.*\n${result.feedback}\n*Verify:* ${result.achievement.verification_url}\n_Next: /leaaid final_`);if(!result.correct)return slack(`*Lab recovery branch*\n${result.recovery}\n_${result.source}_\n${formatLabStep(result.step)}`);return slack(`✓ ${result.feedback}\n\n${formatLabStep(result.step)}`)}
  if(command==='final'){const result=await launchPremierChallenge(config.DB,{session_id:sessionId});return slack(`*${result.module} · ${result.mastery_target}*\n${formatQuestion(result.question)}`)}
  if(command==='answer'){const option='abcd'.indexOf(String(first||'').charAt(0));const result=await validateTrainingResponse(config.DB,{session_id:sessionId,option_index:option});if(result.state==='module_mastered'||result.state==='premier_mastered')return slack(`✓ *Validator confirmed · achievement recorded.*\n${result.feedback}\n*Verify:* ${result.achievement.verification_url}`);if(!result.correct)return slack(`*Validator: recovery required*\n${result.source_coaching.context}\n${result.source_coaching.cue}\n_${result.source_coaching.source} · ${result.source_coaching.locator}_\n${formatQuestion(result.question)}`);return slack(`✓ *Validator confirmed.* ${result.feedback}\n\n${formatQuestion(result.question)}`)}
  if(command==='status'){const result=await getSession(config.DB,{session_id:sessionId});return slack(`*LEAAID status* · completed modules: ${result.completed_modules.join(', ')||'none'}\n${result.question?formatQuestion(result.question):'Ready for `/leaaid start 1`.'}`)}
  return slack('Unknown command. Use `/leaaid help`.');
 }catch(error){return slack(error instanceof Error?error.message:'The LEAAID agent could not complete that command.')}
}

function formatQuestion(question:{index:number;total:number;scenario:string;prompt:string;options:string[];difficulty:number}){return `*Decision ${question.index}/${question.total} · Level ${question.difficulty}*\n_${question.scenario}_\n${question.prompt}\n${question.options.map((option,index)=>`${String.fromCharCode(65+index)}. ${option}`).join('\n')}\n_Reply with /leaaid answer A, B, C, or D._`}
function formatLabStep(step:{index:number;total:number;stage:string;title:string;prompt:string;options:string[]}){return `*Build ${step.index}/${step.total} · ${step.stage} · ${step.title}*\n${step.prompt}\n${step.options.map((option,index)=>`${String.fromCharCode(65+index)}. ${option}`).join('\n')}\n_Reply with /leaaid choose A, B, C, or D._`}
