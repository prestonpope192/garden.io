# Iteration 251 - My Plants Care-First Simplification

Scope: simplify the sample-garden My Plants surface.

Audit mode: UX, content, responsive, and accessibility-risk pass.

User goal:
- Open My Plants and know which plant to check first.
- Still be able to scan every plant record.
- Keep the journal-style plant images and avoid database-like copy.

Accepted screenshots:
- `screenshots/mobile-plants-before.png` - current mobile My Plants screen before the care-first pass.
- `screenshots/mobile-plants-final.png` - final mobile My Plants screen after the care-first pass.
- `screenshots/desktop-plants-final.png` - final desktop My Plants screen after the care-first pass.

Finding:
- The screen repeated generic `Choose a plant` guidance.
- The first care task, `Water deeply before the hot afternoon`, was buried under other plant cards.
- The list order did not match the user's likely question: "which plant should I check first?"

Changed:
- Rewrote the My Plants subtitle to `Start with the next plant to check, then open any plant record.`
- Sorted growing plant records by soonest open care task.
- Added a `First plant to check` guide that names the plant, task, date, and location.
- Kept the simple growing count and weekly-care count, but moved them below the first action.
- Replaced remaining generic `Choose a plant...next steps` helper copy with plant-record language.

Result:
- My Plants now starts with the same practical care-first logic as This Week.
- The first visible plant record is Cucumber, matching the first care task.
- The page still works as a plant record list, but no longer asks users to interpret four equal cards.

Evidence:
- Focused tests passed: `sample-garden.test.ts`, `empty-state-content.test.ts`, `app-flow-visual-css.test.ts`, and `ai-first-garden-home.test.tsx`, 4 files, 32 tests.
- Full `npm test` passed: 22 files, 119 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Browser metrics confirmed `First plant to check` is visible, `Cucumber` is the first plant card, `Water deeply before the hot afternoon` appears before `Harvest cilantro before afternoon heat`, and there is no horizontal overflow on mobile or desktop.

Evidence limits:
- This pass covered the sample My Plants default state.
- It did not test selecting a plant and editing its history/actions.
- Screenshot and DOM checks do not prove complete keyboard/focus behavior.
