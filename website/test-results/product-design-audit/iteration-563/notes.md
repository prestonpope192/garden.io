# Iteration 563 Notes

Scope: make the no-account preview consistently feel like a garden tour, even from legacy links.

## Change

- Changed `/sample-garden` to redirect to `/tour/ask`.
- Changed `/sample-garden/[view]` to validate the view and redirect to `/tour/[view]`.
- Kept `/tour/[view]` as the only route that renders the no-account garden preview.
- Updated `docs/current-state.md` so the implemented product state describes the public preview as a garden-journal tour, with `/sample-garden` only as a legacy alias.
- Updated route/content tests to prove the public preview is `/tour` and the legacy route is redirect-only.

## Evidence

- Browser check entered `/sample-garden/plants` and landed at `/tour/plants`.
- The resulting page rendered `Plant Journal` with journal-style botanical plate imagery.
- The route check found no visible `sample garden` copy after the redirect.
- Screenshot: `01-sample-alias-redirects-to-tour-plants.png`
- Route evidence: `sample-alias-route-check.json`

## Verification

- Focused tests passed from the website package: 3 files, 20 tests.
- Full `npm test` passed from the website package: 23 files, 132 tests.
- `npm run build` passed from the website package.
- `git diff --check` passed.

## Limit

- The legacy `/sample-garden` route files still exist for compatibility, but they no longer render the preview experience directly.
