# Iteration 77 Notes

## Focus

Make the sample Plants screen explain the first-use value more simply: what is growing, where it is, and what needs attention next.

## Current-State Findings

- The sample Plants page still said `Track what is growing now, what you saved for later, and what you learned from past seasons.`
- That copy is true for the full product, but it makes the first read feel broader than the immediate user need.
- The default Plants drawer also said `next care signal`, which sounds more like system language than gardener language.
- Chrome fallback for screenshots is not currently usable: Chrome is running, and the native host manifest is correct, but the Codex Chrome Extension is missing from the selected Chrome profile (`Profile 1`). It is installed in a different Chrome profile.

## Changes Implemented

- Rewrote the Plants view subtitle in the signed-in app and sample app:
  - `Track what is growing now, what you saved for later, and what you learned from past seasons.`
  - to `See what is growing, where it lives, and what needs attention next.`
- Rewrote the read-only Plants drawer prompt:
  - `Choose a plant to see its place, history, and next care signal.`
  - to `Choose a plant to see where it is, what happened, and what needs attention next.`
- Rewrote the sample Plants default guide:
  - `Pick one to see its timeline and next care signal.`
  - to `Pick one to see its care history and next task.`
- Updated sample route regression coverage for the new copy and old-copy exclusions.

## Updated Health

- The Plants route now introduces itself around a user task: see the growing plants and what needs attention.
- The sample default drawer is less technical and no longer uses `signal` language.
- Checked public and sample routes remained clean and continued to use real plant-art image URLs.

## Evidence

- Chrome fallback was checked. Chrome is running and the native host manifest is correct, but the selected Chrome profile does not have the Codex Chrome Extension installed/enabled, so Chrome screenshot capture could not be used.
- Focused test passed: `sample-garden.test.ts`, 1 file, 9 tests.
- Full `npm test` passed: 17 test files, 77 tests.
- `npm run build` passed with Next.js production build.
- `git diff --check` passed.
- Visible route text scan confirmed `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, and `/app/my-property` returned `200`.
- The same visible route scan found no stale visible hits for private-link, early-access, waitlist, prototype, visible `No photo yet`, old first-run wording, old garden-name placeholder, config jargon, environment-variable language, old suggestion-system labels, or old Plants route wording.
- Image-source scan stayed clean on checked routes: homepage `24` plant-art references; sample Property `3`; sample Plants `15`; sample Calendar `3`; sample Plant Guide `12`; public catalogue `98`; French Marigold detail `6`; signed-out app gate `0`; all checked routes had `0` `.svg` image references.

## Evidence Limits

- No accepted screenshots were captured in this pass. In-app Browser screenshot capture previously timed out; Chrome fallback is currently unavailable because the Codex Chrome Extension is missing from the selected Chrome profile.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
