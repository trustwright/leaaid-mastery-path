# LEAAID — start or add to your AI

## Easiest: use it now

Open `https://leaaid-mastery-path.nexus-8198.chatgpt.site/` and choose **Start or continue**. No setup, access code, API key, or profile is required.

## Use it with ChatGPT

1. Open **Plugins → Personal → Created by you**.
2. Install and connect **LEAAID Mastery Path**.
3. Ask **Launch Module 1**.

The Site-created MCP plugin exposes the LEAAID tools privately in ChatGPT. It is not a custom GPT and is not published to the GPT Store.

## Add it to Gemini

This requires **Google AI Studio and an API key**. A standard consumer Gem cannot call the remote training service by itself.

1. Open Google AI Studio. Select an API key and enable **Function calling**.
2. Add `https://leaaid-mastery-path.nexus-8198.chatgpt.site/client-kits/gemini-function-tool.json`.
3. Use `https://leaaid-mastery-path.nexus-8198.chatgpt.site/client-kits/gemini-function-executor.mjs` to run the function. Type **Launch Module 1**.

## Add it to Slack

You need permission to install a Slack app.

1. Open **Your Apps → Create an App → Paste a manifest**, then choose the workspace.
2. Select all of Slack's sample JSON and replace it with the contents of `https://leaaid-mastery-path.nexus-8198.chatgpt.site/slack-app-manifest.json`.
3. Choose **Create and Install**. Approve the single `commands` permission, configure the Slack signing secret in the LEAAID deployment, then type **/leaaid start 1**.

## Claude or another MCP host

Add `https://leaaid-mastery-path.nexus-8198.chatgpt.site/api/mcp` as a custom MCP connector. Approve it, then type **Launch Module 1**.

## Download everything

Download `https://leaaid-mastery-path.nexus-8198.chatgpt.site/leaaid-agent-package.zip`.

## Data behavior

- No learner name, email, profile, or transcript is requested.
- Browser progress remains on the learner device.
- Agent sessions use an opaque ID and expire after seven days.
- Achievement receipts disclose learning evidence, not identity, attempts, timing, or rank.
