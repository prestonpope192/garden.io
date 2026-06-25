# Iteration 288 - My Plants Care-First Language

Date: 2026-06-24
Preview: http://127.0.0.1:3021

## Objective

Make the My Plants entry feel less like a task queue and more like a useful plant journal that naturally surfaces current care.

## Audit Scope

- My Plants page title/subtitle in the real app and sample app.
- My Plants default drawer guidance when no plant is selected.
- Homepage "How it helps" section heading and support copy.

## Finding

The My Plants page still said "Start with the next plant to check," and the drawer said "The first record is the next plant to check." Those lines were understandable, but they made the page feel like a productivity queue. The user benefit is simpler: plants needing care this week appear first, and every plant record still holds notes, photos, and history.

The homepage also had the awkward line "A garden journal that helps back." It did not read like natural user-facing copy.

## Changes

- My Plants subtitle now says: "Plants needing care this week appear first. Open any plant for notes, photos, and history."
- My Plants default drawer now says plants with care this week appear first.
- Homepage section heading now says: "A garden journal that gets more useful."
- Homepage support copy now says every note, photo, and harvest gives future guidance better context.

## Proof

- Focused tests passed: `homepage-content.test.ts`, `sample-garden.test.ts`, `empty-state-content.test.ts`, and `ai-first-garden-home.test.tsx` - 4 files, 30 tests.
- Full `npm test` passed: 23 files, 128 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Preview restarted at `http://127.0.0.1:3021`.
- Rendered homepage contains "A garden journal that gets more useful" and no matched old "helps back" line.
- Rendered sample My Plants route contains "Plants needing care this week appear first" and no matched "next plant to check" line.

## Evidence Limit

The Product Design Browser tool was not exposed in this environment, and the fallback Playwright path requires explicit permission under the Product Design rules. This pass used rendered HTML, source inspection, and automated tests rather than accepted screenshots.
