const DEFAULT_ENDPOINT='https://leaaid-mastery-path.nexus-8198.chatgpt.site/api/agent';

export async function operate_leaaid_agent(argumentsObject,{endpoint=DEFAULT_ENDPOINT,fetchImpl=fetch}={}){
  if(!argumentsObject||typeof argumentsObject!=='object')throw new TypeError('Function arguments must be an object.');
  const response=await fetchImpl(endpoint,{
    method:'POST',
    headers:{'content-type':'application/json'},
    body:JSON.stringify(argumentsObject),
  });
  const result=await response.json();
  if(!response.ok)throw new Error(`${response.status}: ${result.error||'LEAAID request failed'}`);
  return result;
}

export const geminiFunctionResponse=(result)=>({
  functionResponse:{
    name:'operate_leaaid_agent',
    response:result,
  },
});
