# LEAAID Cohort Pathway — student setup

This package connects an AI client to the hosted LEAAID training engine. Obtain the invitation key from your facilitator and keep it private.

## Agent workflow

1. The **Learning Orchestrator** checks progression and assigns the current assessment.
2. The **Testing Agent** selects and presents one source-grounded, non-repeating question without its answer.
3. The **Validator Agent** compares the submitted option to the authored answer key. Advancement is allowed only when `advance_allowed` is `true`.

Recommended starter instruction:

> You are the LEAAID Cohort Pathway facilitator. Create an anonymous session, launch the requested unlocked module through the learning orchestrator, present one Testing Agent decision at a time, and submit every learner response to the Validator Agent before advancing. Never reveal an answer before submission or bypass a mastery gate.

## OpenAI action-compatible assistant

1. Open the assistant/GPT builder and create an action.
2. Import `https://leaaid-mastery-path.nexus-8198.chatgpt.site/openapi.json`.
3. Choose API-key authentication, custom header `X-LEAAID-Access-Key`, and enter the facilitator-provided key.
4. Paste the starter instruction and test `create_session`, `launch_multi_agent_training`, and `validate_training_response`.

## Claude remote MCP

1. Open Claude **Settings → Connectors → Add custom connector**.
2. Use `https://leaaid-mastery-path.nexus-8198.chatgpt.site/api/mcp`.
3. Supply the invitation key as bearer authentication or the `X-LEAAID-Access-Key` header when the client supports a custom header.
4. Team and Enterprise workspaces may require owner approval before learners can connect.

## Gemini developer workflow

1. Download `https://leaaid-mastery-path.nexus-8198.chatgpt.site/client-kits/gemini-function-tool.json`.
2. Register its function declaration with the Gemini SDK or an enterprise extension.
3. When Gemini emits the function call, POST the arguments to `https://leaaid-mastery-path.nexus-8198.chatgpt.site/api/agent` with `Content-Type: application/json` and the invitation-key header.
4. Return the JSON response to Gemini as the function response. A consumer Gem without external tool execution cannot call this service by itself.

## Slack workspace

1. In Slack app management, choose **Create New App → From an app manifest**.
2. Import `https://leaaid-mastery-path.nexus-8198.chatgpt.site/slack-app-manifest.json` or paste its content.
3. Review the single `commands` scope, create the app, and install it with workspace consent.
4. Give the app's **Signing Secret** to the facilitator, who sets it as `SLACK_SIGNING_SECRET` on the deployment.
5. Use `/leaaid help`, `/leaaid start 1`, `/leaaid answer B`, `/leaaid lab`, `/leaaid choose C`, `/leaaid final`, or `/leaaid status`.

## Data behavior

- No learner name, email, profile, or transcript is requested.
- Browser progress remains on the learner device.
- Agent sessions use an opaque ID and expire after seven days.
- Slack routing identifiers are HMAC-hashed before storage.
- Disconnect or remove the client integration in the destination platform to revoke its access; facilitators can rotate the invitation key.
