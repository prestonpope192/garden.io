# Iteration 270 - Signed-In First-Run Direction

Scope: tighten the signed-in no-garden Ask state so it points clearly to the first useful setup path instead of leaving the user in a generic Ask composer.

Captured screen:
- `01-app-auth-gate.png` - signed-out app gate after the first-run copy remains aligned.

Finding:
- The homepage and auth gate now say the app starts with one bed or plant.
- The signed-in Ask state for an empty account previously only said answers get better once the garden exists, then left users to infer where to start.
- That made the first saved value less obvious than the public promise.

Changed:
- Added a first-run panel to `GardenAskView` when no garden exists.
- The panel says `Start with one bed or plant.` and explains the path: name the garden, add one bed, save the first plant.
- The panel links to the existing garden map route instead of adding a new onboarding subsystem.
- Updated the no-garden context line to `Answers get better once your first plant has a place.`
- Added CSS for the panel using the existing journal/folio visual system.
- Added regression coverage for the no-garden Ask state and panel CSS.

Evidence:
- Component-render test confirmed the no-garden Ask state contains the new first-run panel and `/app/garden-memory` link.
- Component-render test confirmed the panel is absent once a garden already exists.
- Focused tests passed: `ai-first-garden-home.test.tsx` and `empty-state-content.test.ts`, 2 files, 13 tests.
- Full `npm test` passed: 22 files, 122 tests.
- `npm run build` passed.
- Route scan confirmed `/`, `/app`, `/sample-garden/ask`, and `/sample-garden/property` return 200.
- Route scan confirmed stale no-garden copy such as `Ask now. Start a garden when you want to save notes.` is absent.
- Chrome screenshot capture confirmed the signed-out app gate still presents `Your first plant makes the garden useful.`
- Preview restarted at `http://127.0.0.1:3021`.

Evidence limits:
- The exact signed-in empty-account state is auth-gated in the local preview, so this pass proves it through component rendering and source-level coverage rather than a live authenticated browser screenshot.
- This pass did not verify magic-link delivery, real signed-in account creation, or the live create-garden mutation.
