# Iteration 250 - This Week / Care Simplification

Scope: simplify the sample-garden Calendar / This Week care surface.

Audit mode: UX, content, responsive, and accessibility-risk pass.

User goal:
- Open the app and immediately know what to do first.
- Keep later care visible without making every task feel equally urgent.
- Stay in the journal-style visual system without nested heavy panels.

Accepted screenshots:
- `screenshots/mobile-care.png` - current mobile This Week screen before the care hierarchy pass.
- `screenshots/mobile-final-care.png` - final mobile This Week screen after the care hierarchy pass.
- `screenshots/desktop-final-care.png` - final desktop This Week screen after the care hierarchy pass.

Finding:
- The care page was technically readable, but all four weekly tasks had the same visual weight.
- The first action was buried in a flat list.
- The wrapper around the weekly care list added extra card weight around cards.

Changed:
- Added a featured first action with the label `First today` when the next task is due now or overdue.
- Moved the remaining weekly tasks into a quieter `Coming up` list.
- Kept the existing garden context and task actions intact.
- Flattened the outer care wrapper so task cards are not sitting inside a heavy framed card.
- Tightened the count copy to `3 later this week`.

Result:
- The page now answers the user's first question: "What should I do first?"
- Later care remains visible, but it no longer competes with the first task.
- The mobile view feels more like a working garden journal and less like a task dashboard.

Evidence:
- Focused tests passed: `sample-garden.test.ts`, `app-flow-visual-css.test.ts`, and `empty-state-content.test.ts`, 3 files, 28 tests.
- Full `npm test` passed: 22 files, 119 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Browser metrics confirmed `First today` and `Coming up` are visible in the right order on mobile and desktop, the featured task is `Water deeply before the hot afternoon`, and there is no horizontal overflow.

Evidence limits:
- This pass covered the sample Calendar / This Week view.
- It did not deeply rework My Plants or My Garden.
- Screenshot and DOM checks do not prove complete keyboard/focus behavior.
