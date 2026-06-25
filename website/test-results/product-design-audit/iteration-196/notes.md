# Iteration 196 Notes

Date: 2026-06-22
Scope: align the signed-in/sample plant-finding section with the public `Find plants` language.

## Changed

- Renamed the app and sample catalogue section from `Plant Guide` to `Find Plants`.
- Updated the app header, sample header, fallback journal shell, and section title to use `Find Plants`.
- Replaced the empty saved-plants CTA `Browse plant guide` with `Find plants`.
- Kept the supporting subtitle `Choose plants that fit your beds.` because it explains the user value in one short sentence.
- Updated regression coverage for sample, empty-state, and catalogue wording.

## Why

- `Plant Guide` sounded like a reference surface; `Find Plants` matches the user task.
- The public catalogue already uses `Find plants`, so the signed-in app should not introduce a second name for the same job.
- The saved-plants empty state now points users toward the action they want: find something worth saving or planting.

## Verification

- Focused tests passed from `website/`: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `catalogue-format.test.ts`, 3 files, 27 tests.
- Full `npm test` passed from `website/`: 18 files, 94 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Local route checks returned 200 for `/sample-garden/catalogue`, `/sample-garden/plants`, `/app/plant-catalogue`, and `/app/my-plants`.
- Rendered `/sample-garden/catalogue` contained `Find Plants` and `Choose plants that fit`; it contained zero `Plant Guide` and zero `Browse plant guide` matches.
- Rendered `/sample-garden/plants` contained `My Plants` and `Find Plants`; it contained zero `Plant Guide` and zero `Browse plant guide` matches.

## Evidence Limits

- Product Design Browser/Chrome capture tools were not exposed in this thread; Playwright was not used because explicit approval is required.
- Current proof is source, server-rendered/component tests, build, route checks, and rendered HTML probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
