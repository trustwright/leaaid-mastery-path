# LEAAID — start or add to your AI

## Easiest: use it now

Open `https://leaaid-mastery-path.nexus-8198.chatgpt.site/` and choose **Start or continue**. No setup, access code, API key, or profile is required.

## Add it to ChatGPT

You need access to create a GPT.

1. Open the GPT builder. Choose **Configure → Actions → Import from URL**.
2. Paste `https://leaaid-mastery-path.nexus-8198.chatgpt.site/openapi.json`. Authentication is **None**.
3. Save. Type **Launch Module 1**.

## Add it to Gemini

This requires **Google AI Studio and an API key**. A standard consumer Gem cannot call the remote training service by itself.

1. Open Google AI Studio. Select an API key and enable **Function calling**.
2. Add `https://leaaid-mastery-path.nexus-8198.chatgpt.site/client-kits/gemini-function-tool.json`.
3. Use `https://leaaid-mastery-path.nexus-8198.chatgpt.site/client-kits/gemini-function-executor.mjs` to run the function. Type **Launch Module 1**.

## Add it to Slack

You need permission to install a Slack app.

1. Choose **Create New App → From an app manifest**.
2. Paste `https://leaaid-mastery-path.nexus-8198.chatgpt.site/slack-app-manifest.json` and install it.
3. Configure the Slack signing secret. Type **/leaaid start**.

## Claude or another MCP host

Add `https://leaaid-mastery-path.nexus-8198.chatgpt.site/api/mcp` as a custom MCP connector. Approve it, then type **Launch Module 1**.

## Download everything

Download `https://leaaid-mastery-path.nexus-8198.chatgpt.site/leaaid-agent-package.zip`.

## Data behavior

- No learner name, email, profile, or transcript is requested.
- Browser progress remains on the learner device.
- Agent sessions use an opaque ID and expire after seven days.
- Achievement receipts disclose learning evidence, not identity, attempts, timing, or rank.
