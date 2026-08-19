# Garden.io five-finalist finish line — 2026-08-19

## Scope

This finish line covers the five numbered finalists produced by the current
Discovery run. That run was non-persisted and produced five finalists, not ten;
no additional proposals were invented.

## Completed implementation

1. Repository hygiene: `website/test-results/` is ignored and removed from the
   Git index without deleting the local working copies. A repeatable hygiene
   command checks tracked paths and high-confidence credential signatures.
2. Abuse boundary: auth magic-link and paid diagnosis requests use the shared
   `public.consume_rate_limit(text, integer, integer)` function with hashed
   email/IP/user keys. Missing shared storage fails closed for provider-backed
   clients.
3. Tenant safety: migration 46 adds plant/property checks to observation/task
   write policies.
4. Memory-loop measurement: authenticated app opens, note saves, care-task
   additions/completions, and saved diagnoses emit bounded allowlisted events.
5. AI evidence contract: diagnosis responses require evidence facts and a
   `needs_confirmation` flag; the UI displays evidence and confirmation guidance.

## Focused validation

- `cd website && npm run check:hygiene` — passed; 237 tracked files checked.
- `cd website && npm test -- --run tests/rate-limit.test.ts tests/analytics-events-route.test.ts tests/diagnose-evidence-route.test.ts tests/diagnose-panel-content.test.ts tests/diagnose-panel-evidence.test.tsx tests/product-events.test.ts tests/diagnose-route-copy.test.ts tests/auth-magic-link-route.test.ts tests/repo-hygiene.test.ts` — 9 files, 18 tests passed.
- `cd website && npm test -- --run tests/garden-app-mutations.test.tsx tests/garden-mutation-copy.test.ts tests/ai-first-garden-home.test.tsx tests/mobile-layout-css.test.ts` — 4 files, 11 tests passed.
- `cd website && npm run typecheck` — passed.
- `cd website && npm run build` — passed; all 18 routes generated.
- `cd website && npm run test:browser -- e2e/finish-line-polish.spec.ts` — 3 Chromium tests passed, including the mobile Garden Memory layout.

Full repository-wide tests and cross-browser matrices were not run; they are
reserved for an explicit `full-suite-tests` request.

## Finish-line coverage ledger

| Issue / behavior | Failure mode or root cause | Direct executable coverage | Direct command | Broader suite command | Status |
| --- | --- | --- | --- | --- | --- |
| Browser-profile exposure | Tracked `website/test-results/` and credential-database paths could re-enter Git | `website/tests/repo-hygiene.test.ts` plus `website/scripts/check-repo-hygiene.mjs` | `npm run check:hygiene`; `npm test -- --run tests/repo-hygiene.test.ts` | `npm test` | Passed locally; history rewrite not performed |
| Shared auth/AI abuse boundary | Process-local counters reset across serverless instances | `website/tests/rate-limit.test.ts` | `npm test -- --run tests/rate-limit.test.ts` | `npm test` | Passed; live RPC verified |
| Observation/task tenant isolation | Bare `plant_instance_id` could reference another property | `supabase/sql/46-private-beta-abuse-boundary-and-events.validate.sql` | Migration validation workflow plus transaction-scoped `SET ROLE authenticated` canary | Migration validation workflow | Passed policy-definition verification and transaction-scoped two-owner negative canaries for both observations and tasks; all writes rolled back |
| Memory-loop measurement | No durable event surface for activation/return analysis | `website/tests/analytics-events-route.test.ts`, `website/tests/product-events.test.ts` | `npm test -- --run tests/analytics-events-route.test.ts tests/product-events.test.ts` | `npm test` | Passed deterministic route/client contract; authenticated hosted write not browser-proved |
| AI evidence and confirmation | Provider output could omit why the answer fits or confirmation need | `website/tests/diagnose-evidence-route.test.ts`, `website/tests/diagnose-panel-content.test.ts`, `website/tests/diagnose-panel-evidence.test.tsx` | `npm test -- --run tests/diagnose-evidence-route.test.ts tests/diagnose-panel-content.test.ts tests/diagnose-panel-evidence.test.tsx` | `npm test` | Passed mocked provider and rendered UI contract; real OpenAI call not run |

## QA/QC catalog records

