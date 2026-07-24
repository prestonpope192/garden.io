# Supabase Auth Email Templates

Supabase sends `/api/auth/magic-link` emails from the hosted Auth email template because the app route calls `signInWithOtp`.

## Magic link

- Subject: `Open Garden.io`
- HTML template: `magic-link-email.html`
- Plain text fallback: `magic-link-email.txt`
- Required Supabase variables: `{{ .RedirectTo }}` and `{{ .TokenHash }}`

Apply the HTML in Supabase Dashboard:

1. Open Authentication > Email Templates.
2. Select the Magic Link template.
3. Set the subject to `Open Garden.io`.
4. Paste the contents of `magic-link-email.html`.
5. Save and send a test email.

Or apply it through the Supabase Management API:

```bash
export SUPABASE_ACCESS_TOKEN="..."
SUPABASE_PROJECT_REF=koeawpuagswysumwuidc node scripts/apply_supabase_magic_link_template.mjs
```

Do not change the button URL pattern:

```html
{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=magiclink
```

The app sends `{{ .RedirectTo }}` as `/auth/confirm?next=/app/my-property`. The confirm page handles either this custom `token_hash` link or Supabase's default fragment-token redirect, stores the Supabase session cookie through `/api/auth/session`, and then opens the garden app.
