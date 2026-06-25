# Product Design Audit Iteration 99

Scope: simplify the Plant Guide to signed-in action path so saving, planting, and checking plants use the same user-facing language as My Plants and Garden Map.

Capture status: no new screenshots were captured in this pass. Browser and Chrome capture are not exposed in this environment, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## What Changed

- Signed-in Plant Guide now says `Save for later` instead of `Save as idea`.
- Signed-in Plant Guide helper copy now says `Know where it belongs? Plant it in a bed. Still deciding? Save it for later.`
- Garden mutation feedback now says `Saved for later.` and `Removed from saved plants.`
- Sample garden save feedback now uses `Saved for later.` and `Saved plant kept.`
- Empty saved-plant sample copy now says `Saved plants would appear here...` instead of `Saved plant ideas...`.
- Plant-check save hint now says it saves with the plant's notes and care list, not notes and tasks.
- Restored-plant feedback now says `Marked as growing again.` to match the action label.

## Product Design Read

Step 1, signed-in Plant Guide card actions: improved. `Save for later` maps to the user's decision state better than `Save as idea`.

Step 2, saved-plant feedback: improved. Feedback now points to saved plants, the same place users later find the item.

Step 3, plant-in-bed action: healthy. The primary action still matches the strongest intent when a user knows where the plant belongs.

Step 4, plant-check save hint: improved. The check now references notes and care list rather than internal task terminology.

Step 5, status-change confirmation: improved. The confirmation now matches `Mark as growing again`.

Step 6, public and signed-out routes: healthy. No stale visible-copy regression found in rendered route HTML.

## Verification

- `npm test -- catalogue-format.test.ts diagnose-panel-content.test.ts garden-mutation-copy.test.ts empty-state-content.test.ts sample-garden.test.ts public-catalogue-content.test.ts`: 6 files, 29 tests passed.
- `npm test`: 17 files, 82 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Source stale-copy scan: passed, with hits only in negative test assertions.
- Rendered-route visible-copy scan: passed for 13 routes at `http://localhost:3020`.

## Remaining Risk

- Screenshot evidence is still limited because no approved screenshot capture path is available in this environment.
- The signed-in Plant Guide action state is verified through component rendering tests and source inspection, not a real signed-in click-through session.
- The homepage still has a few remaining `tasks` references that should be reviewed in a later pass against the newer `care list` language.
