# Garden.io Website

Marketing site, public plant catalogue, and prototype app shell for Garden.io.

Repo-level docs start here:

- [`../README.md`](../README.md)
- [`../docs/README.md`](../docs/README.md)
- [`../docs/current-state.md`](../docs/current-state.md)

Use the repo docs before assuming that product specs elsewhere in the repository are already implemented in this app.

## Tech

- Next.js (App Router)
- Supabase (waitlist persistence)
- Resend (optional custom welcome email)

## Environment variables

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

Optional:

- `SUPABASE_SERVICE_ROLE_KEY` (recommended for server-side writes)
- `SUPABASE_DB_URL` (repo-root `.env`; required for applying schema/import scripts)
- `WAITLIST_TABLE` (default: `waitlist_signups`)
- `RESEND_API_KEY`
- `WAITLIST_FROM_EMAIL`
- `WAITLIST_EMAIL_REDIRECT_TO`

If `RESEND_API_KEY` + `WAITLIST_FROM_EMAIL` are set, custom welcome emails are sent.
Otherwise the API falls back to Supabase `signInWithOtp` to send email confirmation.

## Auth magic links

The `/app/*` sign-in form posts to `/api/auth/magic-link`. That server route sends Supabase a redirect URL for `/auth/confirm?next=/app/my-property`.

`/auth/confirm` supports both Supabase's default fragment-token redirect and the branded `token_hash` link stored in `../supabase/auth/magic-link-email.html`. It exchanges those values through `/api/auth/session`, sets the Supabase session cookie, and then opens the private app route.

Run the local browser smoke against an already-running dev server:

```bash
BASE_URL=http://localhost:3001 npm run smoke:auth-confirm
```

## Local setup

```bash
cd website
npm install
npm run dev
```

The local app runs at `http://localhost:3000`.

## Public plant catalogue

The public catalogue lives at `/catalog`, with individual field-guide profiles at `/catalog/[slug]`.

The surface is server-rendered from normalized plant profiles and then enhanced client-side with search, category filters, a preview drawer, and public read-only plant detail pages. It requires `SUPABASE_DB_URL` for live catalogue data.

Routes:

- `/catalog`
- `/catalog/[slug]`
- `/api/plant-profiles`

## Prototype app routes

The current prototype/private-beta shell lives under `/app/*`.

Current route entrypoints in the repo:

- `/app/my-property`
- `/app/calendar`
- `/app/my-plants`
- `/app/plant-catalogue`

Treat these as in-progress product surfaces unless a task includes explicit verification beyond route presence and current local behavior.

## Docker (local)

Build and run from repo root:

```bash
docker compose up --build -d
```

Stop:

```bash
docker compose down
```

The app will be available at `http://localhost:3000`.

Notes:
- `docker-compose.yml` uses safe placeholder Supabase env values for local UI testing.
- For real waitlist writes/email, replace env vars with your actual project values.

## Tests

```bash
cd website
npm test
npm run test:browser
```

`npm run test:browser` runs Playwright against the local Next app and covers the
sample Garden.io ask chat flow, including chat turns, plant context chips, and
context-chip navigation.

## Supabase table

Run SQL in `supabase/waitlist.sql` inside your Supabase SQL editor.

## Private beta MVP schema

The authenticated app under `/app/*` uses the additive MVP schema at:

```bash
supabase/sql/20-private-beta-mvp.sql
```

Apply it to the main Supabase database with:

```bash
export SUPABASE_DB_URL='postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require'
../scripts/apply_private_beta_mvp.sh
```

This creates RLS-protected tables for properties, zones, beds, plant instances, notes, manual tasks, wishlist items, and starter catalogue records.

To apply the schema and import the March 2026 starter workbook for the primary private-beta account:

```bash
cd ..
python3 scripts/import_garden_starter_workbook.py --apply
```

The importer reads `/Users/preston/Downloads/garden_io_starter_import_march_2026.xlsx` by default, creates or reuses the `prestonpope192@gmail.com` auth user, adds missing catalogue rows for workbook plants, and upserts the property, zones, beds, plant instances, observations, tasks, and wishlist records. It is idempotent and can also emit SQL without applying it:

```bash
python3 scripts/import_garden_starter_workbook.py --output-sql /tmp/garden_starter_import.sql
```

## Deploy (Vercel)

Deploy from `website/` as the project root.
