# Batch Manifest: Garden.io First-Run AI Home

- Batch ID: `garden-first-run-ai-home`
- Scope: Keep signed-in growers with no garden/property on the AI-first home; preserve setup as a secondary path and preserve save guards.
- Repository: `/Users/preston/Code/garden.io`
- Worktree: `/Users/preston/.codex/worktrees/garden-first-run-ai-home-20260901`
- Branch: `codex/bulk-garden-first-run-ai-home-20260901`
- Baseline dev ref: No separate `dev` branch exists in the freshly fetched remote refs. Local integration baseline is `origin/main`.
- Baseline SHA: `5869a9c1a661ebf4fd06d865c713a2af90b3b2c1`
- Deployment: Not requested and not performed. `main` is documented as the production source; this lane is local-only.

## Planned items

- `GARDEN-AI-001` — Empty-property routing: do not auto-redirect the AI ask view to setup when the user has zero properties; retain direct `/app/my-garden` setup behavior.
- `GARDEN-AI-002` — No-property ask state: allow text/photo questions, show setup as a secondary handoff, and keep note/care persistence guarded until a property exists.
- `GARDEN-AI-003` — Existing-user regression protection: preserve memory, plant context, target selection, answer actions, and save/care behavior for users with a property.
- `GARDEN-AI-004` — Automated coverage: add focused route/component coverage for empty-property ask behavior and setup regressions.

## Acceptance criteria

- `/app/my-property` remains on the composer for an authenticated user with zero properties.
- `/app/my-garden` still opens the property/setup view.
- Text and photo questions can be submitted without a property.
- Saving notes or care tasks remains unavailable until a property exists.
- Existing-property memory and answer actions remain unchanged.
- Focused tests cover empty and populated property states.
- No unrelated files or existing `output/` artifacts are changed.

## Exclusions and deferred work

- New analytics event names, API contract changes, migrations, dashboards, or retention queries; defer to a separate measurement batch.
- Carrying an in-progress AI conversation across navigation into setup.
- Authentication, diagnosis prompting/model changes, plant identification, schema changes, broader navigation redesign, deployment, and shared-database mutation.

## Touched areas and overlap zones

- `website/components/garden-app.tsx`
- `website/components/views/garden-ask-view.tsx`
- `website/app/app/my-property/page.tsx`
- `website/app/app/my-garden/page.tsx`
- `website/tests/ai-first-garden-home.test.tsx`
- `website/tests/garden-app-mutations.test.tsx`
- `website/e2e/garden-ask-chat.spec.ts`
- `website/e2e/finish-line-polish.spec.ts`
- Overlap zones: ask-home routing, GardenApp data-load redirect, GardenAskView empty state, setup route, shared test fixtures.

## Predecessor and overlap classification

- `origin/codex/garden-private-beta-mvp` is `closed_out_stale`: its tip is an ancestor of `origin/main`, it has no worktree or dirty state, and its merged successor has recorded local/production closeout evidence.
- Existing stash `stash@{Fri Jul 24 11:52:38 2026}` is preserved and not used.

## Validation

- Fresh baseline required before edits: `npm test`, `npm run typecheck`, `npm run check:hygiene`, `npm run test:browser`, and `npm run build` from `website/`.
- Focused validation: empty-property component/route tests; setup-route regression tests; existing-property ask and save/care tests.
- Broad validation: repository-native Vitest, typecheck, hygiene, build, and browser suite.
- Authenticated browser proof requires an approved test session; unavailable proof must remain blocked rather than pass.

## Commits

- Initial manifest commit: `bab8454` (`chore: add garden first-run batch manifest`).

## Closeout

- Deferred work: analytics measurement batch; conversation persistence across setup navigation.
- Closeout integration SHA:
