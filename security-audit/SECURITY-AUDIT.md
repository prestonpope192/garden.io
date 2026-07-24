# Security Audit — garden.io

**Date:** 2026-07-07
**Branch audited:** `codex/garden-private-beta-mvp`
**Scope:** Full read-only security review of the garden.io repository and all associated services. No files modified, no secrets rotated, no migrations/deploys run, no external services contacted.
**Method:** Main-thread orchestration (Claude Fable 5) with six bounded, parallel read-only review waves (Claude Sonnet subagents) covering auth, RLS/database, API surface, client data-layer/authorization, secrets/config/infra/scripts, and dependencies/frontend-XSS. Every load-bearing finding was re-opened and verified against primary evidence by the orchestrator before inclusion.

---

## Security Audit Summary

### Overall risk posture
**Moderate–Low.** No Critical issues and **no live secret exposure** were found. The core multi-tenant authorization model (Supabase Row Level Security) is fundamentally sound and shows real defense-in-depth: `WITH CHECK` on every owner-scoped table, composite foreign keys that make cross-tenant attachment structurally impossible for zones/beds/plants, `SECURITY DEFINER` functions with pinned `search_path`, and automated RLS-regression validation scripts. There are no XSS sinks anywhere in the app, the browser never holds a privileged key, and dependency/supply-chain hygiene is strong (lockfile integrity intact, zero install scripts across 167 packages).

The findings are concentrated in three areas: (1) **operational hygiene** — thousands of Chrome browser-profile artifacts committed under an un-ignored `test-results/` directory, in a repo whose own workflow mints real Supabase sessions; (2) **one concrete RLS gap** on `garden_observations`/`garden_tasks` that was already fixed for a sibling table but never backported; and (3) **rate-limiting durability** — the paid AI endpoint and the auth email endpoint lack rate limiting that survives a serverless/multi-instance deployment.

### Highest-risk areas
1. **Committed browser-profile artifacts + un-ignored `test-results/`** (SA-01) — latent credential-leak vector.
2. **Cross-tenant write gap in RLS** on `garden_observations` / `garden_tasks` (SA-02).
3. **Rate-limiting that does not survive serverless** — magic-link (SA-03) and AI diagnose (SA-04), the latter a direct financial-abuse vector.

### Repositories / services reviewed
- **garden.io** (this repo, single git remote `github.com/prestonpope192/garden.io`) — a monorepo containing:
  - `website/` — Next.js 16 App Router app (marketing site, public plant catalogue, authenticated garden app). **Primary executable surface, fully reviewed.**
  - `supabase/sql/` — 28 numbered Postgres schema/RLS migrations. **Fully reviewed.**
  - `scripts/` — Python/shell/mjs catalog-import and admin tooling. **Reviewed.**
  - `data/`, `docs/` — seed data and specs. Referenced where load-bearing.
- **External services (config-level review only, no live access):** Supabase (auth + Postgres + Storage), OpenAI (`/api/diagnose` vision model), Open-Meteo (weather, keyless), Resend (email — code was deleted on this branch), Vercel (hosting, inferred from `.vercel/` + `output: "standalone"`).

### Repositories / services NOT reviewed and why
- **Supabase project console/runtime config** — auth settings (OTP expiry, provider-level rate limits, allowed redirect URLs, email templates) and the *actually deployed* RLS state. Requires dashboard access; this was a code-only audit. CLAUDE.md warns migrations may not reflect deployed reality — **treated as residual risk**.
- **Vercel project settings** — env vars, edge HSTS, deployment protection, WAF. Requires Vercel access.
- **`docs/product/specs/sql/10-garden-postgres-ddl.sql`** — the out-of-tree DDL that actually creates the `catalog`/`core` schemas (referenced as a prerequisite by `supabase/sql/10-garden-sample-seed.sql`). Spot-referenced for RLS provenance; not exhaustively reviewed (outside primary scope).
- **`node_modules` source** — trusted lockfile integrity verification instead of source review.
- **No separate backend/worker/infrastructure repository exists** — `origin` is the only remote; all executable surface lives in this one repo.

### Commands / tools run (representative)
`git ls-files`, `git log --all -S <pickaxe>` (secrets in history), `git log --diff-filter=A` (env files ever added), `git check-ignore`, `git show HEAD:<path>` + `strings`/`sqlite3` (browser-profile token sweep, 420 blobs), `grep`/`rg` across app/lib/components/scripts/sql, `npm audit --json`, lockfile integrity parse (registries/integrity/git-URLs), full reads of all 5 API routes, auth flow, RLS migrations 20/43/44, `garden-app.tsx`, `next.config.mjs`, `Dockerfile`, `docker-compose.yml`.

