# Iteration 364 - Homepage Promise Copy

## Objective

Remove the remaining homepage phrasing that talks like a product data model instead of a gardener-facing promise.

## Product Design Read

- Used Product Design audit routing and critical overrides.
- Ran saved Product Design context preflight.
- Used orchestratror-mode for bounded orchestration: main thread kept the prioritization and edit review, with parallel tool reads for evidence gathering.
- Used session-budget guidance for build-work verification.
- Used Garden.io memory for the living botanical notebook / smart companion tension.

## Finding

The homepage promise grid had one remaining internal phrase:

- `Care from the plant record`

That language makes the product architecture visible. A gardener is more likely to think, "check this plant with the notes I already saved."

## Change

- Replaced `Care from the plant record` with `Check with its notes`.
- Replaced `When something looks off, start with that plant's place and notes.` with `When something looks off, start with where it grows and what you already noticed.`
- Updated the homepage content test to require the new phrase and reject the old one.

## Verification

- Focused homepage test passed from the website package: `homepage-content.test.ts` - 1 file, 4 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/` contains `Check with its notes` and `When something looks off, start with where it grows and what you already noticed.`
- Live `/` does not contain `Care from the plant record` or `When something looks off, start with that plant's place and notes.`

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
