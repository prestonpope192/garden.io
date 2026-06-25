# Iteration 370 - Header Garden Check Link

## Objective

Make the app header link match the `Garden Check` surface name instead of using a terse `Check` label.

## Product Design Read

- Used Product Design audit routing and critical overrides.
- Ran saved Product Design context preflight.
- Used session-budget guidance for build-work verification.
- Used Garden.io memory for the living botanical notebook / smart companion tension.

## Finding

The live non-Ask routes opened with:

- `Garden.io Check Start your garden`

Since the Ask surface is now called `Garden Check`, the header link should use the same name. `Check` alone was short but less clear, especially beside `Garden.io` and `Start your garden`.

## Change

- Changed the real app shell header link from `Check` to `Garden Check`.
- Changed the sample app shell header link from `Check` to `Garden Check`.
- Updated focused tests to require the new header label and reject the old terse label.

## Verification

- Focused tests passed from the website package: `sample-garden.test.ts` and `ai-first-garden-home.test.tsx` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/sample-garden/property`, `/sample-garden/plants`, and `/sample-garden/calendar` contain `Garden.io Garden Check Start your garden`.
- Live non-Ask sample routes no longer contain `Garden.io Check Start your garden`.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
