# Iteration 380 Notes

Scope: make the My Garden page describe the actual gardener task more plainly.

## Change

- Changed the My Garden route subtitle from `See what grows where, with notes and care in one place.` to `See each bed, what grows there, and what needs care next.`
- Changed the My Garden section label from `Garden places` to `Beds and areas`.
- Updated sample app tests to require the clearer subtitle and section label and reject the old vague wording.

## Rationale

`Garden places` and `what grows where` were understandable, but still abstract. `Beds and areas` maps to the visible structure on the page, and the new subtitle tells the user what they get from the screen: beds, plants, and next care.

## Evidence

- Focused test passed from the website package: `sample-garden.test.ts` - 1 file, 13 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/sample-garden/property` returned `200`, contains `See each bed, what grows there, and what needs care next.` and `Beds and areas`, and does not contain `See what grows where, with notes and care in one place.` or `Garden places`.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
