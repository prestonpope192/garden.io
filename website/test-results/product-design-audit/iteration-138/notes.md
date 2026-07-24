# Iteration 138 - Garden Map Add Drawer

Scope: keep the whole-garden Add drawer focused on first setup instead of mixing setup and note capture.

Changed:
- The whole-garden default guide now uses `Add area` instead of `Add to map`.
- The whole-garden Add drawer now shows only the area form.
- The note form remains available through the floating `Add note` action and on selected areas, beds, and plants.
- Added regression coverage that rejects `Add to map` and confirms the whole-garden Add branch does not include the note form.

Why:
- A new gardener adding their first area should see one job, not a setup form plus a note form.
- `Add to map` sounds like interface work; `Add area` describes the garden object the user is creating.
- This keeps the app's core loop clear: map the garden first, then save what happens where it belongs.

Verification:
- Focused tests passed: `sample-garden.test.ts`, `quick-log-content.test.ts`, and `empty-state-content.test.ts`, 3 files, 19 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Source scan confirms stale drawer copy remains only as negative test assertions.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
