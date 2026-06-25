# Iteration 295 - CTA And Helper Text Reduction

Date: 2026-06-23
Preview: http://127.0.0.1:3021

## Goal

Reduce visible instruction and CTA density on the homepage and Ask entry so the experience feels quieter and simpler.

## What Changed

- Removed the top-right marketing nav "Start your garden" CTA.
- Removed the repeated bottom homepage CTA section.
- The homepage now renders one visible "Start your garden" and one visible "Tour a garden" action.
- Removed the Ask entry helper line "The more you save, the more context your garden has."
- Removed the unused `.garden-ai-memory-note` CSS block.
- Removed unused `home-start-cta` CSS selectors tied to the deleted homepage section.
- Updated tests to guard the reduced homepage CTA count and removed Ask helper copy.

## Evidence

- Product Design critical overrides were reread during the pass.
- Focused tests passed: `homepage-content.test.ts`, `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, `mobile-layout-css.test.ts`, and `homepage-visual-css.test.ts` - 5 files, 26 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Source scan found no `home-start-cta`, `garden-ai-memory-note`, or deleted helper text in the homepage, Ask component, or CSS.
- Preview restarted at `http://127.0.0.1:3021`.
- Rendered homepage shows exactly one "Start your garden" and one "Tour a garden."
- Rendered homepage no longer shows "Start with the garden you already have."
- Rendered sample Ask route no longer shows "The more you save, the more context your garden has."

## Limit

Browser screenshot capture was not used. Browser/Chrome audit tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Target

When visual capture is available, inspect the actual first viewport on desktop and mobile. The next likely cleanup is spacing and hierarchy, not more explanatory copy.
