# Iteration 255 - Ask Answer Memory Framing

Date: 2026-06-23

Scope: simplify the sample Ask answer/save flow so saving feels like making future help smarter, not filing a note.

## Screenshots

- `screenshots/01-ask-empty-before.png` - Ask entry before the save-hint rewrite.
- `screenshots/02-answer-before.png` - answered state before the save-panel rewrite.
- `screenshots/03-save-panel-before.png` - old save panel with `Save to memory` / `Save note`.
- `screenshots/04-save-panel-after.png` - revised save panel with `Make future help smarter` / `Remember this answer`.
- `screenshots/05-saved-state-after.png` - saved state with `Remembered` button.

## Finding

- The Ask answer itself was useful: one primary action, supporting checks, and reasons below.
- The save language still felt like database filing: `Save to memory`, `Save with`, and `Save note`.
- The sample action also said `Save one note...`, which kept the user's attention on storage instead of the next benefit.

## Changed

- Replaced the Ask entry hint with `Each saved answer gives the next question more context.`
- Replaced the save-panel label with `Make future help smarter`.
- Reframed the target selector from `Save with` to `Remember for`.
- Replaced `Save note` with `Remember this answer`; saved state now says `Remembered`.
- Replaced the success message with `Future answers will remember this for [target].`
- Rewrote the sample answer action to `Remember which plant or bed this happened in so next time starts with more context.`

## Result

- The save step now explains why a gardener would do it: better future answers.
- The language stays aligned with the homepage promise that Garden.io remembers garden context.
- The underlying behavior stayed the same: quick-log still stores the answer against the selected garden target.

## Evidence

- Chrome accessibility tree for `/sample-garden/ask` confirmed the new entry hint.
- Chrome accessibility tree for the answered state confirmed `Make future help smarter`, `Remember for Whole garden`, and `Remember this answer`.
- Chrome accessibility tree after saving confirmed `Future answers will remember this for Whole garden.` and the disabled `Remembered` state.
- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, and `quick-log-content.test.ts`, 3 files, 17 tests.
- Full `npm test` passed: 22 files, 120 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Live HTML at `http://127.0.0.1:3021/sample-garden/ask` contains the new entry hint and no old `Save useful answers` or `Save note` strings.

## Evidence Limits

- This pass covered the sample Ask flow in desktop Chrome.
- It did not test the real authenticated API-backed diagnosis flow with uploaded images.
- Screenshot inspection does not prove complete keyboard or screen-reader behavior.