Created local atomic specifications in
[`output/qa/garden-five-finalists-qaqc-record.json`](../../output/qa/garden-five-finalists-qaqc-record.json).
The project has no central QA catalog writer discovered in this repo, so the
records are local source-of-truth and not synchronized to a dashboard/database.

| Disposition | check_id | coverage_key | Local file | Sync |
| --- | --- | --- | --- | --- |
| created | `GARDEN-HYGIENE-001` | `repository-artifact-hygiene` | `output/qa/garden-five-finalists-qaqc-record.json` | local only |
| created | `GARDEN-ABUSE-001` | `shared-auth-and-ai-rate-limit` | same | local only |
| created | `GARDEN-RLS-001` | `observation-task-plant-tenant-isolation` | same | local only |
| created | `GARDEN-ANALYTICS-001` | `authenticated-memory-loop-events` | same | local only |
| created | `GARDEN-AI-001` | `diagnosis-evidence-and-confirmation-contract` | same | local only |

## Database completion and rollout

- Canonical target: the configured Supabase Postgres database (`postgres`),
  resolved from `SUPABASE_DB_URL`; credentials and project identifiers are not
  written here.
- Migration applied: `supabase/sql/46-private-beta-abuse-boundary-and-events.sql`.
- Migration characteristics: additive/idempotent tables and function; forward-
  only RLS policy hardening; no data rewrite, ownership change, destructive SQL,
  billing, provider credential, queue, webhook, or deployment operation.
- Remote migration ledger: no `supabase_migrations.schema_migrations` table was
  present, so live catalog/policy/function verification was used instead.
- Post-condition evidence: tables, function, grants, policy expressions, and
  atomic first-call/over-limit behavior verified with `psql`; validation script
  returned `migration-46-validation-passed`.
- Deployment: completed after this report's initial local-only checkpoint; see
  `docs/qa/2026-08-19-production-deployment-closeout.md`.

## Proof matrix

| Boundary | Status | Evidence |
| --- | --- | --- |
| Local source and tests | proved | Focused Vitest, typecheck, build, hygiene command |
| Committed/merged | proved | Commit `2732fb23210e89b7322374c0644d47c0c402a33e` on `main` |
| Hosted environment | proved for public route health | Production deployment `dpl_AbTtqAstyrm4bxspghu9pcfYF5fv` and stable alias route checks |
| Shared database/provider configuration | proved for migration and RLS canary | Live Supabase catalog/policies/function verified; two-owner rollback-scoped negative canaries passed; OpenAI provider call not exercised |
| Authenticated provider-backed behavior | blocked | Requires approved authenticated test session and live OpenAI call |
| Production deployment | proved | Vercel production deployment from `main`, source SHA verified |
| Customer-visible release | route health proved / authenticated canary pending | Public routes and expected redirects verified; authenticated provider behavior remains unrun |

## Finish-line sequence status

| Step | Status | Evidence |
| --- | --- | --- |
| Verify feature | completed | Five finalists implemented and documented |
| Focused QA/regression | completed | 32 focused deterministic tests plus 3 browser tests passed |
| Acceptance criteria | completed locally / incomplete live | Local contracts pass; provider/auth canaries blocked |
| Required database migrations/data setup | completed | Migration 46 applied and validated |
| QA/QC records | completed locally | Five records created |
| Docs/changelog | completed | Current-state, analytics contract, and this report updated |
| Release notes | deferred | Deployment closeout is recorded; no separate customer release note requested |
| Social copy | deferred | Internal/security/measurement work |
| Marketing assets | not applicable | Infrastructure and QA finish-line scope |
| Asset bundle | not applicable | No marketing assets generated |
| Release readiness | partial | Deployment and public route proof complete; authenticated provider-backed canary remains absent |

## Remaining blockers

- The original request referenced a top ten, but only five current finalists
  existed; a durable top-ten acceptance set still needs a rerun/persisted scan.
- Run an approved authenticated browser/provider canary for magic-link,
  diagnosis evidence rendering, and event persistence; the negative
  cross-tenant RLS canary and public production route checks are complete.
- If the repository needs historical secret removal, perform a separately
  coordinated history scan/rewrite and any required session/key rotation; this
  finish line only removed the tracked artifact exposure window.
