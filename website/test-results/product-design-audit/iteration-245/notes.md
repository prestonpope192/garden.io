# Product Design Audit - Iteration 245

Date: 2026-06-23

Scope: simplify the Ask answer save-to-memory area.

User need:
- Save a useful answer without being forced into a long placement selector.
- See where the answer will be saved at a glance.
- Keep the ability to change the save target when the default is wrong.

Accepted screenshots:
- `screenshots/01-ask-answer-mobile-final.png` - answered state with the collapsed save target row.
- `screenshots/02-ask-answer-desktop-final.png` - desktop answered state with the collapsed save target row.

Finding:
- The answer result had become clearer, but the save section still exposed the full `Attach to` selector by default.
- That placed 10 possible targets in the main result flow, making the final step feel like configuration instead of a simple save action.

Changed:
- Replaced the always-visible attach selector with a compact `Save with Whole garden` row.
- Added a `Change` button that reveals the full target picker only when needed.
- Kept the full target list and save behavior intact for users who need to attach the answer to a specific area, bed, or plant.
- Added tests that guard the collapsed target picker and new save-target styling.

Result:
- The save area now reads like a quick confirmation instead of a form.
- The long target list is available, but no longer competes with the primary answer and next step.
- The answer flow still supports saving to a plant, bed, area, or the whole garden.

Evidence:
- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, and `mobile-layout-css.test.ts`, 3 files, 17 tests.
- Full `npm test` passed: 22 files, 119 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed for touched files.
- Final browser metrics confirmed the picker is hidden by default, the compact save target row is visible, `Change` reveals the 10 target options, no old Ask copy appears, no beta/waitlist/prototype language appears, and no visible overflow appears on mobile or desktop.

Evidence limits:
- This pass used the sample answer path, not a production AI response.
- Screenshots and DOM checks do not prove full keyboard/focus behavior.
- The full save flow still needs a click-through test that changes the target and saves the note.