### Key assumptions
- **Deployment is Vercel serverless** (multi-instance, ephemeral) — inferred from `.vercel/project.json` and `next.config` `output: "standalone"`. A Docker/compose path also exists. Serverless topology is what makes the in-memory rate limiter (SA-04) materially bypassable.
- **The RLS in `supabase/sql/` reflects deployed policies.** Not verified against the live database — see Residual Risk.
- **Supabase provides auth, Postgres, and Storage;** `auth.uid()` is the tenant boundary.

---

## Prioritized Findings

### SA-01 — Chrome browser-profile artifacts committed to the repo; `test-results/` is not gitignored
- **Severity:** High
- **Status:** Confirmed (exposure vector), profiles verified empty of live tokens
- **Affected repo/service:** garden.io — `website/test-results/`
- **Affected files/routes/config:** 8,737 tracked files under `website/test-results/`; **160 sensitive Chrome DB files** (`Cookies`, `Login Data`, `Web Data`, `Account Web Data`, `Safe Browsing Cookies`, `Local State`) across ~31 profile snapshots, e.g. `website/test-results/product-design-audit/iteration-220/screenshots/chrome-auth/Default/{Cookies,Login Data,Web Data}`. Neither `.gitignore` nor `website/.gitignore` excludes `test-results/`.
- **Evidence:** `git check-ignore website/test-results` → *not ignored*. `git ls-files 'website/test-results/*' | grep -iE 'Cookies$|Login Data$|Web Data$' | wc -l` → 160. A full sweep of **420** tracked cookie/session/local-storage/login blobs (`git show HEAD:<path> | strings | grep -iE 'sb-…-auth-token|access_token|refresh_token|eyJhbGciOi…'`) returned **0 hits** — every committed profile is a fresh, unauthenticated CDP profile.
- **Risk:** The committed profiles are empty *today*, so this is not a live token leak. But `test-results/` being tracked-and-not-ignored means the **next** Playwright/CDP run against an authenticated session — and this project's own documented workflow mints a real Supabase session for `/app/*` preview — would commit a real `sb-<ref>-auth-token` cookie, Supabase JWT, or saved browser credential straight into git history.
- **Realistic exploit scenario:** A developer runs the preview flow with a minted session, a test captures the profile, `git add .` sweeps in `test-results/`, and the commit is pushed. Anyone with repo read access (or on a future open-sourcing) extracts the session cookie and impersonates that user until the token expires; git history retains it even after deletion.
- **Impact:** Session impersonation, and permanent history retention of whatever the profile held. Also ~8.7k files of repo bloat.
- **Recommended fix:**
  1. Add `test-results/`, `**/chrome-*/`, `**/Default/Cookies`, `**/Default/Login Data*`, `**/Default/*Web Data`, `**/Local State`, `playwright-report/`, `output/` to both `.gitignore` and `.dockerignore`.
  2. `git rm -r --cached website/test-results` and commit the removal (the working tree already shows many of these as deleted — finish the job).
  3. Since blobs persist in history, do a one-time sweep of *all* iteration folders for tokens before treating the branch as clean; if any authenticated profile is ever found, rewrite history (git-filter-repo/BFG) **and** rotate the affected Supabase session/keys.
- **Validation plan:** After fix, `git check-ignore website/test-results/x` returns the path; `git ls-files test-results` is empty; re-run the 420-blob token sweep on history to confirm no authenticated profile was ever committed.
- **Estimated effort:** S (30–60 min) for ignore + rm; +1–2 h if history rewrite proves necessary.
- **Dependencies/blockers:** None for the ignore/rm. History rewrite requires coordinating force-push with any collaborators.

