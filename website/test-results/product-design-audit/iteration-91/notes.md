# Product Design Audit Iteration 91

Scope: continue simplifying the homepage and app copy around editable app controls, with emphasis on user-facing gardening intent rather than app mechanics.

Capture status: no new screenshots were captured in this pass. Browser and Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. Validation used component rendering, local build output, and live route HTML from `http://127.0.0.1:3020`.

## What Changed

- Plant cards now use `See place` with an accessible label that explains the action as seeing where the plant is planted in the Garden Map.
- Editable plant cards now say `Next care:` instead of the more generic `Next:`.
- Plant drawer tabs now use `Details`, `History`, and `Log` instead of `Overview`, `History`, and `Actions`.
- Property drawer tabs now use `Details`, `Care`, `Ideas`, and `Log` instead of `Overview`, `Tasks`, `Next steps`, and `Add`.
- Suggested care actions now use `Add to care list` and `Skip` instead of `Add task` and `Not now`.
- Plant check results now use `Try next` and `Add to care list` instead of task-oriented/internal wording.
- Empty upcoming timeline copy now says `Nothing planned yet.`

## Product Design Read

Step 1, homepage hero: healthy. The homepage continues to lead with the user problem: remembering what was planted and what needs care next.

Step 2, homepage value sections: healthy. No new homepage copy regressions were found in this pass.

Step 3, sample Garden Map: healthy. The sample stays read-only and avoids editable setup controls.

Step 4, sample Plants: healthier. The sample preserves `Next care:` and the editable app now matches that same care-first phrasing.

Step 5, editable Plants: improved. Plant placement actions are now about seeing where something is planted instead of viewing/opening app machinery.

Step 6, editable Property drawer: improved. The tabs now describe user intent: details, care, ideas, and logging.

Step 7, Calendar suggestions: improved. Suggestion actions now describe adding something to the care list or skipping it.

Step 8, Plant check: improved. Result actions now use plain gardening language and avoid diagnosis-assistant/task phrasing.

## Verification

- `npm test -- empty-state-content.test.ts sample-garden.test.ts diagnose-panel-content.test.ts homepage-content.test.ts`: 4 files, 18 tests passed.
- `npm test`: 17 files, 80 tests passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Rendered-route scan: passed for 12 routes.

## Remaining Risk

- Screenshot evidence is still limited because the available browser capture paths were unavailable and Playwright has not been approved as a fallback.
- Protected `/app/*` routes render the auth gate in route HTML without a signed-in session, so editable app states are verified through component tests rather than browser screenshots.
- Next cleanup pass should inspect filter language and secondary catalogue controls, especially `Filter plants`, `Clear filters`, `Open guide`, and any remaining generic status language.
