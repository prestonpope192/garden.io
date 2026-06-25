# Iteration 367 - Garden Check Title

## Objective

Make the Ask surface read like a simple garden tool, not a repeated homepage tagline.

## Product Design Read

- Used Product Design audit routing and critical overrides.
- Ran saved Product Design context preflight.
- Used session-budget guidance for build-work verification.
- Used Garden.io memory for the living botanical notebook / smart companion tension.

## Finding

The live `/sample-garden/ask` route repeated the marketing promise before the gardener got to the action:

- `Your garden, smarter`
- `Your garden, smarter`
- `4 plants saved in 3 beds`

That made the tool surface feel promotional and redundant. Inside the app, the user is not evaluating the product; they are trying to check the garden.

## Change

- Changed the shared Ask view title to `Garden Check`.
- Changed the GardenAskView screen-reader heading to `Garden Check`.
- Changed the visible kicker to `Today`, so the opening structure reads `Garden Check Today 4 plants saved in 3 beds`.
- Updated focused tests to require the new title/kicker and reject the old duplicated structure.

## Verification

- Focused tests passed from the website package: `ai-first-garden-home.test.tsx` and `sample-garden.test.ts` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/ask` contains `Garden Check`, `Today`, `4 plants saved in 3 beds`, and `Notice what changed, then save what to try next with the plant.`
- Live `/sample-garden/ask` does not contain `Your garden, smarter Your garden, smarter` or `Your garden, smarter 4 plants saved`.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
