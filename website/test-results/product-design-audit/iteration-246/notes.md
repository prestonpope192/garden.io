# Iteration 246 Notes

Scope: verify and fix the Ask answer target-change save flow.

User need:
- Choose a better save target when the default is wrong.
- Save the answer and land in a clean finished state.
- Avoid leaving configuration controls open after the save succeeds.

Accepted screenshots:
- `screenshots/01-answer-before-save.png` - answered state before changing the save target.
- `screenshots/02-save-target-changed.png` - target changed to Calendula before the fix.
- `screenshots/03-after-save-note.png` - saved state before the fix.
- `screenshots/02-save-target-changed-final.png` - target changed to Calendula after the fix.
- `screenshots/03-after-save-note-final.png` - clean saved state after the fix.

Finding:
- After choosing `Calendula in Bloom Border` and saving, the picker stayed open.
- The target row read like unfinished configuration instead of a completed save state.

Changed:
- Collapsed the target picker after a successful save.
- Reset the picker to closed when a new question starts.
- Added a source-level regression guard for the picker reset.

Result:
- After save, the row returns to the compact `Save with Calendula / Change` state.
- The status says `Saved to Calendula.`
- The save button reads `Saved`, with no visible overflow.

Evidence:
- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, and `mobile-layout-css.test.ts`, 3 files, 17 tests.
- Full `npm test` passed: 22 files, 119 tests.
- `npm run build` passed.
- `git diff --check` passed for touched files.
- Browser click-through metrics are in `fixed-click-through-metrics.json`.

Evidence limits:
- This used the sample-garden answer flow, not a production authenticated save.
- DOM and screenshot checks do not prove full keyboard/focus behavior.
