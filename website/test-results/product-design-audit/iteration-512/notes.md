# Iteration 512 - Weekly Care Button Label

Date: 2026-06-24

## Scope

Remove the last visible `This Week` navigation label from the My Garden drawer so care navigation matches the simplified `Weekly care` app model.

## Changed

- Changed the My Garden drawer button from `See This Week` to `See weekly care`.
- Updated the nearby deep-link comment from `This Week` to `Weekly care` so source scans do not preserve the old feature name.
- Added a content guardrail that requires `See weekly care` and rejects `See This Week`.

## Evidence

- Source scan confirms `See This Week` no longer appears in the changed app surfaces.
- Focused tests passed from the website package: `empty-state-content.test.ts`, `sample-garden.test.ts`, `ai-first-garden-home.test.tsx`, `homepage-content.test.ts`, and `garden-mutation-copy.test.ts` - 5 files, 32 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Limit

- Browser screenshot capture was not available in this tool context. This pass used source scans, content tests, full tests, and build verification.
