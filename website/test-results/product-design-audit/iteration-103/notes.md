# Product Design Audit Iteration 103

Scope: simplify sample Plants age labels so the demo reads like a garden memory, not a compact data table.

Capture status: no new screenshots were captured in this pass. Product Design Browser capture was not exposed through available tools, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- Sample Plants cards now use full-word time-in-ground labels.
- `4w 5d in ground` now displays as `4 weeks, 5 days in ground`.
- `11w 5d in ground` now displays as `11 weeks, 5 days in ground`.
- `8w 2d in ground` now displays as `8 weeks, 2 days in ground`.
- Future planted dates now say `plants in X days` instead of `planted X days from now`.
- Sample-garden tests now guard against compressed `w/d` duration labels returning.

## Product Design Read

Step 1, sample Plants list: improved. Plant age now reads in natural language while staying scannable.

Step 2, demo comprehension: improved. A prospective user no longer has to decode shorthand before understanding the plant record.

Step 3, My Plants list/card consistency: improved. The same formatter powers grid and list displays.

Step 4, public and signed-out routes: healthy. No stale visible-copy regression found in rendered route HTML.

## Verification

- `npm test -- sample-garden.test.ts empty-state-content.test.ts`: 2 files, 15 tests passed.
- `npm test`: 17 files, 83 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route visible-copy scan: passed for 14 routes at `http://localhost:3020`.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- Protected signed-in app states still rely primarily on component rendering tests without a real signed-in browser session.
- More compact date language may still be useful in dense table views later, but the current sample/demo priority is immediate comprehension.
