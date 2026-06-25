# Product Design Audit Iteration 188

Scope: make the app entry action feel like opening the user's garden, not managing authentication.

## Change

- `Sign-in is not available right now...` -> `Starting a garden is not available right now...`
- `Enter your email and we'll send a sign-in link...` -> `Enter your email and we'll send a link to your garden...`
- `Email me a sign-in link` -> `Email me my garden link`

## Rationale

Prospective users do not care about the auth mechanism. They care that their garden is saved and that they can get back to it. This keeps the email step understandable while removing account-plumbing language from the first app screen.

## Verification

- `npm test -- auth-gate-content.test.ts auth-magic-link-route.test.ts` passed from `website/`: 2 files, 4 tests.
- `npm test` passed from `website/`: 18 files, 93 tests.
- `npm run build` passed from `website/`.
- `git diff --check` passed from the repo root.
- Rendered `/app/my-property?auth=missing_config` contained:
  - `Email me my garden link`
  - `send a link to your garden`
  - `Starting a garden is not available`
- Rendered `/app/my-property?auth=missing_config` did not contain `sign-in link`.
- Local route checks:
  - `/` returned 200.
  - `/app` redirected to `/app/my-property` and returned 200.
  - `/sample-garden` redirected to `/sample-garden/property` and returned 200.

## Evidence Limits

- No Playwright screenshot pass was run because Product Design browser-driving requires explicit approval in this thread.
- The authenticated signed-in app still needs browser-backed visual QA.
