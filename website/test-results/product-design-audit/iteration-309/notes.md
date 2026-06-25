# Iteration 309 - Ask flow notebook wording

Scope: simplify the Ask entry and explanation copy so it feels like asking from a garden notebook, not an AI product explanation.

Finding:
- A bounded explorer scan flagged the Ask lead as the highest-impact remaining copy issue.
- The lead said `Get help with the plants, beds, weather, and history already saved`, which was clear but still sounded broad and product-like.
- The explanation panel said `Why this answer` and `Show the garden context behind this answer`, which exposed answer mechanics instead of the gardener-facing evidence.

Changed:
- Changed the Ask lead to `Add a note or photo. Ask from the plants, beds, weather, and notes you already saved.`
- Changed the answer explanation label from `Why this answer` to `What I used`.
- Changed the explanation helper text to `Show the notes, season, and garden details behind this.`
- Updated Ask and sample-garden tests to guard the new copy and reject the old phrases.

Orchestration:
- Used `$orchestratror-mode` with one read-only explorer agent.
- The explorer returned ranked candidates with file/line evidence and made no edits.
- The main thread reviewed the findings, chose the Ask-flow slice, performed the edit, and reran verification.

Evidence:
- Product Design audit, Product Design index, user-context preflight, critical overrides, and design-audit framework were read during this pass.
- Product Design saved context preflight returned no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused Ask tests passed: `ai-first-garden-home.test.tsx` and `sample-garden.test.ts` - 2 files, 18 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed with Next.js production build.
- Standalone preview restarted at `http://127.0.0.1:3021`.
- Live `/sample-garden/ask` contains `Your garden, smarter`, the new Ask lead, `Garden notes`, `This week`, and `Field guide`.
- Live `/sample-garden/property` still contains `Garden notebook`.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
- The live empty Ask route does not expose the answer explanation panel until an answer exists, so `What I used` is verified through source and rendered tests.
