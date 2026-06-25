# Iteration 559 Notes

Date: 2026-06-24
Surface: Garden.io homepage/app simplification pass
Task type: build work

## Scope

Run up to three broad cleanup passes after the user asked for larger, sweeping iterations:

1. Weekly Care language.
2. Field Guide/catalogue language and image selection.
3. Sample garden image fallback behavior.

The goal was to keep the app clean, user-facing, and aligned with the botanical notebook direction instead of developer/product language or ordinary full-color photo-heavy catalogue behavior.

## Changes

- Changed Weekly Care summary and empty-state copy from system-ish labels to direct gardener language:
  - `Everything coming up` -> `All care shown`
  - `No care is due this week...` -> `Nothing is due this week...`
  - `Later care` -> `After this week`
  - `No care planned after this week.` -> `Nothing planned after this week.`
  - `Choose a date` -> `Needs a date`
  - `Try later` -> `Care ideas`
- Changed signed-in Field Guide action copy from `Know where it belongs? Plant it in a bed...` to `Ready to plant? Add it to a bed. Still deciding? Keep it in plants to try.`
- Changed public catalogue and signed-in Field Guide plant cards to display only journal-style plant-art images, not ordinary real garden photos.
- Removed the sample garden fallback that could choose ordinary real photos after the preferred journal-style plant art.
- Updated content tests to require the new wording/image behavior and reject the older labels/fallbacks.

## Evidence

- Product Design audit instructions were loaded.
- Product Design user-context preflight ran; no saved entries were available.
- Garden.io memory was used for the existing brand direction: botanical notebook, user action language, and `your garden, smarter`.
- Source inspection focused on:
  - `website/components/views/calendar-view.tsx`
  - `website/components/public-catalogue-browser.tsx`
  - `website/components/views/catalogue-view.tsx`
  - `website/lib/demo-garden-snapshot.ts`
- Stale-copy scans confirmed the older user-facing phrases remain only in negative test assertions.

## Verification

- Focused tests passed from `website`: 4 files, 43 tests.
- Full `npm test` passed from `website`: 23 files, 131 tests.
- `npm run build` passed from `website`.
- `git diff --check` passed.

## Limit

Direct browser screenshot capture was not used in this run. This pass was verified by source inspection, content tests, full test suite, production build, and whitespace checks.
