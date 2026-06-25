# Iteration 562 Notes

Scope: remove the remaining developer-flavored preview framing from public entry points.

## Change

- Added `/tour` and `/tour/[view]` as the user-facing garden preview routes.
- Changed homepage and sign-in secondary links from `/sample-garden` to `/tour`.
- Kept `/sample-garden` in place as a compatibility alias for saved links and route-level tests.
- Added route/content assertions so public entry points prefer `/tour` and avoid `/sample-garden`.

## Evidence

- Browser check at `/tour/ask` rendered `Your garden, smarter.`
- Preview navigation stayed on `/tour/ask`, `/tour/property`, `/tour/calendar`, and `/tour/catalogue`.
- The browser check found no visible `sample garden` copy on `/tour/ask`.
- Screenshot: `01-tour-ask.png`
- Route evidence: `tour-route-check.json`

## Verification

- Focused tests passed from the website package: 3 files, 20 tests.

## Limit

- This pass intentionally did not remove the existing `/sample-garden` route because it is a compatibility alias and not the user-facing entry point anymore.
