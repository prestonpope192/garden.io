# Product Design Audit Iteration 106

Scope: remove raw due-date strings from plant next-care summaries so editable plant records keep the same user-facing date language as the rest of the app.

Capture status: no new screenshots were captured in this pass. Product Design Browser capture was not exposed through available tools, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- Editable growing plant cards now show next-care due dates through `formatGardenDate()`.
- Growing plant list rows now show next-care due dates through `formatGardenDate()`.
- The sample-garden source regression now guards against direct `nextTask.due_on` rendering returning.

## Product Design Read

Step 1, next-care cards: improved. Date language now matches the calendar and Garden Map surfaces.

Step 2, list rows: improved. Dense plant rows no longer expose database-style ISO dates when a user switches to list view.

Step 3, vocabulary consistency: improved. Plant summaries now use the same care/date model across card, list, drawer, calendar, and map contexts.

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
- Editable list-view states are source/test verified rather than click-through verified because the available test environment does not include a DOM interaction harness.
