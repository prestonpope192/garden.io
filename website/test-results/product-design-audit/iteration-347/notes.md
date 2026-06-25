# Iteration 347 - Homepage Promise Cleanup

## Audit Scope

- Surface: public homepage first screen and homepage promise cards.
- User goal: understand in a few seconds that Garden.io keeps the garden memory together and helps identify the next care step.
- Accessibility target: preserve the existing heading hierarchy, CTA links, plant-image content, and route behavior while improving the visible copy.

## Strengths

- The homepage is already much shorter than the original marketing page.
- The first screen leads with a real botanical plate image instead of SVG placeholder art.
- The primary actions are simple: start a garden, tour a garden, or choose plants.

## UX Risks Found

- The previous hero lead was understandable but grammatically indirect: `a notebook for what you planted...`
- `Get one care step` described the feature more than the user outcome.
- `start with the plant` was less direct than the action the app actually supports: asking with the plant and its saved notes.

## Changes Made

- Replaced the hero lead with `Keep each plant, place, note, photo, and care step in one calm garden notebook.`
- Replaced `Get one care step` with `Know the next care step.`
- Replaced the supporting sentence with `When something looks off, ask with the plant and what you already noticed.`
- Updated homepage tests to lock in the new copy and reject the older wording.

## Evidence

- Source inspected and changed: `website/app/page.tsx`.
- Tests updated: `website/tests/homepage-content.test.ts`.
- Focused tests passed from the website package: `homepage-content.test.ts`, `homepage-visual-css.test.ts`, and `ai-first-garden-home.test.tsx` - 3 files, 11 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/` contains the new hero and care-step wording and does not contain the older phrasing, launch/beta wording, or SVG placeholder references.

## Evidence Limits

- Browser screenshot capture was not available in this session. Browser/Chrome capture tools were not exposed, Codex app capture is blocked by safety policy, and Playwright fallback requires explicit permission under Product Design rules.
