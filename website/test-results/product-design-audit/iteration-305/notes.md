# Iteration 305 - Homepage promise and setup feedback

Scope: keep the public promise aligned with `Your garden, smarter.` and simplify setup/save feedback so it sounds useful to a gardener instead of procedural app status.

Finding:
- The screenshot direction, `Ask your garden` / `Know what to do next`, was too broad and too slogan-like for the gardening-journal feel.
- The current homepage source already uses the better promise, `Your garden, smarter.`, with the supporting line focused on a calm garden notebook.
- A few mutation confirmations still sounded like generic workflow output, especially `details saved` and `add a bed`.

Changed:
- Kept the homepage centered on `Your garden, smarter.`.
- Kept the support line user-facing: `A calm garden notebook for what you planted, where it lives, what changed, and what to care for now.`
- Simplified setup confirmations:
  - `Your garden is saved. Now name one area.`
  - `Area saved. Now name one bed.`
  - `Bed saved. Now add the plant.`
- Shortened edit confirmations to `Garden saved.`, `Area saved.`, `Bed saved.`, and `Plant saved.`

Evidence:
- Focused copy tests passed: `garden-mutation-copy.test.ts`, `sample-garden.test.ts`, `empty-state-content.test.ts`, `ai-first-garden-home.test.tsx`, and `homepage-content.test.ts` - 5 files, 31 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed with Next.js production build.
- Preview restarted at `http://127.0.0.1:3021`.
- Live `/` contains `Your garden, smarter`, `A calm garden notebook`, and `Start with one plant`.
- Live `/sample-garden/ask` contains `Your garden, smarter`, `Garden notes`, `This week`, and `Field guide`.
- Source scan found rejected phrases only in negative test guards:
  - `Know what to do next`
  - `Ask your garden`
  - `Your garden is saved. Now add a place to grow.`
  - `Area saved. Now add a bed.`
  - `Bed saved. Now add a plant.`
  - `details saved`

Limit:
- Browser screenshot capture was not used. The Product Design Browser/Chrome screenshot tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
- The live route HTML does not expose mutation confirmation strings until interactions occur, so confirmation copy is verified through source checks and rendered tests.
