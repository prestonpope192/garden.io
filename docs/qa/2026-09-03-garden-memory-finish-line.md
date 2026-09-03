# Garden Memory finish line — 2026-09-03

Status: locally complete; release readiness incomplete at remote database,
authenticated hosted, provider, merge, and deployment boundaries.

## Scope and authority

This pass finishes the five sequential Garden Memory journeys: diagnosis and
recovery, seasonal plant review, next-season decisions, returning after time
away, and multi-season photo journaling.

- Worktree: `/Users/preston/.codex/worktrees/garden-first-run-ai-home-20260901`
- Branch: `codex/bulk-garden-first-run-ai-home-20260901`
- Finish-line start SHA: `13e952c1e090089126be7e4425673a460192b468`
- Base: `origin/main` at `5869a9c1a661ebf4fd06d865c713a2af90b3b2c1`
- Allowed: local implementation, tests, QA records, docs, and non-destructive
  feature-required database work after exact target resolution
- Not authorized: deployment, merge, push, external messages, billing,
  persistent access creation, destructive data changes, or ambiguous role,
  ownership, and policy changes

## Feature result

- Garden Memory separates observations, completed care, and outcomes from open
  Weekly Care.
- Answer evidence names only returned sources, and change follow-ups retain the
  answer that originated them.
- Plant journals expose an instructive empty photo state and group authorized
  photos by season and year.
- Long place histories reveal older entries instead of silently truncating.
- Outcome capture retains failed drafts and feeds matching-history guidance.
- Failed remote plant artwork falls back to an initial instead of a broken icon.

## Finish-line coverage ledger

| Issue / behavior | Failure mode / root cause | Direct executable test | Focused command | Broader suite | Status |
| --- | --- | --- | --- | --- | --- |
| History vs planned care | Open tasks were presented as remembered care | `website/tests/garden-timeline.test.ts` — `builds a scoped memory timeline with photos, care, and outcomes`; `website/e2e/finish-line-polish.spec.ts` — `a returning grower can separate remembered events from work that still needs care` | `npm test -- --run tests/garden-timeline.test.ts`; `PLAYWRIGHT_BASE_URL=http://localhost:3011 npx playwright test e2e/finish-line-polish.spec.ts -g "returning grower"` | `npm test`; `npm run test:browser` | Passed locally |
| Answer-specific comparisons | A follow-up from an older answer could use the newest answer as context | `website/tests/garden-ask-existing-state.test.tsx` — `keeps an older answer's comparison follow-up tied to that answer` | `npm test -- --run tests/garden-ask-existing-state.test.tsx` | `npm test` | Passed locally |
| Source-specific evidence | Evidence disclosure could claim notes, season, or photo data that was absent | `website/tests/garden-ask-existing-state.test.tsx` — `retains memory, plant context, target selection, note save, and care actions`; `website/e2e/garden-ask-chat.spec.ts` — `garden ask stays in a chat thread and links plant context` | `npm test -- --run tests/garden-ask-existing-state.test.tsx`; `PLAYWRIGHT_BASE_URL=http://localhost:3011 npx playwright test e2e/garden-ask-chat.spec.ts` | `npm test`; `npm run test:browser` | Passed locally |
| Retryable answer persistence | Failed note/care callbacks could display false success and lock controls | `website/tests/garden-ask-existing-state.test.tsx` — `keeps persistence controls retryable when saving fails`; `website/tests/garden-app-mutations.test.tsx` — `does not mark an AI answer kept when the garden save fails` | `npm test -- --run tests/garden-ask-existing-state.test.tsx tests/garden-app-mutations.test.tsx` | `npm test` | Passed locally |
| Season/year photo grouping | Summer photos from different years could merge | `website/tests/plant-timeline-content.test.ts` — `shows a seasonal photo journal alongside the memory timeline` | `npm test -- --run tests/plant-timeline-content.test.ts` | `npm test` | Passed locally |
| Authorized media boundary | An image path without an available media URL could be rendered as a private/broken source | Same photo-journal test; asserts two authorized photo memories and text-only unmatched observation | Same | `npm test` | Passed locally; live signed delivery unverified |
| Empty photo journal | A plant with no photos hid the journal entirely | `website/tests/plant-timeline-content.test.ts` — `uses gardener-facing dates and outcome wording`; `website/e2e/finish-line-polish.spec.ts` — `sample Garden Memory drawer scope stays readable on mobile` | `npm test -- --run tests/plant-timeline-content.test.ts`; browser grep `sample Garden Memory drawer` | `npm test`; `npm run test:browser` | Passed locally |
| Long history expansion | Place histories silently stopped after twelve entries | `website/tests/sample-garden.test.ts` — `lets a long place memory reveal older entries without hiding their count` | `npm test -- --run tests/sample-garden.test.ts` | `npm test` | Passed locally |
| Outcome submission | No direct test protected payload serialization, reset, or failed-save draft retention | `website/tests/plant-timeline-interactions.test.tsx` — both tests | `npm test -- --run tests/plant-timeline-interactions.test.tsx` | `npm test` | Passed locally |
| History-derived guidance | Guidance could cite unrelated history or invent a track record | `website/tests/garden-suggestions-history.test.ts` — `history-cited suggestions`; browser test `sample plant history turns recorded outcomes into resilient next-season guidance` | `npm test -- --run tests/garden-suggestions-history.test.ts`; browser grep `sample plant history` | `npm test`; `npm run test:browser` | Passed locally |
| Thumbnail delivery failure | Plant Journal rendered broken-image icons when remote artwork failed | Browser test `sample plant history turns recorded outcomes into resilient next-season guidance`; image requests are deterministically aborted and four fallbacks asserted | `PLAYWRIGHT_BASE_URL=http://localhost:3011 npx playwright test e2e/finish-line-polish.spec.ts -g "sample plant history"` | `npm run test:browser` | Passed locally |
| Chronology and semantic disclosure | Fixed demo outcome dates could predate planting; date/disclosure state lacked robust semantics | `website/tests/plant-timeline-content.test.ts`, `website/tests/garden-timeline.test.ts`, `website/tests/ai-first-garden-home.test.tsx` | Aggregate focused command below | `npm test` | Passed locally |

