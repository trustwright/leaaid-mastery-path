export type ModuleId=1|2|3|4|5;
export type Question={id:string;moduleId:ModuleId;prompt:string;options:string[];correct:number;hint:string;tipContext:string;rationale:string;sourceRefs:{sourceId:string;locator:string;claim:string}[];semanticKey:string;difficulty:1|2|3};
export const MODULES=[
 {id:1 as ModuleId,code:'M1',title:'Agentic AI Foundations',short:'Foundations',source:'Module1.pdf'},
 {id:2 as ModuleId,code:'M2',title:'Data Foundations & Architecture',short:'Architecture',source:'Module2.pdf'},
 {id:3 as ModuleId,code:'M3',title:'Agentic AI Assurance',short:'Assurance',source:'Module3.pdf'},
 {id:4 as ModuleId,code:'M4',title:'AI Strategy & Transformation',short:'Strategy',source:'Module4.pdf'},
 {id:5 as ModuleId,code:'M5',title:'Agentic AI Lab',short:'Applied Lab',source:'Module5.pptx'},
] as const;
type Seed=[topic:string,answer:string,locator:string];
const S:Record<ModuleId,Seed[]>={
1:[
 ['the workflow-agent dividing line','A workflow has a predetermined path; an agent chooses part of the next-step path.','p. 13, Workflow vs. Agent'],
 ['closing an LLM knowledge gap','Add retrieval and memory to provide grounding.','pp. 10-11, Model vs. System'],
 ['the agent control loop','Perceive, think, act, and reflect.','p. 15, Agent Cycle'],
 ['a task solvable entirely by fixed rules','Use rule-based automation.','p. 17, Least Sufficient Agency Test'],
 ['a vague, untestable goal','Narrow and clarify the task before building.','p. 24, Task Readiness'],
 ['approval for an irreversible action','Place approval before the consequence at the policy-envelope boundary.','p. 25, Policy Envelope'],
 ['authority when nobody is watching','Specify tools, permissions, checkpoints, and operating rules.','p. 26, Specification Canvas'],
 ['adding an architecture pattern','Name the failure mode, test, owner, and boundary first.','p. 27, Architecture Canvas'],
 ['persistent memory','It buys continuity but adds privacy, governance, and stale-belief risk.','p. 28, Design Trade-offs'],
 ['justifying multiple agents','Use them for enforced separation, independent review, true parallel work, or valuable specialization.','p. 29, One Agent to a Team'],
 ['who sets the goal','A person or the organization always sets the goal.','p. 23, Specification Questions'],
 ['agency as a system property','Goals, context, tools, permissions, feedback, and stopping rules create agency around the model.','p. 20, Leadership Takeaways'],
 ['the policy envelope','The organization defines the boundary; the agent has discretion only inside it.','p. 25, Policy Envelope'],
 ['verification in an architecture','Tie claims to evidence and define what low confidence triggers.','p. 27, Architecture Canvas'],
 ['the cost of retrieval','Grounded answers add latency and a pipeline that must be maintained.','p. 28, Design Trade-offs'],
 ['undefined actions','The task is not ready until permitted and forbidden actions are explicit.','p. 24, Task Readiness'],
 ['reaching an authority boundary','Stop, wait for approval, or escalate according to the written rule.','p. 25, Policy Envelope'],
 ['an independent reviewer agent','Separation of duties gives it a distinct control responsibility.','p. 29, One Agent to a Team'],
 ['the leadership authority test','Ask who decides, who acts, and what happens next without a human.','p. 20, Leadership Takeaways'],
 ['one agent completing work within limits','Use one agent and avoid unnecessary coordination overhead.','p. 29, One Agent to a Team'],
],
2:[
 ['why trusted data matters more for agents','Data errors can propagate into actions, not only reports.','p. 19, Agentic AI Raises the Bar'],
 ['the data foundation','It is the trusted knowledge layer for agent decisions.','pp. 18-20, Trusted Knowledge'],
 ['LLM work versus deterministic code','Use AI for judgment and code for rules, calculation, and repeatability.','p. 54, LLM vs. Code'],
 ['retrieval at runtime','Retrieve only the enterprise context relevant to the current task.','p. 59, Retrieval Context'],
 ['agent memory','Retain task state and relevant prior information across steps or sessions.','p. 60, Memory'],
 ['the ReAct loop','Reason, act, observe, and adjust iteratively.','p. 61, ReAct Loop'],
 ['tools','Tools bridge model reasoning to external capabilities and actions.','pp. 62-63, Tools'],
 ['multi-agent architecture','Use it only when specialization benefits exceed coordination cost.','pp. 66-69, Multi-agent Systems'],
 ['AgenticOps','It is the control-plane discipline for safe, reliable, efficient autonomy.','pp. 74-76, AgenticOps'],
 ['observability traces','They reveal retrievals, reasoning steps, and tool calls behind an outcome.','pp. 77-78, Observability'],
 ['agent evaluation','Assess both the outcome and the execution path.','pp. 79-81, Evaluation'],
 ['enforceable guardrails','Translate policy into explicit checks at the relevant execution step.','pp. 87-89, Guardrails'],
 ['fail-safe design','Bound retries, provide safe fallback, and escalate before harm compounds.','p. 92, Fail Safely'],
 ['reliability evidence','Measure the full workflow across repeated runs.','p. 93, Reliability'],
 ['agent cost growth','Every model call, retrieval, tool call, and retry adds consumption.','pp. 94-96, Cost'],
 ['latency','It accumulates across serial reasoning, retrieval, tools, handoffs, and retries.','pp. 97-99, Latency'],
 ['data quality validation','Prevent inaccurate or incomplete data from driving decisions and actions.','p. 38, Data Quality Control'],
 ['business semantics','They define what enterprise data means in context.','pp. 39-42, Semantics and Catalog'],
 ['MCP','It standardizes how AI applications access tools and data.','p. 64, Standardizing Agent Access'],
 ['a deployed-agent change','Version, test, control, monitor, and make it reversible.','p. 100, Deployment Lifecycle'],
],
3:[
 ['security controls under agentic coding','Machine-speed code volume can outpace human review and remediation.','pp. 8-14, Security Landscape'],
 ['the lethal trifecta','Private data, untrusted content, and a path to send data out.','p. 18, Lethal Trifecta'],
 ['hard versus soft guardrails','A hard guardrail is structurally enforced outside model choice.','p. 19, Soft vs. Hard'],
 ['deterministic policy','Place it at the hook or enforcement point where the agent acts.','p. 20, Hooks'],
 ['agent identity','Give the agent scoped permissions, auditability, and revocation.','p. 22, Identity and Protocols'],
 ['ASI01','Agent goal hijack.','p. 28, ASI01'],['ASI02','Tool misuse and exploitation.','p. 29, ASI02'],['ASI03','Identity and privilege abuse.','p. 30, ASI03'],
 ['ASI04','Agentic supply-chain vulnerabilities.','p. 31, ASI04'],['ASI05','Unexpected code execution.','p. 32, ASI05'],
 ['ASI06','Memory and context poisoning.','p. 33, ASI06'],['ASI07','Insecure inter-agent communication.','p. 34, ASI07'],
 ['ASI08','Cascading failures.','p. 35, ASI08'],['ASI09','Human-agent trust exploitation.','p. 36, ASI09'],['ASI10','Rogue agents.','p. 37, ASI10'],
 ['a valid mitigation claim','Support it with adversarial testing evidence.','p. 38, Red Teaming'],
 ['rogue-agent response','Contain access and actions, preserve evidence, investigate, and recover.','p. 47, Incident Response'],
 ['an effective kill switch','Revoke identity, tools, execution, and delegated paths at enforced points.','p. 48, Kill Switch'],
 ['agent classification','Classify by consequence, authority, and autonomy.','p. 51, Classification Levels'],
 ['the module security summary','Most agent security failures are ordinary security failures at machine speed.','p. 59, Module Close'],
],
4:[
 ['where strategy begins','Start with business outcomes and strategic priorities, not agents.','pp. 12-13, Business Strategy'],
 ['golden use cases','Screen value, decision density, data readiness, bounded action, friction, and risk.','p. 14, Golden Use Cases'],
 ['choosing agency','Use the least sufficient agency that captures the value.','p. 8, Agency Level'],
 ['buy, boost, or build','Decide from proprietary data, domain expertise, integration, and strategic advantage.','p. 16, Buy Boost Build'],
 ['portfolio stage gates','Advance, reshape, pause, or stop based on evidence.','p. 17, Portfolio Gates'],
 ['executive measures','Track business outcomes, adoption, agent performance, and economics.','p. 22, Executive Measures'],
 ['decision rights','Match authority to consequence, reversibility, and confidence.','p. 31, Decision Rights'],
 ['production-agent accountability','Give every agent a defined job, human owner, and escalation path.','p. 32, Managing Digital Employees'],
 ['workforce uncertainty','Communicate honestly, build fluency, redesign work, and keep choices reversible.','pp. 37-45, Workforce Actions'],
 ['the governance shift','Govern planning, persistence, connections, identity, and action at machine speed.','p. 47, Governance Equation'],
 ['proportional governance','Increase assurance, approval, monitoring, and oversight with impact and autonomy.','p. 52, Proportional Governance'],
 ['layered governance','Combine senior accountability, process ownership, standards, data governance, and technical controls.','p. 53, Layered Governance'],
 ['agent-ready data governance','Require ownership, classification, quality standards, and lineage.','p. 54, Data Governance'],
 ['ecosystem-scale governance','Move from individual approvals to automated portfolio and ecosystem controls.','p. 55, Agent Ecosystem'],
 ['the enterprise agent control plane','Provide common identity, registry, authority, policy, observability, and lifecycle.','p. 56, Control Plane'],
 ['financial management','Track cost and value per workflow with budgets and limits.','p. 58, Financial Management'],
 ['days 0-30 of governance','Inventory agents, assign owners, risk-tier them, and block unregistered write access.','p. 60, 90-Day Playbook'],
 ['days 61-90 of governance','Produce logs, observability, kill-switch tests, red teams, and board reporting.','p. 60, 90-Day Playbook'],
 ['trusted agent identity','Use unique, scoped, revocable credentials with least privilege.','p. 62, Scale With Control'],
 ['strategy, operating model, and governance','Strategy chooses value, the operating model defines work, and governance enables scale.','p. 63, Key Takeaways'],
],
5:[
 ['what creates an agentic workflow','Data and tool use, orchestration, bounded action, and human checkpoints.','slides 4-7, Learning Progression'],
 ['the first lab baseline','Keep it unchanged for a valid comparison.','slides 10 and 19, Lab 1 Baseline'],
 ['changed policy facts','Update Knowledge and replace the stale uploaded file.','slide 17, Maintenance Test'],
 ['the Lab 1 limitation','Usefulness does not establish correctness.','slide 23, Lab 1 Debrief'],
 ['Lab 2 evaluation','Test whether both the decision and supporting evidence are grounded.','slides 25-32, Lab 2'],
 ['a controlled retest','Change one variable and rerun the same case and prompt.','slides 26 and 31, Controlled Retest'],
 ['prompt improvement','It is one lever among data, tools, orchestration, instructions, and evaluation.','slide 33, Failure Surfaces'],
 ['the regional workflow','Decomposition, tools, orchestration, and a human decision point created agentic behavior.','slide 50, Workflow Debrief'],
 ['the demo checkpoint caveat','It is conversationally instructed, not a deterministic approval node.','slide 50, Implementation Caveat'],
 ['production evaluation','Inspect data, calculations, tools, orchestration, human decisions, and traces.','slide 51, Evaluation Surfaces'],
 ['a justified specialist agent','Require a distinct task, data, tools, permissions, evaluation, or owner.','slides 54-58, Specialization'],
 ['the cost of another agent','It adds latency, coordination, cost, governance, and a failure surface.','slides 58-60, Coordination Cost'],
 ['pre-build multi-agent estimates','Estimate critical-path latency, cost, complexity, and operating burden.','slide 60, Coordination Cost'],
 ['platform selection','Choose where to build, run, integrate, govern, and observe agents.','slide 62, Agent Platforms'],
 ['platform direction','Build, runtime, identity, policy, evaluation, registry, and observability are converging.','slide 63, Platform Direction'],
 ['agent identity','Credentials, permissions, and audit history assigned to the agent.','slide 67, Glossary'],
 ['orchestration','Coordinate steps, tools, state, and agents toward a larger goal.','slide 69, Glossary'],
 ['regression testing','Repeat a test to detect whether a later change breaks acceptable behavior.','slide 70, Glossary'],
 ['an unnecessary specialist','Use a tool or workflow step when it can do the job without another agent.','slide 58, Justifying Agents'],
 ['the module design message','Agentic systems are more than prompts, and more agents are not automatically better.','slide 65, Module Takeaways'],
]};
const distractors=(moduleId:ModuleId,index:number,answer:string)=>S[moduleId]
 .map((seed,i)=>({i,text:seed[1],distance:Math.abs(seed[1].length-answer.length)}))
 .filter(item=>item.i!==index)
 .sort((a,b)=>a.distance-b.distance||Math.abs(a.i-index)-Math.abs(b.i-index)||a.i-b.i)
 .slice(0,3)
 .map(item=>item.text);

