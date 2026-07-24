# Iteration 382 Notes

Scope: make the public catalogue hero summary read more plainly.

## Change

- Changed the public catalogue summary pair from `Keep the story` / `notes, weather, and photos` to `Keep notes` / `weather and photos together`.
- Updated focused catalogue tests to require the new phrase and reject the old awkward wording.

## Rationale

`Keep the story` is poetic but vague. `Keep notes` is clearer in a three-second scan, and `weather and photos together` connects the catalogue to the garden notebook without making the user parse a slogan.

## Evidence

- Focused tests passed from the website package: `catalogue-format.test.ts` and `public-catalogue-content.test.ts` - 2 files, 22 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/catalog` returned `200`, contains `Keep notes` and `weather and photos together`, and does not contain `Keep the story`.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
