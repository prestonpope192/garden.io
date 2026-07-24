# Product Design Audit Iteration 108

Scope: tighten the homepage AI value proposition so it addresses the user concern that garden advice should be based on their real garden, not generic tips.

Capture status: no new screenshots were captured in this pass. Product Design Browser capture was not exposed through available tools, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- Homepage value card changed from `Get a useful next step` to `Get AI advice grounded in your garden`.
- Supporting copy now says suggestions use notes, photos, timing, and weather.
- The old `AI can use your notes...` phrasing is now covered by a negative regression assertion.

## Product Design Read

Step 1, homepage promise: improved. The copy now frames AI as grounded support, not a generic feature.

Step 2, user trust: improved. The text answers a likely concern: advice should fit what is actually happening outside.

Step 3, simplicity: improved. The homepage still keeps the three-step mental model: know what is where, save what happened, get grounded next steps.

Step 4, public and signed-out routes: healthy. No stale visible-copy regression found in rendered route HTML.

## Verification

- `npm test -- homepage-content.test.ts auth-gate-content.test.ts sample-garden.test.ts`: 3 files, 15 tests passed.
- `npm test`: 17 files, 84 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route visible-copy scan: passed for 14 routes at `http://localhost:3020`.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- Protected signed-in app states still rely primarily on component rendering tests without a real signed-in browser session.
- This pass only changes the homepage value copy; more deep signed-in workflow simplification may still be needed.
