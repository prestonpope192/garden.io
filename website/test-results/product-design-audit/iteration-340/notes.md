# Iteration 340 Notes

Date: 2026-06-24
Surface: signed-out app fallback copy
Task class: build work
Destination: local audit folder

## Objective

Keep the signed-out app fallback copy aligned with the simplified `Choose plants` language used on the homepage, public catalogue, and signed-out app entry.

## Product Design Steps

1. Signed-out unavailable-state copy
   - Health: Green
   - Output: `website/components/auth-gate.tsx`
   - Changed the fallback message from `find plants that fit` to `choose plants for your light, water, and beds`.

2. CTA language regression coverage
   - Health: Green
   - Output: `website/tests/auth-gate-content.test.ts`
   - Updated the auth-gate content test to require the new unavailable-state phrase and reject the old one.

3. Public/app consistency check
   - Health: Green
   - Output: this audit note and the verification commands below
   - Confirmed the remaining `Find plants` references in the scanned files are negative regression assertions, not visible product copy.

## Evidence

- Used `$orchestratror-mode` for this pass: main thread kept copy judgment and final review; bounded parallel tool reads handled repo scans and verification.
- Product Design audit, Product Design critical overrides, saved user-context preflight, and Garden.io memory were read during this pass.
- Product Design saved context preflight found no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `auth-gate-content.test.ts`, `homepage-content.test.ts`, `public-catalogue-content.test.ts`, and `catalogue-format.test.ts` - 4 files, 28 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/app/my-property` contains `Choose plants` and `Your garden, smarter`.
- Live `/app/my-property` does not contain `Find plants`, `Find plants that fit`, or `find plants that fit`.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
