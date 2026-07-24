# Product Design Audit - Iteration 243

Date: 2026-06-23

Scope: simplify the Ask answered state after the Ask entry cleanup.

User need:
- Get to the answer immediately after asking a garden question.
- See one clear next step before secondary controls.
- Keep the result tied to the garden memory flow without making the answer feel buried.

Accepted screenshots:
- `screenshots/01-ask-empty-mobile-current.png` - current empty Ask state before submitting.
- `screenshots/02-ask-answer-mobile-current.png` - answered state before this pass.
- `screenshots/03-ask-answer-desktop-current.png` - answered state desktop before this pass.
- `screenshots/02-ask-answer-mobile-final.png` - answered state mobile after this pass.
- `screenshots/03-ask-answer-desktop-final.png` - answered state desktop after this pass.

Finding:
- After submitting a question, the user still had to scroll past the filled question composer before reaching the answer.
- On mobile, the answer card started around 579px from the top of the viewport, so the result felt delayed and visually buried.
- The page repeated the question in both the filled composer and the answer card.

Changed:
- The Ask composer now renders only before an answer exists.
- Once an answer is present, the result card becomes the first major object after the utility buttons.
- Added a regression guard so the answered state keeps the composer conditional on `!diagnosis`.

Result:
- The answer starts around 123px from the top of the mobile viewport instead of around 579px.
- The user sees the question, summary, and next-step actions immediately after submission.
- The result state keeps follow-up, save, and care-list actions without duplicating the filled input.

Evidence:
- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, and `mobile-layout-css.test.ts`, 3 files, 17 tests.
- Full `npm test` passed: 22 files, 119 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed for touched files.
- Final browser metrics confirmed the composer and textarea are no longer visible in the answered state, no old `Ask Garden.io` copy appears, no beta/waitlist/prototype language appears, and there is no visible overflow on mobile or desktop.

Evidence limits:
- This pass used the sample garden answer path, not a live production AI request.
- Screenshots and DOM checks do not prove full keyboard/focus behavior.
- The action list itself remains dense and deserves a later priority/action hierarchy pass.
