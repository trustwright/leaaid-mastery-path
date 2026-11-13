# LEAAID Codespaces workshop

Use the repository's **Open in GitHub Codespaces** button to create an isolated workshop environment with Node.js 22, dependencies, and the source-grounding QA checks prepared automatically.

## Start the visual guide

```bash
npm run dev
```

Open the forwarded **LEAAID Mastery Path** port, then select **Setup guide**. The guide provides:

- visual OpenAI, Gemini, Claude, and Slack setup sequences;
- a live harness proof using an anonymous session;
- the five learning modules and their objectives;
- module, applied-lab, and Premier achievement criteria;
- links to the portable package, public contracts, and verifier.

## Prove the model-independent harness

```bash
unzip public/leaaid-agent-package.zip -d /tmp/leaaid-agent
cd /tmp/leaaid-agent
node harness-runner.mjs create_session
```

Copy the returned session ID and launch the first round:

```bash
node harness-runner.mjs launch_multi_agent_training '{"session_id":"<SESSION_ID>","module_id":1}'
```

The AI platform is the conversational host. The hosted harness owns the authored curriculum, sequence, validation, recovery, and achievement evidence.

## Quality and build

```bash
npm run lint
npm run qa
npm run qa:scale
npm run build
```

No learner name, email, profile, or demographic attribute is required. Agent sessions are anonymous and expire after seven days.
