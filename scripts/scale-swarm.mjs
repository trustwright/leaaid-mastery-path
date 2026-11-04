import assert from 'node:assert/strict';
import { SCALE_BENCHMARK } from '../lib/scaleBenchmark.ts';

function random(seed){let value=seed>>>0;return()=>{value+=0x6D2B79F5;let t=value;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}

export function runSwarm(learners=1000,seed=0x1D920){
  const rng=random(seed);
  const tiers={developing:0,bronze:0,silver:0,gold:0,premier:0};
  const domains=Object.fromEntries([1,2,3,4,5].map(id=>[id,{answered:0,correct:0}]));
  const durations=[];
  let totalCorrect=0;
  for(let learner=0;learner<learners;learner++){
    const band=rng();
    const base=band<.28?.48+rng()*.2:band<.53?.7+rng()*.09:band<.73?.8+rng()*.09:band<.93?.9+rng()*.085:1;
    const bias=Object.fromEntries([1,2,3,4,5].map(id=>[id,base===1?0:(rng()-.5)*.12]));
    let correct=0;
    for(let round=0;round<10;round++){
      const duration=Math.round(390000+(1-base)*520000+rng()*150000);
      durations.push(duration);
      for(let domain=1;domain<=5;domain++)for(let question=0;question<5;question++){
        const probability=Math.max(.2,Math.min(1,base+bias[domain]+round*.004));
        const hit=rng()<probability;
        domains[domain].answered++;if(hit){domains[domain].correct++;correct++;totalCorrect++;}
      }
    }
    const score=Math.round(correct/250*100);
    const tier=score===100?'premier':score>=90?'gold':score>=80?'silver':score>=70?'bronze':'developing';
    tiers[tier]++;
  }
  durations.sort((a,b)=>a-b);
  return {learners,rounds:learners*10,decisions:learners*250,accuracy:Number((totalCorrect/(learners*250)*100).toFixed(1)),p95DurationMs:durations[Math.floor(durations.length*.95)],tiers,domains};
}

const result=runSwarm();
assert.equal(result.learners,1000);
assert.equal(result.rounds,10000);
assert.equal(result.decisions,250000);
assert.ok(Object.values(result.domains).every(domain=>domain.answered===50000),'every domain must receive 50,000 randomized decisions');
assert.equal(Object.values(result.tiers).reduce((sum,value)=>sum+value,0),1000,'every learner must route to one result tier');
assert.ok(result.tiers.premier>0,'the proficiency mix must exercise the Premier path');
assert.deepEqual(result,{learners:SCALE_BENCHMARK.learners,rounds:SCALE_BENCHMARK.rounds,decisions:SCALE_BENCHMARK.decisions,accuracy:SCALE_BENCHMARK.accuracy,p95DurationMs:SCALE_BENCHMARK.p95DurationMs,tiers:SCALE_BENCHMARK.tiers,domains:SCALE_BENCHMARK.domains},'published scale proof must match the executed swarm');
console.log(JSON.stringify(result,null,2));
