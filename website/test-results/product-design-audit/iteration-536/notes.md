# Product Design Audit - Iteration 536

Date: 2026-06-24
Scope: make Weekly Care counts sound like garden notes instead of a generic jobs list.

## Changed
- Changed the Weekly Care attention section aria label from `Garden jobs this week` to `Care notes this week`.
- Changed the visible count from `1 garden job this week` / `{n} garden jobs this week` to `1 care note this week` / `{n} care notes this week`.
- Updated sample-garden tests to require the care-note language and reject the older jobs wording.

## Evidence
- Used Product Design audit guidance, Product Design user-context preflight, session budget guidance, current source, focused tests, and Garden.io brand memory.
- Source inspection showed Weekly Care already used notebook-oriented labels like `care notes`, `care ideas`, and `weekly care`, while the attention count still used task-manager-like `garden jobs`.
- Focused tests passed from the website package: `sample-garden.test.ts`, `empty-state-content.test.ts`, and `ai-first-garden-home.test.tsx` - 3 files, 26 tests.
- Source scan confirms `Garden jobs this week` / `garden jobs this week` are gone from live calendar code and only `Care notes this week` / `care notes this week` remain for the attention count.

## Verification
- Focused tests passed from the website package: 3 files, 26 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Source scan confirms `Garden jobs this week` / `garden jobs this week` are gone from live calendar code and only `Care notes this week` / `care notes this week` remain for the attention count.

## Limit
- Direct browser screenshot capture was not available in this run, so this pass used source/test verification before broader checks.
