# Iteration 76 Notes

## Focus

Make the next-step surfaces feel like simple care guidance instead of a visible suggestion/confidence system.

## Current-State Findings

- The homepage and app routes were clean enough to move deeper into app flow copy.
- The sample calendar still exposed system-like labels: `Suggested next steps`, `Recommended`, and `Pattern spotted`.
- Those labels explain the engine, but they are not the user's felt need. A gardener mainly wants to know what to do next, when, and why it applies to their garden.
- The plant timeline also used a small `suggested` tag, which reads less directly than `next step`.

## Changes Implemented

- Changed the calendar rail from `Suggested next steps` to `Next care steps`.
- Replaced visible confidence chips with the timing window, such as `this season` or `later`.
- Changed suggestion type labels:
  - `Suggested step` -> `Next step`
  - `Pattern spotted` -> `From your garden`
  - `Good opportunity` -> `Good timing`
- Changed plant timeline suggestion tags from `suggested` to `next step`.
- Changed the homepage hero panel from `Suggested next step` to `Next step`.
- Kept the value of garden history and AI guidance, but made the visible copy explain the benefit instead of the machinery.

## Updated Health

- The calendar now reads more like a weekly care surface: what is due, what can wait, and what the next care steps are.
- The product still communicates AI/history-based value, but with simpler user-facing labels.
- Public and sample routes remain healthy and free of launch/beta/prototype copy in visible route scans.

## Evidence

- Browser DOM capture succeeded for route summaries, but screenshot capture failed twice with `Page.captureScreenshot` timeouts, including a clipped retry.
- Focused tests passed: `homepage-content.test.ts`, `sample-garden.test.ts`, and `garden-suggestions-history.test.ts`, 3 files, 19 tests.
- Full `npm test` passed: 17 test files, 77 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed.
- Visible route scan confirmed `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, and `/app/my-property` returned `200`.
- The same visible route scan found no stale hits for private-link, early-access, waitlist, prototype, visible `No photo yet`, old first-run wording, old garden-name placeholder, config jargon, environment-variable language, or old suggestion-system labels.
- Image-source scan stayed clean on checked routes: homepage `24` plant-art references; sample Property `3`; sample Plants `15`; sample Calendar `3`; sample Plant Guide `12`; public catalogue `98`; French Marigold detail `6`; signed-out app gate `0`; all checked routes had `0` `.svg` image references.

## Evidence Limits

- No accepted screenshots were captured in this pass because Browser screenshot capture timed out.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
