# Product Design Audit Iteration 105

Scope: remove raw database dates from plant summaries so sample and in-app plant records read like gardener-facing copy.

Capture status: no new screenshots were captured in this pass. Product Design Browser capture was not exposed through available tools, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- Past plant cards now show readable planted dates, such as `planted Jun 1`, instead of raw ISO strings.
- The selected plant drawer now uses the same readable planted-date formatter.
- Past plant cards now reuse the plain plant-count formatter used by growing cards.
- Sample-garden tests now guard against `planted 2026-` and direct raw planted-date rendering returning.

## Product Design Read

Step 1, plant summaries: improved. Dates now read like a gardening note instead of exported database data.

Step 2, selected drawer consistency: improved. The drawer and cards now share the same readable count and planted-date model.

Step 3, prospective-user trust: improved. Seeing natural dates reinforces that Garden.io is a simple memory for the garden, not a technical record screen.

Step 4, public and signed-out routes: healthy. No stale visible-copy regression found in rendered route HTML.

## Verification

- `npm test -- sample-garden.test.ts empty-state-content.test.ts`: 2 files, 16 tests passed.
- `npm test`: 17 files, 84 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route visible-copy scan: passed for 14 routes at `http://localhost:3020`.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- Protected signed-in app states still rely primarily on component rendering tests without a real signed-in browser session.
- Past-plant interactive states are source/test verified rather than click-through verified because the available test environment does not include a DOM interaction harness.
