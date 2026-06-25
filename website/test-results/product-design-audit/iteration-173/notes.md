# Iteration 173: Auth gate entry copy

Scope: make the unauthenticated app entry clearer and less repetitive for prospective users.

Changed:
- Replaced `Your garden, remembered` with `Open your garden`.
- Replaced `Start with the garden you have.` with `Start with what you already have.`
- Replaced `Save beds, plants, photos, notes, and next care in one place.` with `Add beds and plants once. Keep photos, notes, and next care together.`
- Replaced the form button `Send my link` with `Email me a sign-in link`.
- Updated auth-gate regression coverage to require the clearer entry copy and reject the older phrasing.

Why:
- The app entry should immediately tell a new or returning gardener what they are opening.
- `Start with what you already have` is shorter and avoids repeating `garden`.
- `Email me a sign-in link` is clearer than `Send my link` because it says what will happen.

Verification:
- Focused tests passed from `website/`: `auth-gate-content.test.ts`, `empty-state-content.test.ts`, and `auth-magic-link-route.test.ts`, 3 files, 11 tests.
- Full `npm test` passed from `website/`: 18 files, 90 tests.
- `npm run build` passed.
- `git diff --check` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered visible-text scan passed across `/`, `/app/my-property`, `/app/calendar`, `/app/my-property?auth=sent`, and `/sample-garden/property`.
- Rendered scan confirms `/app/my-property` and `/app/calendar` include `Open your garden`, `Start with what you already have`, `Add beds and plants once`, and `Email me a sign-in link`.
- Rendered scan confirms the auth gate no longer includes `Your garden, remembered`, `Start with the garden you have`, `Send my link`, or the older `Save beds, plants...` sentence.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture controls were not available in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