const promptFor=(topic:string)=>{
 if(topic==='why trusted data matters more for agents')return 'Why does trusted data matter more for agents?';
 if(topic==='where strategy begins')return 'Where should an enterprise AI strategy begin?';
 if(topic==='who sets the goal')return 'Who should set an agent’s goal?';
 if(topic==='what creates an agentic workflow')return 'What creates an agentic workflow?';
 if(topic==='reaching an authority boundary')return 'What should happen when an agent reaches an authority boundary?';
 if(topic==='adding an architecture pattern')return 'What should a team define before adding an architecture pattern?';
 if(topic==='choosing agency')return 'How should a team choose the appropriate level of agency?';
 if(topic==='justifying multiple agents')return 'What justifies using multiple agents?';
 if(topic==='closing an LLM knowledge gap')return 'How should a system close an LLM knowledge gap?';
 if(/^ASI\d+/i.test(topic))return `Which risk name corresponds to ${topic}?`;
 if(/^(adding|choosing|justifying|closing)\b/i.test(topic))return `What does the course recommend when ${topic}?`;
 if(/^(a|an|the)\b/i.test(topic))return `Which statement best explains ${topic}?`;
 const patterns=[`Which statement most accurately describes ${topic}?`,`How does the course characterize ${topic}?`,`Which option best represents ${topic} in practice?`];
 return patterns[(topic.length+topic.charCodeAt(0))%patterns.length];
};
const hintFor=(topic:string,answer:string,locator:string)=>{
 const section=locator.split(',').slice(1).join(',').trim()||locator;
 const lower=answer.toLowerCase();
 const lens=/authority|permission|boundary|scope|credential/.test(lower)?'authority and enforceable limits':/evidence|retriev|data|ground|source|context/.test(lower)?'evidence quality and grounding':/cost|latency|coordination|overhead|consumption/.test(lower)?'operational trade-offs':/human|approval|owner|accountab|decision right/.test(lower)?'decision rights at the point of consequence':/security|identity|kill|contain|revoke|guardrail|policy/.test(lower)?'control placement and containment':/test|evaluat|measure|trace|observ/.test(lower)?'observable evidence rather than appearance':/agent|speciali|multi-agent|workflow/.test(lower)?'whether added agency has a distinct responsibility':'the specific role this concept plays in the system';
 const cue=/^use\b/i.test(answer)?'Test the conditions under which the source recommends this choice.':/^add\b/i.test(answer)?'Identify the missing system capability before selecting an option.':/^place\b/i.test(answer)?'Focus on where the control sits relative to the consequence.':/^specify\b/i.test(answer)?'Look for the option that turns intent into an explicit operating rule.':/^start\b/i.test(answer)?'Find the required starting point before considering implementation.':/^track\b|^measure\b|^assess\b/i.test(answer)?'Choose the option that produces evidence across the full workflow.':/^require\b/i.test(answer)?'Look for the condition the source treats as necessary, not merely helpful.':'Separate this concept from nearby ideas and select the option that directly resolves it.';
 return{context:`The “${section}” material frames ${topic} through ${lens}.`,cue};
};

