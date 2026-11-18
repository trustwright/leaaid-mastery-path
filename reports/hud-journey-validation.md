# HUD and learner-journey validation

## Data contract

- The header and in-question HUD call the same `deriveMasteryHud` function.
- Each M1–M5 point is positioned from that module's integer mastery percentage.
- Overall mastery is the mean of the five displayed module scores.
- Correct, left, decision, time, verified, and recovery values come from the active learner session.
- A verified answer may move the current module downward toward 100%; a recovery result cannot increase mastery.

## Human-agent flow

| Interaction | Orchestrator | Testing agent | Learner | Validator |
|---|---|---|---|---|
| Question ready | Complete | Complete | Active | Standby |
| Response submitted, correct | Complete | Complete | Complete | Verified |
| Response submitted, incorrect | Complete | Complete | Complete | Recovery |

The expanded HUD exposes these states as O/T/L/V. Its trigger uses `aria-expanded` and an explicit toggle, so the visual state and accessible state remain aligned.

## Automated results

- 55 module HUD states checked: 0 through 10 correct decisions for M1–M5.
- Mastery range checked: 0% through 100%.
- Five module badges, one Applied Agent Builder badge, and one Premier Knowledge badge achieved.
- Live journey: 50 module decisions + 7 lab decisions + 10 final decisions.
- Seven public achievement receipts verified.
- Scale run: 10,000 isolated sessions, 1,000,000 decisions, zero repeat violations.

Commands:

```text
npm run qa:hud
npm run qa:live-achievements
npm run qa:connectors
npm run qa:scale
```

## Gemini boundary

The Gemini function declaration and executor passed the live adapter test: they created an anonymous session and returned Module 1, Question 1 without an answer key. This proves the LEAAID tool adapter. A separate Google-model execution still requires Google AI Studio with a selected private API key; no key is stored in this repository.
