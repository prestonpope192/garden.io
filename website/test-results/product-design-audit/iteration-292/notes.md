# Iteration 292 - Replace Record Language With History

Scope: remove visible "record" wording that made the app feel database-like instead of journal-like.

Changed:
- Homepage metadata changed from "plant records" to "plant history."
- Homepage hero note changed from "record bloom timing" to "save bloom timing."
- Homepage Bay leaf card changed from "one useful record" to "winter care together."
- My Garden drawer CTA changed from "Open plant record" to "Open plant history."
- My Plants drawer label changed from "Plant records" to "Plant history."
- My Plants drawer sentence now renders as a single clean sentence without the "3 beds ." spacing artifact.
- Empty app Plant Guide copy changed from "No plant records are ready yet" to "No plants are ready yet."
- My Plants list header changed from "Next step" to "Care note."
- My Plants empty hint changed from "see its next step" to "see what needs care."

Evidence:
- Product Design user-context preflight ran; no saved visual/product references were available.
- Focused tests passed: `homepage-content.test.ts`, `sample-garden.test.ts`, `catalogue-format.test.ts`, `ai-first-garden-home.test.tsx`, and `empty-state-content.test.ts` - 5 files, 42 tests.
- Additional focused tests passed after the punctuation cleanup: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed: 23 files, 128 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Preview restarted at `http://127.0.0.1:3021`.
- Rendered homepage contains "save bloom timing" and "winter care together."
- Rendered sample My Garden route contains "Open plant history" and no matched "Open plant record."
- Rendered sample My Plants route contains "Plant history" and clean "4 saved plants in 3 beds. Plants with care this week..."

Remaining target:
- Separate "next step" language still exists in calendar/timeline paths and one sample diagnosis detail. That should be the next cleanup pass.

Limit:
- Browser screenshot capture was not used. The available Product Design Browser/Chrome tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
