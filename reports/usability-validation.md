# Usability validation

## Completed learner journey

- Five module rounds completed at 10/10.
- Applied Agent Builder completed at 7/7.
- Premier challenge completed at 10/10.
- All seven achievement receipts issued and verified through the public verification API.
- Total scored decisions: 67; total evidence points shown by the learner UI: 120/120.

## Responsive interaction checks

| Surface | Result |
|---|---|
| Desktop guide and setup | No horizontal overflow |
| Desktop assessment HUD | Learner-session metrics only |
| 375 px mobile assessment | No horizontal overflow |
| Mobile HUD trigger | 44 px target |
| Answer selection | Touch, pointer, and keyboard |

## Improvements from observation

- Removed explanatory metaphor copy from the mastery landscape.
- Replaced influence and gap-change abstractions with program, round, remaining, decision, and state data.
- Reduced the orchestration display to three live O/T/R signals with accessible labels.
- Replaced setup prose with a three-step platform path.
- Added an executable Gemini function adapter rather than leaving learners with a declaration alone.
- Kept verification inline at achievement completion while preserving the public receipt link.

## Platform proof

- OpenAI: OpenAPI 3.1 contract parsed; `operateLEAAIDAgent` called the live anonymous gateway.
- Gemini: `operate_leaaid_agent` declaration and executor created a session and returned Module 1, Question 1 with four choices and no answer-key disclosure.
- OpenAI account UI: GPT creation was read-only during browser validation.
- Google AI Studio UI: accessible; function calling required selection of an API key. No credentials were created or selected.
