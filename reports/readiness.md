# Release readiness

## Passed gates

- Production build: passed
- Source-grounded content QA: 100 questions, 20 per module, all with page or slide locators
- Rotation QA: two sequential 10-question rounds per module with zero repeated base questions
- Cue-bias QA: the correct answer is the longest option in 23% of items
- Mastery QA: 100% comprehension remains required before sequential unlock
- Scale simulation: 10,000 isolated learner sessions, 1,000,000 generated decisions, zero repeat violations
- HTTP production-preview load: 500 sessions, 25 concurrent, 500 accepted, 0 rejected; p95 748 ms on the local preview host
- Privacy: progress and question history remain device-local; the curriculum guide uses local retrieval and sends no learner text to an external model

## Experience coverage

- Desktop and mobile responsive layouts
- Light and dark themes
- Minimum 44 px primary interactive targets, touch-action optimization, sticky mobile submission action
- Keyboard answer selection with keys 1–4 and Enter-to-advance
- Per-question module, round, position, timer, and three-level difficulty signals
- Ask LEAAID drawer can retrieve module-grounded explanations and launch unlocked rounds

## Operational notes

- Hosting is stateless for learner activity; concurrent learners do not share progress state.
- Progress does not sync between browsers or devices by design.
- Ask LEAAID is a deterministic source-retrieval guide, not a free-form generative advisor.
- Achievement badges are in-product learning markers, not independently verified credentials.
