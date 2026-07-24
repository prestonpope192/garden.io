# Iteration 125 Notes

Scope: make sample-garden save feedback explain the user value instead of state mechanics.

Changed:
- Sample save feedback now says `Start your garden to keep your own notes.`
- Regression coverage rejects `save changes` for the sample save notice.

Why:
- `Start your garden to save changes` made the sample feel like an editor with unsaved state.
- `Start your garden to keep your own notes` is clearer about the gardener's reason to sign in: preserving their own observations and care history.

Verification:
- Focused sample-garden test passed: `sample-garden.test.ts`, 1 file, 10 tests.
- Full `npm test` passed: 18 files, 87 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Source/test check confirms `Start your garden to keep your own notes.` and rejects `save changes`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by route text scans, source checks, and component tests.
