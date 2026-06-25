# Product Design Audit Iteration 79

Date: 2026-06-21

## Objective

Continue simplifying Garden.io around prospective-user value by tightening the first-use setup and plant-note action copy.

## Current-State Finding

- The rendered homepage, sample garden, catalogue, and signed-out app gate were largely clean.
- The first garden setup still said `after you are inside`, which describes moving through the app instead of the user's actual next step.
- The property edit form used `Type label`, which reads like schema language.
- The plant note action used `Save & interpret`, which reads like an AI/debug action instead of a gardener-facing plant check.
- Save feedback used `created`/`added` language in places where `saved` is simpler and more consistent with the app's core promise.

## Changes Implemented

- Rewrote first garden setup from `Name your garden` to `Start with the garden you have`.
- Rewrote the first garden prompt to `Name it first. Then add one area, one bed, and the plants you want to remember.`
- Replaced `What kind of place is it?` and `Type label` with `Kind of garden`.
- Replaced `Save & interpret` with `Save & check plant`.
- Rewrote mutation feedback:
  - `Garden created...` -> `Garden saved...`
  - `Area added...` -> `Area saved...`
  - `Bed added...` -> `Bed saved...`
  - `Plant added...` -> `Plant saved. Add notes or care tasks when something changes.`
- Updated first-use and mutation-copy tests for the new language and old-copy exclusions.

## Updated Health

- First-run setup now sounds like a simple garden record rather than an app state transition.
- Property metadata copy no longer exposes schema-ish `label` language.
- The note-to-plant-problem flow now reads as a direct gardener action.
- Save feedback is more consistent with the core value: remember the garden by saving small, useful details.

## Evidence

- Focused tests passed: `empty-state-content.test.ts`, `garden-mutation-copy.test.ts`, `diagnose-panel-content.test.ts`, and `sample-garden.test.ts`, 4 files, 14 tests.
- Full `npm test` passed: 17 test files, 77 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed.
- Rendered route scan confirmed `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, and `/app/my-property` returned `200`.
- The rendered route scan found no hits for `Forb`, private beta, early access, waitlist, prototype, old product-facing copy, old SVG plant-art paths, visible photo placeholders, `after you are inside`, `Type label`, `Save & interpret`, `care reminders can live here`, or old created/added feedback phrases.
- Source scan found old setup/action phrases only in negative test assertions.

## Evidence Limits

- No accepted screenshots were captured in this pass. In-app Browser screenshot capture previously timed out; Chrome fallback is currently unavailable because the Codex Chrome Extension is missing from the selected Chrome profile.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
