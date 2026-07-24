# Iteration 361 - Care Step Copy Cleanup

Date: 2026-06-24
Task class: build work
Surface: Homepage, auth gate, Garden Home composer, sample app copy

## Objective

Make the Garden.io promise sound more like a calm garden journal and less like product copy about generated steps.

## Product Design Steps

1. Step 1 - Rendered route and source review: healthy.
   - Inspected `/`, `/sample-garden/ask`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, and related source/tests.
2. Step 2 - User-facing copy simplification: healthy.
   - Replaced `care step` language with `care plan`, `what to try next`, `Check garden`, `next care`, and `garden check`.
3. Step 3 - Regression coverage: healthy.
   - Updated homepage, auth, sample-garden, and Garden Home tests to require the new wording and reject the old phrase.
4. Step 4 - Verification: healthy.
   - Focused tests, full tests, build, diff check, and source/live probes passed.

## Findings

- Strength: the app now consistently leads with `Your garden, smarter` and a record-first journal framing.
- UX issue addressed: `care step` sounded like internal product language and made the core value feel more generated than remembered.
- Copy change: the primary action now says `Check garden`, which is simpler and more action-oriented for a gardener standing in front of a plant.
- Limit: internal route/component names still use `ask` because that would be a broader routing/refactor pass.
- Accessibility risk from screenshots: not checked in this pass because screenshot capture was unavailable under the current Product Design capture rules.

## Verification

- Focused tests passed from the website package: `homepage-content.test.ts`, `auth-gate-content.test.ts`, `ai-first-garden-home.test.tsx`, and `sample-garden.test.ts` - 4 files, 24 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/` contains `Keep each plant, place, note, photo, and care plan in one calm garden notebook.` and `Notice what changed, then keep what to try next with the right plant.`
- Live `/` does not contain the older `care step` homepage promise.
- Live `/sample-garden/ask` contains `Notice what changed, then save what to try next with the plant.`, `Check garden`, and `Your note, photo, and next care stay together.`
- Live `/sample-garden/ask` does not contain `Get a care step` or visible `care step` text.
- Source contains `From this garden check:` and no longer contains `From this care step:`.
