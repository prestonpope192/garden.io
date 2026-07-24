# Iteration 307 - Context instead of memory jargon

Scope: reduce remaining `memory` wording on the homepage and Ask loading state so the app feels like a useful garden notebook, not an internal product concept.

Finding:
- The homepage loop still said `Ask from memory`.
- The same section said every note gives the next question `more memory`.
- The Ask loading state said `Looking across your garden memory...`.
- These phrases were directionally accurate, but they made the first read more abstract than a gardener needs.

Changed:
- Changed the homepage loop card from `Ask from memory` to `Ask with context`.
- Changed the homepage support line to `Every note, photo, and harvest gives the next question more context.`
- Changed the Ask loading line to `Checking your garden notes...`.
- Added tests to keep the older memory phrases out of the homepage and Ask source.

Evidence:
- Product Design audit, Product Design index, user-context preflight, critical overrides, and design-audit framework were read during this pass.
- Product Design saved context preflight returned no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `homepage-content.test.ts`, `ai-first-garden-home.test.tsx`, and `sample-garden.test.ts` - 3 files, 22 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed with Next.js production build.
- Standalone preview restarted at `http://127.0.0.1:3021`.
- Live `/` contains `Your garden, smarter`, `Ask with context`, and `Every note, photo, and harvest gives the next question more context`.
- Live `/sample-garden/ask` contains `Your garden, smarter`, `Garden notes`, `This week`, and `Field guide`.
- Live `/app` contains `Your garden, smarter`, `A calm garden notebook`, and `garden notebook`.

Limit:
- Browser screenshot capture was not used. Browser/Chrome capture tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
- This pass covers copy clarity in the homepage and Ask loading source, not a full visual screenshot audit.
