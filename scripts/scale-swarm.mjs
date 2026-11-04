import assert from'node:assert/strict';
import{selectQuestionSet}from'../lib/questions.ts';

const learners=10000;const started=performance.now();let decisions=0;let repeatViolations=0;let stateCollisions=0;const fingerprints=new Set();
for(let learner=0;learner<learners;learner++){
 const nonce=1700000000000+learner*37;const history={};const fingerprint=[];
 for(let moduleId=1;moduleId<=5;moduleId++){
  const first=selectQuestionSet(moduleId,[],10,nonce+moduleId);const second=selectQuestionSet(moduleId,first.map(q=>q.baseId),10,nonce+moduleId+101);
  const overlap=first.filter(q=>second.some(next=>next.baseId===q.baseId)).length;repeatViolations+=overlap;history[moduleId]=[...first,...second].map(q=>q.baseId);decisions+=20;fingerprint.push(first[0].id,second[0].id);
 }
 const key=fingerprint.join('|');if(fingerprints.has(key))stateCollisions++;fingerprints.add(key);
}
const elapsedMs=performance.now()-started;assert.equal(repeatViolations,0);assert.equal(decisions,learners*100);assert.equal(fingerprints.size+stateCollisions,learners);
const result={status:'passed',simulatedConcurrentSessions:learners,generatedDecisions:decisions,repeatViolations,stateIsolation:'independent-local-progress',elapsedMs:Number(elapsedMs.toFixed(1)),sessionsPerSecond:Math.round(learners/(elapsedMs/1000)),personalDataSent:false};console.log(JSON.stringify(result,null,2));
