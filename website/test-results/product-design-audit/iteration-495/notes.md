# Iteration 495 - Ask CTA Copy

Scope: make the Ask entry CTA read like the help a gardener wants, not like an internal feature action.

Changed:
- Changed the first-screen Ask button from `Check this change` to `See what helps`.
- Updated app-home and sample-garden tests to require `See what helps` and reject the old `Check this change` wording.

Why:
- `Check this change` is understandable but still sounds like operating a tool.
- `See what helps` is shorter, calmer, and closer to the user's felt need after noticing yellow leaves, heavy rain, pests, bloom changes, or another garden issue.

Evidence:
- Product Design user-context preflight ran. Saved context exists but has no entries, so this pass used route output, source, tests, build output, and Garden.io brand memory.
- Live `/sample-garden/ask` and `/sample-garden` route-output probes found `See what helps`.
- The route probes did not find `Check this change`.
- Focused tests passed from the website package: `ai-first-garden-home.test.tsx`, `sample-garden.test.ts`, and `diagnose-route-copy.test.ts` - 3 files, 20 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.

Limit:
- Browser screenshot capture was not available. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used route-output probes plus test/build verification.
