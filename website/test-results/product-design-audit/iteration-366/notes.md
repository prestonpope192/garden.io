# Iteration 366 - Plant Journal Naming

## Objective

Make the Plants route read as one clear garden-journal surface instead of repeating `Plants` and `Plant journal` in adjacent areas.

## Product Design Read

- Used Product Design audit routing and critical overrides.
- Ran saved Product Design context preflight.
- Used session-budget guidance for build-work verification.
- Used Garden.io memory for the living botanical notebook / smart companion tension.

## Finding

The live `/sample-garden/plants` route read:

- `Plants`
- `Plants`
- `Plant journal`

That made the surface feel more like app navigation labels than a calm notebook. The route needed one clear name and a direct drawer prompt.

## Change

- Changed the shared Plants view title to `Plant Journal`.
- Changed the Plants drawer accessible label to `Plant journal`.
- Changed the drawer stamp to `Your plants`.
- Changed the default drawer section label to `Pick a plant`.
- Updated focused tests to require the new labels and reject the old duplicate framing.

## Verification

- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/plants` contains `Plant Journal`, `Your plants`, `Pick a plant`, and `4 saved plants in 3 beds`.
- Live `/sample-garden/plants` does not contain the old visible `Plants Plant journal` sequence or `My Plants`.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
