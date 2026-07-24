# Iteration 136 - Plant Check Copy

Scope: make the AI plant-check panel feel like practical garden help instead of a technical diagnosis feature.

Changed:
- The plant-check save hint now says `Keeps this with the plant so you remember what you tried.`
- The photo label now matches the rest of the app: `Add a photo (optional)`.
- The selected-photo alt text now says `Photo you added for this plant check`.
- Loading text now says `Checking this plant...` / `Checking {plant name}...` instead of focusing on internal record-reading.

Why:
- A gardener's concern is not whether future AI suggestions can use a saved check.
- The meaningful value is remembering what they saw, what they tried, and whether it worked later.
- Keeping the plant-check language close to the note-capture language reinforces the simple loop: notice, save, try, learn.

Verification:
- Focused tests passed: `diagnose-panel-content.test.ts`, `diagnose-route-copy.test.ts`, and `quick-log-content.test.ts`, 3 files, 4 tests.
- Full `npm test` passed: 18 files, 88 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Source scan confirms stale plant-check copy remains only as negative test assertions.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
