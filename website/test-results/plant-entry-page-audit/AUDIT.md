# Plant Entry Page Product Design Audit

Surface: `/catalog/dill`
Date: 2026-06-05
Evidence: screenshots in this folder.

## Captured Steps

1. `01-detail-desktop-hero.png` - Desktop hero, record strip, quick facts, and plate.
   Health: visually aligned with the botanical folio direction, but the decision model is incomplete.
2. `02-detail-desktop-requirements.png` - Desktop lower-content anchor capture.
   Health: useful content exists, but anchor positioning and section hierarchy need refinement.
3. `03-detail-desktop-lifecycle.png` - Lifecycle sheet.
   Health: aesthetically strong, but it is a static summary rather than a true planting/maintenance/harvest timeline.
4. `04-detail-desktop-fit-community.png` - Requirements and lifecycle overlap region.
   Health: exposes missing implementation depth around requirements, planting methods, and calendar-use context.
5. `05-detail-mobile-hero.png` - Mobile hero.
   Health: no horizontal overflow; first viewport is readable, but the primary action and dense record strip compete.
6. `06-detail-mobile-quick-facts.png` - Mobile quick facts transition.
   Health: mobile remains stable, but above-fold content is long before users reach practical detail.

## What Plant Entry Pages Should Do

- Help a public visitor decide whether this plant belongs in their garden.
- Help an authenticated user move from profile to wishlist, property, bed, or calendar action.
- Explain practical growing requirements, not just display profile metadata.
- Show broad confidence/source boundaries so growers do not overtrust precise-looking claims.
- Connect plant knowledge to Garden.io's product loops: property fit, companion planting, calendar timing, observations, and community outcomes.
- Feel like a botanical field-guide sheet with real specimen evidence, margin notes, timelines, and related records.

## Priority Findings

1. Missing required sections: companion plants, plants to avoid, yield expectations, regional suitability, comments/photos.
   Evidence: page nav only includes quick facts, requirements, lifecycle, fit, and community notes. Spec requires companion plants, plants to avoid, lifecycle timeline, yield, regional suitability, community insights, comments, and photos.
   Impact: the page looks like a profile, not the full catalogue decision surface.
   Recommendation: add dedicated sections for companions/conflicts, yield/regional fit, and community/media states, even if first versions show structured empty states.

2. Lifecycle is styled as a sheet, but not a timeline.
   Evidence: lifecycle section has Lifecycle, Habit, Propagation, Garden role only.
   Impact: users cannot answer when to prep, plant, maintain, harvest, or connect to Calendar.
   Recommendation: replace the lifecycle summary with a seasonal timeline: prep, sow/transplant, maintain, harvest, dormancy/cleanup, with public read-only labels and in-app calendar links.

3. Requirements are not implementation-grade yet.
   Evidence: requirements section lists lifecycle, habit, growth rate, drainage, fertility, spread, and planting methods; pH, cold/heat tolerance, spacing, planting depth, and sun range are absent.
   Impact: growers still need another source before acting.
   Recommendation: split quick facts from deeper instructions: scan cards for sun/soil/water/pH/cold/heat, then a practical grow sheet for spacing, depth, propagation, drainage, fertility, and care cadence.

4. Product actions are too generic for entry pages.
   Evidence: hero actions are Browse catalogue and Get launch access; margin note says profile can become wishlist/bed inside app.
   Impact: the page does not preview the core Garden.io loop.
   Recommendation: public: "Save in Garden.io" and "Plan this plant" CTAs route to waitlist/auth. Authenticated: wishlist, add to property, add to bed, add calendar task.

5. Visual system is improved, but content hierarchy is still hero-heavy.
   Evidence: desktop and mobile hero spend substantial space on title, plate, record status, tags, and repeated quick facts before practical sections.
   Impact: style is stronger than before, but the first screen does not yet answer "should I plant this?"
   Recommendation: use a compact hero plus a "decision strip" near the top: best for, avoid if, care load, container fit, pollinator value, region confidence.

6. Community section is a rating stub, not a community insight surface.
   Evidence: section shows container fit, pollinator value, and care load only.
   Impact: it misses success reports, regional context, comments, and photo states called out by the spec.
   Recommendation: add no-community-content state now, with future slots for approved photos, regional notes, and comments.

7. Accessibility risk: anchor navigation and sticky header can obscure section starts.
   Evidence: anchor captures landed awkwardly around lower sections.
   Impact: keyboard/link users may lose orientation after clicking section nav.
   Recommendation: add `scroll-margin-top` to plant profile sections and active/visible state for the field-guide nav.

## Suggested Next Implementation Order

1. Restructure page IA: Overview, Requirements, Lifecycle Timeline, Companions & Conflicts, Yield & Region, Community, Sources.
2. Add data-safe placeholders for missing fields so the page has the final shape without inventing plant facts.
3. Improve top decision strip and CTA states for public vs authenticated users.
4. Add anchor scroll behavior and mobile nav treatment.
5. Expand catalogue data/view model later to support companion links, conflict notes, regional suitability, yield, and timeline windows.
