# Iteration 357 - Field Guide Beds Promise

Date: 2026-06-24
Task class: build work
Surface: `/sample-garden/catalogue`, `/app/plant-catalogue`, Field Guide entry copy

## Objective

Make the Field Guide promise easier to understand at a glance: choose plants for the beds the gardener actually has.

## Product Design Steps

1. Step 1 - Field Guide source and test review: healthy.
   - Inspected the app/sample Field Guide subtitles, signed-out fallback message, catalogue component copy, and Field Guide tests.
2. Step 2 - User-facing copy simplification: healthy.
   - Changed `Choose plants for your light, water, and beds.` to `Choose plants for the beds you have.`
3. Step 3 - Regression coverage: healthy.
   - Updated sample, auth, and navigation tests to require the new wording and reject the older filter-like line.
4. Step 4 - Verification: healthy.
   - Focused tests, full tests, build, diff check, and live route probes passed.

## Findings

- Strength: the Field Guide already avoids database/catalogue language and keeps cards focused on plant fit and field notes.
- UX issue addressed: `light, water, and beds` sounded like filter attributes; `the beds you have` is more directly tied to the user's garden.
- Accessibility risk from screenshots: not checked in this pass because screenshot capture was unavailable under the current Product Design capture rules.
- Limit: this pass used source inspection, render tests, and live route HTML probes instead of browser screenshots.

## Verification

- Focused tests passed from the website package: `catalogue-format.test.ts`, `sample-garden.test.ts`, `ai-first-garden-home.test.tsx`, `auth-gate-content.test.ts`, and `empty-state-content.test.ts` - 5 files, 40 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/catalogue` contains `Field Guide` and `Choose plants for the beds you have.`
- Live `/sample-garden/catalogue` does not contain `Choose plants for your light, water, and beds.`, `Find plants that fit`, `Plant Guide`, `database`, or `Working product`.
- Source/test coverage confirms the signed-out fallback message now says `choose plants for the beds you have`.
- Raw `/app/my-property` SSR HTML does not include the client-only unavailable auth message, so that fallback was verified through component tests and source inspection rather than live HTML.
