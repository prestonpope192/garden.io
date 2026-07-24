# Iteration 217

Scope: simplify the homepage plant-record promise so it describes the outcome, not another feature bucket.

Changed:
- Replaced `Photos, notes, harvests, questions, and next care all stay with the right plant.` with `Photos, notes, harvests, and next steps all stay with the right plant.`
- Updated homepage regression coverage to require the simpler sentence.
- Added a negative assertion so the older `questions` phrasing does not return to the rendered homepage.

Why:
- The homepage is trying to sell one simple habit: save what happened, then know what to do next.
- `Questions` pulls the message back toward an internal plant-help category.
- `Next steps` is more direct and better matches the user's felt need.

Verification:
- Focused `npm test -- homepage-content.test.ts` passed from `website/`: 1 file, 3 tests.
- Full `npm test` passed from `website/`: 18 files, 97 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/app/calendar`, `/app/my-plants`, `/app/plant-catalogue`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/catalog/autumn-sage`, and `/catalog/curry-leaf`.
- Rendered homepage probe confirmed `Photos, notes, harvests, and next steps all stay with the right plant.` is visible.
- Source probe confirmed `website/app/page.tsx` contains the new sentence and no longer contains the old `questions` sentence.
- Source probe confirmed the old sentence remains only in `website/tests/homepage-content.test.ts` as a forbidden regression phrase.

Evidence limits:
- Product Design Browser/Chrome capture tools were not exposed for this pass; no new screenshot capture was accepted as audit evidence.
- Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, and rendered HTML visible-text probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
