# Iteration 118 Notes

Scope: simplify Calendar filter assistive copy.

Changed:
- Expanded Calendar filter toggle now says `Hide care choices` instead of `Hide choices`.
- Calendar filter selects now use `Choose area`, `Choose bed`, and `Choose plant` instead of `Filter by area`, `Filter by bed`, and `Filter by plant`.
- Regression coverage now checks the hidden Calendar filter source because those controls only render after expansion.

Why:
- The Calendar is a care-planning surface; labels should help users choose the garden scope they want to see, not describe filtering mechanics.
- Assistive labels should match the visible plain-language model already used in the app.

Verification:
- Focused tests passed: `empty-state-content.test.ts` and `sample-garden.test.ts`, 2 files, 17 tests.
- Full `npm test` passed: 18 files, 86 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Component source scan confirms `Hide care choices`, `aria-label="Choose area"`, `aria-label="Choose bed"`, and `aria-label="Choose plant"`; it rejects `Hide choices`, `aria-label="Filter by area"`, `aria-label="Filter by bed"`, and `aria-label="Filter by plant"`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by route text scans, source checks, and component tests.
