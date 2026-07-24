# Iteration 378 Notes

Scope: make the Garden Check result action sound like a plain weekly task, not a formal plan object.

## Change

- Changed the Garden Check result action button from `Add to care plan` to `Add to this week`.
- Changed the Garden Check result success message from `Added to your care plan.` to `Added to this week.`
- Updated focused Ask tests to require the new result-action copy and reject the old formal wording inside `GardenAskView`.

## Rationale

Garden Check should feel like a quick loop: notice something, get a next step, and put that step where the user will see it this week. `Care plan` sounds more like product structure; `this week` maps to the app's visible weekly care surface.

## Evidence

- Focused test passed from the website package: `ai-first-garden-home.test.tsx` - 1 file, 5 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Source scan confirms `GardenAskView` contains `Add to this week` and `Added to this week.`, and no longer contains `Added to your care plan.`
- Live `/sample-garden/ask` returned `200` and kept the simplified Garden Check entry copy; the changed result action appears after diagnosis, so source/test evidence is the stronger proof for this specific state.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
