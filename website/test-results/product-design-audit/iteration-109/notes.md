# Product Design Audit Iteration 109

Scope: simplify the Garden Map suggestion tab label so the drawer speaks to the gardener's next action instead of an abstract idea bucket.

Capture status: no new screenshots were captured in this pass. Product Design Browser capture was not exposed through available tools, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- Garden Map drawer tab changed from `Ideas` to `Next`.
- Existing care suggestions still render from the same underlying suggestion flow.
- Regression coverage now expects `Next` and rejects the old `Ideas` tab label.

## Product Design Read

Step 1, drawer navigation: improved. `Next` maps directly to the user's question: what should I do next?

Step 2, simplicity: improved. The tab set now reads as `Details`, `Care`, `Next`, `Add`, which is clearer than `Details`, `Care`, `Ideas`, `Add`.

Step 3, consistency: improved. The Garden Map now matches the homepage and calendar emphasis on next steps.

Step 4, public and signed-out routes: healthy. No stale visible-copy regression found in rendered route HTML.

## Verification

- `npm test -- empty-state-content.test.ts sample-garden.test.ts garden-suggestions-history.test.ts`: 3 files, 24 tests passed.
- `npm test`: 17 files, 84 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route visible-copy scan: passed for 14 routes at `http://localhost:3020`.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- Protected signed-in app states still rely primarily on component rendering tests without a real signed-in browser session.
- Internal code names still use `ideas` for the suggestion mode; this pass only changes user-facing copy.
