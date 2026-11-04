import assert from 'node:assert/strict';

function random(seed){let value=seed>>>0;return()=>{value+=0x6D2B79F5;let t=value;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const rng=random(0xD1717A1);
const origin=process.env.LOAD_ORIGIN||'http://localhost:3000';

const payloads=Array.from({length:1000},()=>{
  const skill=.45+rng()*.55;
  const domains=Array.from({length:5},(_,index)=>{let correct=0;for(let item=0;item<5;item++)if(rng()<Math.max(.2,Math.min(1,skill+(rng()-.5)*.12)))correct++;return{domain:index+1,answered:5,correct}});
  const correct=domains.reduce((sum,domain)=>sum+domain.correct,0);
  return{eventId:crypto.randomUUID(),answered:25,correct,durationMs:Math.round(390000+(1-skill)*520000+rng()*150000),fluency:Math.round(correct/25*80+10),domains};
});

const started=performance.now();
const results=await Promise.allSettled(payloads.map(async payload=>{
  const requestStarted=performance.now();
  let firstAttemptFailed=false;
  let lastError;
  for(let attempt=0;attempt<4;attempt++){
    try{
      const response=await fetch(`${origin}/api/pulse`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(response.ok)return{latency:performance.now()-requestStarted,firstAttemptFailed};
      lastError=new Error(`HTTP ${response.status}`);
    }catch(error){lastError=error}
    firstAttemptFailed=true;
    await new Promise(resolve=>setTimeout(resolve,100*(2**attempt)+rng()*100));
  }
  throw lastError;
}));
const elapsedMs=Math.round(performance.now()-started);
const fulfilled=results.filter(item=>item.status==='fulfilled').map(item=>item.value);
const latencies=fulfilled.map(item=>item.latency).sort((a,b)=>a-b);
const accepted=latencies.length;
const rejected=results.length-accepted;
const recoveredAfterRetry=fulfilled.filter(item=>item.firstAttemptFailed).length;
const p95Ms=Math.round(latencies[Math.floor(latencies.length*.95)]||0);
assert.equal(accepted,1000,`expected 1,000 accepted concurrent rounds; ${rejected} failed`);
const pulse=await fetch(`${origin}/api/pulse`).then(response=>response.json());
assert.ok(Array.isArray(pulse.leaderboard)&&pulse.leaderboard.length<=10,'leaderboard must stay bounded');
assert.equal(pulse.benchmark.learners,1000,'published scale benchmark must remain separate from live load data');
console.log(JSON.stringify({status:'passed',concurrentLearners:1000,accepted,rejected,recoveredAfterRetry,elapsedMs,p95Ms,requestsPerSecond:Number((accepted/(elapsedMs/1000)).toFixed(1)),leaderboardRows:pulse.leaderboard.length,lifetimeRounds:Number(pulse.lifetime.rounds),personalDataSent:false},null,2));
