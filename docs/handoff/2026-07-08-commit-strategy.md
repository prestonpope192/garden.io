# Commit Strategy — July 8, 2026

## Current State

- Branch: `codex/garden-private-beta-mvp`
- Base commit: `9d7bb6d`
- Scope excluding `website/test-results`: 34 tracked files changed, 34
  untracked paths, about 3,417 insertions and 1,544 deletions in tracked
  files.
- The working tree also contains many tracked deletions under
  `website/test-results/`; those predate the July 8 next-step pass and should
  be reviewed separately before any commit.
- Verification from the latest pass:
  - `cd website && npm test` → 154/154 passing
  - `cd website && npm run typecheck` → clean
  - `cd website && npm run build` → exit 0
- Browser verification from the previous queue-completion pass:
  - `cd website && PLAYWRIGHT_BASE_URL=http://localhost:53469 npm run test:browser` → 11/11 passing

## Recommendation

Use **one checkpoint commit** for the current dirty tree, after a final review
of generated artifacts and secrets.

Reasoning:

- The tree mixes earlier app-audit work, July 7 passes, and the July 8 queue
  completion.
- Several high-churn files carry multiple concerns at once, especially
  `website/app/globals.css`, `website/components/garden-app.tsx`,
  `website/components/views/garden-ask-view.tsx`, and
  `website/components/views/plants-view.tsx`.
- The full behavior was validated as an integrated state. Splitting now would
  require careful patch staging and rerunning gates after each slice.
- A checkpoint commit preserves the verified state before product bets or
  medium-queue work continue.

Suggested message:

```text
Complete private beta garden journal quality passes
```

## Pre-Commit Review Checklist

1. Exclude or intentionally handle `website/test-results/` tracked deletions.
2. Confirm no secrets or minted auth artifacts are present:
   - `website/public/`
   - `website/scripts/`
   - `website/.env.local` should remain untracked.
3. Inspect untracked infra/docs paths before staging:
   - `.github/`
   - `supabase/auth/`
   - `website/app/api/auth/session/`
   - `website/app/auth/`
   - `website/e2e/`
   - `website/tests/support/`
   - `docs/handoff/`
   - `docs/qa/`
   - `docs/release-notes/`
4. Re-run the gate after staging but before committing:
   - `cd website && npm test`
   - `cd website && npm run typecheck`
   - `cd website && npm run build`
   - `cd website && npm run test:browser` or reuse the active server with
     `PLAYWRIGHT_BASE_URL=<url> npm run test:browser`.

## Split Fallback

If review granularity matters more than preserving the integrated checkpoint,
split with patch staging in this order:

1. **Auth/session and CI foundation**
   - `.github/workflows/ci.yml`
   - `website/app/api/auth/*`
   - `website/app/auth/*`
   - `supabase/auth/*`
   - auth/session tests and README/env docs
2. **App UX and product behavior**
   - `website/app/page.tsx`
   - `website/app/globals.css`
   - `website/components/garden-app.tsx`
   - `website/components/garden-app-preview.tsx`
   - view components under `website/components/views/`
   - `website/components/quick-log.tsx`
   - `website/components/auth-gate.tsx`
3. **Testing and browser coverage**
   - `website/tests/`
   - `website/e2e/`
   - `website/playwright.config.ts`
   - `website/package.json`
   - `website/package-lock.json`
4. **Durable docs and release artifacts**
   - `docs/current-state.md`
   - `docs/handoff/`
   - `docs/qa/`
   - `docs/release-notes/`
   - `security-audit/`

Risk: these buckets are not clean file boundaries. If using the split fallback,
expect patch-level staging in shared files and run at least `npm test` after
each commit-sized staged set.

## Gated Actions

- Do not stage, commit, push, or create a PR without Preston approving the
  commit strategy.
- Do not deploy or run production mutations as part of commit cleanup.
