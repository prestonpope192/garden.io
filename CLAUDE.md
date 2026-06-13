# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `website/` unless noted.

```bash
# Dev server
npm run dev           # http://localhost:3000

# Tests (Vitest, node env, tests/**/*.test.ts)
npm test
npm run test:watch
npx vitest run tests/waitlist-service.test.ts   # single test file

# Build
npm run build

# Docker (from repo root)
docker compose up --build -d
docker compose down
```

Applying the private-beta schema to Supabase (from repo root):

```bash
export SUPABASE_DB_URL='postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres?sslmode=require'
scripts/apply_private_beta_mvp.sh
```

Importing the starter workbook (idempotent):

```bash
python3 scripts/import_garden_starter_workbook.py --apply
python3 scripts/import_garden_starter_workbook.py --output-sql /tmp/out.sql  # dry run
```

## Environment variables

Required in `website/`:

- `NEXT_PUBLIC_SUPABASE_URL`
- One of: `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

Optional:

- `SUPABASE_SERVICE_ROLE_KEY` — server-side writes; preferred over anon key
- `SUPABASE_DB_URL` — required by schema scripts and catalogue data (stored in repo root `.env`)
- `RESEND_API_KEY` + `WAITLIST_FROM_EMAIL` — enables custom welcome emails; falls back to Supabase OTP if absent
- `WAITLIST_TABLE` — defaults to `waitlist_signups`
- `WAITLIST_EMAIL_REDIRECT_TO`

## Architecture

### Repo layout

```
website/          Next.js app (App Router) — the primary executable surface
supabase/sql/     Postgres schema migrations (numbered; apply in order)
scripts/          Python import helpers for plant catalog and starter workbook
data/catalog/     Plant catalog seed data (JSON → SQL)
docs/             Product specs and architecture docs (intent, not ground truth)
```

`docs/current-state.md` is the authoritative cold-start summary of what is implemented vs. specced-only. Product specs in `docs/product/specs/` describe intended behavior but are often more mature than the code.

### Next.js app structure

- `app/page.tsx` — marketing homepage (public, SSR + client)
- `app/catalog/` — public plant catalogue (`/catalog` list + `/catalog/[slug]` detail); server-rendered, requires `SUPABASE_DB_URL` for live data
- `app/api/waitlist/` — waitlist POST endpoint (Zod-validated, rate-limited)
- `app/api/plant-profiles/` — plant profile data served to the authenticated app
- `app/app/*` — authenticated prototype app shell; `/app` redirects to `/app/my-property`

### Authenticated app shell

All four app views (`my-property`, `calendar`, `my-plants`, `plant-catalogue`) delegate to a single `view` prop on `PrivateBetaApp` in `components/private-beta-app.tsx`. The full data load, all mutations, and all four view components live in that one file.

`AuthGate` (`components/auth-gate.tsx`) wraps every app route. It reads Supabase session state and renders a magic-link sign-in form if no session exists. Once signed in it calls its render-prop child with the `Session` object.

Data flow:
1. `GardenRecordsApp` loads all eight tables in parallel on mount via `Promise.all` of Supabase queries + `/api/plant-profiles`.
2. State is held as a single `GardenSnapshot` object; mutations call `runMutation` which awaits the write then re-fetches the full snapshot.
3. "Active context" (property → zone → bed → plant) is tracked by four `selectedId` state variables and derived with `find` from the snapshot.

### Supabase clients

Two separate client factories:
- `lib/supabase-browser.ts` — browser client using `@supabase/ssr`, used by `AuthGate` and `PrivateBetaApp`
- `lib/supabase.ts` — server-side client (service role key), used by API routes for waitlist writes

### Waitlist flow

`/api/waitlist/route.ts` → `waitlist-service.ts` → `waitlist-repository.ts`. The service layer checks for duplicates and rate-limits (one attempt per email per window), then either sends a Resend welcome email or falls back to Supabase `signInWithOtp`. All types live in `waitlist-types.ts`; config loading is in `lib/env.ts`.

### Database schema

`supabase/sql/` files are numbered and applied in order. `20-private-beta-mvp.sql` is the main schema entrypoint. Later files are additive migrations. Key tables:

- `garden_properties` → `garden_zones` → `garden_beds` → `garden_plant_instances` (the Property → Zone → Bed → Plant hierarchy)
- `garden_observations` — free-text notes scoped to any level of the hierarchy
- `garden_tasks` — manual tasks with `open`/`done` status
- `garden_wishlist` — per-user saved plant profiles
- Normalized plant catalog: `plant_taxa` → `plant_cultivars` → `plant_profiles` (the canonical shape); a legacy `garden_catalog_plants` table exists from the MVP schema

All tables use `updated_at` triggers via `garden_touch_updated_at()`. RLS is enforced — rows are scoped to `auth.users.id`.

### Styling

Single global stylesheet at `website/app/globals.css`. CSS class conventions use BEM-style naming with prefixes: `beta-` for app shell, `site--marketing` for the marketing page. Primitive components (`SpecimenLabel`, `PlateCard`, `MarginNote`, `InkStamp`) are in `components/journal-primitives.tsx` and carry the botanical/herbarium visual language.
