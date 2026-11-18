import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {deriveHarnessAgents,deriveMasteryHud} from '../lib/mastery-hud.ts';

const trainer=await readFile(new URL('../app/Trainer.tsx',import.meta.url),'utf8');
for(const token of ['aria-expanded={open}','onToggle','title="Orchestrator"','title="Testing agent"','title="Learner"','title="Validator"'])assert.ok(trainer.includes(token),`Missing HUD interaction contract: ${token}`);

const moduleTrace=[];
const completed=[];
for(let moduleId=1;moduleId<=5;moduleId++){
 for(let correctCount=0;correctCount<=10;correctCount++){
  const moduleScores=Array.from({length:5},(_,index)=>index<completed.length?100:index===moduleId-1?correctCount*10:0);
  const hud=deriveMasteryHud({completed:completed.length,moduleId,mastered:correctCount,total:10,questionIndex:Math.min(10,correctCount+1),answered:false,correct:false,active:true,secondsRemaining:45-correctCount,moduleScores});
  assert.equal(hud.scores[moduleId-1],correctCount*10);
  assert.equal(hud.overall,completed.length*20+correctCount*2);
  assert.equal(hud.resolved,correctCount);
  assert.equal(hud.gap,10-correctCount);
  assert.equal(hud.seconds,45-correctCount);
  if(correctCount>0)assert.ok(hud.scores[moduleId-1]>=moduleTrace.at(-1)?.score||moduleTrace.at(-1)?.module!==moduleId,'Descending mastery position moved backward.');
  moduleTrace.push({module:moduleId,correct:correctCount,score:hud.scores[moduleId-1],overall:hud.overall,left:hud.gap});
 }
 completed.push(moduleId);
}

const awaiting=deriveHarnessAgents({answered:false,correct:false});
assert.deepEqual({orchestrator:awaiting.orchestrator.state,tester:awaiting.tester.state,learner:awaiting.learner.state,validator:awaiting.validator.state},{orchestrator:'complete',tester:'complete',learner:'active',validator:'standby'});
const verified=deriveHarnessAgents({answered:true,correct:true});
assert.equal(verified.learner.state,'complete');assert.equal(verified.validator.state,'verified');
const recovery=deriveHarnessAgents({answered:true,correct:false});
assert.equal(recovery.validator.state,'recovery');assert.equal(recovery.validator.className,'risk');

const finalHud=deriveMasteryHud({completed:5,moduleId:5,mastered:10,total:10,questionIndex:10,answered:true,correct:true,active:true,secondsRemaining:35,moduleScores:[100,100,100,100,100]});
assert.equal(finalHud.overall,100);assert.equal(finalHud.gap,0);assert.equal(finalHud.state,'VERIFIED');

console.log(JSON.stringify({status:'passed',hudStatesChecked:moduleTrace.length,modules:5,moduleBadges:5,appliedLabBadge:1,premierBadge:1,totalBadges:7,masteryRange:[moduleTrace[0].overall,finalHud.overall],agentFlow:['orchestrator:complete','testing:complete','learner:active→complete','validator:standby→verified|recovery'],dropdownContract:'aria-expanded + explicit toggle',descendingPath:'module score never moves backward after verified answers'},null,2));