### SA-02 — Cross-tenant write gap: `garden_observations` / `garden_tasks` don't verify `plant_instance_id` ownership
- **Severity:** Medium
- **Status:** Confirmed
- **Affected repo/service:** garden.io — Postgres RLS
- **Affected files/routes/config:** `supabase/sql/20-private-beta-mvp.sql:112` (observations FK), `:126` (tasks FK), write policies `garden_observations_write_own` (`:346-351`) and `garden_tasks_write_own` (`:361-366`).
- **Evidence:** `plant_instance_id uuid references public.garden_plant_instances(id) on delete set null` is a **bare single-column FK** — unlike `zone_id`/`bed_id` on the same tables, which use composite FKs `foreign key (zone_id, property_id) references garden_zones(id, property_id)` (`:117-118`, `:134-135`). The write policies only enforce `garden_user_owns_property(property_id)` and never check that the referenced plant instance belongs to that property. Migration `44-private-beta-plant-outcomes-rls-harden.sql` fixes exactly this bug class for `garden_plant_outcomes` (its comment: *"an authenticated user could insert an outcome whose property_id they own but whose plant_instance_id references another user's plant"*) — but the fix was never backported to observations or tasks.
- **Risk:** An authenticated user can create an observation/task on their own property while pointing `plant_instance_id` at **another tenant's** plant instance UUID; the write passes RLS.
- **Realistic exploit scenario:** User A (owner of property P) issues, from devtools or a direct PostgREST call, `insert into garden_observations (property_id, plant_instance_id, note) values ('<P>', '<victim-plant-uuid>', 'x')`. RLS accepts it. Today the shipped UI never joins back through `plant_instance_id`, so impact is data-integrity + a **latent cross-tenant data leak** that goes live the instant any future feature renders a "linked plant" via that column.
- **Impact:** Cross-tenant data integrity violation now; cross-tenant read leak if the column is ever joined outward. Low exploitability today, real correctness defect.
- **Recommended fix:** Add a hardening migration mirroring migration 44: extend both write policies' `WITH CHECK` with
  `and (plant_instance_id is null or exists (select 1 from public.garden_plant_instances pi where pi.id = plant_instance_id and pi.property_id = <table>.property_id))`.
- **Validation plan:** Add a pgTAP/SQL test: as user A, attempt to insert an observation/task referencing user B's plant instance → expect RLS rejection; strengthen `21-…-validate.sql` to assert policy *logic*, not just "RLS enabled."
- **Estimated effort:** S (one additive migration + test).
- **Dependencies/blockers:** Apply via `scripts/apply_private_beta_mvp.sh`; requires `SUPABASE_DB_URL`.

### SA-03 — No rate limiting or CAPTCHA on `/api/auth/magic-link` (email bombing, OTP-quota exhaustion, bulk account pre-creation)
- **Severity:** Medium
- **Status:** Confirmed
- **Affected repo/service:** garden.io — `website/app/api/auth/magic-link/route.ts:27-56`
- **Evidence:** The handler validates only email *format*, then calls `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })` with no IP/email throttle and no CAPTCHA. `lib/rate-limit.ts` exists but is wired only to `/api/diagnose`.
- **Risk:** Scripted POSTs can (a) mass-send magic-link emails to arbitrary addresses (harassment / sender-reputation damage), (b) burn the Supabase OTP send quota (denial of signup for real users), and (c) because `shouldCreateUser: true`, silently pre-create a Supabase auth user for any email the attacker supplies.
- **Realistic exploit scenario:** `for i in …; do curl -X POST .../api/auth/magic-link -d "email=victim+$i@x.com"; done` — unbounded, no friction, no 429.
- **Impact:** Email-bombing of third parties, Supabase quota/cost exhaustion, pollution of the user table with attacker-chosen emails.
- **Recommended fix:** Put an IP+email keyed limiter (reuse the `checkWindow` pattern) in front of `signInWithOtp`; add Turnstile/hCaptcha for repeated submissions; consider Supabase's built-in auth rate limits as a second layer. Use a shared store (see SA-04) so it survives serverless.
- **Validation plan:** Add a test hitting the route N+1 times → expect a 429 after the threshold; confirm no email is sent past the cap.
- **Estimated effort:** S–M.
- **Dependencies/blockers:** Shared rate-limit store (Upstash/Redis) recommended, shared with SA-04.

