# LEAAID Mastery Path

Interactive, source-grounded training based exclusively on the five LEAAID foundation modules supplied with this project.

## Learning model

- Five sequential rounds with 10 scored questions each
- 45-second timer, tips, immediate rationale, and page/slide evidence
- Focused recovery until every round reaches 100% mastery
- Five module badges plus a 10-question cross-module final challenge
- M5 Applied Concepts knowledge validation followed by a seven-decision Applied Agent Builder simulation
- Premier LEAAID Knowledge as an in-product achievement
- Local browser recovery plus anonymous, seven-day agent sessions with no learner profile
- Two complete non-repeating 10-question rotations per module before recycling
- Balanced, parallel answer choices and three runtime stem variants
- Source-grounded three-step Study Coach for topic inquiry and module launching
- Light/dark modes, large touch targets, number-key selection, and responsive layouts
- Invitation-controlled REST/OpenAPI and remote MCP agent surfaces
- Signature-verified Slack slash-command adapter with ephemeral responses
- Visible learning-orchestrator → testing-agent → deterministic-validator workflow
- Copy-ready OpenAI, Claude, Gemini, and Slack setup packages with explicit user/admin consent
- Portable operating harness manifest and runnable connector with allowlisted inputs, role boundaries, deterministic validation, and fail-closed controls
- Scenario-led assessment items with module-specific misconception distractors instead of unrelated answer borrowing

## Agent launch surfaces

- OpenAPI: `https://leaaid-mastery-path.nexus-8198.chatgpt.site/openapi.json`
- Remote MCP: `https://leaaid-mastery-path.nexus-8198.chatgpt.site/api/mcp`
- REST: `https://leaaid-mastery-path.nexus-8198.chatgpt.site/api/agent`
- Slack command request URL: `https://leaaid-mastery-path.nexus-8198.chatgpt.site/api/slack`
- Cohort agent package: `https://leaaid-mastery-path.nexus-8198.chatgpt.site/leaaid-cohort-pathway-agent.json`
- Slack app manifest: `https://leaaid-mastery-path.nexus-8198.chatgpt.site/slack-app-manifest.json`

Set `LEAAID_AGENT_ACCESS_KEY` for invited GPT, Claude, or Gemini-compatible clients. Set `SLACK_SIGNING_SECRET` for the Slack adapter. The REST and MCP surfaces fail closed when the invitation key is missing. The Slack route validates the Slack request signature and stores only an HMAC-derived channel mapping.

## Run

```bash
npm install
npm run qa
npm run qa:scale
npm run build
npm run dev
```

Question content lives in `lib/questions.ts`; `npm run content:export` refreshes `content/questions.json`. The badges are learning achievements, not independently verified credentials or certification claims.

See `reports/readiness.md` for the latest release gates and performance evidence.
