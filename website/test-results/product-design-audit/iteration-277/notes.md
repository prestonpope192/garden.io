# Product Design Audit - Iteration 277

Date: 2026-06-23
Scope: sample Ask entry copy and first-screen prompt density.
Preview: http://127.0.0.1:3021/sample-garden/ask

## Finding

The Ask entry point had the right promise, `Your garden, smarter`, but the first mobile screen still behaved like a prompt catalogue. Four large example prompts pushed the route shortcuts down to about 710px and made the primary user job feel less direct.

## Change

- Rewrote the Ask lead to: `Describe what you see. Get one clear next step for the plant, bed, and season.`
- Rewrote the save hint to: `Save the answer so your garden remembers what happened.`
- Reduced suggested prompts from four to two:
  - `Why are my tomato leaves yellowing?`
  - `What should I do after heavy rain?`
- Removed the extra basil and heat prompt examples from the empty Ask state.

## Evidence

- Before screenshots:
  - `01-ask-desktop-before.png`
  - `02-ask-mobile-before.png`
- After screenshots:
  - `03-ask-desktop-after.png`
  - `04-ask-mobile-after.png`
- Mobile after metrics:
  - CSS viewport: 390px
  - Document scroll width: 390px
  - Horizontal overflow: false
  - Prompt count: 2
  - Shortcut count: 3
  - First shortcut top: 601.734px
- Before mobile metric from the audit capture:
  - Prompt count: 4
  - First shortcut top: 709.656px

## Verification

- Focused tests passed: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, and `mobile-layout-css.test.ts` - 3 files, 20 tests.
- Full `npm test` passed - 23 files, 127 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Preview restarted at `http://127.0.0.1:3021`.

## Evidence Limits

This pass verified the read-only sample Ask screen and source-rendered Ask copy. It did not run an authenticated save flow or photo upload flow.
