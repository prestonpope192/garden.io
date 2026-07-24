# Iteration 298 - Catalogue Field Guide Language

Date: 2026-06-23
Preview: http://127.0.0.1:3021

## Goal

Make the public catalogue and plant detail flow feel like a field guide connected to the garden journal, not a product scaffold or database view.

## What Changed

- Changed the catalogue headline to `Find the right plant for the right spot.`
- Changed the catalogue support copy to `Search by light, water, space, and use before you make room in a bed.`
- Replaced summary labels `Before planting` / `After planting` with `Match the spot` / `Keep the story`.
- Replaced catalogue preview labels and actions: `Start here` -> `Plant plate`, `Check fit` -> `See this plant`, `Plant kind` -> `Kind`.
- Fixed the catalogue count label so it says `plant in the guide` or `plants in the guide`.
- Changed the plant detail page to use `Field guide`, `Field notes`, `Good spot`, `Match the plant to the place`, `Where it belongs`, and `What to remember`.
- Changed the detail CTA to `Keep it in your garden`, `Add it to a bed`, and `Back to field guide`.
- Updated public catalogue and formatting tests to guard the new user-facing copy and reject the old scaffolding.

## Evidence

- Product Design audit and critical overrides were reread during the pass.
- Product Design user-context preflight ran; no saved product/design entries were available.
- Garden.io brand memory was checked to stay aligned with the botanical notebook / AI-as-marginalia direction.
- Focused tests passed: `public-catalogue-content.test.ts` and `catalogue-format.test.ts` - 2 files, 22 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Preview restarted at `http://127.0.0.1:3021`.
- Rendered `/catalog` contains `Find the right plant for the right spot`, `Field guide`, `Plant plate`, `Match the spot`, `Keep the story`, and `See this plant`.
- Rendered `/catalog/calendula` contains `Field guide`, `Field notes`, `Good spot`, `Match the plant to the place`, `Where it belongs`, `What to remember`, `Keep it in your garden`, `Add it to a bed`, and `Back to field guide`.
- Filtered catalogue route `/catalog?query=sage` renders `See this plant` instead of the old `Check fit` action.

## Limit

Browser screenshot capture was not used. The required Product Design Browser/Chrome screenshot tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Target

Audit the signed-in app shell labels next. The public entry path is cleaner now; the app routes still need a pass for any remaining setup/status language that feels like implementation scaffolding rather than a garden journal.
