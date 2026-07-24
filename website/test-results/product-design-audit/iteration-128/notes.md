# Iteration 128 Notes

Scope: make Plant Guide catalogue labels describe the gardener's job instead of the site's content inventory.

Changed:
- Public Plant Guide counts now say `plants to compare` instead of `plants with care notes`.
- Public Plant Guide rows now label each result `Care guide` instead of `Care notes`.
- Signed-in/sample Plant Guide counts and card labels now use the same `plants to compare` / `Care guide` wording.
- Public plant detail photo card now says `Care guide`.
- Regression coverage rejects `plants with care notes` and `Care notes`.

Why:
- `Care notes` describes the catalogue artifact.
- A prospective user is trying to decide what fits their garden, so `plants to compare` and `Care guide` are more direct.
- The public, sample, and signed-in plant guide surfaces now use one consistent mental model.

Verification:
- Focused Plant Guide/sample tests passed: `catalogue-format.test.ts`, `sample-garden.test.ts`, and `public-catalogue-content.test.ts`, 3 files, 24 tests.
- Full `npm test` passed: 18 files, 87 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Route scan confirms `/catalog`, `/catalog/french-marigold`, and `/sample-garden/catalogue` include `Care guide` and rejects `plants with care notes` / `Care notes`.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by route text scans, source checks, and component tests.
