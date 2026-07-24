# Product Design Audit Iteration 102

Scope: simplify plant-guide use labels so prospective users see garden benefits instead of raw plant-use taxonomy.

Capture status: no new screenshots were captured in this pass. Product Design Browser capture was not exposed through available tools, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- Public plant guide use labels now map raw values to gardener-facing benefits.
- `Pest Confusion` now displays as `Helps deter pests`.
- `Companion Plant` now displays as `Companion planting`.
- `Pollinator Support` now displays as `Pollinators`.
- `Fresh herb` now displays as `Fresh herbs`.
- `Xeriscape` now displays as `Dry garden`.
- The signed-in Plant Guide now reuses the same formatter as the public catalogue.
- Catalogue tests now guard against raw use labels returning on filtered public browse and signed-in guide cards.

## Product Design Read

Step 1, public plant detail: improved. French Marigold now explains its value in plain terms: color, pest help, and companion planting.

Step 2, public plant browse: healthy. Broad browse stays compact, while narrowed browse can show benefit chips without exposing raw taxonomy.

Step 3, signed-in Plant Guide: improved. App and public surfaces now use the same plant-use language.

Step 4, trust and comprehension: improved. Labels now answer `why would I plant this?` instead of asking users to decode category names.

Step 5, rendered public and signed-out routes: healthy. No stale visible-copy regression found in route HTML.

## Verification

- `npm test -- catalogue-format.test.ts public-catalogue-content.test.ts`: 2 files, 13 tests passed.
- `npm test`: 17 files, 83 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route visible-copy scan: passed for 14 routes at `http://localhost:3020`.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- Protected signed-in app states still rely primarily on component rendering tests without a real signed-in browser session.
- Search still uses raw `primary_use_cases` values internally so users can find plants by common taxonomy terms; this pass changed display labels only.
