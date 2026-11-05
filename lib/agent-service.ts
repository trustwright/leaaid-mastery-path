import {achievementLookupIndexSchema,achievementReceiptsSchema,agentChannelsSchema,agentSessionsExpiryIndexSchema,agentSessionsSchema} from '../db/schema';
import {COACH,CoachGoal,coachChain} from './coach';
import {MODULES,ModuleId,RuntimeQuestion,selectQuestionSet} from './questions';
import {APPLIED_LAB,labStepFor} from './applied-lab';
import {harnessControl,prepareHarnessInput} from './harness';

type StoredSession={id:string;learner_code:string;goal:CoachGoal;current_module:number;question_index:number;lab_step:number;lab_complete:number;premier:number;completed_json:string;history_json:string;queue_json:string;created_at:string;updated_at:string;expires_at:string};
type History=Partial<Record<ModuleId,string[]>>;
export type AgentAction='describe_program'|'create_session'|'coach'|'launch_training_challenge'|'submit_answer'|'launch_multi_agent_training'|'validate_training_response'|'launch_applied_lab'|'submit_lab_choice'|'launch_premier_challenge'|'get_session'|'list_achievements';

export class AgentError extends Error{constructor(public status:number,message:string){super(message)}}
let agentReady:Promise<void>|undefined;

const parse=<T,>(value:string,fallback:T):T=>{try{return JSON.parse(value) as T}catch{return fallback}};
const validModule=(value:unknown):ModuleId=>{const n=Number(value);if(!Number.isInteger(n)||n<1||n>5)throw new AgentError(400,'module_id must be an integer from 1 to 5');return n as ModuleId};
const validGoal=(value:unknown):CoachGoal=>value==='apply'||value==='prepare'?value:'understand';

export async function ensureAgentTables(db:D1Database){
 if(agentReady)return agentReady;
 agentReady=(async()=>{await db.batch([db.prepare(agentSessionsSchema),db.prepare(agentSessionsExpiryIndexSchema),db.prepare(agentChannelsSchema),db.prepare(achievementReceiptsSchema),db.prepare(achievementLookupIndexSchema),db.prepare("DELETE FROM agent_sessions WHERE expires_at < datetime('now')")]);for(const statement of ['ALTER TABLE agent_sessions ADD COLUMN premier INTEGER NOT NULL DEFAULT 0','ALTER TABLE agent_sessions ADD COLUMN lab_step INTEGER NOT NULL DEFAULT -1','ALTER TABLE agent_sessions ADD COLUMN lab_complete INTEGER NOT NULL DEFAULT 0',"ALTER TABLE agent_sessions ADD COLUMN learner_code TEXT NOT NULL DEFAULT ''"])try{await db.prepare(statement).run()}catch{}})().catch(error=>{agentReady=undefined;throw error});
 return agentReady;
}

export function describeProgram(){return{
 name:'LEAAID Mastery Path Agent',version:'1.0.0',source_grounding:'Five supplied LEAAID foundation modules',
 harness_group:'LEAAID',learning_pack:{id:'leaaid-foundations',contract_version:1,curriculum_version:'2026.10'},
 session_model:'Anonymous, expiring server session; no name, email, prompt transcript, or profile is requested.',
 mastery_rule:'Answer all 10 decisions correctly in a module round. Missed concepts remain in recovery until mastered.',
 modules:MODULES.map(m=>({id:m.id,code:m.code,title:m.title,source:m.source})),
 agent_team:[{id:'learning_orchestrator',role:'Enforces sequence and delegates the active assessment task.'},{id:'testing_agent',role:'Selects a non-repeating source-grounded decision and presents it without the answer.'},{id:'validator_agent',role:'Deterministically validates the submitted option against the authored answer key and returns evidence or recovery.'}],
 actions:['create_session','coach','launch_multi_agent_training','validate_training_response','launch_training_challenge','submit_answer','launch_applied_lab','submit_lab_choice','launch_premier_challenge','get_session','list_achievements'],
 achievement_model:'Durable, pseudonymous verification receipts disclose achievement evidence but no identity, attempts, response time, or ranking.',
 suggested_prompt:'Launch training challenge for Module 1.',
};}

export async function createSession(db:D1Database){
 await ensureAgentTables(db);const id=crypto.randomUUID();const learnerCode=`LRN-${crypto.randomUUID().replaceAll('-','').slice(0,12).toUpperCase()}`;
 await db.prepare("INSERT INTO agent_sessions (id,learner_code,expires_at) VALUES (?,?,datetime('now','+7 days'))").bind(id,learnerCode).run();
 return{session_id:id,learner_code:learnerCode,expires_in:'7 days',next_actions:['coach','launch_training_challenge'],suggested_prompt:'Launch training challenge for Module 1.'};
}

