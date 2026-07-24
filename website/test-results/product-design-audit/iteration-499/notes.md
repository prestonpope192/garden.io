# Iteration 499 - Ask Shortcut Accessibility Labels

Scope: make the Ask shortcut aria labels read like navigation instead of generic opening actions.

Changed:
- Changed `aria-label="Open My Garden"` to `aria-label="Go to My Garden"`.
- Changed `aria-label="Open weekly care"` to `aria-label="Go to weekly care"`.
- Updated Ask/sample tests to require the new accessible labels and reject the old `Open` wording.

Why:
- The visible labels were already simple, but screen-reader labels still used app-like `Open` language.
- `Go to...` is clearer navigation language for these shortcuts.

Evidence:
- Product Design user-context preflight ran. Saved context exists but has no entries, so this pass used route HTML, source, tests, build output, and Garden.io brand memory.
- Raw route HTML for `/sample-garden/ask` and `/sample-garden` found `aria-label="Go to My Garden"` and `aria-label="Go to weekly care"`.
- The same route probes did not find `aria-label="Open My Garden"` or `aria-label="Open weekly care"`.
- Focused tests passed from the website package: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, and `empty-state-content.test.ts` - 3 files, 26 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.

Limit:
- Browser screenshot capture was not available. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used raw route HTML plus test/build verification.
