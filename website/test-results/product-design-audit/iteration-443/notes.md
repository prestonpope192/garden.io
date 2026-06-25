# Iteration 443 - Public Catalogue Action Copy

Date: 2026-06-24
Surface focus:
- Public `/catalog` route
- Catalogue plant card and preview actions

## Scope

Make the repeated public catalogue action read like a simple user command instead of referring to the site's internal "plant note" framing.

## Changes

- Changed public catalogue links from `Open plant note` to `Open plant`.
- Kept the surrounding `Plant notes` and `Field guide` framing where it describes the page context.

## Evidence

- Live `/catalog` route-output probe found repeated `Open plant` links and no `Open plant note` text.
- Focused tests passed from the website package: `public-catalogue-content.test.ts` and `catalogue-format.test.ts` - 2 files, 22 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
