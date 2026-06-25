# Iteration 510 - Field Guide Copy Cleanup

Date: 2026-06-24

## Scope

Make the Field Guide browsing language feel less like a database catalogue and more like a gardener choosing what belongs in a bed.

## Changed

- Changed the in-app Field Guide filter button from `Plant type` to `Browse by kind`, and the expanded state to `Hide plant kinds`.
- Changed app Field Guide result summaries from `plants that fit` to `plants to choose from`, avoiding a false fit claim when no bed/filter is selected.
- Changed in-app empty-state reset language from `show all plants ... browse all plants` to `show every kind ... start over`.
- Changed public Field Guide summary and reset labels from `All plants` / `Show all plants` to `All plant kinds` / `Show every kind`.
- Changed public Field Guide result label from `Plants to consider` to `Plants to choose from`.
- Changed public filter accessibility labels from `Plant filters` / `Plant groups` to `Ways to browse plants` / `Plant kinds`.
- Changed public plant photo alt text from `plant image` to `plant`.

## Evidence

- Source scan no longer finds stale visible strings in the changed Field Guide surfaces: `plants that fit`, `Plant filters`, `Plant groups`, `All plants`, `Plants to consider`, `Show all plants`, `plant image`, `plants shown`, `No plants match your search`, or `browse all plants`.
- Focused tests passed from the website package: `public-catalogue-content.test.ts`, `sample-garden.test.ts`, `ai-first-garden-home.test.tsx`, `homepage-content.test.ts`, and `empty-state-content.test.ts` - 5 files, 41 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not available in this tool context. This pass used source scans, content tests, full tests, and build verification.
