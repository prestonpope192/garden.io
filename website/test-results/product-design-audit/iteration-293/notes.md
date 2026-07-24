# Iteration 293 - Care Language Cleanup

Date: 2026-06-23
Preview: http://127.0.0.1:3021

## Goal

Replace the remaining product-step language with simpler gardener-facing wording that supports the "Your garden, smarter" direction.

## What Changed

- Calendar empty/quiet-state copy now says care is coming up instead of "a next step."
- Plant timeline suggestion chips now say "care idea" instead of "next step."
- Garden suggestions format generic suggestions as "Care idea."
- Diagnosis results now label actions as "Try first."
- Saved diagnosis notes now say "Try first" rather than "Try next."
- Diagnosis API prompt/schema now asks for "care checks" rather than "next actions."
- Sample diagnosis detail now says useful care depends on place.
- Tests now guard the calendar, timeline, diagnosis panel, diagnosis route, and suggestion formatter against the old copy.

## Evidence

- Focused tests passed: `sample-garden.test.ts`, `empty-state-content.test.ts`, `plant-timeline-content.test.ts`, `diagnose-panel-content.test.ts`, `diagnose-route-copy.test.ts`, and `garden-suggestions-history.test.ts` - 6 files, 38 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Source scan found no `next step`, `next steps`, `try next`, or `next actions` matches in `website/app`, `website/components`, or `website/lib`.
- Preview restarted at `http://127.0.0.1:3021`.
- Rendered homepage contains "Your garden, smarter" and no matched "Know what to do next" or "Ask your garden."
- Rendered sample calendar contains "Care this week" and no matched "next step."
- Rendered sample plants route contains "Care note" and "Plant history."

## Limit

Browser screenshot capture was not used. The available Product Design Browser/Chrome tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.

## Next Target

Continue a visual QA pass when browser capture is available, especially mobile spacing and whether the plant imagery feels like a garden journal rather than bright catalogue photography.
