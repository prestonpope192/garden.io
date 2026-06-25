# Iteration 119 Notes

Scope: make the sample Calendar next-step suggestion feel practical.

Changed:
- The garden layout suggestion now says `Add one more bed when you need room`.
- Its rationale now says `If this area starts to feel crowded, one clear bed gives future plants a place to go.`
- The saved task title is now `Plan one more bed`.
- Regression coverage rejects `Lay out more beds`, `productive space`, `room to expand`, and `Plan another bed`.

Why:
- The old copy sounded abstract and product-strategy-ish.
- The new copy speaks to a gardener's felt need: not enough room, crowded plants, and needing one clear next step.

Verification:
- Focused tests passed: `garden-suggestions-history.test.ts` and `sample-garden.test.ts`, 2 files, 18 tests.
- Full `npm test` passed: 18 files, 86 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Rendered `/sample-garden/calendar` now includes `Add one more bed when you need room` and rejects the old abstract phrasing.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by route text scans, source checks, and component tests.
