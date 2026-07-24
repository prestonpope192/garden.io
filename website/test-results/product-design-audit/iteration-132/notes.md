# Iteration 132 Notes

Scope: make the public example-garden entry feel like a user invitation instead of a product demo label.

Changed:
- Homepage CTAs now say `See it in action` instead of `See a sample garden`.
- Sign-in gate secondary CTA now says `See it in action`.
- Sign-in unavailable message now says users can still see Garden.io in action or explore plants.
- The read-only garden shell badge now says `Example garden` instead of `Sample garden`.
- Regression coverage rejects `See a sample garden`, `Sample garden`, `Preview garden`, and `Demo garden` in the affected rendered surfaces.

Why:
- Prospective users are deciding whether this solves their garden problem, not looking for a demo artifact.
- `See it in action` is a faster, clearer CTA from the homepage and sign-in gate.
- Once inside the read-only app, `Example garden` still explains the context without sounding like a prototype label.

Verification:
- Focused entry-point tests passed: `homepage-content.test.ts`, `auth-gate-content.test.ts`, and `sample-garden.test.ts`, 3 files, 15 tests.
- Full `npm test` passed: 18 files, 87 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Source scan confirms old CTA/sample labels remain only as negative assertions.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
