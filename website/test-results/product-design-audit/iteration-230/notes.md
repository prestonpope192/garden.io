# Iteration 230 - Garden Question Entry Copy

Date: 2026-06-22
Surface: `/app/my-property` unauthenticated garden question entry and signed-in AI-first garden home copy
Mode: focused product-design audit and build pass
Destination: local folder

## User Goal

- Understand the first promise in a few seconds: Garden.io helps you know what to do next.
- Start from a note or photo without reading implementation language.
- Trust that garden notes, plants, beds, and care stay connected.

## Accepted Screenshots

- `screenshots/mobile-auth-entry-before.png` - mobile auth entry before this pass, captured through Chrome DevTools Protocol.
- `screenshots/desktop-auth-entry-before.png` - desktop auth entry before this pass, captured through Chrome DevTools Protocol.
- `screenshots/mobile-auth-entry-after.png` - mobile auth entry after this pass, captured through Chrome DevTools Protocol.
- `screenshots/desktop-auth-entry-after.png` - desktop auth entry after this pass, captured through Chrome DevTools Protocol.

## Rejected Evidence

- The first mobile capture used plain headless Chrome and appeared horizontally clipped.
- That screenshot path has been unreliable for narrow viewports in this audit sequence, so it was rejected.
- The screen was recaptured through Chrome DevTools Protocol with layout metrics before any edits.

## Finding

- The entry gate was visually healthy after CDP recapture, but the copy still read more like an app prompt than a user promise.
- The signed-in garden question flow also still had app-name-heavy phrases like `Ask Garden.io`, `Garden.io answer`, and `Garden.io used...`.
- Those phrases explain the product instead of helping a gardener quickly understand the value: ask what is happening, get a next step, save it to the right garden context.

## Changed

- Changed the entry headline from `Ask what to do next.` to `Know what to do next.`
- Replaced `Send a question or photo first...` with `Ask with a quick note or photo...`
- Changed the email CTA from `Send my garden link` to `Email me the link`.
- Updated signed-in AI home copy:
  - `Ask Garden.io` -> `Get next step`
  - `Garden.io answer` -> `Garden answer`
  - `Garden.io used your question...` -> `Based on what you shared, your season, and recent garden notes.`
  - saved task notes now say `From saved garden answer` instead of `From Garden.io answer`
- Added/updated tests to guard against the app-name-heavy language returning.

## Result

- The unauthenticated entry reads more like a user outcome than a product explanation.
- Final mobile metrics at 390px viewport:
  - document scroll width: `390px`
  - panel width: `366px`
  - panel right edge: `378px`
  - H1 right edge: `358.6px`
  - overflowing elements: `0`
- Served HTML contains `Know what to do next`, `Ask with a quick note or photo`, and `Email me the link`.
- Served HTML no longer contains the checked old phrases: `Ask what to do next`, `Send my garden link`, `Garden.io used`, or `Ask Garden.io`.

## Verification

- Focused `npm test -- auth-gate-content.test.ts ai-first-garden-home.test.tsx diagnose-panel-content.test.ts diagnose-route-copy.test.ts` passed from `website/`: 4 files, 9 tests.
- Full `npm test` passed from `website/`: 22 files, 114 tests.
- `npm run build` passed from `website/`.
- Local standalone production server returned 200 for `/app/my-property`, `/sample-garden/property`, and both current CSS chunks.
- Served HTML was checked for new and old phrases.
- Final accepted screenshots and metrics were captured through Chrome DevTools Protocol.

## Evidence Limits

- The live visual proof is for the unauthenticated `/app/my-property` entry gate.
- The signed-in AI home copy is verified through component source and tests in this pass; it was not visually captured because local auth was not available without changing auth state.
- Screenshot evidence does not prove keyboard order, screen reader behavior, magic-link delivery, or signed-in write behavior.

## Recommended Next Action

- Audit the signed-in `GardenAskView` visually with an authenticated session or an approved sample state, then tighten the composer layout and utility buttons if they still feel abstract.
