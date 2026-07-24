# Iteration 310 - Plants View Notebook Wording

Date: 2026-06-23
Surface: `/sample-garden/plants`, Plants view, Plants drawer, app shell title copy
Health: Green

## Goal

Keep simplifying the application copy so the Plants view sounds like a useful garden notebook for a gardener, not a developer-facing product surface.

## Changes

- Changed the Plants shell subtitle from `Plants needing care this week appear first. Open any plant for notes, photos, and history.` to `Plants with care due soon appear first. Open one for notes and photos.`
- Changed the empty Plants drawer helper sentence from `Plants with care this week appear first. Open any plant for notes, photos, and history.` to `Plants with care due soon appear first. Open one for notes and photos.`
- Changed the Plants detail summary label from `Plants at a glance` to `Garden plants`.
- Changed stat labels from `Active plants`, `Distinct species`, and `Beds in use` to `Growing now`, `Kinds of plants`, and `Beds planted`.
- Updated route/component tests to require the new copy and reject the old product/admin phrases.

## Files

- `website/components/garden-app.tsx`
- `website/components/garden-app-preview.tsx`
- `website/components/views/plants-view.tsx`
- `website/tests/sample-garden.test.ts`
- `website/tests/empty-state-content.test.ts`

## Evidence

- Product Design audit, Product Design index, critical overrides, and orchestratror-mode guidance were read during this pass.
- Garden.io memory was used as project grounding for the botanical notebook / AI companion framing.
- Source sweep confirmed the old Plants subtitle and stats labels only remain as negative test expectations.
- Focused tests passed: `empty-state-content.test.ts`, `sample-garden.test.ts`, `app-flow-visual-css.test.ts`, and `ai-first-garden-home.test.tsx` - 4 files, 36 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Standalone preview restarted at `http://127.0.0.1:3021`.
- Live `/sample-garden/plants` contains `Plants with care due soon`, `Open one for notes and photos`, and `Plant history`.
- Live `/sample-garden/plants` did not render the old subtitle or the old stats labels in the route probe.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
- The stats labels live in the selected-plant detail panel, so their copy is guarded through source-backed tests rather than the default no-selection route probe.
