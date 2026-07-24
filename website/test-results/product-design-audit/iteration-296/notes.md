# Iteration 296 - Ask Shortcut Simplification

Date: 2026-06-23
Preview: http://127.0.0.1:3021

## Goal

Make the Ask entry feel more like "Your garden, smarter" and less like a product tour by removing explanatory shortcut-card copy.

## What Changed

- Kept the Ask entry anchored on "Your garden, smarter."
- Changed the three lower Ask shortcuts from card-style labels with descriptions to compact utility links: "Garden notes," "This week," and "Plant guide."
- Removed the old shortcut descriptions: "Beds, plants, and notes together," "Watering, harvests, and checks in one place," and "Find plants for the beds you have."
- Replaced the old shortcut card treatment with lighter journal-style pill links.
- Updated mobile styling so the links remain tappable without becoming stacked cards.
- Updated tests to guard the simpler user-facing labels and prevent the old explanatory copy/card styling from returning.

## Evidence

- Product Design critical overrides were reread during the pass.
- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, `mobile-layout-css.test.ts`, and `homepage-content.test.ts` - 4 files, 24 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Source scan found the old shortcut phrases only in negative test guards.
- Preview restarted at `http://127.0.0.1:3021`.
- Rendered sample Ask route contains "Your garden, smarter," "Garden notes," "This week," and "Plant guide."
- Rendered sample Ask route no longer contains the old shortcut labels or descriptions.
- Rendered homepage and app entry still contain "Your garden, smarter."

## Limit

Browser screenshot capture was not used. Browser/Chrome audit tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Target

When visual capture is available, inspect the first viewport and Ask entry at desktop and mobile sizes. The next likely cleanup is choosing a smaller set of botanical-plate-style catalogue images and reducing any remaining glossy photo emphasis.
