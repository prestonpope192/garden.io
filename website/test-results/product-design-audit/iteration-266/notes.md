# Iteration 266 - Clearer Sample Garden CTA

Date: 2026-06-23

Scope: simplify the public homepage and signed-out app entry actions.

## Finding

- The homepage hero and final CTA used `Look around` for the sample garden entry.
- `Look around` is friendly but vague; it does not tell a prospective gardener what will open or why it is useful.
- The hero also offered three actions at once: start, sample, and catalogue. That made the first decision heavier than it needed to be.

## Changed

- Replaced `Look around` with `See a sample garden` on the homepage and auth gate.
- Removed the catalogue CTA from the homepage hero action row.
- Kept catalogue discovery available through the top `Find plants` navigation and plant showcase links.
- Updated the unavailable-auth message to say users can still `see a sample garden or find plants that fit`.
- Updated homepage and auth tests to lock the clearer sample CTA and reject the old `Look around` wording.

## Evidence

- Focused tests passed: `homepage-content.test.ts` and `auth-gate-content.test.ts`, 2 files, 6 tests.
- Full `npm test` passed: 22 files, 120 tests.
- `npm run build` passed.
- Preview restarted at `http://127.0.0.1:3021`.
- Rendered route scan for `/` confirmed:
  - `Start your garden`, `See a sample garden`, and `Your garden, smarter` are present.
  - `Look around`, `See it in action`, and `Start tracking` are absent.
  - `Find plants that fit` is no longer in the first hero action path.
- Rendered route scan for `/app` confirmed:
  - `See a sample garden` is present.
  - `Look around` is absent.
  - The catalogue fallback link remains available for signed-out users.

## Evidence Limits

- This pass used rendered route text, source inspection, tests, and production build evidence.
- It did not claim full visual or accessibility coverage; screenshot capture through the in-app Browser has been unreliable in this thread, and standalone Playwright/Chrome was not used without explicit permission.
