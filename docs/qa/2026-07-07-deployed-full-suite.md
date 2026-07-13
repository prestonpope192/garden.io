# 2026-07-07 Deployed Full Suite

## Scope

- Requested environment: deployed version.
- Resolved target: latest ready Vercel production deployment for `preston-popes-projects/website`.
- Target URL: `https://website-6562ojpkf-preston-popes-projects.vercel.app`
- Vercel deployment id: `dpl_HartcHGsu1GVzf42q4SSANUbvcfy`
- Deployment created: 2026-06-23 09:50:17 America/Chicago.
- Local branch: `codex/garden-private-beta-mvp`
- Local commit: `9d7bb6d` plus uncommitted work.

## Suite Inventory

| Suite | Target | Status | Evidence |
| --- | --- | --- | --- |
| Vitest deterministic suite | Local checkout | Passed | `npm test`: 26 files, 140 tests passed |
| Next build and TypeScript | Local checkout | Passed | `npm run build`: compiled, type checked, 17 static pages generated |
| Playwright browser suite | Local checkout | Passed | `npm run test:browser`: 11 tests passed |
| Route reachability | Deployed URL | Blocked by Vercel protection | All probed routes redirect through `https://vercel.com/sso-api?...` and render Vercel Login |
| Finish-line ledger Playwright tests | Deployed URL | Failed due Vercel protection | Exact tests reached Vercel Login instead of Garden.io pages |
| Auth confirm smoke | Deployed URL | Failed due Vercel protection | `BASE_URL=<target> npm run smoke:auth-confirm` timed out waiting for `/app/my-property` |
| Authenticated app coverage | Deployed URL | Blocked | Deployment requires Vercel login/protection bypass before app auth can be tested |

## Finish-Line Ledger Verification

| Ledger item | Local broad suite | Deployed result |
| --- | --- | --- |
| Today opens with garden memory before first question | Passed in `npm run test:browser` | Blocked/failed at Vercel Login before assertion |
| Homepage avoids automatic schedule overclaim | Passed in `npm run test:browser` and `npm test` | Blocked/failed at Vercel Login before assertion |
| Auth gate avoids automatic care overclaim | Passed in `npm test` | Authenticated deployed coverage blocked by Vercel protection |
| Mobile drawer scope remains readable | Passed in `npm run test:browser` | Blocked/failed at Vercel Login before assertion |

## Hosted Evidence

Vercel CLI inspect:

- Project: `website`
- Target: `production`
- Status: ready
- URL: `https://website-6562ojpkf-preston-popes-projects.vercel.app`
- Aliases:
  - `https://website-iota-two-93.vercel.app`
  - `https://website-preston-popes-projects.vercel.app`
  - `https://website-preston-5193-preston-popes-projects.vercel.app`

Environment variable names on the Vercel project:

- `WAITLIST_TABLE`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`

No `VERCEL_AUTOMATION_BYPASS_SECRET`, Playwright auth session, QA user credential, or bypass token was discoverable by name in the local environment or Vercel env list.

## Logs

Verbose logs are stored outside the repo at:

- `/tmp/garden-io-full-suite-20260707T150858Z/npm-test.log`
- `/tmp/garden-io-full-suite-20260707T150858Z/npm-build.log`
- `/tmp/garden-io-full-suite-20260707T150858Z/npm-test-browser-local.log`
- `/tmp/garden-io-full-suite-20260707T150858Z/deployed-finish-line-ledger.log`
- `/tmp/garden-io-full-suite-20260707T150858Z/deployed-smoke-auth-confirm.log`
- `/tmp/garden-io-full-suite-20260707T150858Z/deployed-header-probes.log`
- `/tmp/garden-io-full-suite-20260707T150858Z/vercel-inspect.log`

## Result

Local source validation is green. Deployed full-suite validation is incomplete because the production deployment is protected by Vercel SSO, so public, finish-line, auth-confirm, and authenticated app assertions cannot reach the Garden.io app.

## Next Required Action

Provide one of:

- an approved Vercel protection bypass for this deployment,
- a public or preview deployment URL that is not Vercel-login protected, or
- approval to change the Vercel deployment protection settings for the intended QA target.

After that, rerun the deployed Playwright ledger, full browser suite, auth-confirm smoke, and authenticated app checks.
