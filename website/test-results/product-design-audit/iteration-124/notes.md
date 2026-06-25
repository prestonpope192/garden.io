# Iteration 124 Notes

Scope: make the public Plant Guide's highlighted card feel like a recommendation, not a content slot.

Changed:
- Public Plant Guide highlight label now says `Good place to start` instead of `Featured plant`.
- Regression coverage rejects `Featured plant` in the public catalogue browser.

Why:
- `Featured plant` describes the site's content slot.
- `Good place to start` tells a gardener why the card is useful.

Verification:
- Focused public catalogue content test passed: `public-catalogue-content.test.ts`, 1 file, 4 tests.
- Full `npm test` passed: 18 files, 87 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- The first route-scan attempt incorrectly required `Good place to start` on plant detail pages; that was a verifier scope issue because the highlight card only appears on `/catalog`. The corrected scan passed.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by route text scans, source checks, and component tests.
