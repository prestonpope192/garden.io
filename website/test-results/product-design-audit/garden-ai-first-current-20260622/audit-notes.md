# Garden.io AI-First Audit

Date: 2026-06-22
Destination: local folder
Flow audited: unauthenticated entry, sample garden, mobile sample garden, care list

## Audit Scope

This audit checks whether the current Garden.io experience matches the intended Selah-like direction: calm, simple, AI-first, and centered on asking a garden question or uploading a photo, with zones, beds, plants, memory, and care organized behind the scenes.

## Evidence

1. `01-app-auth-gate-desktop.png` - signed-out `/app/my-property`
2. `02-sample-garden-property-desktop.png` - desktop `/sample-garden/property`
3. `03-sample-garden-property-mobile.png` - mobile `/sample-garden/property`
4. `04-sample-garden-care-desktop.png` - desktop `/sample-garden/calendar`

## Step Notes

### 1. Signed-Out Entry

General health: mixed.

Strengths:
- The page already has the right quiet tone, centered composition, and low-noise paper surface.
- The main promise, "Know what to do next," is direct and useful.
- The email form is clear and the sample/catalague links are visible without taking over the page.

UX risks:
- The content still starts from setup and record-making. The first visible task is "Start your garden" rather than "ask now."
- The setup checklist appears before the user has felt the AI-first value.
- The page talks about garden records more than the immediate question/photo behavior.

Accessibility risks:
- The form labels are visible and the primary control is large enough.
- The centered card is readable on desktop, but screenshot-only review cannot confirm keyboard focus order or live error announcement behavior.

Recommendation:
- Keep the calm shell, but change the entry story from setup-first to question/photo-first. Keep setup as a short secondary note.

### 2. Sample Garden Desktop

General health: off-direction.

Strengths:
- The botanical paper-and-ink language is cohesive and feels related to Selah's quiet app framing.
- The garden hierarchy is legible once the user chooses to inspect it.
- Care information is present and useful.

UX risks:
- The first browsable app screen is still a tabbed architecture: Garden, This Week, Plants, Find.
- The primary content is the bed/zone map, not the question/photo action.
- The right-side "What needs care next" panel is helpful, but it makes the app feel like a garden dashboard instead of an AI-first assistant.
- "Look around" and "Start" compete with the product's primary ask/photo behavior.

Accessibility risks:
- Navigation labels are clear, but the tab-like links reinforce multiple peer destinations instead of one primary task.
- The map cards have many nested small controls and labels; screenshot-only review cannot confirm focus order or whether each interactive target has enough context.

Recommendation:
- Make the sample open on the same ask/photo home as the signed-in app. Expose Memory, Care, and Guide as utility controls. Keep the detailed map one click away.

### 3. Sample Garden Mobile

General health: weak for the target direction.

Strengths:
- Text reflows without obvious overlap.
- The Start action remains reachable.
- The hierarchy is readable after scrolling.

UX risks:
- The first mobile screen spends its valuable top area on module tabs and garden records.
- The user does not get an immediate place to ask a question or add a photo.
- Large typography works for the garden map, but it pushes the actual "next step" and hierarchy into a long scroll.

Accessibility risks:
- The top navigation targets are large enough, but they use a tab-like row with no visible AI-first default.
- The screenshot cannot prove zoom behavior, reduced-motion behavior, focus visibility, or screen-reader structure.

Recommendation:
- On mobile, show the ask/photo composer first, then small utility buttons for memory, care, and guide. Avoid persistent bottom or top module tabs.

### 4. Sample Care Desktop

General health: useful but too separate.

Strengths:
- Care tasks are plain-language and actionable.
- The weekly grouping is clear.
- Season guidance adds useful context.

UX risks:
- Care lives as a peer module, which pulls users into app navigation before they ask the first question.
- The page is good as a secondary destination, but it should not be part of the first-run architecture.

Accessibility risks:
- The task list appears readable and structured, but screenshot-only review cannot confirm task toggles, keyboard behavior, or status change announcements.

Recommendation:
- Keep care as a secondary "Care" utility from the ask home. After AI actions are saved, route users toward the care list instead of making them choose a module up front.

## Overall Findings

Strengths:
- The visual language is already close to the desired quiet, restorative Selah-style tone.
- The app has the right underlying garden memory model.
- Care, plant guide, and garden hierarchy are useful once revealed.

Main issue:
- The browsable app still teaches users that Garden.io is a tabbed garden records product. The target direction is an AI-first assistant where organization is under the hood.

Recommended implementation:
1. Add `ask` to the sample garden and make `/sample-garden` redirect there.
2. Remove persistent sample tabs from the first app frame.
3. Use the same ask/photo home for sample and signed-in app.
4. Keep Memory, Care, and Guide as small, secondary utility controls.
5. Tighten signed-out copy so setup supports asking rather than leading the experience.

## Evidence Limits

This audit used local screenshots and DOM text from the current run. It does not prove full WCAG compliance, auth-session behavior, real AI response quality, production performance, or screen-reader output.
