# Iteration 268 - First-Value Copy

Scope: align the homepage and signed-out app entry copy with the simple first-value path: start with one bed or plant, then save notes and photos so answers have useful context.

Captured screens:
- `01-homepage-first-value.png` - public homepage after the copy update.
- `02-auth-gate-first-value.png` - signed-out app gate after the copy update.

Finding:
- The prior copy led with quick notes and saving more context.
- That promised the later AI loop before the user understood the first practical step.
- A prospective gardener needs a three-second answer: this is a garden journal that gets smarter when the app knows one plant or bed.

Changed:
- Changed the homepage headline to `Your garden, smarter.`
- Rewrote the homepage lead to start with one bed or plant before notes and photos.
- Rewrote the homepage support note around a journal that can answer back.
- Matched the signed-out app gate to the same first-value promise.
- Replaced the auth gate first-step card with `Your first plant makes the garden useful.`
- Updated homepage and auth-gate content tests to reject stale note-first and developer-facing copy.

Evidence:
- Browser screenshot metrics confirmed the homepage begins with `Your garden, smarter.` and the first-value lead.
- Browser screenshot metrics confirmed the auth gate shows `Your first plant makes the garden useful.`
- Route scans confirmed `/`, `/app`, and `/sample-garden/ask` return 200.
- Route scans confirmed old `Start with one garden note` and old `Add a quick note or photo as you garden` copy are absent.
- Focused tests passed: `homepage-content.test.ts`, `auth-gate-content.test.ts`, and `empty-state-content.test.ts`, 3 files, 14 tests.
- Full `npm test` passed: 22 files, 121 tests.
- `npm run build` passed.
- Preview restarted at `http://127.0.0.1:3021`.

Evidence limits:
- This pass verified static first-touch copy and screenshots.
- It did not verify successful magic-link delivery or the fully authenticated first-run creation flow.
