# Product Design Audit Iteration 191

Scope: make the plants area feel personal and consistent with the `My Plants` route.

## Change

- App nav: `Plants` -> `My Plants`
- App/page title: `Plants` -> `My Plants`
- Plants drawer: `aria-label="Plants"` -> `aria-label="My plants"`
- Drawer stamp: `Plants` -> `My Plants`

## Rationale

This section is not the public plant guide. It is the user's own growing, past, and saved plant list. `My Plants` makes that ownership clear and matches the route name.

## Verification

- `npm test -- sample-garden.test.ts empty-state-content.test.ts` passed from `website/`: 2 files, 17 tests.
- `npm test` passed from `website/`: 18 files, 93 tests.
- `npm run build` passed from `website/`.
- `git diff --check` passed from the repo root.
- Rendered `/sample-garden/plants` contained:
  - `My Plants`
  - `aria-label="My plants"`
- Rendered `/sample-garden/plants` did not contain the old bare `>Plants<` nav label.
- Local route checks passed after retry:
  - `/` returned 200.
  - `/app` redirected to `/app/my-property` and returned 200.
  - `/sample-garden/plants` returned 200.
  - `/catalog` returned 200.

## Evidence Limits

- One `/catalog` route check returned a transient 500 immediately after `next build` from a Next/Turbopack manifest JSON parse error, then returned 200 on retry without code changes.
- No Playwright screenshot pass was run because Product Design browser-driving requires explicit approval in this thread.
- The authenticated signed-in app still needs browser-backed visual QA.
