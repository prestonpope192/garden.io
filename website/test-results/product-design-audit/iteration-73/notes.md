# Iteration 73 - Capture And Plant Problem Check Copy

## Flow Steps Checked

1. Quick capture button and panel copy
   - Health: improved by source inspection and focused tests.
   - Notes: the quick capture surface now says `Save update` and `What changed?`, which better matches the user job of recording what happened, including notes and photos.

2. Plant problem check
   - Health: improved by source inspection and focused tests.
   - Notes: fallback and save-hint copy now avoids assistant-centered language and avoids naming internal UI like `Care Timeline`.

3. Public and sample routes
   - Health: healthy by route text and image-source checks.
   - Notes: checked routes still avoid beta/private/prototype language, visible `No photo yet`, stale catalogue wording, and SVG image sources.

## Screenshot Capture

- No new accepted screenshots were captured in this pass.
- Evidence is route text, image-source scans, source inspection, focused tests, full tests, and build output.

## Evidence

- Focused tests passed: `quick-log-content.test.ts`, `diagnose-panel-content.test.ts`, and `diagnose-route-copy.test.ts` (3 files, 3 tests).
- Full `npm test` passed: 17 files, 77 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Route scan passed for `/`, `/sample-garden/property`, `/sample-garden/plants`, `/sample-garden/calendar`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, and `/app/my-property`.
- Checked routes had no stale hits for private-link, early-access, waitlist, prototype, visible `No photo yet`, old catalogue wording, old assistant-centered error copy, `Care Timeline`, or old quick-capture labels.
- Checked routes had `0` SVG image sources; homepage rendered 4 `plant-art` images, public catalogue rendered 7, French Marigold detail rendered 1, sample Plants rendered 4, and sample Plant Guide rendered 3.
- Source/copy scan confirmed the new strings:
  - `Save a garden update or photo`
  - `Save update`
  - `What changed?`
  - `Attach it to`
  - `Plant problem checks could not run...`
  - `Keeps this reading with the plant's notes and tasks.`

## Remaining Limits

- Authenticated signed-in visual QA still needs a reliable screenshot path.
- Keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload remain unverified.