All listed deterministic tests are discovered by `npm test`; both Playwright
specs are discovered by `npm run test:browser`. A later `full-suite-tests` run
must include both commands and may not substitute route health for these checks.

Focused deterministic command:

```text
npm test -- --run tests/garden-timeline.test.ts tests/plant-timeline-content.test.ts tests/plant-timeline-interactions.test.tsx tests/garden-ask-existing-state.test.tsx tests/garden-app-mutations.test.tsx tests/garden-suggestions-history.test.ts tests/sample-garden.test.ts tests/ai-first-garden-home.test.tsx
```

Focused browser command:

```text
PLAYWRIGHT_BASE_URL=http://localhost:3011 npx playwright test e2e/finish-line-polish.spec.ts e2e/garden-ask-chat.spec.ts --project=chromium
```

## QA/QC catalog records

| Disposition | check_id | coverage_key | Local source | Sync |
| --- | --- | --- | --- | --- |
| updated | `GARDEN-FIRST-RUN-003` | `ai-home-existing-property-regression` | `output/qa/garden-first-run-ai-home-qaqc-record.json` | Local only |
| created | `GARDEN-MEMORY-001` | `garden-memory-history-plan-separation` | `output/qa/garden-memory-qaqc-record.json` | Local only |
| created | `GARDEN-MEMORY-002` | `garden-memory-long-place-history-expansion` | same | Local only |
| created | `GARDEN-MEMORY-003` | `seasonal-photo-journal-authorized-media` | same | Local only |
| created | `GARDEN-MEMORY-004` | `plant-outcome-capture-history-guidance` | same | Local only |
| created | `GARDEN-MEMORY-005` | `plant-journal-thumbnail-failure-fallback` | same | Local only |

Validation checks JSON serialization, required fields, ready status, unique
`check_id`, unique `coverage_key`, referenced source paths, and obvious secret
patterns. The repository has no central Garden.io QA writer or database schema,
so no dashboard/database sync is applicable or claimed.

## Database completion and rollout safety

