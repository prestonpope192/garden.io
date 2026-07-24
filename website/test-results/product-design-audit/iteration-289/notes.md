# Iteration 289 - Plant Guide Label Split

Date: 2026-06-24
Preview: http://127.0.0.1:3021

## Objective

Reduce app navigation confusion between "My Plants" and "Find Plants" by giving the signed-in/sample app browse surface a distinct guide label while preserving the public marketing/catalogue language.

## Audit Scope

- App shell navigation.
- Real app Plant Guide title/subtitle.
- Sample app Plant Guide title/subtitle.
- Ask-home shortcut to the plant browsing surface.
- Empty signed-in plant guide state.
- Saved-plants empty-state CTA.
- Public catalogue route label check.

## Finding

"My Plants" and "Find Plants" sat next to each other and were too similar. For a prospective or new user, the distinction is clearer if "My Plants" means the user's living plant records and "Plant Guide" means the place to browse/choose plants that fit their beds.

The public catalogue can still say "Find plants" because it is a public discovery surface, not adjacent to a personal plant-record tab.

## Changes

- App shell nav label changed from "Find Plants" to "Plant Guide."
- Real app and sample app catalogue view titles changed to "Plant Guide."
- Plant Guide subtitle changed to "Choose plants that fit the beds you have."
- Ask-home shortcut changed from "Find plants" to "Plant guide."
- Empty signed-in guide state now says "Plant guide" and "No plant records are ready yet."
- Saved-plants empty-state CTA changed from "Find plants" to "Open plant guide."

## Proof

- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, `empty-state-content.test.ts`, `catalogue-format.test.ts`, and `public-catalogue-content.test.ts` - 5 files, 48 tests.
- Full `npm test` passed: 23 files, 128 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Preview restarted at `http://127.0.0.1:3021`.
- Rendered sample ask route contains "Plant guide" and "Choose what fits the beds you have."
- Rendered sample catalogue route contains "Plant Guide" and "Choose plants that fit the beds you have."
- Rendered public catalogue route still contains "Find plants" and "Find plants that fit your garden."

## Evidence Limit

The Product Design Browser tool was not exposed in this environment, and the fallback Playwright path requires explicit permission under the Product Design rules. This pass used rendered HTML, source inspection, and automated tests rather than accepted screenshots.
