# Iteration 423 - My Garden Summary Promise

Date: 2026-06-24

## Scope

Make the My Garden summary line reinforce the app's simple loop: notes, photos, and care stay together by place.

## Changed

- Changed the populated My Garden summary from `Open any bed to see notes and photos.` to `Open any bed to see notes, photos, and care.`
- Updated the sample-garden content test to require the fuller user-facing promise and reject the old shorter line.

## Evidence

- Product Design audit guidance, Product Design critical overrides, Product Design saved-context preflight, current-state docs, branding docs, Garden.io memory, current source/tests, and rendered local route output were used.
- Product Design saved-context preflight found a context file but no saved entries, so this pass used current repo docs and local route evidence.
- Focused test passed from the website package: `sample-garden.test.ts` - 1 file, 13 tests.
- Live `/sample-garden/property` route-output probe found `Open any bed to see notes, photos, and care.` and did not find `Open any bed to see notes and photos.`
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Source readback confirmed the new line in `property-view.tsx` and the new/old copy guards in `sample-garden.test.ts`.

## Limit

Browser screenshot capture was not used. Browser tools were not exposed in this turn, and Computer Use remains blocked from the Codex app by safety policy. Playwright fallback requires explicit permission under the Product Design rules.
