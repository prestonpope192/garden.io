# Product Design Audit Iteration 98

Scope: simplify the My Plants drawer so choosing a plant, saving an update, and changing plant status use one clear user-facing model.

Capture status: no new screenshots were captured in this pass. Browser and Chrome capture are not exposed in this environment, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- My Plants selected drawer tab `Log` is now `Update`.
- The selected drawer tab labels now come from one exported map: `Details`, `History`, `Update`.
- The no-selection Plants guide now says to pick a plant to see what happened and what needs care next.
- The growing plant update flow keeps `Save what happened` and `Save update` as the primary action.
- `See where planted` remains a secondary action outside the management section.
- `Move to past plants` and `Mark as growing again` now sit under `Change plant status`.
- Saved-plant removal now says `Remove from saved plants` and sits under `Change saved plant`.
- Removed stale app-ish copy such as `Choose a plant to log a note...`, `Remove plant idea`, and `Move back to growing`.

## Product Design Read

Step 1, My Plants no-selection guide: improved. The drawer now speaks to memory and care instead of history/task terminology.

Step 2, selected plant tab set: improved. `Update` is a clearer home for saving what happened than `Log`.

Step 3, save update flow: healthy. Plants, Quick Log, and Garden Map now share the same `Save what happened` / `Save update` language.

Step 4, location action: healthy. `See where planted` stays available without competing with the save update form.

Step 5, plant status changes: improved. Less frequent lifecycle actions are tucked under `Change plant status`.

Step 6, saved plant actions: improved. Saved-plant removal now uses the user's concept of saved plants instead of `plant idea`.

Step 7, public and signed-out routes: healthy. No stale visible-copy regression found in rendered route HTML.

## Verification

- `npm test -- empty-state-content.test.ts quick-log-content.test.ts sample-garden.test.ts garden-mutation-copy.test.ts`: 4 files, 17 tests passed.
- `npm test`: 17 files, 82 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Source stale-copy scan: passed, with hits only in negative test assertions.
- Rendered-route visible-copy scan: passed for 13 routes at `http://localhost:3020`.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- The selected My Plants drawer tab itself is verified through the exported label map and source/tests, not a click-through browser harness.
- Protected signed-in app states still rely primarily on component rendering tests without a real signed-in browser session.
- Next pass should audit the Plant Guide save/plant actions and the AI check path together so the public-to-signed-in journey feels like one product instead of separate surfaces.
