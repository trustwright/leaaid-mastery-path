#!/usr/bin/env node
const endpoint=process.env.LEAAID_ENDPOINT||'https://leaaid-mastery-path.nexus-8198.chatgpt.site/api/agent';
const action=process.argv[2]||'describe_program';
const supplied=process.argv[3]?JSON.parse(process.argv[3]):{};
const allowed=new Set(['describe_program','create_session','coach','launch_multi_agent_training','validate_training_response','launch_applied_lab','submit_lab_choice','launch_premier_challenge','get_session','list_achievements']);
if(!allowed.has(action))throw new Error('Action is not allowed by the local harness manifest.');
const response=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action,...supplied})});
const result=await response.json();if(!response.ok)throw new Error(`${response.status}: ${JSON.stringify(result)}`);console.log(JSON.stringify(result,null,2));
