# Iteration 505 - Auth and Example Garden Copy

Scope: make the signed-out start path and homepage secondary CTA feel like gardener-facing actions instead of auth/demo mechanics.

Changed:
- Changed the sent magic-link message from `Check your email. Use the garden link, then add one plant to begin.` to `Check your email, then add one plant to begin.`
- Changed the auth submit button from `Send garden link` to `Email me a start link`.
- Changed homepage and auth secondary CTA copy from `See a sample garden` to `Browse an example garden`.
- Changed unavailable auth copy from `see a sample garden` to `browse an example garden`.
- Kept `Enter your email. We'll send a link to start your garden.` because it explains the required email action without sign-in jargon.

Evidence:
- Used `orchestratror-mode` with one bounded explorer scan for remaining product-internal copy, then kept prioritization, edits, and final verification in the main thread.
- Used Product Design audit guidance, critical overrides, current route output, focused tests, full tests, build verification, and Garden.io brand memory.
- Route probe of `/app/my-property` confirmed the signed-out auth gate renders `Email me a start link`, `Browse an example garden`, and `send a link to start your garden`, with no stale `Send garden link` / `See a sample garden`.
- Route probe of `/` confirmed the homepage renders `Browse an example garden`, with no stale `See a sample garden`.
- Focused tests passed from the website package: `auth-gate-content.test.ts`, `auth-magic-link-route.test.ts`, `homepage-content.test.ts`, and `sample-garden.test.ts` - 4 files, 23 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- Browser screenshot capture was not available. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used route-output probes plus source/test/build verification.