### SA-04 — Diagnose rate limiter is in-memory / per-process → bypassable on serverless (direct OpenAI cost exposure)
- **Severity:** Medium
- **Status:** Confirmed
- **Affected repo/service:** garden.io — `website/lib/rate-limit.ts:10,42-52`; consumer `app/api/diagnose/route.ts:110`
- **Evidence:** `const diagnoseWindows = new Map<string, RateLimitWindow>()` — a process-local `Map`, self-documented as *"In-memory (per server instance) — move to a shared store if we scale horizontally."* Keying is correct (per authenticated `user.id`, not a spoofable header), and auth precedes spend (401 before any OpenAI call), so the *logic* is sound — but on Vercel serverless each warm instance holds its own counter and cold starts reset it. Effective ceiling ≈ `20 × warm_instances`, not 20/hour/user.
- **Risk:** An authenticated user (or a pool of accounts, cf. SA-03 account creation) can exceed the intended 20 vision calls/hour, each hitting `gpt-4o` with up to ~5 MB images.
- **Realistic exploit scenario:** Concurrent requests fan out across instances; the per-instance counter never reflects the global total, so far more than 20 paid calls/hour succeed.
- **Impact:** Direct, uncapped OpenAI spend — the primary financial-abuse vector in scope.
- **Recommended fix:** Back the limiter with a shared store (Upstash Redis / Supabase table with atomic increment). Keep the per-user key. Optionally add a global daily budget circuit-breaker.
- **Validation plan:** Load-test across instances (or two Node procs) asserting the shared limit holds; unit-test the store increments atomically.
- **Estimated effort:** M.
- **Dependencies/blockers:** Requires a Redis/DB-backed store (shared with SA-03).

### SA-05 — Weather route is unauthenticated with no rate limit and an unbounded query
- **Severity:** Low
- **Status:** Confirmed
- **Affected repo/service:** garden.io — `website/app/api/weather/route.ts:72-96`
- **Evidence:** `GET` reads `geocode`/`lat`/`lon`, imports no rate limiter, and bounds `geocode` only with a `< 2` floor (no upper length cap). Both outbound `fetch`es target **hardcoded hosts** (`geocoding-api.open-meteo.com`, `api.open-meteo.com`) with user values placed only as `URLSearchParams` — **confirmed not SSRF**. Next `revalidate` caching is keyed by exact URL, so varying the query string bypasses it.
- **Risk:** Unauthenticated attacker scripts unbounded outbound calls to Open-Meteo (amplification) and consumes app compute; each unique `geocode` value evades the cache.
- **Realistic exploit scenario:** `while true; do curl ".../api/weather?geocode=$RANDOM"; done` → unbounded upstream calls, risk of Open-Meteo rate-limiting/banning the app's egress IP.
- **Impact:** Degraded weather feature for real users, minor compute cost, possible upstream ban. No data exposure.
- **Recommended fix:** Add a per-IP limiter; cap `geocode` length (e.g. 100 chars); consider requiring a session for the endpoint.
- **Validation plan:** Test that requests past the per-IP threshold return 429; over-long `geocode` is rejected.
- **Estimated effort:** S.

### SA-06 — `/api/auth/session` accepts session-setting POSTs with no Origin/CSRF check (login CSRF / session fixation)
- **Severity:** Low
- **Status:** Confirmed
- **Affected repo/service:** garden.io — `website/app/api/auth/session/route.ts:19-61`
- **Evidence:** The cookie-setting POST does no `Origin`/`Sec-Fetch-Site` validation. It accepts either `token_hash`+`type` or `access_token`+`refresh_token`. Supabase validates the tokens cryptographically, so an attacker cannot forge a *victim's* session — but they **can** supply *their own* valid tokens in a cross-origin request/form to log the victim's browser into the **attacker's** account (login CSRF).
- **Risk:** Victim is silently signed into an attacker-controlled account and may enter garden data the attacker later reads back.
- **Realistic exploit scenario:** Attacker hosts a page that auto-POSTs their own `token_hash` to `victim-site/api/auth/session`; the victim, already on the domain, gets their cookies overwritten with the attacker's session.
- **Impact:** Low — classic login-CSRF; data-capture, not account takeover.
- **Recommended fix:** Reject cross-origin POSTs (`Origin`/`Sec-Fetch-Site: same-origin` check) on `/api/auth/session`; optionally CSRF-token the confirm flow.
- **Validation plan:** Cross-origin POST → 403; same-origin still works.
- **Estimated effort:** S.

