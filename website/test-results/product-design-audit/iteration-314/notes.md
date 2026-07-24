# Iteration 314 - Homepage Decision Copy

Date: 2026-06-23
Surface: homepage "How it helps" section
Health: Green

## Goal

Make the homepage promise clearer for a prospective gardener by emphasizing a simple habit: remember what happened before deciding what to do next.

## Changes

- Changed the tracking-loop step from `Save the moment` to `Notice what changed`.
- Changed the tracking-loop step from `Ask with context` to `Ask from your garden`.
- Shortened the support copy from `When something looks off, the answer starts with that plant's place, season, and notes.` to `When something looks off, start with its place, season, and notes.`
- Changed the section headline from `A garden notebook that remembers with you.` to `Know what happened before deciding what to do.`
- Changed the section support copy from `Every note, photo, and harvest gives the next question more context.` to `Your next question starts with the plant, place, season, and notes already in the journal.`
- Updated homepage content tests to require the new wording and reject the older developer/product-facing phrases.

## Files

- `website/app/page.tsx`
- `website/tests/homepage-content.test.ts`

## Evidence

- Product Design audit, Product Design index, user-context preflight, critical overrides, session-budget guidance, and orchestratror-mode guidance were read during this pass.
- Product Design saved context preflight returned no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `homepage-content.test.ts`, `auth-gate-content.test.ts`, `ai-first-garden-home.test.tsx`, and `sample-garden.test.ts` - 4 files, 24 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Standalone preview restarted at `http://127.0.0.1:3021`.
- Live `/` contains `Notice what changed`, `Ask from your garden`, `Know what happened before deciding what to do`, and `Your next question starts with the plant, place, season, and notes already in the journal`.
- Live `/` did not return the older `Save the moment`, `Ask with context`, `A garden notebook that remembers with you`, or `Every note, photo, and harvest gives the next question more context` phrases in the route probe.

## Limit

- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
