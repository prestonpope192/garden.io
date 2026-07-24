# Iteration 135 - Note Capture Copy

Scope: simplify the everyday "save what happened" flow so it matches how a gardener actually uses the app.

Changed:
- The floating note/photo action now says `Add note` instead of `Save update`.
- Quick note copy now asks `What did you notice?` and `Where should this go?`.
- Quick note save action now says `Save to garden`.
- Place and plant note forms use the same `Save to garden` action and a concrete garden-observation placeholder.
- Plant-added feedback now says `Add a note when you notice something.`
- The plant check action now says `Save and check this plant`.

Why:
- `Update`, `what changed`, and `attach it to` describe a product workflow more than a gardener's moment.
- The daily felt need is simpler: "I noticed something outside and want to save it before I forget."
- Consistent note language helps the app feel like one clear habit rather than several small modules.

Verification:
- Focused tests passed: `quick-log-content.test.ts`, `garden-mutation-copy.test.ts`, and `sample-garden.test.ts`, 3 files, 13 tests.
- Full `npm test` passed: 18 files, 88 tests.
- `git diff --check` passed.
- `npm run build` passed.
- Restarted `next start` preview on `http://localhost:3020`.
- Rendered-route visible-copy scan passed for 14 routes at `http://localhost:3020`.
- Source scan confirms stale note-capture copy remains only as negative test assertions.

Evidence limit:
- No new screenshots were captured. Browser/Chrome capture remain unavailable in this environment, and Playwright fallback requires explicit user approval. This pass is covered by source checks, component tests, production build, and rendered-route visible-text scans.
