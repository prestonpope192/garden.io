# Iteration 550 Notes

Date: 2026-06-24

Scope: align secondary app filters with the simpler `place` language established in the first-run garden setup.

Changed:
- Changed Weekly Care location filter copy from `Area` / `Choose area` / `All areas` to `Place` / `Choose place` / `All places`.
- Changed Plant Journal filters from `Area` / `All areas` to `Place` / `All places`.
- Changed Plant Journal search accessibility and placeholder copy from `name, bed, or area` to `name, bed, or place`.
- Updated tests to require the new filter/search labels and reject the older `area` wording.

Evidence:
- Used Product Design audit guidance, Product Design user-context preflight, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source inspection found that iteration 549 aligned My Garden setup around `place`, but Plants and Weekly Care still exposed `area` in filter controls and search labels.
- Targeted stale-copy scans found no remaining exposed `Choose area`, `All areas`, or `Search ... area` strings in the touched filter/search source, aside from tests that explicitly reject the old copy.

Verification:
- Focused tests passed from the website package: `empty-state-content.test.ts` and `sample-garden.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- Direct browser screenshot capture was not available in this run, so this pass used source/test verification before broader visual checks.
