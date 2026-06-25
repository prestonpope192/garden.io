# Iteration 348 - Signed-Out App Entry Copy

## Audit Scope

- Surface: signed-out `/app` entry/auth panel.
- User goal: understand that starting an account creates one calm place for plant memory and care steps.
- Accessibility target: keep heading, form labels, status messages, and secondary links intact while aligning the value copy with the homepage.

## Strengths

- The auth surface already avoids private-beta, waitlist, and internal setup language.
- The primary action is clear: send a garden link.
- Secondary paths let the user tour a garden or choose plants instead of hitting a dead end.

## UX Risks Found

- The auth panel still used the older homepage lead, so the app entry felt slightly less direct than the current public homepage.
- Keeping different promises across `/` and `/app` risks making the product feel less coherent to prospective users.

## Changes Made

- Replaced the auth panel lead with `Keep each plant, place, note, photo, and care step in one calm garden notebook.`
- Updated auth tests to require the shared promise and reject the older line.

## Evidence

- Source inspected and changed: `website/components/auth-gate.tsx`.
- Tests updated: `website/tests/auth-gate-content.test.ts`.
- Focused tests passed from the website package: `auth-gate-content.test.ts`, `homepage-content.test.ts`, and `sample-garden.test.ts` - 3 files, 19 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Live `/app` redirects to `/app/my-property`, and the followed route contains the new shared promise plus `Send my garden link`, `Tour a garden`, and `Choose plants`.
- Live `/app/my-property` does not contain the older auth lead, `private-beta`, or `Supabase environment variables`.

## Evidence Limits

- Browser screenshot capture was not available in this session. Browser/Chrome capture tools were not exposed, Codex app capture is blocked by safety policy, and Playwright fallback requires explicit permission under Product Design rules.