### SA-07 — Postgres pool disables TLS certificate verification (`rejectUnauthorized: false`)
- **Severity:** Low
- **Status:** Confirmed
- **Affected repo/service:** garden.io — `website/lib/plant-profile-service.ts:15-19`
- **Evidence:** `new Pool({ connectionString, max: 3, ssl: { rejectUnauthorized: false } })`. The connection uses `SUPABASE_DB_URL` — a direct, RLS-bypassing Postgres credential — over the public internet to `db.<ref>.supabase.co`, but does not verify the server certificate.
- **Risk:** A man-in-the-middle on the DB connection path could present a forged cert and intercept/modify traffic, including the powerful DB credential. The query itself is parameterized and catalog-only, so no injection.
- **Realistic exploit scenario:** MITM on egress network → captures the service-tier DB connection string.
- **Impact:** Low in practice (managed Supabase egress), but the disabled verification removes an assurance on a high-value credential.
- **Recommended fix:** Verify the cert — supply Supabase's CA (`ssl: { ca: <supabase-ca-pem> }`, `rejectUnauthorized: true`) rather than disabling verification.
- **Validation plan:** Confirm connection succeeds with `rejectUnauthorized: true` + CA; fails against a forged cert.
- **Estimated effort:** S.

### SA-08 — CSP allows `unsafe-inline` + `unsafe-eval`; no HSTS header
- **Severity:** Low
- **Status:** Confirmed
- **Affected repo/service:** garden.io — `website/next.config.mjs` (headers block)
- **Evidence:** `script-src 'self' 'unsafe-inline' 'unsafe-eval'`. No `Strict-Transport-Security` header anywhere; no `vercel.json`. (The rest of the header set is strong: `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, nosniff, Referrer-Policy, Permissions-Policy.)
- **Risk:** CSP provides little XSS protection with `unsafe-inline`/`unsafe-eval` allowed — no safety net if an injection sink is introduced later (e.g. a future markdown renderer). Missing HSTS matters especially for the Docker/self-hosted path (Vercel may add HSTS at the edge, but that's unverified and host-specific).
- **Realistic exploit scenario:** A future HTML-injection point would execute freely under the current CSP; a self-hosted deploy without edge HSTS is exposed to SSL-strip/downgrade.
- **Impact:** Defense-in-depth erosion; no current exploit path.
- **Recommended fix:** Add `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`. Investigate dropping `unsafe-eval` in production; move to nonce-based CSP for Next's inline hydration scripts if feasible. Optionally add CSP `report-uri`.
- **Validation plan:** `curl -I` shows HSTS; site functions with tightened `script-src`.
- **Estimated effort:** S (HSTS) / M (nonce-based CSP).

### SA-09 — `plant-profiles` and `weather` routes return raw `error.message` to clients
- **Severity:** Low
- **Status:** Confirmed
- **Affected repo/service:** garden.io — `website/app/api/plant-profiles/route.ts:14-22`, `website/app/api/weather/route.ts:90-95`
- **Evidence:** Both do `message: error instanceof Error ? error.message : "…"`. For plant-profiles the underlying `pg` driver error (connection/pool/driver text) flows verbatim to any anonymous caller. (Contrast: `/api/diagnose` correctly returns only generic messages.)
- **Risk:** Infrastructure fingerprinting via driver error text under fault conditions. No data exposure (query is parameterized, catalog-only).
- **Realistic exploit scenario:** Trigger a pool-exhaustion or connection fault, read `message` for hostnames/driver codes.
- **Impact:** Low — reconnaissance only.
- **Recommended fix:** Log `error` server-side; return a generic client message (match the diagnose pattern).
- **Validation plan:** Force a DB error → response contains only the generic string.
- **Estimated effort:** S.

### SA-10 — Open-redirect via backslash bypass on the auth-confirm success path
- **Severity:** Low
- **Status:** Confirmed (chained; requires a valid token)
- **Affected repo/service:** garden.io — `website/app/auth/confirm/page.tsx:7-13,70`
- **Evidence:** `safeNextPath` rejects values not starting with `/` and those starting with `//`, but a value like `/\evil.com` passes (single leading `/`, no `//`). On the **error** path the value is normalized through `new URL(...).pathname` (host stripped — safe), but the **success** path calls `window.location.replace(nextPath)` with the raw string; browsers normalize `\` → `/`, turning `/\evil.com` into protocol-relative `//evil.com` → `http://evil.com`. Reaching line 70 requires a valid session (a successful `/api/auth/session` response).
- **Risk:** A crafted confirm link redirects the user off-site after a successful login — useful for phishing polish, and chains with the SA-06 login-CSRF.
- **Realistic exploit scenario:** Attacker sends `.../auth/confirm?next=/\evil.com&token_hash=<their valid hash>`; victim completes login and is bounced to attacker's site (optionally now in the attacker's account).
- **Impact:** Low — post-auth redirect, gated on a valid token.
- **Recommended fix:** Replace the blocklist with an allowlist (`^/(app|catalog|tour)(/|$)`), and redirect using the URL-parsed `pathname+search`, not the raw string, on the success path too.
- **Validation plan:** `next=/\evil.com`, `next=/\/evil.com`, `next=https://evil.com` all fall back to the default path.
- **Estimated effort:** S.

