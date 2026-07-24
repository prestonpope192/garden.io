# Product Design Audit Iteration 81

Date: 2026-06-21

## Objective

Continue simplifying Garden.io by polishing the timing labels in next-care recommendations so they read like intentional UI copy rather than generated fragments.

## Current-State Finding

- The sample calendar was much cleaner overall, but next-care recommendation badges still rendered raw lowercase timing labels such as `this season` and `later`.
- In the rendered calendar text this created awkward phrases like `later From your garden`, which made the rail feel more machine-generated than gardener-facing.
- The same raw `windowLabel` display path was used in both the calendar next-care rail and the property drawer next-step cards.

## Changes Implemented

- Added `formatSuggestionWindowLabel()` to `lib/garden-suggestions.ts`.
- Normalized common timing labels:
  - `later` -> `Later`
  - `this week` -> `This week`
  - `this season` -> `This season`
  - `from your history` -> `From your history`
  - `next rotation` -> `Next rotation`
  - `~10 days` -> `In about 10 days`
- Updated calendar next-care cards to render formatted timing labels.
- Updated property drawer next-step cards to render formatted timing labels.
- Added regression coverage for polished timing labels.
- Updated sample calendar tests to reject old lowercase visible fragments.

## Updated Health

- The calendar next-care rail now reads as intentional copy: `This season`, `Later`, `From your garden`.
- The same improvement applies to in-app property drawer suggestions.
- The underlying suggestion engine and scheduling behavior are unchanged.

## Evidence

- Product Design user-context preflight ran; no saved context exists, so this pass used the current app as source of truth.
- Focused tests passed: `sample-garden.test.ts` and `garden-suggestions-history.test.ts`, 2 files, 17 tests.
- Full `npm test` passed: 17 test files, 78 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed.
- Rendered route scan confirmed `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, and `/app/my-property` returned `200`.
- Rendered sample calendar text confirmed `Next care steps This season ... Later From your garden ...`.
- The rendered route scan found no hits for old stale public-copy markers, including lowercase `>later<` and `>this season<`.
- Source scan found direct `windowLabel` rendering replaced with `formatSuggestionWindowLabel(...)` in calendar and property views.

## Evidence Limits

- No accepted screenshots were captured in this pass. In-app Browser screenshot capture previously timed out; Chrome fallback is currently unavailable because the Codex Chrome Extension is missing from the selected Chrome profile.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
