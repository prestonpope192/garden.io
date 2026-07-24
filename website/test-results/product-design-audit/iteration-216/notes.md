# Iteration 216

Scope: make plant-help retry and limit copy speak to user needs instead of request mechanics.

Changed:
- Replaced the diagnose overload message `A lot of plant questions are queued right now. Please try again in a moment.` with `A lot of plant help is queued right now. Please try again in a moment.`
- Replaced the per-user limit message `You have reached the plant question limit for now. Please try again in a little while.` with `You can ask for more plant help in a little while.`
- Added regression coverage so the older request-mechanics phrasing does not return.

Why:
- `Plant questions` describes an internal feature bucket.
- `Plant help` matches what a gardener is asking for when something looks off: what to do next.
- The error states now use the same plain user-facing language as the plant-help panel and calendar empty states.

Verification:
- Focused `npm test -- diagnose-route-copy.test.ts` passed from `website/`: 1 file, 2 tests.
- Full `npm test` passed from `website/`: 18 files, 97 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/app/calendar`, `/app/my-plants`, `/app/plant-catalogue`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/catalog/autumn-sage`, and `/catalog/curry-leaf`.
- Source probe confirmed `website/app/api/diagnose/route.ts` and `website/lib/rate-limit.ts` contain the new plant-help retry/limit messages.
- Source probe confirmed `website/app/api/diagnose/route.ts` and `website/lib/rate-limit.ts` no longer contain `plant questions are queued` or `plant question limit`.

Evidence limits:
- Product Design Browser/Chrome capture tools were not exposed for this pass; no new screenshot capture was attempted.
- Playwright was not used because explicit approval is required.
- Current proof is source, component tests, full tests, production build, route checks, and rendered HTML visible-text probes.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
