# Iteration 274 Product Design Audit

Scope: align the public homepage, auth gate, and Ask surface around the simpler `Your garden, smarter` promise, then keep the sample calendar focused on immediate weekly care.

Audit mode: copy audit, first-screen visual review, component-render regression tests, full test suite, production build, Chrome-rendered text checks, and screenshot capture.

Captured screens:
- `01-sample-ask.png` - sample Ask screen before this pass.
- `02-sample-property.png` - sample property screen before this pass.
- `03-sample-calendar.png` - sample calendar before this pass.
- `04-sample-plants.png` - sample plants screen before this pass.
- `05-sample-catalogue.png` - sample catalogue before this pass.
- `06-app-auth.png` - auth gate before this pass.
- `07-homepage-copy-after.png` - homepage after the copy update.
- `08-sample-ask-copy-after.png` - sample Ask screen after the copy update.
- `09-sample-calendar-after.png` - sample calendar after the weekly-care simplification.

Finding:
- The stale screenshot language, `Know what to do next` and `Ask your garden`, did not match the simpler direction.
- The homepage already had the right core tagline, but the support copy could be shorter and more user-facing.
- The sample Ask page needed the same three-second value: add a note or photo, then get one clear next step that uses the user's garden context.
- The sample calendar promised `This Week`, but the read-only screen still allowed later-care planning data to compete with the immediate weekly care.

Changed:
- Kept the primary promise as `Your garden, smarter.`
- Rewrote homepage and auth-gate support copy to: `Keep simple notes and photos with the plants and beds they belong to. When you ask for help, the answer starts with your garden.`
- Rewrote the small homepage reassurance to: `Start with one plant. Every note makes the next answer feel less generic.`
- Rewrote the Ask lead to: `Add a note or photo. Get one clear next step that uses your plants, beds, and season.`
- Hid later-care planning rails and season/idea panels from the read-only sample calendar while leaving them available in the signed-in editable calendar.
- Updated regression tests to enforce the new copy and reject stale `Know what to do next`, `Ask your garden`, later-care, and generic planning language.

Evidence:
- Focused tests passed: `homepage-content.test.ts`, `auth-gate-content.test.ts`, `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, `empty-state-content.test.ts`, and `garden-suggestions-history.test.ts` - 6 files, 42 tests.
- Full `npm test` passed: 23 files, 124 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Chrome-rendered text checks passed for `/`, `/sample-garden/ask`, `/sample-garden/calendar`, and `/app/my-property`.
- Rendered checks confirmed the stale `Know what to do next` and `ASK YOUR GARDEN` copy is absent from visible text.
- Rendered checks confirmed the sample calendar visible text does not include `This season`, `Later care`, `Ideas for later`, or `Refresh mulch on exposed soil`.
- Preview restarted at `http://127.0.0.1:3021`.

Evidence limits:
- The signed-in editable calendar was covered by tests and source-level review, not a live authenticated browser session.
- The raw Next HTML still serializes future sample tasks for hydration; visible browser text is the source of truth for the sample calendar copy check.
