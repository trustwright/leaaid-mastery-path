# Release readiness

## Passed gates

- Production build: passed
- Source-grounded content QA: 100 questions, 20 per module, all with page or slide locators
- Rotation QA: two sequential 10-question rounds per module with zero repeated base questions
- Cue-bias QA: the correct answer is the longest option in 23% of items
- Tip QA: question-specific source context and recovery cue checked across all 100 items
- Mastery QA: 100% comprehension remains required before sequential unlock
- Scale simulation: 10,000 isolated learner sessions, 1,000,000 generated decisions, zero repeat violations
- HTTP production-preview load: 500 sessions, 25 concurrent, 500 accepted, 0 rejected; p95 748 ms on the local preview host
- Session minimization: browser progress remains device-local; agent sessions use an opaque identifier, curriculum state, and seven-day expiry without names, emails, profiles, or transcript storage

## Experience coverage

- Desktop and mobile responsive layouts
- Light and dark themes
- Minimum 44 px primary interactive targets, touch-action optimization, sticky mobile submission action
- Keyboard answer selection with keys 1–4 and Enter-to-advance
- Per-question module, round, position, timer, and three-level difficulty signals
- Study Coach produces a goal-based orient → reason → check chain and launches unlocked rounds
- REST/OpenAPI, remote MCP, and Slack command surfaces operate the same question bank and sequential mastery rules

## Operational notes

- Browser learners do not share progress. Agent clients receive isolated, expiring server sessions so a challenge can continue across calls.
- The agent gateway is public-addressable but requires a privately shared invitation key; Slack uses request-signature verification.
- Study Coach is a deterministic source-grounded reasoning chain, not a simulated free-form chatbot.
- Consumer AI products vary: OpenAPI action clients and remote-MCP clients can call the agent directly; Gemini requires a function-calling or extension-capable environment, because a plain consumer Gem cannot independently call arbitrary remote tools.
- Achievement badges are in-product learning markers, not independently verified credentials.
