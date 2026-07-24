# Iteration 269 - Ask Surface Copy

Scope: simplify the public sample Ask screen so the AI entry point reads like a garden journal that gives one practical next step, not a generic assistant surface.

Captured screen:
- `01-sample-ask-copy.png` - public sample Ask screen after the copy update.

Finding:
- The homepage now promises `Your garden, smarter`, but the Ask surface still used generic care language like `What needs attention today?`
- The shortcut copy also said `The care that needs attention`, which sounded more like a productivity dashboard than a gardening journal.
- The user-facing value is simpler: add a garden note or photo, get one next step, then save the answer to the plant or bed so the next check starts with memory.

Changed:
- Rewrote the Ask lead to `Add a garden note or photo. Get one next step that uses your plants, beds, and season.`
- Rewrote the save hint to `Save useful answers so the next check starts with what happened.`
- Replaced generic prompt chips with more concrete garden questions.
- Rewrote shortcuts to emphasize garden map, weekly watering/harvest/checks, and plant fit.
- Replaced `Make future help smarter` with `Save this to your garden`.
- Updated app and sample shell subtitles to match the new Ask promise.
- Updated AI-first and sample garden content tests to reject the old generic copy.

Evidence:
- Chrome screenshot capture confirmed the current `/sample-garden/ask` visual state.
- Computer Use accessibility tree confirmed the page URL and text state before capture.
- Route scan confirmed `/sample-garden/ask`, `/sample-garden/property`, `/`, and `/app` return 200.
- Route scan confirmed old `What needs attention today`, old `The care that needs attention`, and the old Ask lead are absent.
- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, `homepage-content.test.ts`, and `auth-gate-content.test.ts`, 4 files, 22 tests.
- Full `npm test` passed: 22 files, 121 tests.
- `npm run build` passed.
- Preview restarted at `http://127.0.0.1:3021`.

Evidence limits:
- The Product Design Browser tool was not callable in this session, so capture used Chrome against the local preview.
- This pass verified static Ask entry copy and accessible text, not the live OpenAI diagnosis response or saved-answer mutation after sign-in.
