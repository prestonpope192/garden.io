# Garden.io first-run AI home finish line — 2026-09-01

## Scope

This finish line covers the prepared `garden-first-run-ai-home` batch:

- `GARDEN-AI-001` — keep the AI ask home available when a signed-in user has no property, while preserving the setup redirect on direct setup views.
- `GARDEN-AI-002` — allow no-property text and photo questions, keep setup secondary, and guard note/care persistence.
- `GARDEN-AI-003` — protect existing-property memory, context, target selection, answer actions, and persistence behavior.
- `GARDEN-AI-004` — make the empty and populated paths executable in the normal Vitest suite.

Excluded by the accepted batch: new analytics, migrations/schema work, conversation persistence across setup navigation, authentication/model/plant-identification changes, navigation redesign, deployment, and shared-database mutation.

## Implementation

- `website/components/garden-app.tsx` now skips the zero-property redirect only for `view="ask"`; setup-oriented views retain the existing `/app/my-garden` replacement.
- `website/components/views/garden-ask-view.tsx` now explicitly tells an unconfigured grower to “Ask first” before setup. Existing submit and persistence guards remain intact.
- Added deterministic empty-state and existing-property interaction coverage.
- Updated [`docs/current-state.md`](../current-state.md) to describe the shipped local behavior.

## Finish-line coverage ledger

| Issue / behavior | Failure mode or acceptance risk | Direct executable coverage | Focused command | Broader command | Status |
| --- | --- | --- | --- | --- | --- |
| Empty-property AI routing | `GardenApp` redirected every zero-property view to setup before the user could ask | `website/tests/garden-app-mutations.test.tsx` — `keeps the AI ask home available without a property while setup views redirect` | `npm test -- --run tests/garden-app-mutations.test.tsx` | `npm test` | Passed locally |
| Direct setup remains available | Changing the AI route must not remove the property/setup entry path | Same test; asserts `/app/my-garden` replacement for `view="property"` | Same | `npm test` | Passed locally |
| No-property text answer | Composer must submit a useful text question without a property | `website/tests/garden-ask-empty-state.test.tsx` — `answers a text question while keeping note and care persistence disabled` | `npm test -- --run tests/garden-ask-empty-state.test.tsx` | `npm test` | Passed locally |
| No-property photo answer | Photo-only submission must carry image data before setup | `website/tests/garden-ask-empty-state.test.tsx` — `submits a photo question before setup without calling persistence handlers` | Same | `npm test` | Passed locally |
| Persistence guard | Empty-property answers must not write notes or care tasks | Both empty-state tests assert disabled controls and untouched `quickLog`/`addTask` handlers | Same | `npm test` | Passed locally |
| Existing memory/context/actions | First-run changes must not regress populated-property answer behavior | `website/tests/garden-ask-existing-state.test.tsx` — `retains memory, plant context, target selection, note save, and care actions` | `npm test -- --run tests/garden-ask-existing-state.test.tsx` | `npm test` | Passed locally |
| Existing route/copy/layout contracts | AI home structure, mobile controls, and copy should remain consistent | `website/tests/ai-first-garden-home.test.tsx`, `website/tests/app-flow-visual-css.test.ts`, `website/tests/mobile-layout-css.test.ts`, `website/tests/garden-mutation-copy.test.ts` | Aggregate feature command below | `npm test` | Passed locally |

Aggregate feature command:

```text
npm test -- --run tests/garden-app-mutations.test.tsx tests/garden-ask-empty-state.test.tsx tests/garden-ask-existing-state.test.tsx tests/ai-first-garden-home.test.tsx tests/app-flow-visual-css.test.ts tests/mobile-layout-css.test.ts tests/garden-mutation-copy.test.ts
```

Result: 7 files and 26 tests passed.

## Local stack and proof

- Frontend/API: `/Users/preston/.codex/worktrees/garden-first-run-ai-home-20260901/website`, served by the same Next.js app; no separate API worktree or worker is required.
- Branch: `codex/bulk-garden-first-run-ai-home-20260901`.
- Local server: `npm run dev -- --hostname 127.0.0.1 --port 3011`, task session `29362`, exact worktree URL `http://127.0.0.1:3011`.
- Browser command: `PLAYWRIGHT_BASE_URL=http://localhost:3011 npm run test:browser`.
- Browser result: 11 Chromium tests passed, including Garden Ask chat/context and mobile Garden Memory layout. The initial unparameterized browser command did not execute because its web-server setup attempted a duplicate server on the occupied port; the explicit local-base-URL rerun passed.
- `npm run typecheck`: passed.
- `npm run check:hygiene`: passed for 256 tracked files.
- `npm run build`: passed; Next.js compiled, typechecked, and generated the route set.
- No `.env` or `.env.local` files are present in this worktree. Authenticated provider-backed proof is therefore unavailable here; public/demo and deterministic mocked behavior are the claimed local proof tiers.

