# Product Design Audit - Iteration 244

Date: 2026-06-23

Scope: simplify the Ask answer action hierarchy.

User need:
- See one clear recommended next step after asking a garden question.
- Avoid having three equally weighted care actions compete for attention.
- Still allow useful supporting checks to be saved without making them feel like the main instruction.

Accepted screenshots:
- `screenshots/01-ask-answer-mobile-current.png` - answered state before this pass.
- `screenshots/02-ask-answer-desktop-current.png` - answered state desktop before this pass.
- `screenshots/01-ask-answer-mobile-final.png` - answered state mobile after the action hierarchy cleanup.
- `screenshots/02-ask-answer-desktop-final.png` - answered state desktop after the action hierarchy cleanup.

Finding:
- The answered state had three equal action cards, each with the same `Add to care list` button.
- That made the answer feel busier than the product promise: a simple, useful next step.

Changed:
- Replaced the equal action list with one primary `Do this first` action.
- Moved remaining actions into a quieter `Other helpful checks` list.
- Kept secondary actions saveable with smaller `Add` buttons.
- Added tests that guard the new primary/secondary result structure.

Result:
- The first action now reads as the recommended next step.
- Secondary checks remain available without competing with the primary action.
- The answer still preserves the garden-memory loop through care-list and save-note controls.

Evidence:
- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, and `mobile-layout-css.test.ts`, 3 files, 17 tests.
- Full `npm test` passed: 22 files, 119 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed for touched files.
- Final browser metrics confirmed one primary action, two secondary checks, no old equal action cards, no old Ask copy, no beta/waitlist/prototype language, and no visible overflow on mobile or desktop.

Evidence limits:
- This pass used the sample answer path, not a production AI response.
- Screenshots and DOM checks do not prove full keyboard/focus behavior.
- The save-to-memory selector still has a long option list and may deserve a later simplification pass.
