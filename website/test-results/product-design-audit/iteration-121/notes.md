# Iteration 121 Notes

Scope: make the AI plant-check save hint explain why saving helps the gardener.

Changed:
- Plant-check save hint now says `Keeps this check with this plant so future suggestions remember it.`
- Regression coverage rejects `Saves this check with the plant's notes and care list`.

Why:
- The old hint described storage mechanics.
- The new hint explains the user value: saving a check helps future suggestions remember what happened to that specific plant.

Verification:
- Focused plant-check content test passed: `diagnose-panel-content.test.ts`, 1 file, 1 test.
- Full `npm test` passed: 18 files, 86 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- The first route-scan command failed because of shell quoting around an apostrophe in the stale-copy list; rerunning the same check through a heredoc passed.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by route text scans, source checks, and component tests.