## QA/QC catalog

Created local source-of-truth records in [`output/qa/garden-first-run-ai-home-qaqc-record.json`](../../output/qa/garden-first-run-ai-home-qaqc-record.json):

- `GARDEN-FIRST-RUN-001` — empty-property AI routing.
- `GARDEN-FIRST-RUN-002` — no-property text/photo questions and persistence guards.
- `GARDEN-FIRST-RUN-003` — existing-property regression behavior.
- `GARDEN-FIRST-RUN-004` — first-run regression suite wiring.

The repository has no central QA catalog writer discovered for this scope. Records are local only; no database/dashboard sync was attempted.

## Migrations, data, providers, and rollout

- Migrations: none introduced or required.
- Seeds/backfills: none.
- Environment/provider changes: none.
- Shared database/provider mutation: skipped and explicitly excluded.
- Deployment, merge, push, traffic promotion, and customer messaging: not performed.

## Polish passes

Each feature received three focused `make-it-better` reviews in sequence:

| Feature | Layout/style/animation | Usability/mobile | Copy/labels/spacing |
| --- | --- | --- | --- |
| `GARDEN-AI-001` | Reviewed; no change selected | Reviewed; no change selected | Reviewed; no change selected |
| `GARDEN-AI-002` | Reviewed; no change selected | Reviewed; no change selected | Added explicit “Ask first” handoff copy and regression assertion |
| `GARDEN-AI-003` | Reviewed; existing populated layout retained | Reviewed; existing target/action controls retained | Reviewed; existing labels retained |
| `GARDEN-AI-004` | Reviewed test-surface consistency | Reviewed focused and mobile-support coverage | Reviewed test naming and documentation clarity |

Weak or speculative ideas rejected: redesigning navigation, adding analytics, carrying conversations into setup, changing persistence contracts, or introducing new setup state. Those are outside the accepted batch or lack evidence of need.

## Hot-fix loops

- Test matcher repair: replaced unavailable `toHaveAttribute` with a native `getAttribute` assertion; the route file then passed 5/5 tests.
- Photo harness repair: made jsdom’s non-resolving `Image` path fail deterministically so the production fallback could be exercised.
- Typecheck repair: replaced the incorrect `typeof vi.fn` callback type with the component’s `askGarden` function type; typecheck and focused tests then passed.

All repairs were local, task-owned, and retested. No product behavior was weakened.

## Truth matrix

| Surface | Status | Evidence / boundary |
| --- | --- | --- |
| Local source and deterministic tests | Proved | Isolated branch, aggregate 7-file/26-test pass, typecheck, hygiene, build |
| Local browser/demo surface | Proved | 11 Chromium tests against the task worktree on port 3011 |
| Committed branch | Proved locally | Batch commits descend from `origin/main` baseline `5869a9c1a661ebf4fd06d865c713a2af90b3b2c1` |
| Merged branch | Not requested | No merge or push performed |
| Hosted non-production | Not requested | No deployment performed |
| Shared database/provider | Not applicable / excluded | No schema, data, or provider mutation required |
| Authenticated provider-backed behavior | Blocked | No approved authenticated session or provider configuration in this worktree |
| Production deployment | Not requested | Main remains unchanged apart from its pre-existing untracked output artifacts |
| Customer-visible release | Not claimed | Local-only implementation; authenticated hosted proof and deployment are absent |

## Finish-line sequence status

| Step | Status |
| --- | --- |
| Verify feature | Completed locally |
| Focused QA/regression | Completed locally |
| Acceptance criteria | Completed at deterministic local proof layer; authenticated hosted layer blocked |
| Required migrations/data setup | Not applicable; none required |
| QA/QC records | Completed locally |
| Docs/changelog | Completed in `docs/current-state.md` and this report |
| Release notes | Deferred; no deployment or release request |
| Social copy | Deferred; local engineering batch |
| Marketing assets | Not applicable; no customer-facing release candidate proof |
| Asset bundle | Not applicable |
| Release readiness | Local collapse-ready, not release/customer-visible ready |

## Collapse handoff

The batch is locally ready for a later collapse workflow from
`codex/bulk-garden-first-run-ai-home-20260901` into the intended integration
branch. Before collapse, use the final SHA and inspect the complete diff. Do
not treat this report as merge, deployment, hosted, provider, production, or
customer-visible proof.
