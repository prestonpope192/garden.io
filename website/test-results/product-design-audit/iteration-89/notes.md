# Iteration 89 - Plant Check Copy Simplification

Date: 2026-06-21
Surface: Plant check / AI-assisted next-step flow
Goal: Make AI help feel practical and calm: use the plant's own notes, bed, and season to suggest what to try next.

## Current-State Finding

- The plant-check flow was already useful, but the visible copy still leaned clinical or system-like in places.
- `Plant problem checks`, `Check a plant problem`, and `narrow likely causes` made the feature feel heavier than a gardener needs when they are just trying to decide what to do next.
- Error and rate-limit messages still used `plant problem checks` or `diagnosis limit`, which could surface directly to users.
- Saved plant-check notes used terse labels like `Likely:` and `Next:`, which felt more like generated output than a calm garden record.

## Changes Implemented

- Reframed the panel:
  - `Check a plant problem` -> `Check this plant`
  - Intro copy now says the plant's notes, bed, and season help suggest what to try next.
  - Loading state now says it is checking the plant's notes instead of reading history.
- Simplified plant-check supporting copy:
  - Photo alt text now says `Photo selected for plant check`.
  - Save hint now says `Saves this check with the plant's notes and tasks.`
  - Result follow-up label changed from `Follow up:` to `Look for:`.
  - Disclaimer now says `Use this as a second opinion. Look closely before you act.`
- Cleaned saved note wording:
  - `Likely:` -> `Possible cause:`
  - `Next:` -> `Try next:`
  - Task notes now say `From the plant check for...`
- Simplified API and rate-limit messages:
  - `Plant problem checks...` -> `Plant checks...`
  - `Please sign in to check this plant problem.` -> `Please sign in to check this plant.`
  - `diagnosis limit` -> `plant check limit`
- Updated the plant-check tests to protect the new language and reject the old problem/diagnosis framing.

## Updated Health

- The plant-check flow now reads like a practical garden helper instead of a diagnosis report.
- The AI value is still present, but framed around the user's felt need: decide what to try next based on what has happened with this plant.
- Error states are calmer and match the feature name users see.
- No model behavior or database behavior changed in this pass.

## Evidence

- Product Design audit skill and critical overrides were loaded.
- Product Design user-context preflight ran and found no saved Product Design context.
- Focused tests passed: `diagnose-panel-content.test.ts` and `diagnose-route-copy.test.ts`, 2 files, 2 tests.
- Full `npm test` passed: 17 test files, 78 tests.
- `git diff --check` passed.
- `npm run build` passed with a Next.js production build.
- Stale-copy source scan found old plant-problem/diagnosis wording only inside negative test assertions.
- Rendered route scan passed for `/`, `/sample-garden`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, `/app/my-property`, `/app/my-plants`, and `/app/calendar`.
- Rendered route scan found no hits for removed beta/product/dashboard/plant-check phrases, including `Check a plant problem`, `Plant problem checks`, `diagnosis assistant`, `narrow likely causes`, `turn the next step into a task`, `Photo selected for plant problem check`, `Keeps this check`, or `diagnosis limit`.

## Evidence Limits

- No accepted screenshots were captured in this pass. Browser and Chrome screenshot capture were unavailable in this environment, and Product Design audit rules require asking before using Playwright as a screenshot fallback.
- The signed-in plant-check panel does not render on public signed-out routes, so its visible state was verified with component tests rather than browser screenshots.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.

## Next Opportunity

Continue through the remaining AI/next-step surfaces and remove any labels that still read as generated suggestions, warnings, or system outputs instead of direct garden actions.
