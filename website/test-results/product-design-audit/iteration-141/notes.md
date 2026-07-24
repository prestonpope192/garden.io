# Iteration 141: Plant Guide Browse Copy

Scope: simplify the public and in-app plant guide browse states so the catalogue feels like choosing useful plants, not reading a repeated index of guide cards.

Changed:
- Public plant guide counts now say `988 plants` instead of `988 plants to compare`.
- The public guide summary now says `plants in the guide` instead of `plants to compare`.
- Public result rows no longer repeat a visible `Care guide` badge; each row now shows the plant lifecycle/type facts.
- Shared catalogue tags no longer add generic `Care guide` to every plant.
- In-app/sample plant cards now use the actual plant type beside the name instead of a fallback `Care guide` label.
- In-app/sample plant guide counts now say `3 plants` instead of `3 plants to compare`.
- Added regression coverage that rejects `plants to compare` and generic `Care guide` badges in guide browse states.

Why:
- The repeated `Care guide` badge did not help users decide; every result is already a guide and already has a `Read guide` link.
- `Plants to compare` sounds like an index workflow. A prospective gardener is usually trying to find a plant that fits a bed, light, water, or role.
- Showing plant facts directly makes the browse list easier to scan.

Verification:
- Focused tests passed: `catalogue-format.test.ts`, `public-catalogue-content.test.ts`, and `sample-garden.test.ts`, 3 files, 25 tests.
- Full `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Rendered scan confirms `/catalog` has `plants in the guide`, no visible `plants to compare`, and no repeated `care guide` row labels.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