export const QUESTIONS:Question[]=([1,2,3,4,5] as ModuleId[]).flatMap(moduleId=>S[moduleId].map(([topic,answer,locator],i)=>{
 const correct=(i*3+moduleId)%4;const options=distractors(moduleId,i,answer);options.splice(correct,0,answer);const tip=hintFor(topic,answer,locator);
 const relationship=/^(use|add|place|specify|start|track|measure|assess|require|keep|update|change|test|inspect|choose|coordinate|repeat|estimate|give|translate|bound|prevent|retrieve|retain|classify|support|contain|revoke|screen|advance|decide|match|communicate|govern|increase|combine|move|provide|produce|inventory|build|stop|narrow|name|tie|ask)\b/i.test(answer)?'recommended action or control':'definition or operating principle';
 return{id:`m${moduleId}-q${String(i+1).padStart(2,'0')}`,moduleId,prompt:promptFor(topic),options,correct,hint:tip.cue,tipContext:tip.context,rationale:`In ${locator}, the course treats this as the ${relationship} for ${topic}: ${answer} The alternatives address adjacent ideas but not the condition, mechanism, or decision requested here.`,sourceRefs:[{sourceId:`module-${moduleId}`,locator,claim:answer}],semanticKey:`m${moduleId}|${i+1}|${topic}`,difficulty:(i<7?1:i<14?2:3) as 1|2|3};
}));

