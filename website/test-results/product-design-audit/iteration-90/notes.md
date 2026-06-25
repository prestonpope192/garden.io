# Iteration 90 - Next-Step Label Cleanup

Date: 2026-06-21
Surface: Suggestion labels, Plants view care states, homepage/app promise copy
Goal: Make next-step and AI-backed guidance read like direct garden care, not generated status labels.

## Current-State Finding

- Suggestion card labels still used status-like wording:
  - `Needs attention`
  - `Good timing`
  - `Next step`
- The Plants view used `Needs attention` for a count and filter, and the sample/app subtitles said plants show `what needs attention next`.
- The homepage and metadata repeated the same `needs attention next` framing.
- These phrases were understandable, but they made the app feel more like a dashboard flagging statuses than a calm helper showing what needs care.

## Changes Implemented

- Reframed suggestion type labels:
  - `Needs attention` -> `Check soon`
  - `Good timing` -> `Good moment`
  - `Next step` -> `Try next`
  - Kept `From your garden`, because it clearly explains why the suggestion is personalized.
- Reframed Plants view care-state copy:
  - `Needs attention` -> `Needs care soon`
  - `Needs attention only` -> `Needs care soon only`
  - `need attention soon` -> `need care soon`
  - `what needs attention next` -> `what needs care next`
- Reframed app subtitles:
  - `See what needs attention soon and what can wait.` -> `See what needs care soon and what can wait.`
  - `See what is growing, where it lives, and what needs attention next.` -> `See what is growing, where it lives, and what needs care next.`
- Reframed homepage/metadata promise:
  - `what needs attention next` -> `what needs care next`
- Updated tests to protect the new labels and reject the old attention/timing/status language.

## Updated Health

- The app now uses a more natural gardening vocabulary around next actions.
- AI-backed suggestions feel less like generated categories and more like useful care prompts.
- The homepage promise and app copy now say the same thing: remember what is planted and what needs care next.
- No behavior or data model changes were introduced in this pass.

## Evidence

- Product Design audit skill and critical overrides were loaded.
- Product Design user-context preflight ran and found no saved Product Design context.
- Focused tests passed: `garden-suggestions-history.test.ts`, `empty-state-content.test.ts`, `sample-garden.test.ts`, and `homepage-content.test.ts`, 4 files, 24 tests.
- Full `npm test` passed: 17 test files, 79 tests.
- `git diff --check` passed.
- `npm run build` passed with a Next.js production build.
- Stale-label source scan found old attention/timing/suggestion language only inside negative test assertions.
- Rendered route scan passed for `/`, `/sample-garden`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, `/app/my-property`, `/app/my-plants`, and `/app/calendar`.
- Rendered route scan found no hits for removed stale labels including `Needs attention`, `needs attention next`, `needs attention soon`, `Good timing`, `Suggested next steps`, `Suggested step`, `Recommended`, or `Pattern spotted`.

## Evidence Limits

- No accepted screenshots were captured in this pass. Browser and Chrome screenshot capture were unavailable in this environment, and Product Design audit rules require asking before using Playwright as a screenshot fallback.
- Some signed-in interactive states, such as the collapsed Plants filter drawer, were verified by source inspection and component tests rather than browser interaction.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.

## Next Opportunity

Continue through the remaining app surfaces for action labels such as `View in garden`, `Open`, `Tasks`, and `Next steps`, and replace any that do not match the gardener's immediate intent.
