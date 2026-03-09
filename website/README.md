# Garden.io Website

Marketing site + waitlist signup app.

## Tech

- Next.js (App Router)
- Supabase (waitlist persistence)
- Resend (optional custom welcome email)

## Environment variables

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`)

Optional:

- `SUPABASE_SERVICE_ROLE_KEY` (recommended for server-side writes)
- `WAITLIST_TABLE` (default: `waitlist_signups`)
- `RESEND_API_KEY`
- `WAITLIST_FROM_EMAIL`
- `WAITLIST_EMAIL_REDIRECT_TO`

If `RESEND_API_KEY` + `WAITLIST_FROM_EMAIL` are set, custom welcome emails are sent.
Otherwise the API falls back to Supabase `signInWithOtp` to send email confirmation.

## Local setup

```bash
cd website
npm install
npm run dev
```

## Tests

```bash
cd website
npm test
```

## Supabase table

Run SQL in `supabase/waitlist.sql` inside your Supabase SQL editor.

## Deploy (Vercel)

Deploy from `website/` as the project root.
