# Garden.io Today Memory Strip

Status: local finish-line draft, not published or deployed.

## Summary

The sample Garden.io Today screen now shows garden context before the first question. Visitors can see the sample garden name, region, growing plant count, place count, today's care count, the latest note, and a link into garden memory before asking Garden.io for help. The homepage and sign-in gate also avoid implying automatic scheduling or automatic care before those behaviors are fully proven.

The sample Garden Memory drawer also received a mobile polish fix so the rotated scope stamp no longer overlaps the garden or plant name on narrow screens.

## Why It Matters

The prior sample tour opened on a polished but nearly empty composer. The new memory strip makes the core promise visible immediately: Garden.io answers from the garden record, not from a blank chat box. The tightened planning copy keeps the product promise grounded in contextual guidance rather than overstated automation.

## Customer-Facing Copy

Garden.io now starts the sample Today screen with real garden memory: current plants, places, today’s care, and the latest note, so you can see what context the assistant has before you ask. Planning language now focuses on wishlist, bed, season, note, and weather context instead of promising automatic scheduling.

## Suggested Social Copy

Garden.io is becoming less like a blank chatbot and more like a living garden notebook. The sample Today screen now opens with garden memory up front: what is growing, where it lives, what needs care today, and the latest note. The surrounding copy now stays honest about contextual guidance instead of overclaiming automation.

## QA Status

- Deterministic tests: `npm test`
- Production build: `npm run build`
- Browser regression: `npm run test:browser`
- Focused mobile regression: `npm run test:browser -- --grep "sample Garden Memory drawer scope"`

## Finish-Line Coverage Ledger

| Issue or behavior | Failure mode covered | Executable coverage | Direct command | Broader suite |
| --- | --- | --- | --- | --- |
| Today screen must show garden memory before the first question | The sample tour could open as a blank chat composer without visible garden context | `website/e2e/finish-line-polish.spec.ts` - `sample tour Today page exposes garden memory before the first question`; `website/tests/ai-first-garden-home.test.tsx` - `opens on a simple text/photo composer with top shortcuts` | `npm run test:browser -- --grep "sample tour Today page exposes"`; `npm test -- ai-first-garden-home.test.tsx` | `npm run test:browser`; `npm test` |
| Homepage planning copy must not overclaim automatic scheduling | Marketing copy could imply a fully automatic schedule that is not production-proven | `website/e2e/finish-line-polish.spec.ts` - `homepage describes planning without claiming an automatic schedule`; `website/tests/homepage-content.test.ts` - homepage planning assertions | `npm run test:browser -- --grep "homepage describes planning"`; `npm test -- homepage-content.test.ts` | `npm run test:browser`; `npm test` |
| Auth gate copy must not overclaim automatic care | Sign-in page could promise automatic care/planting guidance before that behavior is proven | `website/tests/auth-gate-content.test.ts` - `uses user-facing copy for unavailable sign-in states` | `npm test -- auth-gate-content.test.ts` | `npm test` |
| Mobile Garden Memory drawer scope must stay readable | The rotated drawer stamp could overlap the garden or plant scope label on narrow screens | `website/e2e/finish-line-polish.spec.ts` - `sample Garden Memory drawer scope stays readable on mobile` | `npm run test:browser -- --grep "sample Garden Memory drawer scope"` | `npm run test:browser` |

## Screenshot

- Today memory proof: `docs/release-notes/assets/2026-07-07-today-memory-strip/01-today-memory-desktop.png`
- Mobile Garden Memory proof: `docs/release-notes/assets/2026-07-07-today-memory-strip/02-garden-memory-mobile.png`
- Mobile plant drawer proof: `docs/release-notes/assets/2026-07-07-today-memory-strip/03-plant-memory-mobile.png`

## Rollout and Marketing Status

- Migration/env/provider/billing/webhook/queue/job/seed/backfill changes: not required.
- Deployment: not run. This is local-ready only.
- Shared docs: no Garden.io shared-docs repo was located; only repo-local docs were updated.
- Marketing package search: no existing package found for "Garden.io Today memory strip".
- Marketing asset generation: not run because this is a local Garden.io polish package and the available marketing workflow is Bonfire-branded. Use Garden.io-specific brand guidance before generating launch graphics.

## Known Limits

- This is local-ready only. No deployment or production verification was performed.
- Authenticated deployed coverage is not claimed; this finish-line pass covered the public sample tour and homepage surfaces.
- Marketing image generation was not run because this is a Garden.io local polish package, not a Bonfire-branded public launch package.
