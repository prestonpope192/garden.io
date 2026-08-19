# Garden.io Production Deployment Closeout — 2026-08-19

This closeout supersedes the deployment-state statements in the earlier
local-only finish-line checkpoint. It does not rewrite the historical
pre-repair QA run at `output/qa/prod-full-suite-2026-08-19-2213/`.

## Deployment proof

- Branch/source: `main` / `2732fb23210e89b7322374c0644d47c0c402a33e`
- Vercel deployment: `dpl_AbTtqAstyrm4bxspghu9pcfYF5fv`
- Stable alias: `https://garden-io.vercel.app`
- Project root/framework: `website` / Next.js
- Production environment variables: configured; names and values are not
  recorded here.
- Database migration 46: applied and validated with
  `migration-46-validation-passed`.

## Live route proof

| Route | Result |
| --- | --- |
| `/` | 200 |
| `/catalog` | 200 |
| `/auth/confirm` | 200 |
| `/sample-garden` | 307 to `/tour/ask` |
| `/app` | 307 to `/app/my-property` |

## Remaining boundary

An approved authenticated browser/provider canary for magic-link,
diagnosis evidence rendering, and event persistence remains unrun. Public
route health and the negative cross-tenant RLS canary are not substitutes for
that authenticated proof.
