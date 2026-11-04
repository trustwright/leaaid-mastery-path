# LEAAID Mastery Path

Interactive, source-grounded training based exclusively on the five LEAAID foundation modules supplied with this project.

## Learning model

- Five sequential rounds with 10 scored questions each
- 45-second timer, tips, immediate rationale, and page/slide evidence
- Focused recovery until every round reaches 100% mastery
- Five module badges plus a 10-question cross-module final challenge
- Premier LEAAID Knowledge as an in-product achievement
- Local browser recovery with no account, personal data, or telemetry

## Run

```bash
npm install
npm run qa
npm run build
npm run dev
```

Question content lives in `lib/questions.ts`; `npm run content:export` refreshes `content/questions.json`. The badges are learning achievements, not independently verified credentials or certification claims.
