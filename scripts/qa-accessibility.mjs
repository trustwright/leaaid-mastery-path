import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(path,import.meta.url),'utf8');
const [layout,trainer,lab,css,globals]=await Promise.all([
 read('../app/layout.tsx'),read('../app/Trainer.tsx'),read('../app/AppliedLab.tsx'),read('../app/accessibility.css'),read('../app/globals.css')
]);
const checks={
 language:layout.includes('<html lang="en">'),
 skipLink:layout.includes('className="skip-link" href="#main-content"')&&layout.includes('id="main-content"'),
 focusVisible:css.includes(':focus-visible')&&css.includes('outline:3px solid var(--focus)'),
 targetSize:css.includes('min-height:44px')&&css.includes('@media(pointer:coarse)')&&css.includes('min-height:48px'),
 reducedMotion:globals.includes('@media(prefers-reduced-motion:reduce)'),
 touchInput:css.includes('touch-action:manipulation'),
 timerControl:trainer.includes('Pause question timer')&&lab.includes('Pause lab timer')&&trainer.includes('aria-pressed={!timed}')&&lab.includes('aria-pressed={!timed}'),
 answerState:trainer.includes('role="group" aria-labelledby="question-heading"')&&lab.includes('role="group" aria-labelledby="lab-question-heading"')&&trainer.includes('aria-pressed={selected===i}')&&lab.includes('aria-pressed={selected===i}'),
 progressName:lab.includes('role="progressbar"')&&lab.includes('aria-valuenow={completedThrough}'),
 modalKeyboard:trainer.includes("event.key==='Escape'")&&trainer.includes("event.key!=='Tab'")&&trainer.includes('agentButtonRef.current?.focus()'),
 liveFeedback:trainer.includes('aria-live="polite"')&&lab.includes('aria-live="polite"'),
 sourceDisclosure:trainer.includes('aria-controls="source-guidance"')&&trainer.includes('id="source-guidance"'),
 focusTransfer:trainer.includes('questionHeadingRef.current?.focus()')&&lab.includes('headingRef.current?.focus()'),
 compactControls:css.includes('border-radius:999px!important')&&css.includes('transform:scale(.985)')
};
for(const [name,passed] of Object.entries(checks))assert.ok(passed,`Accessibility contract failed: ${name}`);
console.log(JSON.stringify({status:'passed',standardTarget:'Section 508 / WCAG 2.0 A-AA; enhanced toward WCAG 2.2',automatedContracts:Object.keys(checks).length,checks},null,2));
