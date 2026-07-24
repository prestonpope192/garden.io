# Iteration 306 - Auth gate notebook wording

Scope: align the signed-out app gate with the public homepage's garden-notebook promise.

Finding:
- The auth gate already used the stronger headline, `Your garden, smarter.`
- One remaining validation message and the first-step region label still used `garden memory`.
- That wording is close to the product concept, but it sounds more like internal positioning than a simple thing a gardener understands before signing in.

Changed:
- Changed the empty-email validation message to `Enter your email to start your garden notebook.`
- Changed the first-step region label to `Why start a garden notebook`.
- Updated tests to guard against the old `garden memory` auth-gate wording.
- Renamed the homepage test description from garden memory positioning to garden notebook positioning.

Evidence:
- Product Design audit, Product Design index, user-context preflight, critical overrides, and design-audit framework were read during this pass.
- Product Design saved context preflight returned no saved entries, so this pass used the current repo and Garden.io memory as grounding.
- Focused tests passed: `auth-gate-content.test.ts`, `ai-first-garden-home.test.tsx`, and `homepage-content.test.ts` - 3 files, 11 tests.
- Full `npm test` passed: 23 files, 130 tests.
- `git diff --check` passed.
- `npm run build` passed with Next.js production build.
- Standalone preview restarted at `http://127.0.0.1:3021`.
- Live `/` contains `Your garden, smarter`, `A calm garden notebook`, and `A garden notebook that remembers`.
- Live `/app` contains `Start your garden`, `Your garden, smarter`, `A calm garden notebook`, `garden notebook`, `Email me my garden link`, `Tour a garden`, and `Find plants that fit`.
- Live `/sample-garden/ask` contains `Your garden, smarter`, `Garden notes`, `This week`, and `Field guide`.

Limit:
- Browser screenshot capture was not used. The Product Design Browser/Chrome screenshot tools were not exposed, and Playwright fallback requires explicit permission under the Product Design rules.
- This pass only covers the signed-out auth gate wording and related homepage/Ask route checks, not a full visual screenshot audit.
