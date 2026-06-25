# Iteration 211 - Quick Note Location Label

Date: 2026-06-22

## Scope

Simplify the quick note/photo dialog label that decides where a saved note belongs.

## Changed

- Replaced the quick-log selector label `Save it with` with `Where to save it`.
- Kept the target options unchanged: whole garden, area, bed, or plant.
- Added regression coverage so the older awkward label does not return.

## Why

- `Save it with` was short, but it read awkwardly and did not clearly name the decision the user is making.
- `Where to save it` explains the control in plain language while preserving the core promise: notes and photos stay tied to the right garden place.
- This supports the primary usage loop: notice something now, save it quickly, and know where it belongs later.

## Verification

- Focused `npm test -- quick-log-content.test.ts` passed from `website/`: 1 file, 2 tests.
- Full `npm test` passed from `website/`: 18 files, 96 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/app/calendar`, `/app/my-plants`, `/app/plant-catalogue`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, and `/catalog/french-marigold`.
- Source probe confirmed `website/components/quick-log.tsx` contains `Where to save it`.
- Source probe confirmed `website/components/quick-log.tsx` no longer contains `Save it with`.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed in this thread, and Computer Use could not attach to a Chrome window in the previous capture attempt.
- Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, and rendered HTML visible-text probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
