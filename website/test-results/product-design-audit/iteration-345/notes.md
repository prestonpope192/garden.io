# Iteration 345 - Plants Copy Cleanup

## Audit Scope

- Surface: `/sample-garden/plants` and the shared Plants app title copy.
- User goal: quickly see which plants need care while keeping observations and photos attached to the right plant.
- Accessibility target: keep the existing headings, drawer, cards, table labels, and route behavior intact while improving visible copy.

## Strengths

- The Plants surface already leads with real plant cards and care notes rather than product feature explanations.
- The drawer gives a compact summary of saved plants and current care work without requiring the user to open a plant first.
- Existing labels such as `Plant journal` and `Care note` fit the gardening-journal direction.

## UX Risks Found

- The previous subtitle, `Check plants that need care first. Keep notes and photos together.`, was understandable but read like interface instruction.
- The drawer repeated the same instruction instead of explaining the benefit in one plain sentence.
- The fallback `Pick one...` phrasing was casual but less direct than `Choose one plant...`.

## Changes Made

- Replaced the Plants subtitle with `See what needs care and keep every note and photo with the right plant.`
- Reused that same value sentence in the default Plants drawer summary.
- Replaced `Pick one to see notes, photos, and care.` with `Choose one plant to see its notes, photos, and care.`
- Updated regression tests to require the new value copy and reject the older mechanical copy.

## Evidence

- Source inspected: `website/components/garden-app.tsx`, `website/components/garden-app-preview.tsx`, `website/components/views/plants-view.tsx`.
- Tests updated: `website/tests/sample-garden.test.ts`, `website/tests/empty-state-content.test.ts`.
- Focused tests passed from the website package: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `app-flow-visual-css.test.ts` - 3 files, 31 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/plants` contains the new value sentence and does not contain the older mechanical Plants sentence.

## Evidence Limits

- Browser screenshot capture was not available in this session. Browser/Chrome capture tools were not exposed, Codex app capture is blocked by safety policy, and Playwright fallback requires explicit permission under Product Design rules.
