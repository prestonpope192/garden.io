# Iteration 319 - Public Plant Detail Fit Copy

Date: 2026-06-23
Surface: public plant detail page
Health: Green

Goal: Make public plant detail headings answer practical gardener questions instead of sounding generic or product-directed.

Changes:
- Changed fit section label from `Good spot` to `Before you plant`.
- Changed fit section headline from `Match the plant to the place.` to `Check the spot first.`
- Changed CTA label from `Grow this plant` to `Add it to your garden`.
- Changed CTA headline from `Plant it in the right place.` to `Give it the right place.`
- Updated public catalogue tests to require the new labels and reject the old phrases.

Files:
- `website/app/catalog/[slug]/page.tsx`
- `website/tests/public-catalogue-content.test.ts`

Evidence:
- Product Design audit, Product Design index, user-context preflight, critical overrides, session-budget guidance, orchestrator-mode guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `public-catalogue-content.test.ts` and `catalogue-format.test.ts` - 2 files, 22 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/catalog/calendula` contains `Before you plant`, `Check the spot first`, `Add it to your garden`, and `Give it the right place`.
- Live `/catalog/calendula` did not return old `Good spot`, `Match the plant to the place`, `Grow this plant`, or `Plant it in the right place` phrases.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
