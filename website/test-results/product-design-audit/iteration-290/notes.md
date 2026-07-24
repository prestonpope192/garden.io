# Iteration 290 - Your Garden, Smarter Copy Pass

Scope: replace remaining over-explained ask/product copy with a simpler user-facing promise around "Your garden, smarter."

Changed:
- Homepage hero lead now says: "A simple garden journal that remembers what you plant, where it grows, and what happened last time, so care gets clearer every season."
- Homepage supporting note now says: "Start with one plant. Every note makes your garden smarter."
- Homepage third promise changed from "Get smarter guidance" to "Ask with context."
- Auth gate uses the same simple garden-journal promise as the homepage.
- Ask surface lead changed to "Add a note or photo. Get help that already knows your plants, beds, weather, and history."
- Ask surface supporting note changed to "The more you save, the smarter your garden gets."
- Ask surface save hint changed to "Save useful notes so next time starts with what happened."
- Ask shortcut label changed from "Garden memory" to "My garden."

Evidence:
- Focused tests passed: `homepage-content.test.ts`, `auth-gate-content.test.ts`, `ai-first-garden-home.test.tsx`, and `sample-garden.test.ts` - 4 files, 24 tests.
- Full `npm test` passed: 23 files, 128 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Preview restarted at `http://127.0.0.1:3021`.
- Rendered homepage contains "Your garden, smarter", the new garden-journal lead, "Every note makes your garden smarter", and "Ask with context."
- Rendered sample ask route contains "Add a note or photo", "The more you save, the smarter your garden gets", and "My garden."
- Rendered auth gate contains the new garden-journal lead.

Limit:
- Browser screenshot capture was not used. The available Product Design Browser/Chrome tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