### SA-11 — `img src` values are not scheme-validated
- **Severity:** Low
- **Status:** Confirmed (defense-in-depth; very low practical risk)
- **Affected repo/service:** garden.io — `website/lib/plant-images.ts:1-10`
- **Evidence:** `getRealPlantPhotoUrl` filters by filename pattern (`.svg`, `/art/plants/`) and returns the trimmed string verbatim into `<img src={…}>`; no `https:`-scheme check. Source is `plant_profiles.primary_image_url`, populated by the import pipeline (not a user form). Browsers don't execute `javascript:` from `<img src>`, so worst case is a broken image.
- **Risk:** Negligible today; matters only if that column ever becomes user-writable or is reused in a navigational context.
- **Recommended fix:** Enforce `startsWith("https://")` and/or align to the `next.config` `remotePatterns` host allowlist (`koeawpuagswysumwuidc.supabase.co`).
- **Estimated effort:** S.

### SA-12 — Abandoned production dependency `react-pageflip`
- **Severity:** Low
- **Status:** Confirmed
- **Affected repo/service:** garden.io — `website/package.json` (`react-pageflip@^2.0.3`)
- **Evidence:** Last npm publish 2021-04-18 (>5 years stale), single maintainer, small install base; its transitive `page-flip` is declared as `"latest"`. No known CVE, not a typosquat — just unmaintained with no realistic prospect of security patches.
- **Risk:** Supply-chain: a compromised maintainer account could ship a malicious `page-flip@latest`; no upstream fixes if a vuln is found.
- **Recommended fix:** Confirm it's still needed; if the page-flip effect is small, vendor/fork it or replace with a maintained alternative. Pin transitive `page-flip` exactly via `overrides`.
- **Estimated effort:** S–M (depends on replacement).

### SA-13 — `npm audit` high (vite / launch-editor) is dev-only, Windows-only, no production impact
- **Severity:** Low (Informational for production)
- **Status:** Confirmed
- **Affected repo/service:** garden.io — transitive `vite` via `@playwright/test` (devDependency)
- **Evidence:** `GHSA-fx2h-pf6j-xcff` (vite `server.fs.deny` bypass, Windows) + `GHSA-v6wh-96g9-6wx3` (launch-editor NTLMv2 disclosure, Windows). `vite` is not a direct dep, never runs in `next build`/`next start` or the Docker image; vectors require running vite's dev server on Windows. `fixAvailable: true`.
- **Risk:** None in production; theoretical only for a Windows developer running vite's dev server (which this repo never does — it uses `next dev`).
- **Recommended fix:** `npm audit fix` at next convenient maintenance; non-urgent.
- **Estimated effort:** S.

### SA-14 — Catalog Python scripts build SQL via escaped f-strings (not parameterized)
- **Severity:** Low
- **Status:** Confirmed
- **Affected repo/service:** garden.io — `scripts/*.py` (e.g. `import_garden_starter_workbook.py`, `backfill_catalog_content.py`, `generate_catalog_images.py`, `apply_image_verdicts.py`)
- **Evidence:** SQL is assembled by f-strings routed through a quote-doubling escape (`s.replace("'","''")`) and executed via `subprocess.run(["psql", …, "-c", …])` (list-form, no `shell=True`). No raw un-escaped interpolation and no `eval`/`exec`/`os.system` found. Adequate under default `standard_conforming_strings`, but not defense-in-depth — notably `backfill_catalog_content.py` interpolates LLM-drafted text.
- **Risk:** Local operator trust boundary (CLI run against a service-role DB), not network-facing. Low exploitability; a malformed/adversarial catalog string is the realistic concern.
- **Recommended fix:** Migrate to `psycopg2`/`asyncpg` with real bind parameters instead of `psql -c` string interpolation, especially where content is LLM-generated.
- **Estimated effort:** M (mechanical but broad).