async function session(db:D1Database,id:unknown){
 if(typeof id!=='string'||id.length<20)throw new AgentError(400,'A valid session_id is required.');
 await ensureAgentTables(db);const row=await db.prepare("SELECT * FROM agent_sessions WHERE id=? AND expires_at >= datetime('now')").bind(id).first<StoredSession>();
 if(!row)throw new AgentError(404,'Training session not found or expired. Create a new session.');return row;
}

const VERIFY_ORIGIN='https://leaaid-mastery-path.nexus-8198.chatgpt.site';
type AchievementRow={verification_code:string;learner_code:string;achievement_id:string;title:string;module_id:number|null;issued_at:string;harness_version:string;curriculum_version:string;evidence_json:string;revoked_at:string|null};
const publicAchievement=(row:AchievementRow)=>({
 verification_code:row.verification_code,learner_code:row.learner_code,achievement_id:row.achievement_id,title:row.title,module_id:row.module_id,issued_at:row.issued_at,
 status:row.revoked_at?'revoked':'verified',verification_url:`${VERIFY_ORIGIN}/verify?code=${encodeURIComponent(row.verification_code)}`,
 assurance:{harness_version:row.harness_version,curriculum_version:row.curriculum_version,validation:'Deterministic authored-key validation',evidence:parse<Record<string,unknown>>(row.evidence_json,{})},
 privacy:'Pseudonymous receipt; no name, email, attempts, response time, or ranking is stored.',
});
async function learnerCode(db:D1Database,row:StoredSession){if(row.learner_code)return row.learner_code;const code=`LRN-${crypto.randomUUID().replaceAll('-','').slice(0,12).toUpperCase()}`;await db.prepare('UPDATE agent_sessions SET learner_code=? WHERE id=?').bind(code,row.id).run();return code}
async function issueAchievement(db:D1Database,row:StoredSession,input:{id:string;title:string;moduleId?:number;evidence:Record<string,unknown>}){
 await ensureAgentTables(db);const existing=await db.prepare('SELECT * FROM achievement_receipts WHERE session_id=? AND achievement_id=?').bind(row.id,input.id).first<AchievementRow>();if(existing)return publicAchievement(existing);
 const code=`LEAAID-${crypto.randomUUID().replaceAll('-','').slice(0,20).toUpperCase()}`;const learner=await learnerCode(db,row);const issuedAt=new Date().toISOString();
 await db.prepare('INSERT INTO achievement_receipts (verification_code,session_id,learner_code,achievement_id,title,module_id,issued_at,harness_version,curriculum_version,evidence_json) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(code,row.id,learner,input.id,input.title,input.moduleId||null,issuedAt,'1.2.0','2026.10',JSON.stringify(input.evidence)).run();
 return publicAchievement({verification_code:code,learner_code:learner,achievement_id:input.id,title:input.title,module_id:input.moduleId||null,issued_at:issuedAt,harness_version:'1.2.0',curriculum_version:'2026.10',evidence_json:JSON.stringify(input.evidence),revoked_at:null});
}
export async function verifyAchievement(db:D1Database,code:unknown){await ensureAgentTables(db);if(typeof code!=='string'||!/^LEAAID-[A-F0-9]{20}$/.test(code))throw new AgentError(400,'A valid LEAAID verification code is required.');const row=await db.prepare('SELECT * FROM achievement_receipts WHERE verification_code=?').bind(code).first<AchievementRow>();if(!row)throw new AgentError(404,'Achievement receipt not found.');return publicAchievement(row)}
export async function listAchievements(db:D1Database,input:Record<string,unknown>){const row=await session(db,input.session_id);const learner=await learnerCode(db,row);const result=await db.prepare('SELECT * FROM achievement_receipts WHERE learner_code=? ORDER BY issued_at').bind(learner).all<AchievementRow>();return{learner_code:learner,achievements:(result.results||[]).map(publicAchievement)}}

function publicQuestion(question:RuntimeQuestion,index:number,total:number){return{
 id:question.id,index:index+1,total,scenario:question.scenario,prompt:question.prompt,options:question.options,
 difficulty:question.difficulty,module_id:question.moduleId,module_code:MODULES[question.moduleId-1].code,
 response_format:'Submit the zero-based option_index, or map A/B/C/D to 0/1/2/3.',
};}
function publicLabStep(index:number){const step=labStepFor(index);return{id:step.id,index:index+1,total:APPLIED_LAB.length,stage:step.stage,title:step.title,prompt:step.prompt,options:step.options,response_format:'Submit the zero-based option_index, or map A/B/C/D to 0/1/2/3.'}}

export async function coach(db:D1Database,input:Record<string,unknown>){
 const moduleId=validModule(input.module_id);const goal=validGoal(input.goal);const guide=COACH[moduleId];
 if(input.session_id){const row=await session(db,input.session_id);await db.prepare("UPDATE agent_sessions SET goal=?,updated_at=CURRENT_TIMESTAMP,expires_at=datetime('now','+7 days') WHERE id=?").bind(goal,row.id).run()}
 return{module_id:moduleId,module:MODULES[moduleId-1].title,goal,reasoning_chain:coachChain(moduleId,goal).map((content,index)=>({step:index+1,stage:['orient','reason','check'][index],content})),source_refs:guide.refs,next_action:{action:'launch_training_challenge',module_id:moduleId}};
}

export async function launchChallenge(db:D1Database,input:Record<string,unknown>){
 const row=await session(db,input.session_id);const moduleId=validModule(input.module_id);const completed=parse<ModuleId[]>(row.completed_json,[]);
 if(moduleId>1&&!completed.includes((moduleId-1) as ModuleId))throw new AgentError(409,`Complete Module ${moduleId-1} before launching Module ${moduleId}.`);
 const history=parse<History>(row.history_json,{});const queue=selectQuestionSet(moduleId,history[moduleId]||[],10,Date.now());
 history[moduleId]=[...(history[moduleId]||[]),...queue.map(q=>q.baseId)].slice(-20);
 await db.prepare("UPDATE agent_sessions SET current_module=?,question_index=0,lab_step=-1,queue_json=?,history_json=?,updated_at=CURRENT_TIMESTAMP,expires_at=datetime('now','+7 days') WHERE id=?").bind(moduleId,JSON.stringify(queue),JSON.stringify(history),row.id).run();
 return{session_id:row.id,state:'challenge_active',module_id:moduleId,module:MODULES[moduleId-1].title,mastery_target:'10 of 10 correct',question:publicQuestion(queue[0],0,queue.length)};
}

const workflow=(status:'awaiting_response'|'validated'|'recovery')=>({
 pattern:'orchestrated_multi_agent',
 agents:[
  {id:'learning_orchestrator',state:'delegated',evidence:'Sequential module gate and anonymous session state checked.'},
  {id:'testing_agent',state:status==='awaiting_response'?'active':'completed',evidence:'Question selected from the authored module bank with answer order rotated.'},
  {id:'validator_agent',state:status==='awaiting_response'?'waiting':status,evidence:status==='awaiting_response'?'No validation occurs before learner submission.':'Submitted option compared deterministically with the authored answer key.'},
 ],
});

export async function launchMultiAgentTraining(db:D1Database,input:Record<string,unknown>){
 const result=await launchChallenge(db,input);return{...result,agent_workflow:workflow('awaiting_response')};
}

export async function validateTrainingResponse(db:D1Database,input:Record<string,unknown>){
 const result=await submitAnswer(db,input);const valid=Boolean((result as {correct?:boolean}).correct);return{...result,validation:{valid,response_rule:'Exact authored answer-key match; no model self-grading.',advance_allowed:valid,checked_at:new Date().toISOString()},agent_workflow:workflow(valid?'validated':'recovery')};
}

export async function launchPremierChallenge(db:D1Database,input:Record<string,unknown>){
 const row=await session(db,input.session_id);const completed=parse<ModuleId[]>(row.completed_json,[]);if(completed.length<5)throw new AgentError(409,'Complete all five module rounds before launching the Premier challenge.');if(!row.lab_complete)throw new AgentError(409,'Complete the Applied Agent Builder Lab before launching the Premier challenge.');
 const history=parse<History>(row.history_json,{});const nonce=Date.now();const queue=MODULES.flatMap((m,index)=>selectQuestionSet(m.id,history[m.id]||[],2,nonce+index*11));
 for(const m of MODULES)history[m.id]=[...(history[m.id]||[]),...queue.filter(q=>q.moduleId===m.id).map(q=>q.baseId)].slice(-20);
 await db.prepare("UPDATE agent_sessions SET current_module=5,question_index=0,queue_json=?,history_json=?,updated_at=CURRENT_TIMESTAMP,expires_at=datetime('now','+7 days') WHERE id=?").bind(JSON.stringify(queue),JSON.stringify(history),row.id).run();
 return{session_id:row.id,state:'premier_challenge_active',module:'Premier LEAAID Knowledge',mastery_target:'10 of 10 cross-module decisions correct',question:publicQuestion(queue[0],0,queue.length)};
}

export async function launchAppliedLab(db:D1Database,input:Record<string,unknown>){
 const row=await session(db,input.session_id);const completed=parse<ModuleId[]>(row.completed_json,[]);if(!completed.includes(5))throw new AgentError(409,'Complete the M5 Applied Concepts knowledge round before launching the build simulation.');
 await db.prepare("UPDATE agent_sessions SET lab_step=0,queue_json='[]',question_index=0,updated_at=CURRENT_TIMESTAMP,expires_at=datetime('now','+7 days') WHERE id=?").bind(row.id).run();
 return{session_id:row.id,state:'applied_lab_active',lab:'Applied Agent Builder Lab',objective:'Build, refine, and operate a grounded multi-agent outcome through seven decisions.',milestones:['baseline','refinement','operate'],step:publicLabStep(0)};
}

export async function submitLabChoice(db:D1Database,input:Record<string,unknown>){
 const row=await session(db,input.session_id);if(row.lab_step<0||!APPLIED_LAB[row.lab_step])throw new AgentError(409,'No applied lab is active. Launch the applied lab first.');const selected=Number(input.option_index);if(!Number.isInteger(selected)||selected<0||selected>3)throw new AgentError(400,'option_index must be 0, 1, 2, or 3.');
 const step=labStepFor(row.lab_step);if(selected!==step.correct)return{session_id:row.id,correct:false,state:'lab_recovery',recovery:step.recovery,source:step.source,step:publicLabStep(row.lab_step)};
 const next=row.lab_step+1;if(next<APPLIED_LAB.length){await db.prepare("UPDATE agent_sessions SET lab_step=?,updated_at=CURRENT_TIMESTAMP,expires_at=datetime('now','+7 days') WHERE id=?").bind(next,row.id).run();return{session_id:row.id,correct:true,state:'applied_lab_active',feedback:step.success,milestone:step.milestone||null,step:publicLabStep(next)}}
 await db.prepare("UPDATE agent_sessions SET lab_step=-1,lab_complete=1,updated_at=CURRENT_TIMESTAMP,expires_at=datetime('now','+7 days') WHERE id=?").bind(row.id).run();const achievement=await issueAchievement(db,row,{id:'applied-agent-builder',title:'Applied Agent Builder',moduleId:5,evidence:{mastery_percent:100,required_decisions:APPLIED_LAB.length,scope:'baseline, refinement, and governed operation',timing_affects_award:false,hints_affect_award:false}});return{session_id:row.id,correct:true,state:'applied_lab_mastered',feedback:step.success,badge:{type:'applied',title:'Applied Agent Builder'},achievement,next_action:{action:'launch_premier_challenge'}};
}

export async function submitAnswer(db:D1Database,input:Record<string,unknown>){
 const row=await session(db,input.session_id);const queue=parse<RuntimeQuestion[]>(row.queue_json,[]);const index=row.question_index;
 if(!queue.length||!queue[index])throw new AgentError(409,'No active question. Launch a training challenge first.');
 const selected=Number(input.option_index);if(!Number.isInteger(selected)||selected<0||selected>3)throw new AgentError(400,'option_index must be 0, 1, 2, or 3.');
 const current=queue[index];const correct=selected===current.correct;
 if(!correct)return{session_id:row.id,correct:false,state:'focused_recovery',message:'That concept is not mastered yet. Use the source coaching cue, then answer this decision again.',source_coaching:{context:current.tipContext,cue:current.hint,source:MODULES[current.moduleId-1].source,locator:current.sourceRefs[0].locator},question:publicQuestion(current,index,queue.length)};
 const nextIndex=index+1;
 if(nextIndex<queue.length){await db.prepare("UPDATE agent_sessions SET question_index=?,updated_at=CURRENT_TIMESTAMP,expires_at=datetime('now','+7 days') WHERE id=?").bind(nextIndex,row.id).run();return{session_id:row.id,correct:true,state:'challenge_active',feedback:current.rationale,progress:{mastered:nextIndex,total:queue.length},question:publicQuestion(queue[nextIndex],nextIndex,queue.length)}}
 const completed=parse<ModuleId[]>(row.completed_json,[]);const moduleId=current.moduleId;const premier=new Set(queue.map(q=>q.moduleId)).size>1;
 if(!premier&&!completed.includes(moduleId))completed.push(moduleId);
 await db.prepare("UPDATE agent_sessions SET question_index=?,completed_json=?,premier=?,queue_json='[]',updated_at=CURRENT_TIMESTAMP,expires_at=datetime('now','+7 days') WHERE id=?").bind(nextIndex,JSON.stringify(completed),premier?1:row.premier,row.id).run();
 if(premier){const achievement=await issueAchievement(db,row,{id:'premier-knowledge',title:'Premier LEAAID Knowledge',evidence:{mastery_percent:100,required_modules:5,required_applied_lab:true,required_final_decisions:10,timing_affects_award:false,hints_affect_award:false}});return{session_id:row.id,correct:true,state:'premier_mastered',feedback:current.rationale,badge:{type:'premier',title:'Premier LEAAID Knowledge'},achievement,completed_modules:completed}}
 const achievement=await issueAchievement(db,row,{id:`module-${moduleId}-mastery`,title:`${MODULES[moduleId-1].title} Mastery`,moduleId,evidence:{mastery_percent:100,required_decisions:10,source:MODULES[moduleId-1].source,timing_affects_award:false,hints_affect_award:false}});return{session_id:row.id,correct:true,state:'module_mastered',feedback:current.rationale,badge:{type:'module_round',module_id:moduleId,title:`${MODULES[moduleId-1].title} Mastery`},achievement,completed_modules:completed,next_action:moduleId<5?{action:'launch_training_challenge',module_id:moduleId+1}:{action:'launch_applied_lab'}};
}

export async function getSession(db:D1Database,input:Record<string,unknown>){
 const row=await session(db,input.session_id);const queue=parse<RuntimeQuestion[]>(row.queue_json,[]);const completed=parse<ModuleId[]>(row.completed_json,[]);const current=queue[row.question_index];
 return{session_id:row.id,state:current?'challenge_active':row.lab_step>=0?'applied_lab_active':'ready',current_module:row.current_module,completed_modules:completed,applied_lab_mastered:Boolean(row.lab_complete),premier_mastered:Boolean(row.premier),progress:current?{mastered:row.question_index,total:queue.length}:row.lab_step>=0?{completed:row.lab_step,total:APPLIED_LAB.length}:null,question:current?publicQuestion(current,row.question_index,queue.length):null,lab_step:row.lab_step>=0?publicLabStep(row.lab_step):null,expires_at:row.expires_at};
}

export async function dispatchAgentAction(db:D1Database,input:Record<string,unknown>){
 switch(input.action as AgentAction){case'describe_program':return describeProgram();case'create_session':return createSession(db);case'coach':return coach(db,input);case'launch_multi_agent_training':return launchMultiAgentTraining(db,input);case'validate_training_response':return validateTrainingResponse(db,input);case'launch_training_challenge':return launchChallenge(db,input);case'submit_answer':return submitAnswer(db,input);case'launch_applied_lab':return launchAppliedLab(db,input);case'submit_lab_choice':return submitLabChoice(db,input);case'launch_premier_challenge':return launchPremierChallenge(db,input);case'get_session':return getSession(db,input);case'list_achievements':return listAchievements(db,input);default:throw new AgentError(400,'Unknown action. Use describe_program to inspect the supported training actions.');}
}

export async function dispatchHarnessAction(db:D1Database,input:Record<string,unknown>){
 try{const prepared=prepareHarnessInput(input);const result=await dispatchAgentAction(db,prepared);return{...result,control:harnessControl(prepared.action)}}
 catch(error){if(error instanceof AgentError)throw error;throw new AgentError(400,error instanceof Error?error.message:'Harness rejected the request.');}
}

export async function channelSession(db:D1Database,channelHash:string){
 await ensureAgentTables(db);const mapped=await db.prepare('SELECT session_id FROM agent_channel_sessions WHERE channel_hash=?').bind(channelHash).first<{session_id:string}>();
 if(mapped){try{await session(db,mapped.session_id);return mapped.session_id}catch{}}
 const created=await createSession(db);await db.prepare('INSERT OR REPLACE INTO agent_channel_sessions (channel_hash,session_id,updated_at) VALUES (?,?,CURRENT_TIMESTAMP)').bind(channelHash,created.session_id).run();return created.session_id;
}
