# Iteration 257 - Ask Reasoning Compactness

Date: 2026-06-23

Scope: simplify the sample Ask answer after a gardener gets a result on a phone-width screen.

## Screenshots

- `screenshots/01-mobile-answer-before.png` - the old mobile answer area with long reasoning before the memory action.
- `screenshots/02-mobile-answer-after.png` - the compact answer area with the follow-up check, optional reasoning, and visible memory action.
- `screenshots/03-mobile-why-open.png` - the expanded reasoning detail still showing the supporting causes.

## Finding

- The answer gave useful context, but the `Why this answer` section took over the mobile flow before the user could remember the answer.
- The follow-up copy could render as `Look for: Look for...`, which sounded generated instead of written for a gardener.
- One sample secondary action asked the user to remember the plant or bed, even though the save panel already does that job.

## Changed

- Replaced the always-open reasoning section with an expandable `Why this answer` detail.
- Promoted the follow-up into a short `To check:` callout and stripped duplicated `Look for` wording.
- Kept the full cause list available inside the expanded detail.
- Replaced the redundant sample action with a real care-list check: `Compare old leaves and new growth before pruning or feeding.`
- Added tests for the compact reasoning classes, cleaned follow-up wording, and replacement care action.

## Result

- The mobile answer now keeps the action path visible: suggested checks, what to look at next, why if wanted, then remember the answer.
- The explanation still supports trust, but it no longer blocks the save action by default.
- The sample care-list buttons now map to care tasks rather than memory/storage mechanics.

## Evidence

- In-app browser capture at `http://127.0.0.1:3021/sample-garden/ask` confirms the compact answer layout at a 390px viewport.
- DOM verification confirmed the `Why this answer` detail is closed by default, opens with two causes, and no longer contains `Look for: Look for`.
- DOM verification confirmed the redundant `Remember which plant or bed...` action is gone and the replacement care action is present.
- Focused tests passed: `mobile-layout-css.test.ts`, `ai-first-garden-home.test.tsx`, and `sample-garden.test.ts`, 3 files, 17 tests.
- Full `npm test` passed: 22 files, 120 tests.
- `npm run build` passed.
- `git diff --check` passed.

## Evidence Limits

- This pass covered the sample Ask flow at a narrow viewport.
- It did not test real authenticated image upload or API-backed diagnosis responses.
- Screenshot inspection does not prove full keyboard or screen-reader quality beyond the native `details` behavior.
