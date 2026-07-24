# Iteration 496 - Sample Garden CTA Clarity

Scope: make the homepage and auth fallback sample-garden CTA more explicit for prospective users.

Changed:
- Changed homepage secondary CTA from `Tour a garden` to `See a sample garden`.
- Changed the auth fallback sample-garden link from `Tour a garden` to `See a sample garden`.
- Changed the auth fallback message from `tour a garden` to `see a sample garden`.
- Updated homepage and auth content tests to require the new wording and reject the old wording.

Why:
- `Tour a garden` is warm but vague.
- `See a sample garden` tells the user exactly what they can do before starting their own garden.

Evidence:
- Product Design user-context preflight ran. Saved context exists but has no entries, so this pass used route output, source, tests, build output, and Garden.io brand memory.
- Live `/` route-output probe found `See a sample garden`.
- The route probe did not find `Tour a garden`.
- Focused tests passed from the website package: `homepage-content.test.ts`, `auth-gate-content.test.ts`, and `sample-garden.test.ts` - 3 files, 20 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.

Limit:
- Browser screenshot capture was not available. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used route-output probes plus test/build verification.
