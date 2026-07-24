# Iteration 365 - Weekly Care Copy

## Objective

Remove `care check` as visible app language where it makes the weekly care flow feel like a feature taxonomy instead of a garden journal.

## Product Design Read

- Used Product Design audit routing and critical overrides.
- Ran saved Product Design context preflight.
- Used session-budget guidance for build-work verification.
- Used Garden.io memory for the living botanical notebook / smart companion tension.

## Finding

The current sample flow still showed `care check(s)` in the weekly calendar and Garden Home supporting labels:

- `Start with the next care check. Let the rest wait.`
- `3 care checks`
- `2 care checks later this week`
- `Your note, photo, and next care stay together.`

That wording is understandable but a little artificial. The rest of the app has moved toward plainer garden-journal language: care plan, notes, today's care, and things to check.

## Change

- Changed the This Week subtitle to `Start with today's care. Let the rest wait.`
- Changed the weekly count to `3 things to check` style wording.
- Changed the upcoming count to `2 more this week` style wording.
- Changed the Garden Home composer hint to `Your note, photo, and care plan stay together.`
- Changed Garden Home accessibility labels from `care checks` to `care ideas`.
- Updated focused tests to require the new wording and reject the old wording.

## Verification

- Focused tests passed from the website package: `sample-garden.test.ts` and `ai-first-garden-home.test.tsx` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/ask` contains `Your note, photo, and care plan stay together.` and does not contain `Your note, photo, and next care stay together.`
- Live `/sample-garden/calendar` contains `Start with today's care. Let the rest wait.`, `3 things to check`, and `2 more this week`.
- Live `/sample-garden/calendar` does not contain `Start with the next care check. Let the rest wait.` or care-check count wording.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
