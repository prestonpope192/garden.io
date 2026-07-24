# Iteration 338 - Public Catalogue Choose Plants Copy

Date: 2026-06-24
Surface: public catalogue and public plant detail pages
Health: Green

Goal: Make the prospect-facing plant catalogue match the Field Guide direction: choosing plants by real garden conditions.

Changes:
- Changed the public catalogue nav, hero label, summary aria label, and results label from `Find plants` to `Choose plants`.
- Changed the public catalogue headline from `Find the right plant for the right spot.` to `Choose the right plant for the right spot.`
- Changed the public plant detail nav and hero label from `Find plants` to `Choose plants`.
- Updated tests to require the new copy and reject the old public catalogue phrasing.

Files:
- `website/app/catalog/page.tsx`
- `website/app/catalog/[slug]/page.tsx`
- `website/components/public-catalogue-browser.tsx`
- `website/tests/public-catalogue-content.test.ts`
- `website/tests/catalogue-format.test.ts`

Evidence:
- Product Design audit, Product Design critical overrides, saved user-context preflight, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `public-catalogue-content.test.ts`, `catalogue-format.test.ts`, `homepage-content.test.ts`, and `auth-gate-content.test.ts` - 4 files, 28 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/catalog` contains `Choose plants` and `Choose the right plant for the right spot.`
- Live `/catalog` did not return `Find plants` or `Find the right plant` in the route probe.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
