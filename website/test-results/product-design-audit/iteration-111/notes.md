# Product Design Audit Iteration 111

Scope: make plant-check failure and recovery copy calmer and more user-facing.

Capture status: no new screenshots were captured in this pass. Product Design Browser capture was not exposed through available tools, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, route-handler tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- Plant-check panel fallback now says `We couldn't check this plant right now...` instead of `Plant checks could not run...`.
- Plant-check API unavailable copy now says `We can't check this plant right now. You can still save a note and try again later.`
- Busy, timeout, and retry copy now use direct recovery language instead of system-ish `could not finish` / `taking too long` phrasing.
- Regression tests now reject `could not run`, `unavailable`, and `could not` in the user-facing plant-check failure path.

## Product Design Read

Step 1, plant-check error state: improved. The failure message now sounds like the app is speaking to a gardener, not reporting an internal job failure.

Step 2, recovery path: improved. The copy preserves the user's next action: save a note and try again later.

Step 3, trust: improved. Plant checks are an AI-supported feature, so calm, non-technical error wording matters more than in a normal form.

Step 4, public and signed-out routes: healthy. No stale visible-copy regression found in rendered route HTML.

## Verification

- `npm test -- diagnose-panel-content.test.ts diagnose-route-copy.test.ts`: 2 files, 2 tests passed.
- `npm test`: 17 files, 84 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route visible-copy scan: passed for 14 routes at `http://localhost:3020`.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- The plant-check failure states are verified through component and route-handler tests, not a real signed-in browser interaction.
- Broader plant-check result UX still needs browser-backed visual QA.
