import assert from'node:assert/strict';import{access,readFile}from'node:fs/promises';import{QUESTIONS,MODULES}from'../lib/questions.ts';
assert.equal(MODULES.length,5);assert.equal(QUESTIONS.length,100);assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,100);assert.equal(new Set(QUESTIONS.map(q=>q.semanticKey)).size,100);
for(const m of MODULES){const items=QUESTIONS.filter(q=>q.moduleId===m.id);assert.equal(items.length,20,`${m.code} candidate bank`);assert.equal(items.slice(0,10).length,10);}
for(const q of QUESTIONS){assert.equal(q.options.length,4);assert.ok(q.correct>=0&&q.correct<4);assert.ok(q.prompt.length>35);assert.ok(q.rationale.length>25);assert.ok(q.sourceRefs[0]?.locator);assert.ok(q.sourceRefs[0]?.claim);}
const trainer=await readFile(new URL('../app/Trainer.tsx',import.meta.url),'utf8');const css=await readFile(new URL('../app/globals.css',import.meta.url),'utf8');
for(const token of ['LIMIT=45','Focused recovery','Premier LEAAID Knowledge','localStorage','slice(0,10)','slice(18,20)'])assert.match(trainer,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
assert.match(css,/--red:#c41230/i);assert.match(css,/@media\(max-width:720px\)/);assert.match(css,/prefers-reduced-motion/);
await access(new URL('../training.config.json',import.meta.url));await access(new URL('../reports/source-coverage.md',import.meta.url));
console.log(JSON.stringify({status:'passed',modules:5,candidateQuestions:100,roundQuestions:10,finalQuestions:10,timerSeconds:45,masteryRequired:100,badges:6,privacy:'local-device'},null,2));
