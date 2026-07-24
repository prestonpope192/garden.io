# Iteration 218

Scope: normalize the user-facing promise around `next step(s)` instead of the awkward noun phrase `next care`.

Changed:
- Replaced homepage and metadata copy with `Keep beds, plants, notes, photos, and next steps in one place.`
- Replaced auth-gate copy with `Keep photos, notes, and next steps together.`
- Replaced sample/app plant subtitles with `Choose a plant to see its notes, photos, and next steps.`
- Replaced property and plant detail labels from `Next care:` to `Next step:`.
- Replaced plants list/table copy from `Next care` to `Next step`.
- Replaced calendar fallback copy from `Next care is coming up.` to `A next step is coming up.`
- Updated regression coverage across homepage, auth gate, sample garden, and empty-state tests.

Why:
- `What needs care next` works as a plain user question, but `next care` as a noun phrase reads like app jargon.
- `Next step` is simpler, more direct, and matches what a gardener is trying to learn when they open the app.
- This pass makes the homepage, auth gate, sample garden, My Garden, My Plants, and calendar copy feel like one product promise.

Verification:
- Focused `npm test -- homepage-content.test.ts auth-gate-content.test.ts sample-garden.test.ts empty-state-content.test.ts` passed from `website/`: 4 files, 23 tests.
- Full `npm test` passed from `website/`: 18 files, 97 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/app/calendar`, `/app/my-plants`, `/app/plant-catalogue`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/catalog/autumn-sage`, and `/catalog/curry-leaf`.
- Rendered homepage probe confirmed `Keep beds, plants, notes, photos, and next steps in one place.` is visible.
- Rendered sample property probe confirmed `Next step: Water deeply before the hot afternoon` is visible.
- Rendered sample plants probe confirmed `Choose a plant to see its notes, photos, and next steps.` is visible.
- Source probe confirmed no user-facing app/component code under `website/app` or `website/components` contains `next care` or `Next care`; remaining matches are regression guards/test names.

Evidence limits:
- Product Design Browser/Chrome capture tools were not exposed for this pass; no new screenshot capture was accepted as audit evidence.
- Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, and rendered HTML visible-text probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
