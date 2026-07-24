# Product Design Audit Iteration 373

Date: 2026-06-24
Surface: Public catalogue and in-app Field Guide filters

## Objective

Continue simplifying Garden.io by replacing taxonomy-style filter copy with plain plant-browsing language.

## Finding

The public catalogue still rendered `Choose plant type`. The in-app Field Guide used the same wording, plus `Hide plant types` and a `Selected type` fallback. The rest of the cleaned-up catalogue already favors the simpler label `Kind`, so `plant type` was a lingering taxonomy phrase.

## Changes

- Public catalogue filter button: `Choose plant type` -> `Choose kind`.
- Public catalogue expanded state: `Hide plant types` -> `Hide kinds`.
- In-app Field Guide filter button: `Choose plant type` -> `Choose kind`.
- In-app Field Guide expanded state: `Hide plant types` -> `Hide kinds`.
- In-app fallback label: `Selected type` -> `Selected kind`.
- Updated focused tests in `public-catalogue-content.test.ts` and `catalogue-format.test.ts`.

## Evidence

- Focused tests passed: `npm test -- public-catalogue-content.test.ts catalogue-format.test.ts sample-garden.test.ts`
- Full tests passed: `npm test` with 23 files and 130 tests.
- Production build passed: `npm run build`.
- Whitespace check passed: `git diff --check`.
- Live route probe against `http://127.0.0.1:3021/catalog` returned `200`.
- Live route probe confirmed `hasChooseKind: true`, `hasChoosePlantType: false`, and `hasHidePlantTypes: false`.
- Live route probe against `http://127.0.0.1:3021/sample-garden/catalogue` returned `200` and confirmed the old filter terms are not visible in the default sample view.

## Remaining Risk

- Screenshot capture was not available in this session, so visual spacing and line wrapping for the changed labels were verified indirectly through tests, build, and live route text only.
- The in-app Field Guide filter is hidden in the read-only sample default state, so its expanded-state copy is protected by component tests and source scan rather than a live browser interaction.
