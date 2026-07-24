# Iteration 503 - My Garden Care Prompt Copy

Date: 2026-06-24
Surface: My Garden sample guide
Health: Green

## Goal

Remove abstract product-language from the My Garden care prompt and make the next action feel like a practical gardening habit.

## Change

- Changed `Start with Bell Pepper. View its notes when you need context.` to `Start with Bell Pepper. Read its notes before you act.`
- Updated sample garden coverage to require the new phrase and reject the old `need context` phrasing.

## Files

- `website/components/views/property-view.tsx`
- `website/tests/sample-garden.test.ts`

## Evidence

- Product Design audit guidance, Product Design critical overrides, session-budget guidance, and Garden.io memory were read during this pass.
- Route probe of `/sample-garden/property` found `Read its notes before you act` and did not find `View its notes when you need context` or `Open it when you want its notes`.
- Focused tests passed: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `app-flow-visual-css.test.ts` - 3 files, 31 tests.
- Full `npm test` passed: 23 files, 131 tests.
- `npm run build` passed.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
- This pass covers one My Garden guide line. Other app surfaces should still be audited for abstract terms like `context` when they appear in visible copy.
