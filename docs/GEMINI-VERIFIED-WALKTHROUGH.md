# Gemini verified walkthrough

Validated in Google AI Studio with Gemini 3.8 Flash on November 20, 2026.

## What was proven

1. Gemini emitted `operate_leaaid_agent` with `create_session`.
2. The executor posted that request to the live LEAAID endpoint.
3. Gemini emitted `launch_multi_agent_training` for Module 1.
4. The harness returned Question 1 without an answer key.
5. Gemini mapped learner choice C to zero-based `option_index: 2` and emitted `validate_training_response`.
6. The deterministic validator returned `correct: true`, the Module 1 source cue, and progress `1/10`.
7. A later `get_session` call resumed at Module 1, Question 2 with the same `1/10` progress.

## Setup

1. Open [Google AI Studio](https://aistudio.google.com/prompts/new_chat?model=gemini-3.8-flash) and select Gemini 3.8 Flash.
2. In Run settings, turn off Google Search grounding and turn on Function calling.
3. Open **Edit function declarations**, choose **Code Editor**, and paste the `function_declarations` array from `public/client-kits/gemini-function-tool.json`.
4. Open **System instructions** and paste `public/client-kits/leaaid-system-instructions.txt`.
5. Enter `Launch Module 1.`

## Executor loop

AI Studio displays a function request but does not call the LEAAID HTTP endpoint by itself. For each request:

1. Pass the displayed arguments to `operate_leaaid_agent` from `public/client-kits/gemini-function-executor.mjs`.
2. Paste the returned JSON into **Enter a function response**.
3. Select **Send**.

For a deployed Gemini application, host this same executor loop so it happens automatically.

## Important boundaries

- A consumer Gemini Gem cannot execute an arbitrary external HTTP function by itself.
- AI Studio temporary chats do not persist the function declaration. Paste it again in a new temporary chat.
- Google Drive access is not required for a temporary proof run.
- A paid API key is not required for the manual AI Studio proof. Automated deployments may require a project key and billing according to the selected Gemini model and account.
- The host model does not grade. The LEAAID harness performs exact authored-key validation and controls progression.