- Branch diff against `origin/main`: no migration, schema, seed, or backfill files.
- Existing dependencies: `supabase/sql/43-private-beta-plant-outcomes.sql` and
  `44-private-beta-plant-outcomes-rls-harden.sql` are already on `origin/main`.
- Migration review: 43 creates an additive outcomes table, indexes, RLS,
  authenticated grants, and timestamp trigger; 44 narrows the write policy so
  the referenced plant must belong to the same owned property. Neither is new
  in this feature diff.
- Local migration layout: raw ordered SQL under `supabase/sql`; no
  `supabase/migrations`, linked `supabase/config.toml`, or `.temp/project-ref`.
- Canonical target resolution: project documentation uses `SUPABASE_DB_URL`;
  that variable and `SUPABASE_PROJECT_REF` are absent in this worktree.
- Remote ledger/catalog: not queried. A prior report states this project had no
  `supabase_migrations.schema_migrations` table and used live catalog inspection,
  but current credentials are unavailable, so that evidence is stale.
- Operations applied: none. No env, provider, billing, webhook, queue, job,
  seed, backfill, migration, or deployment operation was required by this diff.

Release readiness remains incomplete until an authorized environment supplies
the canonical database connection and confirms the outcomes table, columns,
indexes, RLS enablement, policies, and same-property plant constraint.

## Proof matrix

| Layer | Status | Evidence / boundary |
| --- | --- | --- |
| Local source | Proved | Clean isolated branch descending from current `origin/main` |
| Local deterministic | Proved | 8 focused files / 60 tests, catalog validation, and typecheck; production build had already passed at the same code SHA before docs/catalog-only edits |
| Local rendered browser | Proved | 13 focused Chromium tests against the exact worktree on port 3011 |
| Committed branch | Proved locally | Finish-line commits recorded after final review |
| Pushed / merged | Not requested | No push or merge |
| Canonical database | Blocked | Connection and live catalog unavailable; no new SQL in diff |
| Hosted authenticated | Blocked | No authorized hosted target/session in this worktree |
| OpenAI / signed-media provider | Blocked | Local service-boundary fixtures only |
| Production/customer-visible | Not requested | No deployment or public release |

## Release artifacts

- Unpublished draft: `docs/release-notes/2026-09-03-garden-memory.md`
- Existing reusable Garden Memory screenshots:
  `docs/release-notes/assets/2026-07-07-today-memory-strip/`
- New run screenshots remain test artifacts under `/tmp/garden-user-stories/`;
  they are evidence, not a durable marketing package.
- Shared docs: no Garden.io shared-docs repository was located.
- Marketing assets: deferred because the feature is customer-facing but lacks
  canonical-database and authenticated hosted acceptance.

## Finish-line sequence status

| Step | Status | Evidence |
| --- | --- | --- |
| 1. Verify feature | Completed locally | Five sequential journeys passed before finish-line |
| 2. Focused QA/regression | Completed locally | 60/60 deterministic tests, typecheck, and 13/13 Chromium tests |
| 3. Acceptance criteria | Completed locally / blocked live | Coverage ledger and proof matrix |
| 4. Required migrations/data setup | Incomplete verification | No new operations; canonical live catalog unavailable |
| 5. QA/QC catalog records | Completed locally | Six dispositions above |
| 6. Docs/changelog | Completed | Current-state, journey ledger, this report |
| 7. Release notes | Completed as unpublished draft | Release-note path above |
| 8. Social copy | Prepared in unpublished release draft | Not posted |
| 9. Marketing assets | Deferred | Customer-facing but technically blocked |
| 10. Bundled handoff | Completed locally | This report links records, release draft, and proof |
| 11. Release readiness | Incomplete | Database/auth/provider/deploy boundaries remain open |

## Exact next actions

1. Commit the QA catalog, report, and release draft after review.
2. In a separately authorized environment, verify the canonical outcomes schema
   and policies, then run authenticated outcome-save and signed-photo journeys.
3. Merge or deploy only with exact repo/target/SHA approval.

Focused logs: `/tmp/garden-finish-line/focused-vitest.log`,
`/tmp/garden-finish-line/typecheck.log`, and
`/tmp/garden-finish-line/focused-browser.log`.
