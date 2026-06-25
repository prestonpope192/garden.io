# Iteration 202 - Trial Garden Language Cleanup

Date: 2026-06-22

## Scope

Remove remaining visible `sample` language from the trial garden flow and replace a generic plant-history label so a prospective user experiences the app as a real garden workflow instead of a demo artifact or product surface.

## Changed

- Replaced the read-only empty My Plants state from `There are no growing plants in this sample yet.` to `No plants are growing here yet.`
- Added regression coverage for the read-only empty plants state.
- Replaced the plant timeline tag `milestone` with `planting`.
- Added regression coverage that the plant timeline renders `planting` and no longer renders the visible `milestone` tag.
- Confirmed rendered public, trial, catalogue, and signed-out app routes do not expose visible beta, demo, sample, preview, product, homepage, database, upload, or `milestone` language.

## Why

- The homepage and sign-in gate now invite people to `See it in action`; the trial garden should keep that plain user framing.
- `Sample` is implementation language. It reminds the visitor they are looking at a constructed demo instead of showing them how the garden record would feel.
- Empty states should explain the current garden condition, not the provenance of the data.
- `Milestone` is generic product language; `planting` names what actually happened in the garden.

## Verification

- Focused `npm test -- plant-timeline-content.test.ts empty-state-content.test.ts` passed from `website/`: 2 files, 8 tests.
- Full `npm test` passed from `website/`: 18 files, 95 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered visible-text probe returned 200 and clean for `/`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/app/my-property`, `/catalog`, and `/catalog/french-marigold`.
- Source probe found old sample/demo wording only in negative test assertions and internal route/helper names; `milestone` remains only as an internal timeline item kind, CSS class, comments, and negative/assertion coverage.

## Evidence limits

- Product Design Browser/Chrome capture tools were not exposed in this thread; Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, and rendered HTML visible-text probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
