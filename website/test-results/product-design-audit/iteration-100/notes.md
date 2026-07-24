# Product Design Audit Iteration 100

Scope: simplify homepage and sample-garden promise language so the public first impression matches the app's current care-list and save-update model.

Capture status: no new screenshots were captured in this pass. Browser and Chrome capture are not exposed in this environment, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- Homepage `Save what happened` copy now says users can add photos, blooms, harvests, pests, weather notes, and care items.
- The hero fit note now says `what needs care next` instead of `what needs attention`.
- The plant-story section now says photos, notes, harvests, care items, and plant checks stay with the plant they belong to.
- The sample Garden Map drawer now says `What needs care next` instead of `What needs attention`.
- Homepage and sample-garden tests now guard against old task/attention wording returning.

## Product Design Read

Step 1, hero promise: improved. The homepage now repeats `what needs care next`, matching the app's care-list model.

Step 2, tracking-loop copy: improved. `Care items` is clearer than `tasks` for gardeners and matches the Calendar language.

Step 3, plant story section: improved. The copy now names the actual user artifacts: notes, harvests, care items, and plant checks.

Step 4, AI next-step promise: healthy. The page still keeps the AI value simple: notes, timing, and weather make advice fit the user's garden.

Step 5, public and signed-out routes: healthy. No stale visible-copy regression found in rendered route HTML.

## Verification

- `npm test -- homepage-content.test.ts sample-garden.test.ts empty-state-content.test.ts catalogue-format.test.ts diagnose-panel-content.test.ts garden-mutation-copy.test.ts public-catalogue-content.test.ts`: 7 files, 32 tests passed.
- `npm test`: 17 files, 82 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route visible-copy scan: passed for 14 routes at `http://localhost:3020`.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- Homepage visual spacing and hierarchy were not re-screenshotted; this pass verified copy through source, tests, build, and rendered route text.
- Protected signed-in app states still rely primarily on component rendering tests without a real signed-in browser session.
