# Iteration 120 Notes

Scope: make the homepage AI value card explain the user's outcome instead of the feature label.

Changed:
- Homepage value card now says `Know what to do next`.
- Supporting copy now says `AI turns your notes, photos, dates, and weather into practical suggestions for what to water, check, prune, or watch next.`
- Regression coverage rejects `Get AI advice grounded in your garden`, `Suggestions use your notes, photos, timing, and weather`, and `what is actually happening outside`.

Why:
- `AI advice grounded in your garden` was accurate, but still read like feature marketing.
- The new copy answers the user's felt need faster: they want to know what to do next without remembering every note, photo, and weather pattern themselves.

Verification:
- Focused homepage test passed: `homepage-content.test.ts`, 1 file, 3 tests.
- Full `npm test` passed: 18 files, 86 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Rendered homepage now includes `Know what to do next` and rejects the older AI-advice phrasing.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by route text scans, source checks, and component tests.
