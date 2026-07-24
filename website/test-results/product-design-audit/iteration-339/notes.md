# Iteration 339 - Public Catalogue CTA Consistency

Date: 2026-06-24
Surface: homepage nav and signed-out app entry
Health: Green

Goal: Keep prospect-facing catalogue entry points aligned with the newer `Choose plants` direction.

Changes:
- Changed the homepage catalogue nav link from `Find plants` to `Choose plants`.
- Changed the signed-out app secondary catalogue link from `Find plants that fit` to `Choose plants`.
- Updated homepage and auth-gate tests to require the new CTA copy and reject the older `Find plants` phrasing.

Files:
- `website/app/page.tsx`
- `website/components/auth-gate.tsx`
- `website/tests/homepage-content.test.ts`
- `website/tests/auth-gate-content.test.ts`

Evidence:
- Product Design audit, Product Design critical overrides, saved user-context preflight, session-budget guidance, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `homepage-content.test.ts`, `auth-gate-content.test.ts`, `public-catalogue-content.test.ts`, and `catalogue-format.test.ts` - 4 files, 28 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/` contains `Choose plants` and did not return `Find plants`.
- Live `/app/my-property` signed-out entry contains `Choose plants` and did not return `Find plants` or `Find plants that fit`.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
