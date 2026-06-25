# Iteration 145: App Entry Sign-In Copy

Date: 2026-06-22
Route focus: `/app`, protected app routes, and `/app/my-property` auth fallback states

## Scope

Simplify the app entry/sign-in gate so the first protected-app impression explains the value quickly and keeps the auth step low-friction.

## Changed

- Replaced repeated `secure link` copy with one simple line: `Enter your email and we'll send a sign-in link. No password needed.`
- Replaced `Email me a secure link` with `Send my link`.
- Replaced `Your email` with `Email address`.
- Reworded the main value copy to `Save beds, plants, photos, notes, and care reminders in one place.`
- Reworded the success state to `Check your email. The link opens your garden here.`
- Reworded unavailable and send-failed states to avoid internal/provider language.
- Added regression coverage that rejects the old secure-link/private-beta/internal wording.

## Why

A prospective user arriving at the app should understand the payoff before thinking about authentication. The old copy repeated the sign-in mechanism; the new copy says what they can save, reassures them there is no password, and gives one short action.

## Verification

- Focused tests passed: `auth-gate-content.test.ts`, `auth-magic-link-route.test.ts`, `empty-state-content.test.ts`, and `homepage-content.test.ts`, 4 files, 14 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for `/app`, `/app/my-property`, `/app/calendar`, `/app/my-plants`, `/app/plant-catalogue`, `/sample-garden`, `/catalog`, and `/`.
- Rendered auth-state scan passed for `/app/my-property?auth=sent`, `?auth=invalid_email`, `?auth=missing_config`, and `?auth=send_failed`.
- Rendered scan confirms `/app` includes `Save beds, plants, photos, notes, and care reminders in one place.`, `No password needed.`, `Email address`, and `Send my link`.
- Rendered scan confirms stale secure-link, private-beta, Supabase, and old sign-in wording is absent from scanned routes.

## Evidence limit

No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
