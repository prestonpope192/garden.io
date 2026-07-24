# Iteration 303 - Drawer And Plant Detail Action Copy

Date: 2026-06-23 20:55 CDT
Preview: http://127.0.0.1:3021

## Scope

Make remaining action labels read like gardener actions instead of app workflow labels.

## Changed

- Changed the property drawer ideas tab from `Next` to `Try`.
- Kept the drawer’s empty state aligned with that label: `Nothing to try right now...`
- Changed the plant detail CTA label from `Keep it in your garden` to `Grow this plant`.
- Changed the plant detail CTA heading from `Add it to a bed.` to `Give it a bed.`

## Evidence

- Product Design audit, user-context preflight, and critical overrides were read during this pass.
- Garden.io memory was checked to preserve the living botanical notebook / useful AI companion tension.
- Focused tests passed: `empty-state-content.test.ts`, `public-catalogue-content.test.ts`, `sample-garden.test.ts`, and `catalogue-format.test.ts` - 4 files, 43 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Preview restarted at `http://127.0.0.1:3021`.
- Source scan found `Keep it in your garden`, `Add it to a bed`, and `>Next<` only in negative test guards.
- Rendered property tests confirm the drawer tabs include `Details`, `Care`, `Try`, and `Update`, and reject `Next`, `Ideas`, and `Actions`.
- Live `/catalog/calendula` contains `Grow this plant`, `Give it a bed`, and `Back to field guide`.
- Live `/` still contains `Your garden, smarter`, `A calm garden notebook`, and `Start with one plant`.

## Limit

Browser screenshot capture was not used. The required Product Design Browser/Chrome screenshot tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Target

Continue checking calendar and care-list language for anything that still sounds like task management instead of garden care.
