# Product Design Audit Iteration 190

Scope: make the first in-app garden action feel like starting the user's garden, not creating a database object.

## Change

- `Create garden` -> `Start this garden`

## Rationale

The first empty state asks for one thing: name the place the user grows. The button should match that plain-language action. `Start this garden` keeps the step focused on the user's garden rather than implementation language.

## Verification

- `npm test -- empty-state-content.test.ts garden-mutation-copy.test.ts` passed from `website/`: 2 files, 8 tests.
- `npm test` passed from `website/`: 18 files, 93 tests.
- `npm run build` passed from `website/`.
- `git diff --check` passed from the repo root.
- Local route checks:
  - `/` returned 200.
  - `/app` redirected to `/app/my-property` and returned 200.
  - `/catalog` returned 200.
  - `/sample-garden` redirected to `/sample-garden/property` and returned 200.

## Evidence Limits

- The first-run garden form is not visible from signed-out route rendering, so the strongest proof for this copy is the server-rendered component test.
- No Playwright screenshot pass was run because Product Design browser-driving requires explicit approval in this thread.
- The authenticated signed-in app still needs browser-backed visual QA.
