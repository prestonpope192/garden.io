# security-audit/

Read-only security audit of garden.io — 2026-07-07, branch `codex/garden-private-beta-mvp`.

- **[SECURITY-AUDIT.md](./SECURITY-AUDIT.md)** — the full decision-ready report (summary, prioritized findings SA-01…SA-16, roadmap, verification plan, residual risk).

## TL;DR

**Posture: Moderate–Low.** No Critical issues, **no live secrets committed**, RLS is fundamentally sound, no XSS anywhere, strong dependency hygiene.

| ID | Sev | Status | Finding |
|----|-----|--------|---------|
| SA-01 | High | Confirmed | Chrome browser profiles (Cookies/Login Data/Web Data DBs) committed under un-ignored `test-results/`; profiles verified empty, but a live-token leak vector on the next authenticated test run |
| SA-02 | Medium | Confirmed | RLS: `garden_observations`/`garden_tasks` don't verify `plant_instance_id` ownership (migration-44 fix never backported) |
| SA-03 | Medium | Confirmed | No rate limit/CAPTCHA on `/api/auth/magic-link` (email bombing, bulk account pre-creation) |
| SA-04 | Medium | Confirmed | Diagnose rate limiter is in-memory/per-process → bypassable on serverless → OpenAI cost abuse |
| SA-05 | Low | Confirmed | Weather route: unauthenticated, no rate limit, unbounded query |
| SA-06 | Low | Confirmed | `/api/auth/session`: no Origin/CSRF check → login CSRF |
| SA-07 | Low | Confirmed | Postgres pool `ssl.rejectUnauthorized:false` (DB TLS cert unverified) |
| SA-08 | Low | Confirmed | CSP `unsafe-inline`+`unsafe-eval`; no HSTS |
| SA-09 | Low | Confirmed | `plant-profiles`/`weather` leak raw `error.message` |
| SA-10 | Low | Confirmed | Open-redirect via backslash in auth-confirm success path (chained) |
| SA-11 | Low | Confirmed | `img src` not scheme-validated (defense-in-depth) |
| SA-12 | Low | Confirmed | Abandoned prod dep `react-pageflip` (5yr stale) |
| SA-13 | Low | Confirmed | `npm audit` high is dev-only (vite/Playwright), no prod impact |
| SA-14 | Low | Confirmed | Catalog Python scripts build SQL via escaped f-strings (not parameterized) |
| SA-15 | Info | Confirmed | Catalog DDL lives outside `supabase/sql/`; reference tables unRLS'd by design |
| SA-16 | Info | Confirmed | CLAUDE.md stale (waitlist deleted; component is `garden-app.tsx`) |

**Fix first:** SA-01 (gitignore + purge), SA-04/SA-03 (durable rate limiting), SA-02 (RLS hardening migration).

All findings are read-only observations. No code was modified, no secrets rotated, no migrations run.
