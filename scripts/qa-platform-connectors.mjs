import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {operate_leaaid_agent,geminiFunctionResponse} from '../public/client-kits/gemini-function-executor.mjs';

const origin=process.env.LEAAID_ORIGIN||'https://leaaid-mastery-path.nexus-8198.chatgpt.site';
const openapi=JSON.parse(await readFile(new URL('../public/openapi.json',import.meta.url),'utf8'));
const gemini=JSON.parse(await readFile(new URL('../public/client-kits/gemini-function-tool.json',import.meta.url),'utf8'));
const operation=openapi.paths?.['/api/agent']?.post;
const declaration=gemini.function_declarations?.[0];

assert.equal(openapi.openapi,'3.1.0');
assert.equal(operation?.operationId,'operateLEAAIDAgent');
assert.equal(openapi.components?.securitySchemes,undefined,'Anonymous connector must not imply credentials.');
assert.equal(declaration?.name,'operate_leaaid_agent');
assert.ok(declaration.parameters.properties.action.enum.includes('launch_multi_agent_training'));

const created=await operate_leaaid_agent({action:'create_session'},{endpoint:`${origin}/api/agent`});
assert.match(created.session_id,/^[A-Za-z0-9_-]{20,}$/);
const launched=await operate_leaaid_agent({action:'launch_multi_agent_training',session_id:created.session_id,module_id:1},{endpoint:`${origin}/api/agent`});
assert.equal(launched.question.module_id,1);
assert.equal(launched.question.index,1);
assert.equal(Array.isArray(launched.question.options),true);
assert.equal(launched.question.options.length,4);
assert.equal('answer' in launched.question,false,'Question response must not disclose the answer key.');
const wrapped=geminiFunctionResponse(launched);
assert.equal(wrapped.functionResponse.name,'operate_leaaid_agent');

console.log(JSON.stringify({status:'passed',origin,openai:{schema:'3.1.0',operation:operation.operationId,authentication:'none'},gemini:{declaration:declaration.name,executor:'live',module:launched.question.module_id,question:launched.question.index,answer_key_exposed:false}},null,2));
