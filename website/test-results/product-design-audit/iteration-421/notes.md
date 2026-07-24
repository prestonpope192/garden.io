# Iteration 421 - Homepage Saved-Notes Value

Date: 2026-06-24

## Scope

Make the homepage habit loop explain the smart-garden value more plainly without reverting to heavy AI/product language.

## Changed

- Kept the hero headline as `Your garden, smarter.`
- Changed the third habit card from `Check with its notes` to `Ask from saved notes`.
- Changed the supporting line to explain that answers start with where the plant grows and what the gardener already noticed.
- Updated homepage content tests to require the new phrasing and reject the vague old copy.

## Evidence

- Used orchestratror-mode framing: main thread kept the copy judgment and validation bar; bounded parallel reads scanned homepage source/tests for remaining developer/product phrasing.
- Product Design critical overrides, current homepage source, existing homepage tests, and Garden.io memory were used.
- Focused test passed from the website package: `homepage-content.test.ts` - 1 file, 5 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Source readback confirmed `Ask from saved notes` and rejected the old `Check with its notes` copy in tests.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed in this turn, and the only available screenshot-capable app tool has been blocked by safety policy for the Codex app in this session. Playwright fallback requires explicit permission under the Product Design rules.