### SA-15 — (Info) Catalog schema DDL lives outside `supabase/sql/`; reference tables have no RLS by design
- **Severity:** Informational / Process
- **Status:** Confirmed
- **Affected files:** `supabase/sql/10-garden-sample-seed.sql:2` points to `docs/product/specs/sql/10-garden-postgres-ddl.sql` as the actual `catalog.*` DDL source, which lives outside the numbered migration set. `catalog.*` tables (plant reference data, no PII) have no RLS — appropriate for public reference content — but a fresh apply from `supabase/sql/` alone would fail (missing schema), and an auditor can't verify catalog access control from the migration set alone.
- **Recommended fix:** Move `10-garden-postgres-ddl.sql` into `supabase/sql/` (or add a top-of-file pointer in `20-private-beta-mvp.sql`) so the schema is self-contained and auditable.

### SA-16 — (Info) CLAUDE.md is stale (drift between docs and code)
- **Severity:** Informational / Process
- **Status:** Confirmed
- **Evidence:** The waitlist route and all `waitlist-*`/`env.ts` libs documented in CLAUDE.md were **deleted** in commit `2764c7e` (only an empty `app/api/waitlist/` dir and a stray `supabase/waitlist.sql` remain). CLAUDE.md also names `components/private-beta-app.tsx` as the app shell; the actual file is `components/garden-app.tsx`.
- **Risk:** Doc drift causes future contributors (and audits) to reason about code paths that no longer exist.
- **Recommended fix:** Update CLAUDE.md's architecture section to reflect the deleted waitlist flow and the real component name.

---

## Verified positives (no action required)

These were checked and found sound — recorded so the next reviewer doesn't re-litigate them:

- **No live secrets committed** — `git log --all -S` on `service_role`/`sk-`/`eyJ`, and `--diff-filter=A` for `.env`, all clean. Root `.env` and `website/.env.local` hold real values but are correctly gitignored and untracked. Service-role key + `SUPABASE_DB_URL` + `OPENAI_API_KEY` are referenced only server-side; never in a `'use client'` component or `NEXT_PUBLIC_*` var.
- **Browser never holds a privileged key** — `supabase-browser.ts` reads only anon/publishable keys; zero `SERVICE_ROLE` references in client-reachable code.
- **No XSS sinks** — zero `dangerouslySetInnerHTML`/`innerHTML`/`outerHTML`/`document.write`/`eval`/`new Function` across `app/` + `components/`. AI-diagnosis output and catalog prose render exclusively through React's auto-escaping JSX. No markdown/HTML parser is installed. No `target="_blank"` (no tabnabbing).
- **RLS is otherwise airtight** — all 13 owner-scoped tables have RLS enabled with matching `WITH CHECK` on writes; zones/beds/plants/water tables use composite FKs that structurally block cross-property attachment; `garden_user_owns_property()` and `garden_handle_new_user()` are `SECURITY DEFINER` but narrowly scoped with pinned `search_path`; no `USING (true)` on any user table; no `GRANT ALL`; no `DISABLE ROW LEVEL SECURITY`.
- **Waitlist table** grants `anon` INSERT-only with no SELECT policy → no email enumeration/PII read via PostgREST.
- **Auth trust boundaries use `getUser()`** (JWT-validated) not `getSession()`; the client-side `AuthGate` gate is UX-only, correctly backstopped by RLS and the `proxy.ts` (Next 16 middleware convention) `getUser()` refresh.
- **`/api/diagnose`** enforces auth *before* spend, caps symptoms (2000 chars) and image size (~5 MB) *before* the paid call, uses a 45s abort timeout and strict JSON-schema output, and never echoes upstream OpenAI error text.
- **`/api/plant-profiles`** is intentionally public, catalog-only, parameterized (`$1`) — no cross-user data, no injection.
- **No SSRF** — every outbound `fetch` targets a hardcoded host.
- **Dependencies** — lockfile committed and integrity-intact (0 non-npm registries, 0 git URLs, 0 missing hashes); **zero install/postinstall scripts across all 167 packages**; tight graph.
- **Docker** — multi-stage; final image copies only `.next/standalone` + `.next/static` (no `.env`, no source); runs as non-root `nextjs` user; `website/.dockerignore` excludes `.env*`/`.git`/`node_modules`/`.vercel`.
- **Storage bucket** `garden-media` is private with owner-scoped policies keyed on `(storage.foldername(name))[1] = auth.uid()::text`.

---

## Resolution Roadmap

