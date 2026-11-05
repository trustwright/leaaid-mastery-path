# LEAAID Cohort Pathway — connection guide

The hosted LEAAID learning harness creates anonymous seven-day sessions. Learners do not need an account, facilitator code, API key, or profile.

## Start immediately

Open `https://leaaid-mastery-path.nexus-8198.chatgpt.site/` to run the complete visual learning experience without connecting another service.

## ChatGPT

1. Open the GPT builder and select **Configure**.
2. Under Actions, select **Create new action** and **Import from URL**.
3. Paste `https://leaaid-mastery-path.nexus-8198.chatgpt.site/openapi.json`.
4. Keep authentication set to **None**.
5. Ask the GPT to create a session and launch Module 1.

## Claude

1. Open **Settings → Connectors → Add custom connector**.
2. Paste `https://leaaid-mastery-path.nexus-8198.chatgpt.site/api/mcp`.
3. Confirm the connector. Team or Enterprise workspaces may require owner approval under their own policies.
4. Say “Launch Module 1.”

## Gemini

1. Use Google AI Studio or a function-enabled enterprise workflow.
2. Copy the function declaration from `https://leaaid-mastery-path.nexus-8198.chatgpt.site/client-kits/gemini-function-tool.json`.
3. Register it as a function and send function arguments to `https://leaaid-mastery-path.nexus-8198.chatgpt.site/api/agent`.

A consumer Gem cannot call arbitrary external tools by itself. The gateway does not imply otherwise.

## Slack workspace installation

Slack requires a workspace owner to install and approve apps.

1. Choose **Create New App → From an app manifest**.
2. Paste the content of `https://leaaid-mastery-path.nexus-8198.chatgpt.site/slack-app-manifest.json`.
3. Review the single `commands` scope and install the app.
4. A deployment administrator must configure the Slack signing secret before `/leaaid` commands can operate.

## Agent workflow

1. The **Learning Orchestrator** checks progression and assigns the current assessment.
2. The **Testing Agent** presents one source-grounded, non-repeating question without its answer.
3. The **Validator Agent** compares the submitted option to the authored answer key.
4. The **Achievement Register** issues a pseudonymous verification link only after mastery.

Validation never uses identity, demographics, response time, attempts, writing style, or inferred ability. Recovery is unlimited and carries no award penalty.

## Data behavior

- No learner name, email, profile, or transcript is requested.
- Browser progress remains on the learner device.
- Agent sessions use an opaque ID and expire after seven days.
- Achievement receipts disclose learning evidence, not identity, attempts, timing, or rank.
