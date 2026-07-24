# Product Design Audit Iteration 97

Scope: simplify the Garden Map Add/quick-save flow so adding structure, saving updates, and checking a plant use one coherent user-facing model.

Capture status: no new screenshots were captured in this pass. Browser and Chrome capture are not exposed in this environment, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- Garden Map drawer tab `Log` is now `Add`, since the tab adds areas, beds, plants, and updates.
- Property guide action now says `Add to map` instead of `Add to garden`.
- The Add tab now frames notes as `Save what happened`.
- Note labels now say `Note`, with concrete garden examples in the placeholder.
- Note actions now say `Save update` and `Save and check plant`.
- Removed the duplicate `Move to past plants` action from the Add tab; that action now lives in the Details management disclosure.
- The Plants drawer observation form now uses the same `Save what happened` / `Save update` language as Quick Log and Garden Map.

## Product Design Read

Step 1, Garden Map tab set: improved. `Add` now matches the mixed structural/add-update work better than `Log`.

Step 2, add area/bed/plant flow: improved. These actions now live under an explicit add-to-map concept.

Step 3, save update flow: improved. Garden Map, Plants, and Quick Log now share the same language for recording what happened.

Step 4, plant check flow: improved. `Save and check plant` keeps the AI check tied to the user's own saved observation.

Step 5, plant status movement: improved. Moving a plant to past plants is no longer mixed into the update/check flow.

Step 6, public and signed-out routes: healthy. No stale-copy regression found in rendered route HTML.

## Verification

- `npm test -- empty-state-content.test.ts quick-log-content.test.ts sample-garden.test.ts garden-mutation-copy.test.ts`: 4 files, 17 tests passed.
- `npm test`: 17 files, 82 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route scan: passed for 13 routes at `http://localhost:3020` with no hits for old labels such as `Log`, `Save note`, `Add a note here`, `Add to garden`, `Actions`, `Delete this`, `Mark finished`, `Return to growing`, or prior first-run/empty-state copy.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- Protected signed-in app states still rely primarily on component rendering tests without a real signed-in browser session.
- Next pass should audit the My Plants drawer so its Details/Care/Add flow matches the calmer Garden Map drawer hierarchy.
