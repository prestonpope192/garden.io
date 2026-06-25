# Iteration 82 - App Copy Simplification

## Current-State Finding

- The homepage and public plant guide were much cleaner after prior passes, so this pass moved deeper into the reusable app surfaces.
- The plant history and saved/past plant flows still used a few internal or system-like words: `Timeline`, `outcome`, `Archive`, `Archived`, and `Move to bed`.
- Those terms are technically accurate, but they make the app feel more like a record system than a simple helper for remembering what happened and knowing what to do next.
- Shared history-summary copy could still produce `success`, `partial`, `failure`, or `recorded outcomes` in AI-backed suggestions.

## Changes Implemented

- Replaced user-facing plant history language:
  - `Timeline` -> `History`
  - `Care timeline` -> `Care history`
  - empty history copy now says to add a planting date, note, or harvest so the gardener can remember what happened.
- Replaced outcome wording with result wording:
  - `Log harvest / outcome` -> `Add harvest or result`
  - `Record an outcome` -> `How did this planting go?`
  - `Result` form label -> `How it went`
  - `Success` / `Partial` / `Failure` -> `Grew well` / `Mixed result` / `Did not work`
  - `Save outcome` -> `Save result`
  - mutation feedback now says `Result saved`, `Result removed`, and sample mode says `Result kept`.
- Replaced archive wording with gardener-facing past-plant language:
  - tab label `Archived` -> `Past`
  - card/list labels `Archived` -> `Past`
  - `Archive` / `Archive plant` -> `Mark finished`
  - `Restore to growing` -> `Return to growing`
  - empty state `No archived plants` -> `No past plants yet`
  - route/list aria labels now say `Past plants`.
- Replaced saved plant movement copy:
  - `Move to a bed` -> `Plant it in a bed`
  - `Move to bed` -> `Plant in this bed`
  - `Moving...` -> `Planting...`
- Updated shared history/performance summaries:
  - `Outcome` milestone title -> `Result`
  - `success` / `partial` / `failure` summaries -> `grew well` / `mixed result` / `did not work`
  - `recorded harvests/outcomes` -> `saved harvests/results`
- Updated tests to protect the new user-facing language.

## Updated Health

- The app now describes finished plants as past plants, which better matches a gardener's mental model.
- The plant-history surface now explains the value directly: remember what happened and see what comes next.
- AI-backed suggestions no longer quote database-ish result labels in user-facing summaries.
- The editable app and sample app now use the same language, so prospective users do not encounter a different vocabulary while browsing the sample.

## Evidence

- Product Design audit skill and critical overrides were loaded; user-context preflight ran and found no saved Product Design context.
- Focused tests passed: `sample-garden.test.ts`, `garden-performance.test.ts`, and `garden-timeline.test.ts`, 3 files, 31 tests.
- Full `npm test` passed: 17 test files, 78 tests.
- `git diff --check` passed.
- `npm run build` passed with Next.js production build.
- Rendered route scan confirmed `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app/my-property`, and `/app/my-plants` returned `200`.
- Rendered route scan found no hits for `Care timeline`, `No timeline yet`, `Log harvest / outcome`, `Record an outcome`, `Save outcome`, `Outcome saved`, `Outcome removed`, `Outcome kept`, `Plant archived`, `Plant restored`, `Archived plants`, `Archived<span`, or `Move to bed`.

## Evidence Limits

- No accepted screenshots were captured in this pass. In-app Browser screenshot capture previously timed out; Chrome fallback is currently unavailable because the Codex Chrome Extension is missing from the selected Chrome profile.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
