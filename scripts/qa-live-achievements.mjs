import assert from 'node:assert/strict';
import {QUESTIONS} from '../lib/questions.ts';
import {APPLIED_LAB} from '../lib/applied-lab.ts';

const origin=process.env.LEAAID_ORIGIN||'https://leaaid-mastery-path.nexus-8198.chatgpt.site';
const endpoint=`${origin}/api/agent`;
const call=async body=>{const response=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});const result=await response.json();assert.equal(response.ok,true,result.error||`HTTP ${response.status}`);return result};
const authoredFor=question=>QUESTIONS.find(item=>item.prompt===question.prompt&&question.scenario.startsWith(item.scenario));
const answerIndex=question=>{const authored=authoredFor(question);assert.ok(authored,`Authored item not found for ${question.id}`);const correct=authored.options[authored.correct];const index=question.options.indexOf(correct);assert.ok(index>=0,`Correct option not rendered for ${question.id}`);return index};

const created=await call({action:'create_session'});const session_id=created.session_id;assert.ok(session_id);
const awarded=[];
for(let module_id=1;module_id<=5;module_id++){
 let result=await call({action:'launch_multi_agent_training',session_id,module_id});
 for(let decision=0;decision<10;decision++){
  result=await call({action:'validate_training_response',session_id,option_index:answerIndex(result.question)});
  assert.equal(result.correct,true);assert.equal(result.validation.valid,true);
 }
 assert.equal(result.state,'module_mastered');awarded.push(result.achievement);
}
let lab=await call({action:'launch_applied_lab',session_id});
for(let index=0;index<APPLIED_LAB.length;index++){const authored=APPLIED_LAB.find(item=>item.prompt===lab.step.prompt);assert.ok(authored,`Authored lab step not found for ${lab.step.id}`);const correct=authored.options[authored.correct];const option_index=lab.step.options.indexOf(correct);assert.ok(option_index>=0,`Correct lab option not rendered for ${lab.step.id}`);lab=await call({action:'submit_lab_choice',session_id,option_index});assert.equal(lab.correct,true,`Lab validation failed at ${lab.step?.id||'completion'}`)}
assert.equal(lab.state,'applied_lab_mastered');awarded.push(lab.achievement);
let premier=await call({action:'launch_premier_challenge',session_id});
for(let decision=0;decision<10;decision++){premier=await call({action:'validate_training_response',session_id,option_index:answerIndex(premier.question)});assert.equal(premier.correct,true)}
assert.equal(premier.state,'premier_mastered');awarded.push(premier.achievement);

const listed=await call({action:'list_achievements',session_id});assert.equal(listed.achievements.length,7);
for(const achievement of listed.achievements){const response=await fetch(`${origin}/api/verify?code=${encodeURIComponent(achievement.verification_code)}`);const result=await response.json();assert.equal(response.ok,true);assert.equal(result.verified,true);assert.equal(result.achievement.status,'verified')}
console.log(JSON.stringify({status:'passed',modules:5,moduleDecisions:50,labDecisions:7,finalDecisions:10,achievements:listed.achievements.map(item=>({id:item.achievement_id,status:item.status,verification:item.verification_code})),verifiedReceipts:listed.achievements.length,personalDataSent:false},null,2));
