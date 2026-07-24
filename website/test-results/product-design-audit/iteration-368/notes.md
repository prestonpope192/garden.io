# Iteration 368 - My Garden Next Plant

## Objective

Make the My Garden next-action drawer point directly to the plant the gardener should check, instead of using generic place language.

## Product Design Read

- Used Product Design audit routing and critical overrides.
- Ran saved Product Design context preflight.
- Used session-budget guidance for build-work verification.
- Used Garden.io memory for the living botanical notebook / smart companion tension.

## Finding

The live `/sample-garden/property` route showed:

- `First place to check`
- `Start with the next plant to check, or open any bed for notes and photos.`

The card itself is about a plant, `Bell Pepper`, so `place` made the next action less direct. The second line also repeated the same idea rather than helping the gardener decide what to do.

## Change

- Changed `First place to check` to `First plant to check`.
- Changed `Start with the next plant to check, or open any bed for notes and photos.` to `Start here, or open any bed for notes and photos.`
- Updated focused tests to require the new wording and reject the old wording.

## Verification

- Focused tests passed from the website package: `sample-garden.test.ts` and `empty-state-content.test.ts` - 2 files, 21 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/property` contains `First plant to check`, `Start here, or open any bed for notes and photos.`, `Bell Pepper`, and `Open plant notes`.
- Live `/sample-garden/property` does not contain `First place to check` or `Start with the next plant to check, or open any bed for notes and photos.`

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
