# Iteration 446 - Ask Shortcut Labels

Date: 2026-06-24
Surface focus:
- Sample garden Ask route
- Ask home shortcut row

## Scope

Make the Ask home shortcuts read as plain user actions instead of internal app module names.

## Changes

- Changed `My Garden` shortcut text to `See your garden`.
- Changed `This Week` shortcut text to `See next care`.
- Changed `Field Guide` shortcut text to `Choose plants`.
- Updated matching accessible labels so screen reader users hear the same action-oriented language.

## Evidence

- Live `/sample-garden/ask` route-output probe found `See your garden`, `See next care`, and `Choose plants`.
- Focused tests passed from the website package: `sample-garden.test.ts` and `ai-first-garden-home.test.tsx` - 2 files, 18 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not used. This pass used server-rendered route text plus full test/build verification; Playwright fallback still requires explicit permission under the Product Design browser rule.
