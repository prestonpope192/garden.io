# Product Design Audit - Iteration 114

Date: 2026-06-22
Scope: public and signed-in Plant Guide browse copy.

Capture status: no new screenshots were captured in this pass. Product Design Browser capture was not exposed through available tools, and Playwright fallback still requires explicit user approval. Validation used source inspection, component rendering tests, production build, and rendered route HTML from `http://localhost:3020`.

## User Goal

A gardener opening the Plant Guide should immediately understand how it helps: choose a plant that fits the actual spot, then save what happens after planting. The first screen should not lead with interface mechanics like browsing/filtering.

## Finding

The Plant Guide still used mechanical labels in the public and signed-in browse controls: `Browsing`, `Narrow choices`, `Sun + water`, `spot-check the basics`, `Save to garden`, and `track what happens`. These were understandable, but they made the page feel more like a catalogue UI than a simple garden decision helper.

## Change

- Public Plant Guide filter summary now says `Showing`.
- Public and signed-in Plant Guide filter toggle now says `Choose plant type` / `Hide plant types`.
- Public Plant Guide value stats now say `Right place / check sun, water, and space` and `After planting / save what happens`.
- Updated catalogue tests to require the cleaner labels and reject the old mechanical phrases.

## Step Review

1. Public Plant Guide hero: healthier. The page now frames the user task as fit and follow-through.
2. Public Plant Guide filter summary: healthier. `Showing` is simpler than `Browsing`, and `Choose plant type` is more specific than `Narrow choices`.
3. Signed-in Plant Guide toolbar: healthier. It now uses the same `Showing` and `Choose plant type` language as public browse.
4. Public and signed-out routes: healthy. Rendered route scan still avoids stale launch/beta/product and old Plant Guide copy markers.

## Verification

- Focused tests passed: `public-catalogue-content.test.ts`, `catalogue-format.test.ts`, and `sample-garden.test.ts`, 3 files, 23 tests.
- Full `npm test` passed: 18 files, 86 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes.
- Rendered `/catalog` text now includes `Showing All plants`, `Choose plant type`, `Right place`, and `After planting`.

## Evidence Limit

No screenshot-backed visual audit was completed in this pass. The public route was verified through rendered HTML; the signed-in Plant Guide toolbar is covered by component rendering tests because protected app routes render the auth gate without a session.
