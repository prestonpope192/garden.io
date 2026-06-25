# Iteration 115 Notes

Scope: make sample calendar care labels more user-facing.

Changed:
- Calendar task classification now treats trim, deadhead, pinch, and compost tasks as plant care.
- Calendar task type labels now use `Care` for maintenance and fallback tasks instead of `Maintenance` or `Other`.
- Regression tests now require the sample `Trim spent sage blooms` card to render as `Care` and reject the old generic labels.

Why:
- A prospective gardener should see the task as ordinary care, not as a catch-all bucket.
- The sample garden is part of the sales and preview experience, so unclear labels make the app feel more mechanical than useful.

Verification:
- Focused tests passed: `sample-garden.test.ts` and `empty-state-content.test.ts`, 2 files, 17 tests.
- Full `npm test` passed: 18 files, 86 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Rendered `/sample-garden/calendar` text includes `Trim spent sage blooms ... Care` and does not include `Maintenance` or `Other`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by route text scans and component tests.
