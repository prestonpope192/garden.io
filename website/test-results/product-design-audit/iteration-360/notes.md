# Iteration 360 - Garden Check Language

Date: 2026-06-24
Task class: build work
Surface: Garden home/check flow, sample app header, diagnose route copy

## Objective

Make the main garden help flow feel like checking and recording the garden, not asking a chatbot.

## Product Design Steps

1. Step 1 - Current copy and source review: healthy.
   - Inspected the homepage, GardenAskView, app shell, sample shell, route copy, and related tests.
2. Step 2 - User-facing language simplification: healthy.
   - Changed visible and assistive copy from ask/question/answer language to check/note/result language.
3. Step 3 - Regression coverage: healthy.
   - Updated content tests to require the new labels and reject the older ask-oriented wording.
4. Step 4 - Verification: healthy.
   - Focused tests, full tests, build, diff check, and source/live probes passed.

## Findings

- Strength: the current app already centers the simple promise, `Your garden, smarter`.
- UX issue addressed: `Ask`, `question`, and `answer` wording still made the primary flow feel like chatbot chrome instead of a garden journal with useful care checks.
- Accessibility issue addressed: hidden labels and ARIA labels now describe checks/results instead of garden questions/answers.
- Limit: route names and internal component types still use `ask` because changing those would be a broader routing/refactor pass.
- Accessibility risk from screenshots: not checked in this pass because screenshot capture was unavailable under the current Product Design capture rules.

## Verification

- Focused tests passed from the website package: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, `diagnose-route-copy.test.ts`, and `homepage-content.test.ts` - 4 files, 24 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/ask` contains `Tomato leaves are yellowing` and `Heavy rain last night`, and does not contain `Why are my tomato leaves yellowing?` or `What should I do after heavy rain?`.
- Live `/sample-garden/property` contains the `Check` header link and does not contain the older `Ask` header link.
- Source contains `Checked:`, `Check again`, `Garden check result`, `Suggested garden checks`, `Please sign in to check your garden.`, `Add what you are seeing or a photo to check your garden.`, and `You can check the garden again in a little while.`
- Source no longer contains `Ask follow-up`, `Garden answer`, `Suggested garden questions`, `Start your garden before saving answers or care`, or the older route/rate-limit ask copy.
