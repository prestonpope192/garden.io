# Product Design Audit Iteration 104

Scope: simplify sample Plants quantity labels so the demo reads like a garden record rather than a compressed status table.

Capture status: no new screenshots were captured in this pass. Product Design Browser capture was not exposed through available tools, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- Growing plant cards now show plain plant counts.
- `6 growing` now displays as `6 plants`.
- `2 growing` now displays as `2 plants`.
- `1 growing` now displays as `1 plant`.
- The selected plant drawer uses the same plant-count formatter.
- Sample-garden tests now guard against the clipped `N growing` card labels returning.

## Product Design Read

Step 1, sample Plants cards: improved. Quantity now describes the thing the user has: plants.

Step 2, status clarity: improved. The `Growing` badge owns status, while the metadata line owns count and time in ground.

Step 3, selected plant drawer: improved. The drawer summary now uses the same count language as the cards.

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
- Dense table views may eventually need a shorter count format, but the current sample/demo priority is immediate comprehension.
