# Iteration 219

Scope: use current visual evidence to tighten the simplified homepage first viewport.

Accepted screenshots:
- `screenshots/01-homepage.png` — Chrome screenshot, homepage before spacing fix.
- `screenshots/02-auth-start.png` — Chrome screenshot, signed-out start-garden screen.
- `screenshots/03-sample-property.png` — Chrome screenshot, sample My Garden screen.
- `screenshots/05-catalog.png` — Chrome screenshot, public plant catalogue.
- `screenshots/06-homepage-after.png` — Chrome screenshot, homepage after spacing fix.

Rejected capture:
- A fullscreen macOS capture was rejected because it showed the lock screen, not Garden.io.

Finding:
- The simplified homepage was mostly clear, but the first viewport cut the next section heading at the bottom of the screen.
- That made the transition from hero to `How it helps` feel accidental and visually heavy.
- The desired behavior is a deliberate preview: enough of the next section should be visible to show the page continues without cropping the heading awkwardly.

Changed:
- Added a homepage-specific `.home-hero` spacing override.
- Reduced homepage hero media minimum height from `clamp(420px, 42vw, 560px)` to `clamp(360px, 36vw, 500px)`.
- Reduced homepage fit-note top margin.
- Added a `.home-loop` spacing override so the first explanatory section starts cleaner.
- Added `homepage-visual-css.test.ts` to guard the compact hero spacing.

Result:
- Before: `screenshots/01-homepage.png` showed the `How it helps` heading clipped at the bottom.
- After: `screenshots/06-homepage-after.png` shows the `How it helps` label, full heading, and supporting line in the first viewport.

Verification:
- Focused `npm test -- homepage-visual-css.test.ts homepage-content.test.ts` passed from `website/`: 2 files, 4 tests.
- Full `npm test` passed from `website/`: 19 files, 98 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Rendered visible-text probe returned 200 and clean for `/`, `/app/my-property`, `/app/calendar`, `/app/my-plants`, `/app/plant-catalogue`, `/sample-garden/property`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/catalog/autumn-sage`, and `/catalog/curry-leaf`.
- Accepted screenshot inspection confirmed homepage before/after, auth gate, sample My Garden, and catalogue states rendered the intended Garden.io routes.

Evidence limits:
- Product Design Browser/Chrome internal tools were not exposed; screenshots were captured through local command-line Chrome.
- Computer Use could not attach to Chrome or Arc windows in this session.
- The accepted screenshots are current Chrome-rendered local routes, but this is still not a full interactive browser audit.
- Authenticated signed-in visual QA, keyboard flow, screen-reader behavior, successful magic-link delivery, and photo upload still need a reliable browser-backed pass.