export type RuntimeQuestion=Question&{baseId:string;variant:number};
const hash=(value:string)=>{let h=2166136261;for(const ch of value){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const rotate=<T,>(items:T[],amount:number)=>items.map((_,i)=>items[(i+amount)%items.length]);
export function materializeQuestion(question:Question,nonce=0):RuntimeQuestion{
 const lowerPrompt=question.prompt[0].toLowerCase()+question.prompt.slice(1);const stems=[question.prompt,`According to the course material, ${lowerPrompt}`,`In an enterprise review, ${lowerPrompt}`];
 const variant=(hash(question.id)+nonce)%stems.length;const shift=(hash(`${question.id}:${nonce}`)%3)+1;
 const paired=question.options.map((text,i)=>({text,correct:i===question.correct}));const options=rotate(paired,shift);
 return{...question,id:`${question.id}-v${variant}-${nonce%97}`,baseId:question.id,variant,prompt:stems[variant],options:options.map(item=>item.text),correct:options.findIndex(item=>item.correct)};
}
export const questionsFor=(moduleId:ModuleId)=>QUESTIONS.filter(q=>q.moduleId===moduleId);
export function selectQuestionSet(moduleId:ModuleId,history:string[]=[],count=10,nonce=Date.now()){
 const pool=questionsFor(moduleId);const recent=new Set(history.slice(-count));const unseen=pool.filter(q=>!recent.has(q.id));const seen=pool.filter(q=>recent.has(q.id));
 const ordered=[...rotate(unseen,hash(`${moduleId}:${nonce}`)%Math.max(1,unseen.length)),...seen];
 return ordered.slice(0,count).map((q,i)=>materializeQuestion(q,nonce+i));
}
