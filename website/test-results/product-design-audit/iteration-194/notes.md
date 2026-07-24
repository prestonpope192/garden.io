# Iteration 194 Notes

Date: 2026-06-22
Scope: make the main app place view feel like the user's garden, not an internal map feature.

## Changed

- Replaced the app and sample preview `Garden Map` nav/title with `My Garden`.
- Replaced the place-view subtitle `Find each area, bed, plant, and note by place.` with `See each area, bed, plant, and note by place.`
- Replaced plant and calendar deep-link actions from `Show in map` / `Show in Garden Map` to `Show in My Garden`.
- Kept compact table actions short as `Show`, with accessible labels that say where the action goes.
- Updated regression coverage for the sample garden and empty-state app copy.

## Why

- `My Garden` is a clearer user mental model than `Garden Map`; it describes the place the user owns, not the UI widget.
- `See each area...` is simpler and less search-like than `Find each area...`.
- `Show in My Garden` makes cross-app navigation understandable from plants and calendar care items.

## Verification

- Focused app copy tests passed from `website/`: `sample-garden.test.ts` and `empty-state-content.test.ts`, 2 files, 17 tests.
- Full `npm test` passed from `website/`: 18 files, 93 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Local route checks returned 200 for `/`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, and `/app/my-property`.
- Rendered `/sample-garden/property` contained `My Garden` and `See each area`; it contained zero `Garden Map` and zero `Find each area` matches.
- Rendered `/sample-garden/plants` and `/sample-garden/calendar` contained zero `Garden Map` and zero `Show in map` matches.

## Evidence Limits

- Browser screenshot capture remains unavailable in this thread without explicit Playwright approval; current proof is source, server-rendered/component tests, build, route checks, and rendered HTML probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
