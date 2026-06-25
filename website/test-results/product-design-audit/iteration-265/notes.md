# Iteration 265 - Ask Copy Simplification

Date: 2026-06-23

Scope: simplify the sample and app Ask surface around the user-facing promise `Your garden, smarter`.

## Finding

- The user screenshot showed the old `Know what to do next.` direction, which felt too generic and command-like.
- Current source had already moved away from that headline, but the Ask lead still described the mechanism more than the user benefit.
- The sample app header also had an unnecessary `Look around` label next to the start CTA, which added clutter and collapsed into `Look aroundStart your garden` in rendered text.

## Changed

- Kept the Ask promise as `Your garden, smarter`.
- Replaced the Ask lead with `Add a note or photo. Get a next step that knows your plants, beds, and season.`
- Replaced the composer hint with `Save the answer so future advice remembers what happened.`
- Updated signed-in and sample Ask subtitles to match the same simple note/photo-to-next-step promise.
- Removed the sample header `Look around` label so `Start your garden` stands alone.
- Added regression checks against the older `Know what to do next`, `Ask with a quick note or photo`, and the sample app header `Look around` copy.

## Evidence

- Focused copy tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, `auth-gate-content.test.ts`, and `homepage-content.test.ts`, 4 files, 21 tests.
- Full `npm test` passed: 22 files, 120 tests.
- `npm run build` passed.
- Preview restarted at `http://127.0.0.1:3021`.
- Rendered route scan for `/sample-garden/ask` confirmed:
  - `Your garden, smarter` is present.
  - `Add a note or photo. Get a next step that knows your plants, beds, and season.` is present.
  - `Save the answer so future advice remembers what happened.` is present.
  - `Know what to do next`, `Ask with a quick note or photo`, and `Each saved answer gives the next question more context.` are absent.
- Rendered route scan for `/app` confirmed the signed-out gate still presents `Your garden, smarter.` and does not contain the old screenshot copy.

## Evidence Limits

- In-app screenshot capture remains unreliable in this run due repeated CDP screenshot timeouts, so this iteration used rendered HTML/text route evidence plus tests and build.
- This pass focused on the Ask entry copy and sample app header, not every screen in the app.
