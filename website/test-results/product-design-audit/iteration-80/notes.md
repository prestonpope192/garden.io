# Product Design Audit Iteration 80

Date: 2026-06-21

## Objective

Continue simplifying Garden.io by replacing formal public plant-guide and plant-check language with direct gardener-facing actions.

## Current-State Finding

- Public plant-guide copy still used `Keep a record` / `Start a record for this plant`, which is accurate but formal.
- The plant detail page used `Care fit signals` as an accessible label, carrying old system-style language forward for assistive tech.
- The plant-problem flow saved notes under `Diagnosis`, used `Suggested actions`, and described the saved result as a `reading`.
- The API validation error said `Add a description or a photo to diagnose`, which sounds more clinical and less like a gardener checking a plant.

## Changes Implemented

- Replaced public catalogue CTA copy:
  - `Keep a record` -> `Save to garden`
  - `once it is growing` -> `track what happens`
- Replaced public plant detail CTA:
  - `Start a record for this plant.` -> `Save it to your garden.`
  - `Choose its bed` -> `Choose a bed`
- Replaced accessible label `Care fit signals` with `Care fit`.
- Rewrote plant-check output copy:
  - saved note heading `Diagnosis` -> `Plant check`
  - result section `Suggested actions` -> `Next steps to try`
  - save hint `reading` -> `check`
- Rewrote the empty plant-check validation error to `Add what you are seeing or a photo to check this plant.`
- Cleaned the server-side endpoint comment so it no longer refers to an assistant.

## Updated Health

- Public plant discovery now more clearly tells a prospective user what they can do next: save the plant and track what happens.
- The plant detail page CTA now matches the core behavior of the app without formal recordkeeping language.
- The plant-problem flow feels more like a practical garden check and less like a generated diagnosis artifact.
- Screen-reader-facing language is less system-oriented.

## Evidence

- Product Design user-context preflight ran; no saved context exists, so this pass used the current app as source of truth.
- Focused tests passed: `catalogue-format.test.ts`, `public-catalogue-content.test.ts`, `sample-garden.test.ts`, `diagnose-panel-content.test.ts`, and `diagnose-route-copy.test.ts`, 5 files, 22 tests.
- Full `npm test` passed: 17 test files, 77 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed.
- Rendered route scan confirmed `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, and `/app/my-property` returned `200`.
- The rendered route scan confirmed `/catalog` contains `Save to garden` and `track what happens`.
- The rendered route scan confirmed `/catalog/french-marigold` contains `Save it to your garden` and `Choose a bed`.
- The rendered route scan found no hits for `Forb`, private beta, early access, waitlist, prototype, old product-facing copy, old SVG plant-art paths, visible photo placeholders, `Keep a record`, `Start a record`, `Care fit signals`, `Suggested actions`, `Diagnosis —`, `Add a description or a photo to diagnose`, or `Keeps this reading`.
- Source scan found old `Keep a record` and `diagnosis assistant` phrases only in negative test assertions.

## Evidence Limits

- No accepted screenshots were captured in this pass. In-app Browser screenshot capture previously timed out; Chrome fallback is currently unavailable because the Codex Chrome Extension is missing from the selected Chrome profile.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
