# Selah Style Audit For Garden.io

Date: 2026-06-22
Destination: local folder only
Reference app: `/Users/preston/Code/selah`
Garden target: `/Users/preston/Code/garden.io`

## Audit Scope

This audit inspects Selah's local onboarding and signed-in home surfaces as a style and interaction reference for simplifying Garden.io. The core question is how Garden.io can mimic Selah's calm, tabless, AI-first structure while preserving garden beds, zones, plants, care, and photos under the hood.

Evidence was captured from the local Selah app at `http://localhost:3001` with the repo's local e2e auth bypass enabled. Screenshots were saved with Chrome DevTools Protocol into this folder and visually inspected before acceptance.

## Screenshot Evidence

1. `01-onboarding-entry.png`
   Health: strong visual baseline. The first screen is quiet, centered, and branded, with a single form and no competing navigation.

2. `02-home-ai-first.png`
   Health: strong AI-first home. The signed-in home gives almost the entire screen to one prompt: "What are you carrying?" Utility actions sit in small icon controls at the top.

3. `03-home-prompt-typed.png`
   Health: strong prompt-writing state. A typed gardening-style question still feels like the whole app's center of gravity. The send action stays singular and spatially clear.

4. `04-prior-sessions-panel.png`
   Health: strong progressive reveal. Prior sessions appear as a compact panel above the primary prompt instead of becoming a permanent tab or page-level mode.

5. `05-mobile-home-ai-first.png`
   Health: strong mobile translation. The same one-question experience works on a narrow viewport without introducing a bottom tab bar or dense dashboard.

## Strengths To Reuse

- Selah has one obvious primary action: type what you are carrying and send it. Everything else is utility, not navigation.
- The app avoids a tabbed architecture. History, account, music, and new-session controls are small affordances around a stable center.
- The first screen creates trust with restraint: ample whitespace, soft color, simple copy, and a clear form.
- The home surface does not expose its data model first. The user starts with a need, not with a structure.
- Secondary organization is available through progressive reveal. Prior sessions open only when requested and do not displace the main input.
- Mobile keeps the same mental model as desktop: single canvas, top utilities, one major input, one send control.

## UX Risks Seen In Selah

- Icon-only utility controls depend heavily on accessible names and user recognition. The screenshot shows the icons clearly, but discoverability could be weak for first-time users.
- The local bypass state shows `Sign in to continue.` after typing. That is an artifact of the audit environment, but it is a reminder that blocked-send states need to be legible without feeling like a dead end.
- The prompt uses very large serif text. That creates focus, but long practical questions wrap aggressively. Garden.io should preserve the calm input feeling while making horticulture questions readable at 1 to 4 lines.
- The history panel is elegant, but it can be easy to miss if the icon is not learned. Garden.io's equivalent "memory" or "garden record" access should be discoverable without turning into a tab bar.

## Accessibility Risks

- Screenshots confirm a visible, simple hierarchy, but they do not prove full keyboard access, screen-reader order, focus management, contrast, or reduced-motion behavior.
- Icon-only controls need reliable accessible names, target sizes, focus rings, and visible states.
- The low-contrast prompt placeholder and soft text are part of the calm style, but Garden.io should test contrast on outdoor-photo backgrounds, plant diagnosis states, and mobile brightness.
- The prior-sessions panel should be validated for focus return, Escape close, and screen-reader announcement. The screenshot only proves the visual state.

## Garden.io Direction

Garden.io should adopt Selah's architecture more than its literal devotional content style:

- Make the first signed-in garden screen an AI/photo-first canvas: one large prompt such as "What is happening in your garden?" plus a photo upload button and one send action.
- Treat zones, beds, plants, observations, and care tasks as organization under the hood. The user should not have to choose bed/plant first to ask a question or upload a photo.
- Keep structure accessible through progressive reveal: small controls for Garden, Care, History/Memory, and Settings, not persistent tabs.
- After an answer, offer lightweight attachment actions: save to plant, connect to bed, create care item, add observation, or mark resolved. Do this after the useful guidance, not before.
- Use a narrow, centered reading/input column on desktop and the same single-column flow on mobile.
- Use calm surface colors, soft borders, restrained shadows, and a few high-signal icons. Avoid dashboard cards, section grids, and exposed taxonomy on first load.
- Keep the existing garden data model, but let AI infer or ask follow-up questions when bed/plant context matters.
- Replace onboarding-style "set up your garden" pressure with a gentle setup affordance: "Help me remember this garden" or "Add where this happened" after the user receives value.

## Recommended Garden.io V1 Shape

1. Home canvas
   - Centered ask box with photo upload and send.
   - Ambient suggestions relevant to home growers, for example "What should I do today?", "Diagnose this leaf", and "What needs water?"
   - Tiny top controls for Garden, Care, History, and Settings.

2. Answer state
   - Diagnosis or guidance first.
   - Care list suggestions second.
   - "Save to garden" actions third, with inferred plant/bed suggestions.

3. Garden structure drawer
   - Progressive reveal for beds, zones, plants, and setup.
   - No tab bar as the main architecture.
   - Structure exists to improve AI context and recordkeeping, not to block the user.

4. Care view
   - A compact, utility-style list reachable from the home controls.
   - No dashboard-style landing page.
   - Items should link back to the AI conversation, plant, and photo context.

## Evidence Limits

- Generated guidance was not captured because the local audit did not install API route mocks or use a real signed-in account.
- The authenticated home used Selah's e2e auth bypass, so account/billing-dependent messages are not production evidence.
- Screenshots do not prove WCAG compliance.
- This audit did not modify Garden.io implementation files.

