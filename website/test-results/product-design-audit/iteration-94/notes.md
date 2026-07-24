# Product Design Audit Iteration 94

Scope: continue simplifying destructive, undo-adjacent, and completion copy so gardeners understand what will happen before they act.

Capture status: no new screenshots were captured in this pass. Browser and Chrome capture are not exposed in this environment, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- Delete confirmations now say `Remove ...` instead of `Delete ...`.
- Confirmation cancel buttons now say `Keep ...` with the specific item name.
- Plant status actions now say `Move to past plants` and `Move back to growing`.
- Note, care-list, and result removal actions now say `Remove note`, `Remove from care list`, and `Remove result`.
- Completed care items now sit under `Done` instead of `Completed`.
- Care-list checkbox labels now say `Mark care item done` and `Put care item back on the list`.
- Removal feedback now tells users where the change happened: `Note removed from your garden`, `Result removed from this plant`, and `Moved back to growing plants`.

## Product Design Read

Step 1, homepage hero: healthy. No regression found in rendered route scan.

Step 2, homepage value sections: healthy. The core promise still centers on remembering what was planted and what needs care next.

Step 3, sample garden property: improved. Destructive controls now use `Remove` and scoped keep/remove confirmation labels.

Step 4, sample garden plants: improved. Plant lifecycle actions now use plain garden language instead of status-machine language.

Step 5, sample garden calendar: improved. Care-list completion now reads as `To do` / `Done`, with clearer checkbox labels.

Step 6, plant timeline/results: improved. Result removal copy is more specific and less abrupt.

Step 7, signed-in app routes: no stale-copy regression found in route HTML. Protected editable states still rely on component rendering tests.

## Verification

- `npm test -- empty-state-content.test.ts sample-garden.test.ts garden-mutation-copy.test.ts garden-timeline.test.ts`: 4 files, 27 tests passed.
- `npm test`: 17 files, 81 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route scan: passed for 13 routes at `http://localhost:3020` with no hits for old labels such as `Delete this`, `Mark finished`, `Return to growing`, `Back in growing plants`, `Reopen task`, `Complete task`, `Task added`, `Task completed`, or `Open it on this device`.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- Protected signed-in app states still rely primarily on component rendering tests without a real signed-in browser session.
- Next pass should audit form labels, empty-state helper text, and whether first-run setup asks for the smallest useful amount of input.
