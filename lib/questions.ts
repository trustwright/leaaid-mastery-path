export type ModuleId=1|2|3|4|5;
export type Question={id:string;moduleId:ModuleId;scenario:string;prompt:string;options:string[];correct:number;hint:string;tipContext:string;rationale:string;sourceRefs:{sourceId:string;locator:string;claim:string}[];semanticKey:string;difficulty:1|2|3};
export const MODULES=[
 {id:1 as ModuleId,code:'M1',title:'Agentic AI Foundations',short:'Foundations',source:'Module1.pdf'},
 {id:2 as ModuleId,code:'M2',title:'Data Foundations & Architecture',short:'Architecture',source:'Module2.pdf'},
 {id:3 as ModuleId,code:'M3',title:'Agentic AI Assurance',short:'Assurance',source:'Module3.pdf'},
 {id:4 as ModuleId,code:'M4',title:'AI Strategy & Transformation',short:'Strategy',source:'Module4.pdf'},
 {id:5 as ModuleId,code:'M5',title:'Applied Agentic Systems',short:'Applied Concepts',source:'Module5.pptx'},
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
const MISCONCEPTIONS:Record<ModuleId,string[]>={
 1:['Increase autonomy first and use post-hoc review as the primary control.','Expand the prompt while leaving permissions, checkpoints, and stop conditions implicit.','Add a second agent and treat agreement between models as approval.','Give the agent broad tool access so it can resolve exceptions without escalation.','Use a fixed workflow even when the next step depends on evidence discovered at runtime.','Persist every interaction indefinitely so the model never loses context.','Place approval after execution so reviewers can assess a concrete outcome.','Treat model confidence as sufficient authority for a consequential action.','Adopt the architecture pattern before naming the failure mode it must address.','Delegate goal setting to the agent once its operating instructions are complete.'],
 2:['Send the entire enterprise corpus on every turn instead of retrieving task-relevant context.','Use the model for deterministic calculations so all logic remains in one component.','Retry without a limit and rely on eventual model convergence.','Measure only the final answer and omit retrieval, tool, and handoff traces.','Grant a shared service identity to every agent to simplify integration.','Add specialist agents before estimating coordination cost and critical-path latency.','Treat a successful demonstration as sufficient reliability evidence for production.','Encode policy only in natural-language instructions and omit enforcement at execution.','Allow data definitions to vary by workflow so each agent can optimize locally.','Deploy irreversible changes without versioning, rollback, or staged evaluation.'],
 3:['Rely on a policy reminder inside the prompt as the sole enforcement mechanism.','Use one shared privileged identity so every agent can recover from access failures.','Treat model self-critique as adversarial testing evidence.','Allow untrusted retrieved content to invoke tools without an isolation boundary.','Log only the final response and discard the action path needed for investigation.','Make the kill switch another natural-language instruction interpreted by the agent.','Permit agents to accept unsigned inter-agent messages as authoritative context.','Restore service before containing delegated access and preserving evidence.','Classify risk by model size instead of authority, autonomy, and consequence.','Assume conventional controls operate at sufficient speed without agent-specific testing.'],
 4:['Begin with an agent platform selection and search afterward for business value.','Fund every promising prototype equally until adoption data becomes available.','Use the highest available autonomy to maximize strategic optionality.','Assign production accountability to the model provider rather than an internal owner.','Track model accuracy alone as the executive measure of program value.','Centralize every decision regardless of consequence, reversibility, or confidence.','Treat governance as a one-time approval before deployment.','Permit unregistered write-enabled agents during the portfolio discovery phase.','Measure shared infrastructure cost without allocating it to workflows and outcomes.','Delay workforce communication until the future operating model is final.'],
 5:['Change the prompt, source data, and evaluation case together to accelerate improvement.','Read the known-answer key before recording the baseline result.','Treat a useful response as proof that the underlying decision is correct.','Add a specialist agent whenever a workflow contains more than one step.','Let the parent and specialist independently alter assumptions during recalculation.','Continue to recommendation when a low-confidence assumption materially drives the ranking.','Use external search to fill workbook gaps even when the lab defines one authoritative source.','Compare rewritten test cases after refinement instead of rerunning the same inputs.','Present a financial ranking as the final enterprise expansion decision.','Treat a conversational checkpoint as equivalent to an enforced production approval gate.'],
};
const DEFINITION_MISCONCEPTIONS:Record<ModuleId,string[]>={
 1:['Any workflow that calls an LLM is an agent, regardless of how the next step is selected.','Agency is a property of the model rather than the surrounding goals, tools, permissions, and feedback.','Persistent memory is an unqualified benefit because additional context cannot create new governance risk.','A policy envelope is a prompt that asks the model to behave cautiously.','Multiple agents are justified whenever a task contains more than one activity.','Human approval and human ownership are interchangeable controls.','Model confidence grants temporary authority when a written rule is unavailable.','Reflection means repeating the same action until the result changes.','A fixed rule becomes agentic when its execution is fast enough.','The agent may set its own enterprise objective if the objective is measurable.'],
 2:['A trusted data foundation is a larger prompt containing every available enterprise record.','Observability is a final-response log without retrieval, tool, or handoff evidence.','Agent evaluation is equivalent to measuring linguistic quality on one successful run.','Memory is the permanent retention of every interaction regardless of task relevance.','A tool is any text the model cites, even when no external capability is invoked.','AgenticOps is conventional model hosting without workflow-level controls.','MCP determines which business decision an agent is authorized to make.','Reliability is established when the same prompt succeeds once in a demonstration.','Latency is the duration of the model call and excludes retrievals, tools, and retries.','A multi-agent design removes coordination cost by distributing responsibility.'],
 3:['A hard guardrail is a strongly worded instruction that the model is expected to follow.','Agent identity is the display name shown to users in the interface.','A kill switch is a message asking the agent to stop at its next convenient checkpoint.','Red teaming is satisfied when the model critiques its own response.','The lethal trifecta is high autonomy, high cost, and long latency.','Rogue-agent containment begins after service restoration and root-cause analysis.','Agent classification is determined primarily by model parameter count.','Secure inter-agent communication can rely on shared context as proof of origin.','Memory poisoning affects answer quality but cannot influence future actions.','Machine-speed execution reduces security exposure by shortening the review window.'],
 4:['An AI strategy is a prioritized list of available models and agent platforms.','A golden use case is the initiative with the most impressive demonstration.','Proportional governance applies the same control set to every agent for consistency.','The control plane is a dashboard that reports adoption after deployment.','Decision rights should follow technical ownership rather than consequence and reversibility.','A digital employee is accountable for its own production outcomes.','Portfolio governance means approving all pilots before evidence is available.','Agent-ready data governance is satisfied by granting broad read access.','Financial management tracks aggregate AI spend without workflow-level value.','Workforce transparency should wait until every operating-model decision is irreversible.'],
 5:['A controlled retest changes the prompt and evaluation case together to test adaptability.','A useful answer is sufficient evidence that the underlying reasoning and data are correct.','An agentic workflow is any prompt that requests a multi-step response.','A specialist agent is justified whenever a separate role label can be written.','A conversational checkpoint is an enforced approval boundary in production.','Regression testing compares different cases to maximize coverage after each change.','Agent identity is the persona and tone assigned in system instructions.','Orchestration is the use of multiple prompts in the same conversation.','Platform selection is only a model-quality decision.','A financial recommendation resolves commercial, regulatory, geopolitical, and operational readiness.'],
};
const SCENARIOS:Record<ModuleId,string[]>= {
1:[
 'A claims-review process follows fixed validation steps until conflicting evidence appears, when software may choose which approved check to run next.',
 'A policy assistant answers from model memory even though the enterprise rulebook changed twice after the model training cutoff.',
 'A service agent reads an incident, selects a diagnostic, observes the result, and must decide whether to continue or hand control back.',
 'A payroll team can express every eligibility decision as an approved rule table with no judgment, ambiguity, or changing route.',
 'A sponsor asks for an agent that will “improve operations” but cannot name one accountable outcome, input set, or testable result.',
 'An agent can prepare a supplier payment, but posting it changes the ledger and cannot be recalled after the bank accepts it.',
 'A support agent will run overnight without supervision, yet its draft specifies tone and model choice while omitting tool limits and checkpoints.',
 'An architect proposes adding reflection and a second model before the team has documented the failure the pattern should address.',
 'A case agent could remember prior investigations across quarters, including customer details and conclusions that may later become stale.',
 'A design team proposes four agents for a serial task that one bounded agent can complete, with no access separation or parallel work.',
 'A product team suggests allowing the deployed agent to revise its enterprise objective whenever operating data indicates a better target.',
 'A team attributes agency to the language model alone even though the deployed system also supplies goals, tools, permissions, and stopping rules.',
 'A procurement agent asks to increase its own transaction limit after repeated success, although the organization approved a fixed boundary.',
 'A research agent may recommend action only when its material claims are supported, and low-confidence evidence needs a defined response.',
 'A team wants grounded answers from approved documents but has not budgeted for search latency, indexing, updates, or retrieval failures.',
 'A task specification lists permitted data sources but never states which external actions the agent may perform or must never perform.',
 'During execution, an agent reaches a spend threshold outside its written authority while the next operational step is otherwise clear.',
 'A reviewer agent receives the same evidence as the authoring agent but has a distinct veto and must remain independent of the original work.',
 'Leadership can see the agent output but cannot identify who chooses the next step, who executes it, or who owns an exception.',
 'A single agent has the needed data, tools, and permissions and can complete the work within one enforceable policy envelope.',
],
2:[
 'A contract agent acts on a duplicate supplier record and initiates the wrong recovery, turning a data defect into an operational action.',
 'Several agents consume enterprise facts from different systems, but no governed layer establishes trusted meaning, provenance, or quality.',
 'A model is asked to calculate invoice variance and enforce a fixed threshold even though both outputs must be identical for identical inputs.',
 'A contract review sends an entire repository into every prompt although only one amendment and one invoice govern the current decision.',
 'A long-running investigation repeatedly forgets the contract already matched, the checks completed, and the next unresolved step.',
 'An invoice agent reasons that a price may conflict, queries the effective amendment, observes the result, and then updates its next action.',
 'A model identifies that it needs current sanctions data but cannot query the approved service or perform any external operation.',
 'A proposed design splits one serial calculation across five agents even though each handoff adds delay and no role needs separate authority.',
 'A platform team can run agents but lacks one discipline for lifecycle controls, reliability, cost, latency, evaluation, and safe operation.',
 'A recommendation is wrong, yet the team retained only the final prose and cannot inspect retrieval, tool, handoff, or policy decisions.',
 'A pilot scores polished answers on one case but never checks whether the workflow selected the right evidence or used tools correctly.',
 'A policy says recoveries above a threshold require approval, but the rule exists only as prose inside the model instructions.',
 'A supplier API fails repeatedly, and the agent continues retrying while downstream actions accumulate without a safe fallback or escalation.',
 'A demonstration succeeds once, so the team claims production reliability without repeated workflow runs or recovery measurements.',
 'A workflow invokes several models, retrievals, tools, memory operations, and evaluator calls, but budgeting counts only final-response tokens.',
 'A user waits through serial reasoning, retrieval, three tool calls, a handoff, and a retry while reporting measures only model latency.',
 'A contract record lacks a required test result, conflicts with the finance system, and is stale, yet the agent is allowed to recommend action.',
 '“High-risk contract” has different thresholds in finance and sourcing, so two agents interpret the same record differently.',
 'Teams expose tools through incompatible custom interfaces, making access controls, discovery, and integration inconsistent across agents.',
 'A new prompt and tool version is released directly to every user with no regression test, staged rollout, observability, or rollback path.',
],
3:[
 'Agent-authored code volume triples while review, scanning, triage, and remediation capacity remains tied to human headcount.',
 'A mail agent reads private records and untrusted inbound messages and can send external email without an independent approval boundary.',
 'A security rule appears only in a system prompt and the same model may ignore or reinterpret it during a tool call.',
 'A coding agent is about to execute a destructive shell command, and policy must block the action before the tool receives it.',
 'Several agents reuse an employee credential with broad access, leaving no independent revocation path or attributable audit trail.',
 'Retrieved text quietly changes an agent objective so it exports information while continuing to describe the original task.',
 'An approved tool is invoked with unsafe arguments that exceed the intended operation and create an unauthorized external effect.',
 'One agent impersonates a privileged service because every agent shares the same credential and authorization context.',
 'A previously trusted tool server ships a malicious update that enters the runtime through an unpinned dependency.',
 'Repository configuration causes an agent to run host commands before the project trust decision and outside an isolated environment.',
 'A poisoned memory entry persists into later sessions and changes decisions long after the attacker interaction has ended.',
 'An unauthenticated inter-agent message is accepted as trusted context and causes a specialist to execute a delegated task.',
 'A small retrieval error propagates through planning, analysis, and downstream agents until the system performs a harmful action.',
 'A reviewer sees a polished recommendation but lacks the evidence and time needed to notice that approval would cause harm.',
 'A compromised agent continues operating across sessions, uses legitimate credentials, and appears normal while violating its mandate.',
 'A team says a mitigation works because the agent self-critiqued successfully, but no adversarial campaign tested the control boundary.',
 'An agent shows anomalous tool calls and egress while active work remains queued and shared memory may contain poisoned state.',
 'Operations can message an agent to stop, but cannot revoke identity, cut egress, pause orchestration, or disable its tools.',
 'Two agents use the same model, but one only drafts text while the other can change production records and trigger irreversible actions.',
 'A review treats agent security as a novel model problem even though the failure combines ordinary access, identity, logging, and response gaps.',
],
4:[
 'Executives have a catalog of agent platforms but have not connected proposed investments to measurable enterprise outcomes.',
 'A candidate process has frequent decisions and clear value, but its data quality, delegation boundary, and downside recovery remain uncertain.',
 'A team wants maximum autonomy even though a recommendation with human approval captures the value and limits consequence.',
 'A capability uses proprietary operating data and domain knowledge that creates differentiation, while commodity alternatives cover only generic work.',
 'A pilot produces an impressive demo, but the next investment gate lacks evidence for readiness, delegation, risk, or repeatable value.',
 'Leadership reports model accuracy and user counts but cannot connect the program to outcomes, workflow adoption, operating performance, or economics.',
 'An agent handles both routine reversible updates and high-consequence decisions under one undifferentiated authority rule.',
 'A production agent has permissions and metrics but no named human manager who owns exceptions, continued deployment, or escalation.',
 'Personnel face real uncertainty about role change, yet leaders plan to delay communication and training until the future design is final.',
 'A governance process reviews generated content but does not govern persistent memory, connected tools, action authority, or machine-speed execution.',
 'A low-impact drafting assistant and an autonomous regulated decision system receive the same validation and oversight requirements.',
 'Business owners, governance leaders, data stewards, and technical teams each control part of an agent, but accountability is fragmented.',
 'An agent can access sensitive data whose owner, classification, minimum quality, and lineage have not been established.',
 'The portfolio grows from ten agents to hundreds, while approvals, identities, monitoring, and lifecycle changes remain manual.',
 'Teams track agents in separate spreadsheets and cannot consistently apply identity, policy, authority, observability, or retirement controls.',
 'Finance knows total AI spend but cannot attribute consumption, limits, value, or ROI to an agent or workflow.',
 'In the first month of governance, write-enabled agents exist without a live inventory, named owners, or consequence-based risk tiers.',
 'After three months, leadership still lacks action logs, a tested kill switch, red-team evidence, incident reporting, or value-versus-cost reporting.',
 'A vendor-embedded agent uses a borrowed employee key that cannot be scoped, independently monitored, or revoked without affecting the person.',
 'A leadership team debates value, workforce design, and control separately, producing investments with no coherent path from strategy to scale.',
],
5:[
 'A configured assistant is being extended with approved data access, delegated analysis, bounded actions, orchestration, and a human checkpoint.',
 'Learners run the common triage prompt and want to edit the first output before preserving what the unchanged configuration produced.',
 'Northstar changes a priority threshold, but the Gem still contains an uploaded file with the previous policy facts.',
 'A fluent triage response looks useful, yet the team has not compared its decision or evidence with an authoritative answer.',
 'Case T-03 receives the expected priority, but its owner, evidence, and action boundary still need to be checked against ground truth.',
 'After diagnosing one failure, a learner proposes changing the prompt, source file, and test case before rerunning the assessment.',
 'A team assumes every flaky result is a prompt problem even though retrieval, tools, permissions, orchestration, or source data may have failed.',
 'A parent agent delegates workbook analysis, pauses on one sensitive assumption, receives human input, and asks the specialist to recalculate.',
 'The parent agent asks for human confirmation in conversation, but the platform does not enforce a deterministic approval node.',
 'A regional recommendation is disputed, and the team must identify whether data, calculation, delegation, review, or synthesis caused the error.',
 'A market specialist is proposed even though the role has no distinct data, tools, permissions, evaluation criteria, owner, or operating rhythm.',
 'A design adds four specialists and assumes parallel execution removes the added compute, governance, coordination, and reliability burden.',
 'Before implementation, architects know the proposed handoffs but have not estimated critical-path delay, model calls, dependencies, or operating effort.',
 'A team selects a platform based only on model rankings without deciding where agents will build, run, integrate, govern, and be observed.',
 'A roadmap treats the prompt builder as the whole platform while identity, runtime, policy, evaluation, registry, and observability remain separate.',
 'An agent operates under a persona but still borrows a human credential and has no independent permissions, audit history, or revocation.',
 'Several tools and specialists run independently, but no component coordinates state, order, handoffs, or synthesis toward the larger goal.',
 'A later instruction change appears successful on a new example, but the team never reruns a previously acceptable case.',
 'A proposed specialist only reformats an existing result and could be replaced by a deterministic tool or workflow step.',
 'An architecture review equates a longer prompt and more agents with stronger capability without testing grounding, controls, or coordination cost.',
]};

const EVIDENCE:Record<ModuleId,string[]>={
1:[
 'The course separates fixed routes from delegated next-step choice. A model call alone does not make a workflow agentic.',
 'Grounding requires approved external knowledge. Retrieval supplies current evidence, while memory carries relevant state over time.',
 'The control loop is iterative: perceive the situation, think, act through an allowed capability, then reflect on the result.',
 'The least-sufficient-agency test keeps deterministic work deterministic when rules fully define the route and result.',
 'Task readiness requires a clear goal, known inputs and outputs, bounded actions, testable success, and visible escalation.',
 'Approval must occur before an irreversible consequence. Review after payment or publication cannot restore the lost control.',
 'The specification canvas makes tools, permissions, checkpoints, operating rules, and escalations explicit before architecture begins.',
 'Architecture patterns must answer a named requirement or failure mode and carry a test, owner, and boundary.',
 'Persistent memory creates continuity but also retention, privacy, governance, and stale-state risks that require deliberate limits.',
 'Additional agents are justified by enforced access separation, separation of duties, true parallel work, or valuable specialization.',
 'The specification assigns the goal to a person or organization. Delegation concerns execution within that goal, not goal ownership.',
 'Agency emerges from the complete system of goals, context, tools, permissions, feedback, and stopping rules around the model.',
 'The organization sets the envelope. The agent chooses only among legitimate routes inside the approved boundary.',
 'Verification connects material claims to evidence and defines what low confidence must trigger before action can continue.',
 'Retrieval trades stronger grounding for latency and an indexing, freshness, and maintenance pipeline.',
 'Undefined actions let the system invent its own authority. Permitted and forbidden actions must be settled before deployment.',
 'At a boundary the written rule determines whether the agent waits, recommends, stops, or escalates. It cannot enlarge its own authority.',
 'A separate reviewer has an independent control duty. Agreement between agents is not equivalent to enforced separation of duties.',
 'Leadership must be able to identify who decides, who acts, and what follows when no person is continuously present.',
 'When one bounded agent can complete the task, adding coordination produces cost and failure modes without control benefit.',
],
2:[
 'Once an agent can act, a data error can propagate into an action error. Trustworthiness becomes an execution control.',
 'The data foundation supplies a trusted knowledge layer with architecture, governance, quality, metadata, privacy, automation, and recovery.',
 'Models handle ambiguity and judgment. Deterministic code remains appropriate for exact rules, calculations, thresholds, and validations.',
 'Runtime retrieval should assemble only evidence relevant to the current decision rather than loading the full enterprise corpus.',
 'Memory preserves task state and relevant prior outcomes so a long-running workflow does not restart from zero at each step.',
 'ReAct alternates reasoning, action, observation, and updated reasoning until the system reaches a decision or bounded action.',
 'Tools connect reasoning with external systems. They provide capabilities to retrieve, calculate, update, or act.',
 'Multi-agent designs need coordination and should be used only when specialization or separation benefits outweigh added overhead.',
 'AgenticOps covers the engineering and operating controls needed to keep autonomous workflows safe, reliable, efficient, and observable.',
 'Traces expose what the agent retrieved, which tools it called, what policies applied, and how a result was produced.',
 'Evaluation must test task outcome and execution behavior, including evidence, tool use, boundaries, and recovery.',
 'A policy becomes a guardrail when explicit conditions produce an independently enforced allow, approve, block, or escalation decision.',
 'Safe failure requires detection, bounded retry, approved fallback, containment, and escalation before an error propagates.',
 'Reliability is established across repeated end-to-end runs using success, tool failure, retry, escalation, and recovery measures.',
 'Agent cost includes every model call, reasoning step, tool invocation, memory operation, retrieval, and evaluation.',
 'End-to-end latency compounds across serial inference, retrieval, tools, handoffs, reflection, and retry.',
 'Data quality controls accuracy, completeness, consistency, uniqueness, validity, and timeliness before action proceeds.',
 'Business semantics define terms, relationships, calculations, rules, and domain meaning so agents interpret data consistently.',
 'MCP standardizes how AI applications discover and invoke tools and data. It does not grant business authority by itself.',
 'Every agent change can alter behavior, so lifecycle control requires versioning, validation, staged release, monitoring, and rollback.',
],
3:[
 'Agent-generated code can grow faster than human review and remediation capacity. Assurance controls must scale with machine output.',
 'The lethal trifecta combines private data, untrusted content, and an exfiltration path. Removing or gating one leg breaks the combination.',
 'A hard boundary is deterministic and independent of model choice. A strongly worded prompt remains probabilistic.',
 'Hooks enforce policy at lifecycle events before or after tool use, outside the model reasoning that might ignore the rule.',
 'An agent needs its own scoped identity, least privilege, audit trail, and revocation path rather than a borrowed human credential.',
 'ASI01 covers manipulation of objectives or decision paths through processed content, even when the agent appears on task.',
 'ASI02 covers unsafe or unauthorized use of tools, including dangerous parameters and unintended external effects.',
 'ASI03 covers identity impersonation, excessive privilege, credential abuse, and authorization beyond the intended scope.',
 'ASI04 covers compromised tools, skills, models, dependencies, and other components entering through the agent supply chain.',
 'ASI05 covers generated or executed code and commands that create security or operational risk.',
 'ASI06 covers malicious or false content planted in memory, retrieval stores, embeddings, or shared context that influences later decisions.',
 'ASI07 covers spoofed, tampered, or unauthenticated messages trusted across agents.',
 'ASI08 covers errors that propagate across planning, execution, agents, and downstream systems.',
 'ASI09 covers people approving harm because confident agent output defeats an otherwise present human checkpoint.',
 'ASI10 covers compromised, drifting, or misaligned agents that persist and act outside their mandate while appearing legitimate.',
 'A mitigation remains a claim until adversarial testing exercises the model, implementation, system, and runtime or human layers.',
 'Rogue-agent response starts with containment: revoke credentials, cut egress, stop orchestration, and freeze affected state before recovery.',
 'An effective kill switch controls identity, network, orchestration, tools and memory, and actions already taken in the world.',
 'Risk classification follows authority, autonomy, reversibility, and consequence because those properties determine the required enforcement.',
 'Agent failures often accelerate familiar security weaknesses in identity, access, supply chain, observability, and incident response.',
],
4:[
 'Enterprise AI strategy begins with measurable business outcomes and strategic priorities, not available agents or platform features.',
 'A golden use case combines decision density, measurable impact, process friction, data readiness, bounded delegation, and containable risk.',
 'Least sufficient agency captures the value while avoiding unnecessary autonomy, complexity, control burden, and consequence.',
 'Buy, boost, or build depends on proprietary data, domain knowledge, integration needs, sensitivity, and strategic differentiation.',
 'Portfolio gates use evidence to advance, pause, reshape, or stop investment as value, readiness, delegation, risk, and scale become clearer.',
 'Executive measurement spans business outcomes, workflow adoption, agent performance, and economics. Model quality alone is incomplete.',
 'Decision authority must match consequence, reversibility, and confidence, with immediate takeover outside the defined boundary.',
 'Every production agent needs a defined job, decision rights, least privilege, performance measures, a human manager, and escalation.',
 'No-regrets workforce action combines honest communication, role-based fluency, capability preservation, and reversible operating-model choices.',
 'Agentic governance extends beyond outputs to planning, persistence, connections, identity, permissions, actions, and machine-speed control.',
 'Proportional governance increases assurance, approval, containment, monitoring, and human oversight as impact and autonomy rise.',
 'Layered governance connects senior accountability, process ownership, standards, data governance, and technical guardrails.',
 'Agent-ready data needs ownership, classification and access rules, use-case quality standards, and traceable lineage.',
 'As agent populations grow, governance moves from individual review to portfolio standards and then automated ecosystem controls.',
 'A control plane supplies common identity, registry, access and authority, policy, observability, and lifecycle management.',
 'Financial management attributes variable consumption, limits, cost, utilization, value, and ROI to agents and workflows.',
 'The first 30 days establish visibility: inventory agents, name owners, risk-tier by consequence, and block unregistered write access.',
 'Days 61 through 90 prove control through action logs, observability, kill-switch exercises, red teaming, and board reporting.',
 'Trusted agent identity uses unique, scoped, revocable credentials and least privilege instead of borrowed keys.',
 'Strategy selects value, the operating model assigns work and accountability, and governance enables controlled scale.',
],
5:[
 'The module distinguishes a configured assistant from an agentic workflow through data and tool use, orchestration, bounded action, and human boundaries.',
 'A valid baseline preserves the original prompt, configuration, and output before any refinement so later comparison has a stable reference.',
 'Current policy facts belong in Knowledge. When an uploaded source changes, the stale file must be replaced because it does not auto-sync.',
 'Usefulness and fluency do not prove correctness. A decision and its evidence must be checked against an external authoritative reference.',
 'Lab 2 evaluates priority, authority, action, and evidence. A correct label with unsupported reasoning still fails.',
 'A controlled retest changes one reusable variable, then reruns the same case and prompt in a fresh context.',
 'Prompt improvement is one diagnostic lever among data, retrieval, model, tool, orchestration, permissions, and instructions.',
 'The demo becomes agentic through decomposition, specialist analysis, orchestration, a human checkpoint, recalculation, and bounded synthesis.',
 'The demonstrated checkpoint is conversationally instructed. A production approval boundary needs deterministic enforcement.',
 'Production evaluation must inspect source data, calculations, delegation, tool use, human review, traces, and the final recommendation.',
 'A specialist is justified by a distinct objective, authoritative data, tools, permissions, evaluation, or accountable operating rhythm.',
 'Additional agents add compute, latency, coordination, governance work, and failure surfaces even when some calls run in parallel.',
 'Pre-build estimates cover critical-path hops, model and tool consumption, dependent steps, interfaces, identities, and operating requirements.',
 'Platform choice concerns where agents are built, executed, integrated, governed, evaluated, and observed, not only which model is used.',
 'Agent platforms increasingly combine runtime, identity, policy, evaluation, registry, observability, and interoperable connections.',
 'Agent identity consists of separate credentials, permissions, audit history, and revocation rather than a persona label.',
 'Orchestration coordinates steps, tools, state, agents, and synthesis toward the larger goal.',
 'Regression testing repeats a known case to detect whether a later change broke previously acceptable behavior.',
 'If a deterministic tool or workflow step can perform the responsibility, another agent adds cost without justified specialization.',
 'The durable design message is that agentic systems extend beyond prompts and that additional agents require evidence of net benefit.',
]};
const actionPattern=/^(use|add|place|specify|start|track|measure|assess|require|keep|update|change|test|inspect|choose|coordinate|repeat|estimate|give|translate|bound|prevent|retrieve|retain|classify|support|contain|revoke|screen|advance|decide|match|communicate|govern|increase|combine|move|provide|produce|inventory|build|stop|narrow|name|tie|ask)\b/i;
const distractors=(moduleId:ModuleId,index:number,topic:string,answer:string)=>{
 if(/^ASI\d+/i.test(topic)){const risks=S[moduleId].filter(seed=>/^ASI\d+/i.test(seed[0])&&seed[1]!==answer).map(seed=>seed[1]);return[0,3,6].map(offset=>risks[(index+offset)%risks.length])}
 if(actionPattern.test(answer)){const pool=MISCONCEPTIONS[moduleId];return[0,3,7].map(offset=>pool[(index+offset)%pool.length])}
 const pool=DEFINITION_MISCONCEPTIONS[moduleId];return[0,3,7].map(offset=>pool[(index+offset)%pool.length]);
};

const promptFor=(topic:string,moduleId:ModuleId,index:number)=>{
 if(topic==='why trusted data matters more for agents')return 'Why does trusted data matter more for agents?';
 if(topic==='where strategy begins')return 'Where should an enterprise AI strategy begin?';
 if(topic==='who sets the goal')return 'Who should set an agent’s goal?';
 if(topic==='what creates an agentic workflow')return 'What creates an agentic workflow?';
 if(topic==='reaching an authority boundary')return 'What should happen when an agent reaches an authority boundary?';
 if(topic==='adding an architecture pattern')return 'What should a team define before adding an architecture pattern?';
 if(topic==='choosing agency')return 'How should a team choose the appropriate level of agency?';
 if(topic==='justifying multiple agents')return 'What justifies using multiple agents?';
 if(topic==='closing an LLM knowledge gap')return 'How should a system close an LLM knowledge gap?';
 if(/^ASI\d+/i.test(topic))return 'Which agentic security risk best fits this scenario?';
 if(/^(adding|choosing|justifying|closing)\b/i.test(topic))return `What does the course recommend when ${topic}?`;
 if(/^(a|an|the)\b/i.test(topic))return `Which statement best explains ${topic}?`;
 const actionPrompts:Record<ModuleId,string[]>={1:['Which design decision should the review board require?','What is the most defensible next step?','Which operating rule resolves the issue?','What must be explicit before approval?'],2:['Which architecture decision best addresses the failure?','What should the platform team implement?','Which control produces reliable operating evidence?','What design choice protects the end-to-end workflow?'],3:['Which assurance response should be required?','What control belongs at the enforcement point?','Which response contains the risk at machine speed?','What evidence would satisfy the security review?'],4:['Which portfolio decision aligns value, authority, and risk?','What should the executive team require next?','Which operating-model choice supports controlled scale?','What governance action is proportionate to the consequence?'],5:['Which lab decision preserves a valid evaluation?','What should the learner do at this checkpoint?','Which design choice produces defensible evidence?','What conclusion is supported without exceeding the evidence?']};
 const definitionPrompts:Record<ModuleId,string[]>={1:['Which distinction should guide the design?','Which operating principle is accurate?','Which statement defines the relevant boundary?','Which interpretation should the review accept?'],2:['Which architecture principle is accurate?','Which description matches the component’s role?','Which operating characteristic should be recorded?','Which interpretation fits the end-to-end system?'],3:['Which security finding is technically accurate?','Which description matches the identified exposure?','Which assurance interpretation should be recorded?','Which statement correctly defines the control or risk?'],4:['Which strategic interpretation is accurate?','Which description matches the governance responsibility?','Which principle should guide the portfolio decision?','Which statement reflects the intended operating model?'],5:['Which interpretation is supported by the lab evidence?','Which description matches the demonstrated control?','Which statement correctly distinguishes the concept?','Which conclusion stays within the exercise evidence?']};
 const patterns=actionPattern.test(S[moduleId][index][1])?actionPrompts:definitionPrompts;return patterns[moduleId][index%patterns[moduleId].length];
};
const scenarioFor=(moduleId:ModuleId,index:number)=>SCENARIOS[moduleId][index];
const hintFor=(topic:string,answer:string,locator:string)=>{
 const section=locator.split(',').slice(1).join(',').trim()||locator;
 const lower=answer.toLowerCase();
 const lens=/authority|permission|boundary|scope|credential/.test(lower)?'authority and enforceable limits':/evidence|retriev|data|ground|source|context/.test(lower)?'evidence quality and grounding':/cost|latency|coordination|overhead|consumption/.test(lower)?'operational trade-offs':/human|approval|owner|accountab|decision right/.test(lower)?'decision rights at the point of consequence':/security|identity|kill|contain|revoke|guardrail|policy/.test(lower)?'control placement and containment':/test|evaluat|measure|trace|observ/.test(lower)?'observable evidence rather than appearance':/agent|speciali|multi-agent|workflow/.test(lower)?'whether added agency has a distinct responsibility':'the specific role this concept plays in the system';
 const cue=/^use\b/i.test(answer)?'Test the conditions under which the source recommends this choice.':/^add\b/i.test(answer)?'Identify the missing system capability before selecting an option.':/^place\b/i.test(answer)?'Focus on where the control sits relative to the consequence.':/^specify\b/i.test(answer)?'Look for the option that turns intent into an explicit operating rule.':/^start\b/i.test(answer)?'Find the required starting point before considering implementation.':/^track\b|^measure\b|^assess\b/i.test(answer)?'Choose the option that produces evidence across the full workflow.':/^require\b/i.test(answer)?'Look for the condition the source treats as necessary, not merely helpful.':'Separate this concept from nearby ideas and select the option that directly resolves it.';
 return{context:`The “${section}” material frames ${topic} through ${lens}.`,cue};
};

export const QUESTIONS:Question[]=([1,2,3,4,5] as ModuleId[]).flatMap(moduleId=>S[moduleId].map(([topic,answer,locator],i)=>{
 const correct=(i*3+moduleId)%4;const options=distractors(moduleId,i,topic,answer);options.splice(correct,0,answer);const tip=hintFor(topic,answer,locator);
 return{id:`m${moduleId}-q${String(i+1).padStart(2,'0')}`,moduleId,scenario:scenarioFor(moduleId,i),prompt:promptFor(topic,moduleId,i),options,correct,hint:tip.cue,tipContext:tip.context,rationale:`${EVIDENCE[moduleId][i]} Source: ${locator}.`,sourceRefs:[{sourceId:`module-${moduleId}`,locator,claim:answer}],semanticKey:`m${moduleId}|${i+1}|${topic}`,difficulty:(i<7?1:i<14?2:3) as 1|2|3};
}));

export type RuntimeQuestion=Question&{baseId:string;variant:number};
const hash=(value:string)=>{let h=2166136261;for(const ch of value){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const rotate=<T,>(items:T[],amount:number)=>items.map((_,i)=>items[(i+amount)%items.length]);
export function materializeQuestion(question:Question,nonce=0):RuntimeQuestion{
 const scenarios=[question.scenario,`${question.scenario} The decision is now at a formal approval gate.`,`${question.scenario} The team must document a choice that remains defensible in production.`];
 const variant=(hash(question.id)+nonce)%scenarios.length;const shift=(hash(`${question.id}:${nonce}`)%3)+1;
 const paired=question.options.map((text,i)=>({text,correct:i===question.correct}));const options=rotate(paired,shift);
 return{...question,id:`${question.id}-v${variant}-${nonce%97}`,baseId:question.id,variant,scenario:scenarios[variant],options:options.map(item=>item.text),correct:options.findIndex(item=>item.correct)};
}
export const questionsFor=(moduleId:ModuleId)=>QUESTIONS.filter(q=>q.moduleId===moduleId);
export function selectQuestionSet(moduleId:ModuleId,history:string[]=[],count=10,nonce=Date.now()){
 const pool=questionsFor(moduleId);const recent=new Set(history.slice(-count));const unseen=pool.filter(q=>!recent.has(q.id));const seen=pool.filter(q=>recent.has(q.id));
 const ordered=[...rotate(unseen,hash(`${moduleId}:${nonce}`)%Math.max(1,unseen.length)),...seen];
 return ordered.slice(0,count).map((q,i)=>materializeQuestion(q,nonce+i));
}
