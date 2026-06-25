# Iteration 163 Product Design Audit Notes

Scope: align the sign-in gate with the app's actual care-list promise.

Changed:
- Replaced the sign-in value line `Save beds, plants, photos, notes, and care reminders in one place.` with `Save beds, plants, photos, notes, and next care in one place.`
- Updated auth-gate content tests to require `next care` and reject `care reminders`.

Why:
- `Care reminders` can imply notification behavior, while the current app gives users a care list and clear next care.
- The homepage and app already promise `next care`; the sign-in gate should match that simpler value.
- Prospective users should understand the app as a garden memory plus next-step surface, not a reminders product.

Verification:
- Focused tests passed: `auth-gate-content.test.ts`, `homepage-content.test.ts`, and `empty-state-content.test.ts`, 3 files, 12 tests.
- Full `npm test` passed: 18 files, 90 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Source scan confirms `care reminders` is absent from user-facing component copy and remains only in negative regression assertions.
- Rendered visible-text scan passed across `/`, `/sample-garden`, `/sample-garden/calendar`, `/sample-garden/plants`, `/sample-garden/catalogue`, `/catalog`, `/catalog/french-marigold`, `/app`, and `/app/my-property`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
