# Garden Memory release closeout - 2026-09-28

## Release

- Repository: `prestonpope192/garden.io`
- Integration target: `main` (the repository has no `dev` branch)
- Pull request: [#1 - Finish Garden first-run and Memory journeys](https://github.com/prestonpope192/garden.io/pull/1)
- PR head: `0a32257bd0c0263a66ef6c027eeeeffe83daf119`
- Merge commit: `994c468e6d28afe062960a5d926845a92a8a7630`
- Vercel production deployment: `dpl_2RS3S598FwnZZnxg8kVbBhiNuC7a`
- Deployment URL: `https://garden-qyazmhlcf-preston-popes-projects.vercel.app`
- Stable production alias: `https://garden-io.vercel.app` (it resolved to this
  deployment during post-release verification)
- Deployment status: READY at verification time.

No database migration, seed, or backfill was introduced by the merged branch.
Existing outcome migrations 43 and 44 are present in the repository history,
but their live application and the current schema were not re-verified in this
closeout.

## Verification

Local candidate checks:

- `npm test` - 39 files, 185 tests passed before the review fix.
- `npm test -- --run tests/garden-ask-existing-state.test.tsx` - 1 file, 6 tests
  passed after the fix.
- `npm run typecheck` - passed after the fix.
- `npm run check:hygiene` - passed for 263 tracked files.
- `npm run build` - passed.
- `npm run test:browser` - 14/14 passed. The test server logged Supabase DNS
  resolution failures; tests using sample/local fixtures still passed.
- Independent Sol review found that an older answer follow-up could inherit
  plant links from the latest turn. The repair and two-plant regression test
  passed re-review.
- GitHub Actions `test` and `browser` checks passed; Vercel Preview passed.

Post-deployment public route checks against the stable alias:

| Route | Result |
| --- | --- |
| `/` | 200 |
| `/catalog` | 200 |
| `/auth/confirm` | 200 |
| `/sample-garden` | 307 to `/tour/ask` |
| `/app` | 307 to `/app/my-property` |
| `/app/garden-memory` | 307 to `/app/my-garden` |

These checks prove deployed routing only. They do not prove authenticated
application behavior, saved user data, signed-photo delivery, or live AI
provider behavior.

## Remaining Acceptance Gates

1. **Canonical database and migrations:** the local Supabase CLI account did not
   list Garden as a linked project. Direct database access failed DNS resolution
   for the configured host. Therefore the live migration ledger, outcomes
   schema, RLS policies, and tenant-scoped reads/writes were not inspected. No
   migration or data write was attempted. The PR itself contains no migration.
2. **Authenticated Garden workflows:** unauthenticated production requests
   redirect as expected, but no Garden identity or authenticated session was
   verified in Arc. Arc's current tab remained on Google Search during a bounded
   navigation attempt; no credentials or browser storage were inspected.
3. **Provider/media acceptance:** live OpenAI diagnosis, persisted plant
   outcomes, and signed photo delivery were not exercised.

The full Garden Memory workflow must remain **release-acceptance incomplete**
until the intended Supabase project is reachable and the authenticated user
journeys are verified. The code is merged and deployed; that is not equivalent
to complete data/provider acceptance.

## QA Catalog

`output/qa/garden-memory-qaqc-record.json` remains the local QA specification
source. Records `GARDEN-MEMORY-001` through `GARDEN-MEMORY-005` cover the existing
timeline, photo, outcome, guidance, and thumbnail behaviors. New record
`GARDEN-MEMORY-006` covers `garden-ask-older-answer-plant-context` and points to
the tomato-A/basil-B regression test. This catalog is a test specification,
not a result from the live production environment; no shared QA database sync
was attempted.

## Finish-Line Sequence

| Step | Status |
| --- | --- |
| Feature implementation and regression repair | Completed locally and merged |
| Focused and broad local QA | Passed |
| Public production route smoke | Passed |
| Required migration inventory | No new migration required by this branch |
| Live migration ledger/schema comparison | Blocked by database target access/DNS |
| QA/QC catalog specifications | Local records present; not synced to shared DB |
| Documentation and release note | Updated; release not announced |
| Social copy and marketing assets | Not requested; no new package generated |
| Production deployment | Completed and verified READY |
| Authenticated/provider acceptance | Incomplete |
| Overall release readiness | Incomplete pending gates above |
