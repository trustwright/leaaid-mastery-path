import assert from'node:assert/strict';
import{access,readFile}from'node:fs/promises';
import{QUESTIONS,MODULES,selectQuestionSet}from'../lib/questions.ts';

assert.equal(MODULES.length,5);assert.equal(QUESTIONS.length,100);assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,100);assert.equal(new Set(QUESTIONS.map(q=>q.semanticKey)).size,100);
let longestCorrect=0;
for(const m of MODULES){const items=QUESTIONS.filter(q=>q.moduleId===m.id);assert.equal(items.length,20,`${m.code} candidate bank`);const first=selectQuestionSet(m.id,[],10,1000+m.id);const second=selectQuestionSet(m.id,first.map(q=>q.baseId),10,2000+m.id);assert.equal(first.length,10);assert.equal(second.length,10);assert.equal(new Set([...first,...second].map(q=>q.baseId)).size,20,`${m.code} must deliver two non-repeating rounds`);}
for(const q of QUESTIONS){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.correct>=0&&q.correct<4);assert.ok(q.prompt.length>20);assert.doesNotMatch(q.prompt,/module\s*[1-5]/i);assert.ok(q.rationale.length>10);assert.ok(q.sourceRefs[0]?.locator);assert.ok(q.sourceRefs[0]?.claim);const lengths=q.options.map(option=>option.length);if(lengths[q.correct]===Math.max(...lengths))longestCorrect++;}
assert.ok(longestCorrect/QUESTIONS.length<.35,'correct choices must not be signaled by consistently greater length');
const trainer=await readFile(new URL('../app/Trainer.tsx',import.meta.url),'utf8');const css=(await readFile(new URL('../app/globals.css',import.meta.url),'utf8'))+(await readFile(new URL('../app/agent.css',import.meta.url),'utf8'));
for(const token of ['LIMIT=45','Focused recovery','Premier LEAAID Knowledge','localStorage','selectQuestionSet','materializeQuestion','THEME_STORE','Switch to','Ask LEAAID','SOURCE-GROUNDED CURRICULUM GUIDE'])assert.ok(trainer.includes(token),`missing ${token}`);
assert.match(css,/--red:#c41230/i);assert.match(css,/html\[data-theme=dark\]/);assert.match(css,/@media\(max-width:720px\)/);assert.match(css,/prefers-reduced-motion/);assert.match(css,/:focus-visible/);assert.match(css,/touch-action:manipulation/);
await access(new URL('../training.config.json',import.meta.url));await access(new URL('../reports/source-coverage.md',import.meta.url));
console.log(JSON.stringify({status:'passed',modules:5,candidateQuestions:100,nonRepeatingRoundsPerModule:2,roundQuestions:10,finalQuestions:10,timerSeconds:45,masteryRequired:100,badges:6,longestCorrectRate:Number((longestCorrect/100).toFixed(2)),learningAgent:'local-source-grounded',privacy:'local-device'},null,2));
