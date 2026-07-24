# Iteration 122 Notes

Scope: make the Calendar empty state feel less like tracking software.

Changed:
- Empty Calendar copy for a garden with no plants now says `Add one plant first. Then watering, pruning, harvests, and plant checks have a place to go.`
- Regression coverage rejects `Then you can track watering`.

Why:
- The old copy framed the value as tracking.
- The new copy frames the value as a simple place for real garden care to live after the user adds one plant.

Verification:
- Focused empty-state test passed: `empty-state-content.test.ts`, 1 file, 7 tests.
- Full `npm test` passed: 18 files, 86 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by route text scans, source checks, and component tests.
