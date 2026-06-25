# Product Design Audit Iteration 150

Date: 2026-06-22
Surface: public plant catalogue browse page
Preview: http://localhost:3020/catalog

## Finding

The public catalogue had become much cleaner, but the browse hero still used a few labels that made users translate the intent: `Right place`, `save what happens`, `Good fit if`. A prospective gardener needs faster guidance: what to check before planting and what to save after planting.

## Change

- Changed `Right place / check sun, water, and space` to `Before planting / check sun, water, and room`.
- Changed `After planting / save what happens` to `After planting / save notes and photos`.
- Changed the featured plant label from `Good place to start` to `Start here`.
- Changed the featured plant type label from `Good fit if:` to `Plant type`.
- Added tests that reject the older catalogue labels.

## Verification

- `npm test -- public-catalogue-content.test.ts catalogue-format.test.ts homepage-content.test.ts` passed.
- `npm test` passed: 18 files, 89 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered scan of `/catalog` passed with required copy present and stale catalogue copy absent.
- Visible-text scan across the main public and sample routes found no beta-era or internal product language.

## Evidence Limit

No fresh screenshots were captured because Browser/Chrome capture tools are not available in this thread and Playwright requires explicit approval. This iteration is validated through source checks, component tests, production build, and rendered-route visible-text scans.
