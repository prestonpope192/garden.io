# Iteration 375 Notes

Scope: simplify signed-out app gate copy so it describes the user action and value, not auth mechanics.

## Change

- Changed the first-step copy to `Start with one plant.`
- Changed the supporting copy to `Put it in a bed once. Notes, photos, and care stay connected after that.`
- Changed the email explainer to `Enter your email. We'll send a link to open your garden.`
- Changed the validation text to `Enter your email to start your garden.`
- Updated auth-gate tests to require the new copy and reject the old `no-password` and notebook-place wording.

## Rationale

The old signed-out gate still explained implementation details and app structure. This pass makes the gate read like a simple gardener workflow: choose one plant, place it once, and keep future care connected.

## Evidence

- Focused test passed from the website package: `auth-gate-content.test.ts` - 1 file, 2 tests.
- Full `npm test` passed from the website package: 23 files, 130 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live `/app` returned `200`, contains `Start with one plant`, `Put it in a bed once`, and `send a link to open your garden`, and does not contain `no-password` or `Your first plant gives the notebook a place to begin`.
- Live `/app/my-property` returned `200`, contains `Start with one plant`, `Put it in a bed once`, and `send a link to open your garden`, and does not contain `no-password` or `Your first plant gives the notebook a place to begin`.

## Limit

Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, Codex app capture has been blocked by safety policy in this session, and Playwright fallback requires explicit permission under the Product Design rules.
