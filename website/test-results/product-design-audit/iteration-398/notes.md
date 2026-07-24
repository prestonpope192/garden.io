# Iteration 398 Notes

Scope: keep the Ask/sample garden flow and repo cold-start docs aligned with the simplified garden-notebook product story.

Changed:
- Changed the Garden Check prompt example from `Tomato leaves are yellowing` to `Leaves are yellowing`, so the app does not imply the user has a specific plant.
- Updated the sample Garden Check fallback detail from old demo plants (`French Marigold, Foxglove, and Curry Leaf`) to the current sample plants (`Borage, Bouquet Dill, and Bell Pepper`).
- Renamed remaining test descriptions from `AI-first` to `Garden Check` wording.
- Updated `docs/current-state.md` so the canonical cold-start doc now describes the working Garden Check / My Garden / This Week / Plant Journal / Field Guide app and the passwordless start flow instead of older waitlist, prototype, and private-beta framing.

Evidence:
- Product Design audit/index/user-context guidance, Product Design critical overrides, session-budget guidance, Garden.io memory, and current repo state were used.
- Product Design saved-context preflight found no saved entries, so this pass used current source, docs, tests, and live local route probes.
- Focused tests passed from the website package: `sample-garden.test.ts` and `ai-first-garden-home.test.tsx` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/ask` returned `200` and contains `Leaves are yellowing` and `Heavy rain last night`; it does not contain `Tomato leaves are yellowing`, `French Marigold, Foxglove, and Curry Leaf`, or old sample-specific plant drift.
- Live `/` returned `200` and contains `Your garden, smarter.` and `plant-art%2Fapple.jpg`; it does not contain `Waitlist`, `early access`, or `Working product`.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
