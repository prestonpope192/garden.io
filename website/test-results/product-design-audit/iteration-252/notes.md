# Iteration 252 - My Garden Place-Aware First Check

Scope: simplify the sample-garden My Garden default state.

Audit mode: UX, content, responsive, and accessibility-risk pass.

User goal:
- Open My Garden and know where to go first.
- Understand the next task with plant and place context.
- Keep the garden layout available as a map of areas, beds, and plants.

Accepted screenshots:
- `screenshots/mobile-property-before.png` - current mobile My Garden screen before the guide cleanup.
- `screenshots/mobile-property-final.png` - final mobile My Garden screen after the guide cleanup.
- `screenshots/desktop-property-final.png` - final desktop My Garden screen after the guide cleanup.

Finding:
- The default guide said `What needs care next`, but the next task lacked plant and place context.
- The guidance asked users to `Pick a place or plant...` instead of naming the place that matters first.
- The garden layout was useful, but users still had to connect the care task to the right bed themselves.

Changed:
- Replaced the generic guide with `First place to check`.
- Added the plant name, task, due date, bed, and area to the guide.
- Added `Open plant record` so users can jump straight to the relevant plant.
- Replaced generic `Pick a place or plant...` copy with `Open a place or plant for its notes, photos, and history.`
- Kept the layout below the guide as the map of areas, beds, and plants.

Result:
- My Garden now answers “where should I go first?” before showing the layout.
- The first care task is tied to Cucumber in Container Row, Kitchen Garden.
- The layout remains useful as a garden map instead of carrying the burden of interpreting the next task.

Evidence:
- Focused tests passed: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `app-flow-visual-css.test.ts`, 3 files, 28 tests.
- Full `npm test` passed: 22 files, 119 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Browser metrics confirmed `First place to check` appears before `Garden layout`, the old generic guide is absent, and there is no horizontal overflow on mobile or desktop.
- Interaction metrics confirmed `Open plant record` opens the Cucumber record with the care task and plant history visible.

Evidence limits:
- This pass covered the sample My Garden default state and one click into the first plant record.
- It did not deeply test all edit/add/delete flows.
- Screenshot and DOM checks do not prove complete keyboard/focus behavior.
