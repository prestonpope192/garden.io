# Product Design Audit Iteration 110

Scope: simplify the selected Garden Map detail summary so the next item reads as garden care, not shorthand.

Capture status: no new screenshots were captured in this pass. Product Design Browser capture was not exposed through available tools, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- Selected Garden Map details now say `Next care:` instead of `Next:`.
- Regression coverage now expects the clearer `Next care:` copy and rejects `Next: ` in the rendered selected plant detail state.

## Product Design Read

Step 1, selected detail summary: improved. The next item is now clearly a care item, not a vague app status.

Step 2, consistency: improved. Garden Map details now match Plants cards and the broader `what needs care next` promise.

Step 3, user comprehension: improved. The label tells a gardener why the line matters: it is the next care action for that place or plant.

Step 4, public and signed-out routes: healthy. No stale visible-copy regression found in rendered route HTML.

## Verification

- `npm test -- empty-state-content.test.ts sample-garden.test.ts`: 2 files, 16 tests passed.
- `npm test`: 17 files, 84 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route visible-copy scan: passed for 14 routes at `http://localhost:3020`.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- Protected signed-in app states still rely primarily on component rendering tests without a real signed-in browser session.
- This pass changes copy only; deeper visual hierarchy and interaction QA still need a browser-backed screenshot pass.
