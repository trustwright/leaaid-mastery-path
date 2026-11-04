'use client';
import {useEffect,useMemo,useState} from 'react';
import {MODULES,ModuleId,Question,questionsFor} from '../lib/questions';

type Progress={completed:ModuleId[];best:Partial<Record<ModuleId,number>>;premier:boolean};
type Phase='home'|'quiz'|'module-result'|'final'|'premier';
const STORE='leaaid-mastery-v1';
const EMPTY:Progress={completed:[],best:{},premier:false};
const LIMIT=45;

function Badge({moduleId,earned}:{moduleId:ModuleId;earned:boolean}){return <div className={`badge ${earned?'earned':''}`} aria-label={`${MODULES[moduleId-1].title} badge ${earned?'earned':'locked'}`}><span>{earned?'✓':MODULES[moduleId-1].code}</span><b>{MODULES[moduleId-1].short}</b><small>{earned?'MASTERED':'LOCKED'}</small></div>}

export default function Trainer(){
 const [progress,setProgress]=useState<Progress>(EMPTY);const[loaded,setLoaded]=useState(false);const[phase,setPhase]=useState<Phase>('home');
 const[moduleId,setModuleId]=useState<ModuleId>(1);const[queue,setQueue]=useState<Question[]>([]);const[index,setIndex]=useState(0);const[selected,setSelected]=useState<number|null>(null);const[answered,setAnswered]=useState(false);const[mastered,setMastered]=useState<string[]>([]);const[missed,setMissed]=useState<string[]>([]);const[tip,setTip]=useState(false);const[seconds,setSeconds]=useState(LIMIT);const[toast,setToast]=useState('');
 useEffect(()=>{try{const raw=localStorage.getItem(STORE);if(raw)setProgress(JSON.parse(raw));}catch{}setLoaded(true)},[]);
 useEffect(()=>{if(loaded)localStorage.setItem(STORE,JSON.stringify(progress))},[loaded,progress]);
 useEffect(()=>{if((phase!=='quiz'&&phase!=='final')||answered)return;setSeconds(LIMIT);const timer=setInterval(()=>setSeconds(s=>{if(s<=1){clearInterval(timer);setAnswered(true);setMissed(m=>[...new Set([...m,queue[index]?.id])]);return 0}return s-1}),1000);return()=>clearInterval(timer)},[phase,index,answered,queue]);
 const current=queue[index];const moduleDone=progress.completed.includes(moduleId);const totalMastery=progress.completed.length*20+(progress.premier?10:0);
 const start=(id:ModuleId)=>{const unlocked=id===1||progress.completed.includes((id-1) as ModuleId);if(!unlocked)return;setModuleId(id);setQueue(questionsFor(id).slice(0,10));setIndex(0);setMastered([]);setMissed([]);setSelected(null);setAnswered(false);setTip(false);setPhase('quiz')};
 const startFinal=()=>{if(progress.completed.length<5)return;const items=MODULES.flatMap(m=>questionsFor(m.id).slice(18,20));setQueue(items);setIndex(0);setMastered([]);setMissed([]);setSelected(null);setAnswered(false);setTip(false);setPhase('final')};
 const submit=()=>{if(selected===null||answered)return;setAnswered(true);if(selected===current.correct)setMastered(m=>[...new Set([...m,current.id])]);else setMissed(m=>[...new Set([...m,current.id])])};
 const advance=()=>{if(index<queue.length-1){setIndex(i=>i+1);setSelected(null);setAnswered(false);setTip(false);return}
   const unresolved=queue.filter(q=>!mastered.includes(q.id)&&!(q.id===current.id&&selected===current.correct));
   if(unresolved.length){const remedial=unresolved.map((q,i)=>{const bank=questionsFor(q.moduleId);return bank[10+(Number(q.id.slice(-2))-1+i)%10]});setQueue(remedial);setIndex(0);setSelected(null);setAnswered(false);setTip(false);setMissed([]);setToast(`${unresolved.length} concept${unresolved.length===1?'':'s'} moved to focused recovery`);setTimeout(()=>setToast(''),2600);return}
   if(phase==='final'){setProgress(p=>({...p,premier:true}));setPhase('premier');return}
   setProgress(p=>({...p,completed:[...new Set([...p.completed,moduleId])] as ModuleId[],best:{...p.best,[moduleId]:100}}));setPhase('module-result');setToast(`${MODULES[moduleId-1].title} badge achieved`);setTimeout(()=>setToast(''),3000)
 };
 const reset=()=>{if(confirm('Reset all LEAAID progress on this device?')){setProgress(EMPTY);setPhase('home')}};
 const isCorrect=answered&&selected===current?.correct;const completion=queue.length?Math.round(((index+(answered?1:0))/queue.length)*100):0;
 if(!loaded)return <main className="loading">Preparing your LEAAID path…</main>;
 return <main className={`app phase-${phase}`}>
  {toast&&<div className="toast" role="status">{toast}</div>}
  <header className="topbar"><div className="wordmark"><span>CMU</span><div><b>LEAAID</b><small>Leading Enterprise Agentic AI Development</small></div></div><button className="quiet" onClick={()=>setPhase('home')}>Learning path</button></header>
  {phase==='home'&&<>
   <section className="hero"><div><p className="eyebrow">CARNEGIE MELLON UNIVERSITY · HEINZ COLLEGE</p><h1>Build judgment.<br/><em>Prove mastery.</em></h1><p>Five sequential module rounds. Ten decisions each. Every concept must reach mastery before the next round unlocks.</p><button className="primary" onClick={()=>start((progress.completed.length<5?progress.completed.length+1:5) as ModuleId)}>{progress.completed.length?'Continue your path':'Begin Module 1'}</button></div><div className="hero-score"><span>LIVE MASTERY</span><strong>{totalMastery}<small>/110</small></strong><div><i style={{width:`${totalMastery/110*100}%`}}/></div><p>{progress.premier?'Premier LEAAID Knowledge achieved':`${5-progress.completed.length} module badges remaining`}</p></div></section>
   <section className="path"><div className="section-title"><div><p className="eyebrow">SEQUENTIAL MASTERY</p><h2>Five rounds. One premier badge.</h2></div><p>Incorrect or timed-out concepts enter focused recovery. You advance only when the round reaches 100% comprehension.</p></div>
    <div className="module-grid">{MODULES.map((m,i)=>{const earned=progress.completed.includes(m.id);const locked=m.id>1&&!progress.completed.includes((m.id-1) as ModuleId);return <article className={`${locked?'locked':''} ${earned?'complete':''}`} key={m.id}><div className="module-head"><span>{m.code}</span><small>{earned?'100% MASTERED':locked?'PREREQUISITE LOCKED':'READY'}</small></div><h3>{m.title}</h3><p>10 scored decisions · 45 seconds each · source-grounded rationale</p><div className="module-actions"><button disabled={locked} onClick={()=>start(m.id)}>{earned?'Review round':locked?'Locked':'Start round'}</button><Badge moduleId={m.id} earned={earned}/></div></article>})}</div>
   </section>
   <section className={`final-card ${progress.completed.length<5?'locked':''}`}><div><p className="eyebrow">FINAL COMPREHENSION CHALLENGE</p><h2>Premier LEAAID Knowledge</h2><p>Ten cross-module decisions test whether you can connect architecture, data, assurance, strategy, and applied operations.</p></div><button className="gold" disabled={progress.completed.length<5} onClick={startFinal}>{progress.premier?'Retake challenge':progress.completed.length<5?'Complete all five rounds':'Start final challenge'}</button></section>
   <footer><span>Progress stays on this device. No account or personal data.</span><button className="quiet" onClick={reset}>Reset progress</button></footer>
  </>}
  {(phase==='quiz'||phase==='final')&&current&&<section className="quiz-shell">
   <aside><button className="back" onClick={()=>setPhase('home')}>← Save & exit</button><p className="eyebrow">{phase==='final'?'FINAL CHALLENGE':`${MODULES[moduleId-1].code} ROUND`}</p><h2>{phase==='final'?'Premier Knowledge':MODULES[moduleId-1].title}</h2><div className="round-ring"><strong>{index+1}<small>/{queue.length}</small></strong><span>QUESTION</span></div><div className="mini-badges">{MODULES.map(m=><Badge key={m.id} moduleId={m.id} earned={progress.completed.includes(m.id)}/>)}</div></aside>
   <div className="question-area"><div className="quiz-progress"><span><b>{completion}%</b> round progress</span><i><em style={{width:`${completion}%`}}/></i><span className={seconds<=10?'urgent':''}><b>{seconds}</b>s</span></div><div className="question-card"><div className="qmeta"><span>QUESTION {index+1}</span><span>DIFFICULTY {current.difficulty}</span><span>{current.sourceRefs[0].locator}</span></div><h1>{current.prompt}</h1><div className="answers">{current.options.map((o,i)=><button disabled={answered} onClick={()=>setSelected(i)} className={`${selected===i?'selected':''} ${answered&&i===current.correct?'correct':''} ${answered&&selected===i&&i!==current.correct?'wrong':''}`} key={o}><span>{String.fromCharCode(65+i)}</span>{o}</button>)}</div>
    {!answered&&<div className="question-actions"><button className="tip" onClick={()=>setTip(t=>!t)}>Tip</button><button className="primary" disabled={selected===null} onClick={submit}>Check answer</button></div>}{tip&&!answered&&<p className="hint">{current.hint}</p>}
    {answered&&<div className={`feedback ${isCorrect?'good':'retry'}`} role="status"><div><strong>{isCorrect?'Concept mastered':'Focused recovery required'}</strong><p>{selected===null?'Time expired. ':''}{current.rationale}</p><small>Source: {MODULES[current.moduleId-1].source} · {current.sourceRefs[0].locator}</small></div><button onClick={advance}>{index===queue.length-1?'Complete checkpoint':'Next question'}</button></div>}
   </div></div>
  </section>}
  {phase==='module-result'&&<section className="result"><Badge moduleId={moduleId} earned/><p className="eyebrow">ROUND COMPLETE · 100% COMPREHENSION</p><h1>{MODULES[moduleId-1].title}<br/><em>badge achieved.</em></h1><p>All ten concepts are mastered. Module {moduleId<5?moduleId+1:'challenge'} is now unlocked.</p><div><button className="primary" onClick={()=>moduleId<5?start((moduleId+1) as ModuleId):startFinal()}>{moduleId<5?`Begin Module ${moduleId+1}`:'Start final challenge'}</button><button className="quiet" onClick={()=>setPhase('home')}>View learning path</button></div></section>}
  {phase==='premier'&&<section className="result premier"><div className="premier-badge"><span>LEAAID</span><b>PREMIER</b><small>KNOWLEDGE</small></div><p className="eyebrow">ALL FIVE MODULES + FINAL CHALLENGE</p><h1>Premier knowledge.<br/><em>Fully demonstrated.</em></h1><p>You achieved 100% comprehension across the complete LEAAID learning path.</p><button className="gold" onClick={()=>setPhase('home')}>View achievement path</button><small className="disclaimer">In-product learning achievement. This is not an independently verified credential.</small></section>}
 </main>
}
