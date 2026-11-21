# LEAAID portable learning agent

This folder defines the platform-neutral handoff for operating the LEAAID learning harness from an AI assistant, an enterprise agent runtime, or a team channel. The repository build script combines these instructions with the public contracts into one downloadable archive.

## What the downloadable package contains

- `SYSTEM_INSTRUCTIONS.md` — the instruction contract for the host agent.
- `SKILL.md` — a portable agent-skill operating contract.
- `LEAAID-COHORT-PATHWAY-SETUP.md` — plain-language setup for learners and administrators.
- `leaaid-cohort-pathway-agent.json` — discovery, endpoints, session model, and starter instruction.
- `leaaid-operating-harness.json` — roles, guardrails, mastery rules, ethics controls, and interoperability target.
- `openapi.json` — importable REST action contract for GPT and OpenAPI-capable platforms.
- `gemini-function-tool.json` — Gemini function declaration and execution endpoint.
- `slack-app-manifest.json` — minimal Slack slash-command app definition.
- `harness-runner.mjs` — dependency-free Node.js runner for the REST harness.

The downloadable archive is published at:

`https://leaaid-mastery-path.nexus-8198.chatgpt.site/leaaid-agent-package.zip`

## Fastest proof

```bash
node harness-runner.mjs create_session
```

Copy the returned `session_id`, then run:

```bash
node harness-runner.mjs launch_multi_agent_training '{"session_id":"<SESSION_ID>","module_id":1}'
```

This invokes the same learning orchestrator, teaching/testing role, deterministic reviewing role, sequential mastery gate, and authored question bank used by the visual experience.

## Platform installation

### ChatGPT

Install the Site-created LEAAID MCP plugin under **Plugins → Personal → Created by you**, approve its tools, and ask `Launch Module 1.` The plugin is private and is not a custom GPT or GPT Store listing.

OpenAPI-capable enterprise hosts can still import `openapi.json` and apply `SYSTEM_INSTRUCTIONS.md`.

### Gemini

Register the declaration in `gemini-function-tool.json` in Google AI Studio or a function-enabled Gemini application. When Gemini emits `operate_leaaid_agent`, POST its arguments as JSON to the package endpoint and return the JSON response to Gemini. Consumer Gems do not execute arbitrary external functions without an enabled tool runtime.

The verified AI Studio sequence is documented in `docs/GEMINI-VERIFIED-WALKTHROUGH.md`. Temporary AI Studio chats do not retain the function declaration, so paste it again for each new temporary chat. The manual proof does not require Google Drive access or paid billing; an automated deployment may require an API key and billing for the selected Gemini model.

### Slack

Create an app from `slack-app-manifest.json`, install the single `commands` scope, and configure the hosted deployment with Slack's signing secret. Run `/leaaid start 1` in the installed workspace.

The ChatGPT MCP plugin, Gemini function executor, and Slack slash command are clients of the same hosted harness. None of them score independently.

### Any other agent runtime

Use the REST endpoint in `leaaid-cohort-pathway-agent.json`, allow only the actions enumerated in the harness manifest, retain the opaque `session_id` for the conversation, and render one returned decision at a time.

## Trust boundary

The host model does not grade the learner. It routes structured actions. Scoring is deterministic against authored keys inside the harness. No name, email, profile, demographic attribute, response time, writing style, or inferred ability is used to determine mastery.
