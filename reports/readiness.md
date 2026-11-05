# Release readiness

## Passed gates

- Production build: passed
- Source-grounded content QA: 100 questions, 20 per module, all with page or slide locators
- Rotation QA: two sequential 10-question rounds per module with zero repeated base questions
- Cue-bias QA: the correct answer is the longest option in 14% of items
- Tip QA: question-specific source context and recovery cue checked across all 100 items
- Applied lab QA: seven ordered build decisions, varied correct-choice positions, explicit recovery branches, and baseline/refinement/operation milestones
- Agent workflow QA: learning orchestrator delegates to a testing agent; a separate deterministic validator blocks advancement until the authored key confirms the response
- Client-kit QA: OpenAI/OpenAPI, Claude/MCP, Gemini function declarations, and Slack manifest are present without embedded credentials
- Operating harness QA: allowlisted actions, typed inputs, source authority, non-disclosure, deterministic progression, role prohibitions, seven-day expiry, and fail-closed behavior are declared and enforced at the REST/MCP boundary
- Linguistic QA: every item now includes a distinct enterprise scenario; action and definition distractors use module-specific misconception models rather than answer-length matching
- Mastery QA: 100% comprehension remains required before sequential unlock
- Scale simulation: 10,000 isolated learner sessions, 1,000,000 generated decisions, zero repeat violations
- HTTP production-preview load: 500 sessions, 25 concurrent, 500 accepted, 0 rejected; p95 748 ms on the local preview host
- Session minimization: browser progress remains device-local; agent sessions use an opaque identifier, curriculum state, and seven-day expiry without names, emails, profiles, or transcript storage
- Achievement verification: agent-path mastery issues a durable random receipt code and public evidence link without storing identity, attempts, response time, or rank
- Ethical validation: outcome logic excludes identity, demographics, response time, attempt count, writing style, and model-inferred ability; recovery is unlimited and unpenalized
- Adoption inventory: SPDX software SBOM plus operating and learning-context SBOMs are published with the harness

## Experience coverage

- Desktop and mobile responsive layouts
- Achievement verification checked at large-display and 390 px mobile viewports with no horizontal overflow and 54 px form targets
- Light and dark themes
- Minimum 44 px primary interactive targets, touch-action optimization, sticky mobile submission action
- Keyboard answer selection with keys 1–4 and Enter-to-advance
- Per-question module, round, position, timer, and three-level difficulty signals
- Study Coach produces a goal-based orient → reason → check chain and launches unlocked rounds
- REST/OpenAPI, remote MCP, and Slack command surfaces operate the same question bank and sequential mastery rules
- Consent-based connection suite generates copy-ready client configuration in-browser without storing the invitation key
- M5 uses two gates: a 10-question Applied Concepts knowledge round, then a Northstar agent-build simulation grounded in the Lab 1, Lab 2, and Regional Expansion materials

## Operational notes

- Browser learners do not share progress. Agent clients receive isolated, expiring server sessions so a challenge can continue across calls.
- The agent gateway is public-addressable but requires a privately shared invitation key; Slack uses request-signature verification.
- Study Coach is a deterministic source-grounded reasoning chain, not a simulated free-form chatbot.
- Consumer AI products vary: OpenAPI action clients and remote-MCP clients can call the agent directly; Gemini requires a function-calling or extension-capable environment, because a plain consumer Gem cannot independently call arbitrary remote tools.
- Browser-only markers remain device-local. Agent-path receipts verify completion within this harness, but do not verify identity, licensure, employment suitability, or independent professional certification.
