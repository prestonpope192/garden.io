# Iteration 355 - Auth Boundary Copy Simplification

Date: 2026-06-24
Task class: build work
Surface: `/app/my-property`, `AuthGate`

## Objective

Make the signed-out app boundary feel like a simple first step into the garden notebook: enter email, get a no-password garden link, then start with one bed or plant.

## Product Design Steps

1. Step 1 - Auth boundary source and route review: healthy.
   - Inspected `AuthGate`, auth-gate tests, and the live signed-out `/app/my-property` HTML.
2. Step 2 - User-facing copy simplification: healthy.
   - Shortened the email instruction to `Enter your email. We'll send a no-password garden link.`
   - Shortened the CTA to `Send garden link`.
   - Clarified the sent-state message as `Open the garden link`.
3. Step 3 - Regression coverage: healthy.
   - Updated auth-gate tests to require the simpler language and reject the older wording.
4. Step 4 - Verification: healthy.
   - Focused tests, full tests, build, diff check, and live route probes passed.

## Findings

- Strength: the signed-out boundary already avoids beta, early access, provider, and setup jargon.
- UX issue addressed: the old email line had three small ideas in one sentence and made the page feel more like authentication than starting a notebook.
- Copy rationale: the shorter version keeps the value clear while still making the no-password behavior explicit.
- Accessibility risk from screenshots: not checked in this pass because screenshot capture was unavailable under the current Product Design capture rules.
- Limit: this pass used source inspection, render tests, and live route HTML probes instead of browser screenshots.

## Verification

- Focused tests passed from the website package: `auth-gate-content.test.ts`, `auth-magic-link-route.test.ts`, `app-entry-redirect.test.ts`, `homepage-content.test.ts`, and `sample-garden.test.ts` - 5 files, 23 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/app/my-property` contains `Your garden, smarter`, `Enter your email. We'll send a no-password garden link.`, and `Send garden link`.
- Live `/app/my-property` does not contain `Enter your email to start your garden.`, `send a link back`, `No password needed`, `Send my garden link`, `AI suggestions`, `private-beta`, `early access`, `Working product`, `Supabase`, or `environment variables`.
