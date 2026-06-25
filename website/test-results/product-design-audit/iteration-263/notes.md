# Product Design Audit - Iteration 263

Date: 2026-06-23

Task class: build work

Current-state finding:
- The sample Ask screen was centered on the right promise, `Your garden, smarter`, but still opened with three abstract utility controls: `Memory`, `Care`, and `Guide`.
- Those labels exposed internal app modules before the user had asked a question, making the first screen feel more like a product shell than a simple garden helper.

Changes implemented:
- Removed the top `Memory` / `Care` / `Guide` toggle row and its secondary panel.
- Replaced it with three plain, persistent links beneath the composer:
  - `Open garden map`
  - `See this week`
  - `Find plants`
- Removed the old utility-panel CSS classes.
- Added regression coverage so the Ask surface keeps the simpler shortcut links and does not bring back the old utility row.

Updated health:
- The Ask screen now prioritizes the note/photo composer and then gives three direct next choices in gardener language.
- Navigation remains available, but it no longer asks the user to understand internal module labels before the value is clear.
- The first app impression is simpler and closer to the core promise: ask from the garden you already saved.

Evidence:
- Focused tests passed: `ai-first-garden-home.test.tsx` and `app-flow-visual-css.test.ts`, 2 files, 13 tests.
- Full `npm test` passed: 22 test files, 120 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Running preview at `http://127.0.0.1:3021/sample-garden/ask` renders `Open garden map`, `See this week`, and `Find plants`.
- Running preview DOM check found no `.garden-ai-utility-row`, `.garden-ai-icon-button`, or `.garden-ai-panel`.

Evidence limits:
- In-app Browser DOM verification succeeded.
- In-app Browser screenshot capture still timed out with `Page.captureScreenshot`.
- Separate Playwright/Chrome screenshot capture was not used because Product Design browser guidance requires explicit approval before using another browser route.
