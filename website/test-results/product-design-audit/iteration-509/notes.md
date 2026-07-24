# Iteration 509 - Weekly Care Action Labels

Scope: make care-action labels match the app's simplified `Weekly care` navigation instead of mixing in the older `This Week` feature name.

Changed:
- Changed shared care mutation messages from `Added to This Week.`, `Added back to This Week.`, and `Removed from This Week.` to `Added to weekly care.`, `Added back to weekly care.`, and `Removed from weekly care.`
- Changed care action buttons in My Garden, Weekly care, plant journal suggestions, plant checks, and Ask results from `Add to This Week` / `Add to this week` / `Remove from This Week` to `Add to weekly care` / `Remove from weekly care`.
- Left date-window prose like `this week`, `Later this week`, and `garden jobs this week` intact where it describes timing rather than navigation.

Evidence:
- Used Product Design critical overrides, session budget guidance, current source, focused tests, route probes, full tests, build verification, and Garden.io brand memory.
- Source scan confirms visible components no longer contain `Add to This Week`, `Added to This Week`, `Added back to This Week`, `Remove from This Week`, `Removed from This Week`, `Add to this week`, or `Added to this week`.
- Route probe of `/sample-garden/calendar` confirmed the `Weekly care` surface still renders with timing copy like `This week` in the page kicker; action buttons are read-only on the sample route and therefore source/test covered.
- Focused tests passed from the website package: `garden-mutation-copy.test.ts`, `ai-first-garden-home.test.tsx`, `empty-state-content.test.ts`, `sample-garden.test.ts`, `diagnose-panel-content.test.ts`, and `plant-timeline-content.test.ts` - 6 files, 31 tests.
- Full `npm test` passed from the website package: 23 files, 131 tests.
- `npm run build` passed.
- `git diff --check` passed.

Limit:
- Browser screenshot capture was not available. The Browser-specific tool was not exposed, and Computer Use is blocked from accessing the Codex app, so this pass used source scans, route-output probes, tests, and build verification.
- The sample garden runs read-only, so the exact action buttons do not render there; their labels are covered by source and component tests.
