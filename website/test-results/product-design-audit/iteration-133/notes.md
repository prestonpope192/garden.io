# Iteration 133 Notes

Scope: remove one remaining product-centered homepage sentence from the first-scroll explanation.

Changed:
- Replaced `Add quick notes as you go. Garden.io turns them into a clear garden history and better next steps.`
- New copy: `Quick notes become a clear garden history and better next steps.`
- Regression coverage now rejects `Garden.io turns` on the homepage.

Why:
- The line sits high on the homepage, where a prospective user is deciding whether the app solves their problem.
- `Garden.io turns...` explains product mechanics.
- `Quick notes become...` keeps the promise centered on the gardener's felt need: record small observations and get a useful memory of the season.

Verification:
- Focused homepage copy test passed: `homepage-content.test.ts`, 1 file, 3 tests.
- Full `npm test` passed: 18 files, 87 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Source scan confirms `Garden.io turns` remains only as a negative assertion.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
