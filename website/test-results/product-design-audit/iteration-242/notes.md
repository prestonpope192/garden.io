# Product Design Audit - Iteration 242

Date: 2026-06-23

Scope: simplify the sample/app Ask surface after the homepage and catalogue cleanup.

User need:
- Understand immediately that the app can answer a garden question from a note or photo.
- See that useful answers can be saved with the right plant, bed, or season.
- Use the first screen without facing a giant empty input or app-name-heavy product copy.

Accepted screenshots:
- `screenshots/01-ask-mobile-current.png` - Ask view before this pass.
- `screenshots/02-ask-desktop-current.png` - Ask view desktop before this pass.
- `screenshots/03-plants-mobile-current.png` - adjacent My Plants surface for context.
- `screenshots/04-calendar-mobile-current.png` - adjacent weekly care surface for context.
- `screenshots/05-catalogue-mobile-current.png` - adjacent Find Plants surface for context.
- `screenshots/01-ask-mobile-final.png` - Ask view mobile after the cleanup.
- `screenshots/02-ask-desktop-final.png` - Ask view desktop after the cleanup.

Finding:
- The Ask surface was functional, but the first view was dominated by a large centered placeholder.
- The screen still contained app-name-heavy copy such as `Ask Garden.io`, even though the current positioning is user-facing: ask your garden, then save the useful answer.
- The empty state did not make the garden-memory value visible before the user submitted a question.

Changed:
- Replaced `Ask Garden.io` with `Ask your garden`.
- Replaced the large `What are you seeing in the garden?` placeholder with the shorter `What are you seeing?`.
- Added a short lead: `Ask with a note or photo. Keep the useful answer with the right plant, bed, or season.`
- Added a save hint below the controls: `Answers can be saved with a plant, bed, or the whole garden.`
- Changed the textarea from a huge centered prompt to a smaller journal-style note field.
- Updated tests to reject the old copy and protect the compact mobile input.

Result:
- The Ask screen now explains the core value before submission.
- The input feels more like a garden journal note and less like an oversized marketing prompt.
- The first mobile viewport still includes the utility buttons, garden context, input, actions, save hint, and suggested questions.

Evidence:
- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, and `mobile-layout-css.test.ts`, 3 files, 17 tests.
- Full `npm test` passed: 22 files, 119 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed for touched files.
- Final browser metrics confirmed `Ask your garden`, the new lead, the save hint, no old Ask copy, no beta/waitlist/prototype language, and no visible overflow on mobile or desktop.

Evidence limits:
- This pass did not test a real AI response from production services.
- Screenshots and DOM checks do not prove full keyboard/focus behavior.
- The result state after an answer still deserves a separate visual pass.