### Immediate (0–24 h)
- **SA-01:** gitignore + `git rm -r --cached website/test-results`; run the full history token-sweep; if any authenticated profile is found, rewrite history and rotate Supabase sessions/keys.
- **SA-04 / SA-03:** stand up a shared rate-limit store (Upstash/Supabase) and gate the AI diagnose endpoint (financial exposure) and magic-link endpoint.

### Short-term (1–7 days)
- **SA-02:** ship the observations/tasks RLS hardening migration (mirror migration 44) + regression test.
- **SA-05:** rate-limit + length-cap the weather route.
- **SA-06:** add an Origin/`Sec-Fetch-Site` check to `/api/auth/session`.
- **SA-09:** stop leaking `error.message` from plant-profiles/weather.
- **SA-10:** allowlist the auth-confirm redirect and use the parsed path on success.

### Medium-term (1–4 weeks)
- **SA-07:** enable Postgres TLS cert verification with Supabase's CA.
- **SA-08:** add HSTS; work toward dropping `unsafe-eval` / nonce-based CSP.
- **SA-11:** scheme-validate `img src`.
- **SA-12:** replace/vendor `react-pageflip`; pin `page-flip`.
- **SA-13:** `npm audit fix`.

### Longer-term hardening
- **SA-14:** move catalog scripts to parameterized DB access (`psycopg2`/`asyncpg`).
- **SA-15 / SA-16:** consolidate catalog DDL into `supabase/sql/`; refresh CLAUDE.md.
- Add a global daily OpenAI budget circuit-breaker; add CSP violation reporting; consider a secret-scanning pre-commit hook (gitleaks) and a CI `npm audit`/RLS-test gate.

---

## Verification Plan

### Tests to add or run
- **RLS (SA-02):** SQL/pgTAP test — user A inserting an observation/task referencing user B's `plant_instance_id` must be rejected; extend `21-…-validate.sql` to assert policy logic, not just RLS-enabled.
- **Rate limits (SA-03/04/05):** integration tests asserting 429 past thresholds, holding across two processes (proves the shared store).
- **Auth (SA-06/SA-10):** cross-origin POST to `/api/auth/session` → 403; malicious `next` values fall back to default.
- **Error hygiene (SA-09):** forced DB error returns only a generic message.

### Manual checks
- Full `git history` token sweep across every `test-results` iteration folder (SA-01).
- Confirm Vercel edge HSTS / deployment protection (SA-08).
- In the Supabase console, verify deployed RLS matches `supabase/sql/`, check auth-level rate limits, OTP expiry, and the allowed-redirect-URL list.

### CI / security tooling
- Add `gitleaks` (or `trufflehog`) pre-commit + CI to prevent secret/profile commits.
- Add `npm audit --audit-level=high` to CI (non-blocking initially).
- Run the RLS regression suite on every migration.

### Regression risks
- Tightening the confirm redirect allowlist could break a legitimate deep-link target — enumerate valid `next` destinations first.
- Enabling Postgres cert verification requires the correct CA bundle or connections fail.
- A shared rate-limit store adds a runtime dependency — fail-open vs fail-closed must be a deliberate choice.

---

## Residual Risk

### Remaining unknowns
- **Deployed RLS vs. repo SQL** — not verified against the live database; CLAUDE.md explicitly warns migrations may not reflect deployed reality. SA-02's real-world exposure depends on the deployed policy set.
- **Whether every historical `test-results` profile is truly empty** — the 420-blob sweep covered tracked HEAD blobs and found zero tokens; a deeper per-commit history scan is still advisable before declaring the branch clean.
- **Serverless topology** — the rate-limit severity assumes Vercel multi-instance; a single long-lived Node process would reduce SA-04's impact.

### Areas needing credentials / production access / owner confirmation
- Supabase project console (auth settings, deployed RLS, redirect allowlist, provider rate limits).
- Vercel project settings (env vars, edge HSTS, WAF, deployment protection).
- Confirmation of the production hosting path (Vercel vs. Docker/self-host) — changes the HSTS and rate-limit calculus.

### Recommended follow-up audit work
- Live authenticated pen-test of the app once test credentials are provided (IDOR probing of the RLS boundary via direct PostgREST calls; the client has zero defense-in-depth, so RLS is the only boundary).
- Supabase Storage policy runtime test (signed-URL scoping) with two real accounts.
- Dependency review cadence + Dependabot/Renovate for the abandoned `react-pageflip`.
