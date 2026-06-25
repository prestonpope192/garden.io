# Iteration 168: Contextual plant-check homepage copy

Scope: tighten the homepage value loop so it explains the app's plant-check value in prospective-user language.

Changed:
- Replaced the abstract value point `Get the next step` with `Check plants with context`.
- Replaced the broad `Turn notes, photos, dates, and weather into clear steps` language with a more concrete promise: when something looks off, use the plant's notes, bed, season, and photo to decide what to try next.
- Reworded the plant-memory section from `care items` to `next care`, matching the rest of the public promise.
- Updated homepage regression coverage to require the new language and reject the older abstract/internal wording.

Why:
- A prospective user is not evaluating a product architecture; they are wondering what to do when a real plant looks wrong.
- The new copy maps directly to a felt need: "what is happening to this plant, and what should I try?"
- `Care items` reads like task-system terminology; `next care` is shorter and matches the user's garden goal.

Verification:
- Focused tests passed from `website/`: `homepage-content.test.ts` and `diagnose-panel-content.test.ts`, 2 files, 4 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered visible-text scan passed across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, and `/app/my-property`.
- Rendered scan confirms `/` includes `Check plants with context`, `use its notes, bed, season, and photo to decide what to try next`, and `Photos, notes, harvests, plant checks, and next care all stay with the right plant`.
- Rendered scan confirms `/` no longer includes `Get the next step`, `Turn notes, photos, dates, and weather into clear steps`, homepage `care items`, `Working product`, `whole product`, `homepage`, or `.svg`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls are not available in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
