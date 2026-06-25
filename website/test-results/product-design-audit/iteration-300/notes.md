# Iteration 300 - App Shell Language

Date: 2026-06-23 20:43 CDT
Preview: http://127.0.0.1:3021

## Scope

Make the homepage and app shell copy align with the simpler `Your garden, smarter` direction and the garden-journal / field-guide feel.

## Changed

- Confirmed the homepage hero is now `Your garden, smarter.` instead of `Know what to do next.`
- Confirmed the homepage support line is user-facing: `A calm garden notebook for what you planted, where it lives, what changed, and what to care for now.`
- Changed app navigation and view titles from `Plant Guide` to `Field Guide`.
- Changed Ask shortcuts from `Plant guide` / `Open the plant guide` to `Field guide` / `Open the field guide`.
- Changed the main app plants title/nav from `My Plants` to `Plants`.
- Changed the plants drawer stamp and aria label from `My Plants` to `Plants`.
- Changed the plants view CTA from `Open plant guide` to `Open field guide`.
- Changed signed-in catalogue empty state from `Plant guide` to `Field guide`.

## Evidence

- Product Design audit skill, critical overrides, and user-context preflight were used during this pass.
- Garden.io memory was checked to preserve the botanical notebook / living memory direction.
- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, `empty-state-content.test.ts`, `catalogue-format.test.ts`, and `public-catalogue-content.test.ts` - 5 files, 48 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Preview restarted at `http://127.0.0.1:3021`.
- Live `/` contains `Your garden, smarter`, `A calm garden notebook`, and `Start your garden`.
- Live `/sample-garden/ask` contains `Your garden, smarter`, `Garden notes`, `This week`, and `Field guide`.
- Live `/sample-garden/plants` contains `Plants` and no visible `My Plants` match in the checked output.
- Live `/sample-garden/catalogue` contains `Field Guide` and `Find plants that fit`.

## Limit

Browser screenshot capture was not used. The required Product Design Browser/Chrome screenshot tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Target

Continue simplifying the logged-answer and drawer feedback states so they sound like useful garden actions, not internal product workflow.
