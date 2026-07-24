# Iteration 363 - Garden Places Label

Date: 2026-06-24
Task class: build work
Surface: My Garden / Property spread

## Objective

Make the property overview feel more like the gardener's places and less like a software layout diagram.

## Product Design Steps

1. Step 1 - Current property copy review: healthy.
   - Inspected rendered `/sample-garden/property`, `PropertyView`, and the sample garden assertions around the place map.
2. Step 2 - User-facing copy simplification: healthy.
   - Changed `Garden layout` to `Garden places`.
3. Step 3 - Regression coverage: healthy.
   - Updated the sample garden test to require `Garden places`, preserve its position before `First place to check`, and reject `Garden layout`.
4. Step 4 - Verification: healthy.
   - Focused tests, full tests, build, diff check, and source/live probes passed.

## Findings

- Strength: the property screen already leads with concrete areas, beds, plants, notes, and care.
- UX issue addressed: `Garden layout` sounded like a software diagram; `Garden places` better matches how a gardener thinks about areas, beds, and plants.
- Limit: old `Garden layout` wording remains in historical audit artifacts only.
- Accessibility risk from screenshots: not checked in this pass because screenshot capture was unavailable under the current Product Design capture rules.

## Verification

- Focused tests passed from the website package: `sample-garden.test.ts`, `empty-state-content.test.ts`, `app-flow-visual-css.test.ts`, and `ai-first-garden-home.test.tsx` - 4 files, 36 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/property` contains `Garden places`, does not contain `Garden layout`, and keeps `Garden places` before `First place to check`.
- `PropertyView` source contains `Garden places` and no longer contains `Garden layout`.
- `sample-garden.test.ts` requires `Garden places` and rejects `Garden layout`.
