# Style and Branding Module Spec

## Document Status and Scope

- Status: canonical Module 07 product specification.
- Effective date: March 9, 2026.
- Module role: cross-product visual and verbal identity system.
- Product position: system-level standard, not a standalone user module.
- Scope: brand identity, visual language, typography, color, illustration, motion, component style, and voice.
- Out of scope: final logo artwork production files, design tool setup internals, and marketing campaign operations.

Reference sources:
- Royal Horticultural Society standards context: https://www.rhs.org.uk
- Smithsonian Libraries botanical illustration context: https://library.si.edu
- USDA Plant Hardiness Zones context: https://planthardiness.ars.usda.gov

## Brand North Star

Garden.io should feel like a timeless botanical notebook brought to life digitally.

North-star statement:
- opening the app should feel like opening a personal garden journal, not logging into software.

Emotional target:
- calm focus
- thoughtful stewardship
- reflective learning
- seasonal continuity

## Core Brand Identity and Personality

Brand values:
- knowledge
- craft
- stewardship
- care
- seasonality
- calm intelligence

Brand personality traits:
- thoughtful
- experienced
- elegant
- natural

Behavioral rule:
- brand expression should encourage observation and consistency, not urgency and optimization pressure.

## Visual Inspiration Contract

Primary inspiration references:
- botanical field guides
- 19th-century plant plates
- gardening journals
- naturalist sketchbooks
- horticultural manuals

Visual metaphor:
- layered paper pages, specimen labels, and handwritten annotations.

Constraint:
- inspiration should inform structure and tone without becoming ornamental clutter.

## Color System and Token Contract

Palette direction:
- muted, natural, slightly desaturated.
- avoid bright, synthetic SaaS color behavior.

Core token set (baseline):

```txt
--color-paper-50:   #F6F1E7
--color-paper-100:  #ECE3D3
--color-ink-900:    #2A2A25
--color-ink-700:    #4A4941
--color-earth-700:  #6D7A4E
--color-olive-600:  #7E8562
--color-clay-600:   #8A6D55
--color-sage-500:   #8DAA8A
--color-berry-500:  #8E4B4E
--color-sunflower-500:#B88E3A
--color-border-soft:#D8CCB8
--color-shadow-ink: rgba(42,42,37,0.12)
```

Color use rules:
- paper and ink tokens dominate.
- accent colors are sparse and semantic.
- avoid pure black and pure white extremes.

## Background Texture and Surface Treatment

Background style:
- subtle parchment or pressed-paper texture.

Texture constraints:
- low contrast
- minimal repetition visibility
- no noticeable noise at normal reading distance

Surface hierarchy:
- base canvas resembles paper sheet
- elevated components resemble stacked notes or index cards
- dividers resemble fine ink lines

## Typography System Contract

Type strategy:
- serif-led system for editorial calm and botanical heritage.

Recommended font stacks:
- heading serif: `Cormorant Garamond`, `Source Serif 4`, `Garamond`, serif
- body serif: `Source Serif 4`, `Baskerville`, serif
- utility sans: `Alegreya Sans`, `Gill Sans`, sans-serif
- accent script (very limited): `Caveat`, cursive

Type roles:
- H1/H2: heading serif
- body text: body serif
- controls and metadata: utility sans
- decorative captions only: accent script

Typography constraints:
- avoid geometric/tech-forward default SaaS stacks.
- script use must stay minimal and never for core body content.

## Type Scale and Spacing Rhythm

Baseline type scale:

```txt
Display: 40/46
H1:      32/38
H2:      26/32
H3:      22/28
Body L:  18/28
Body:    16/26
Meta:    14/20
Label:   12/16
```

Spacing rhythm:
- base unit: 8px
- primary layout spacing increments: 16, 24, 32, 40
- preserve generous whitespace over dense data packing

## Illustration System Contract

Primary representation style:
- botanical illustrations first, photos second.

Illustration characteristics:
- fine linework
- slight stroke irregularity
- natural shading
- restrained color washes

Accepted illustration modes:
- ink sketch
- pencil study
- watercolor botanical plate

Asset rule:
- every major plant entity should have a canonical illustration variant.

## Photo Integration Contract

Photos remain important for:
- plant history logs
- observations
- community contributions

Display rules:
- photo blocks should not replace primary illustration identity.
- photos in feed/history contexts can be framed as clipped journal inserts.
- moderation and attribution metadata remain visible where required.

## Component Styling Contract

Component metaphor:
- objects placed on a page, not floating glass UI panes.

Styling patterns:
- paper-slip cards
- soft corner radii
- subtle stacked-paper shadows
- hand-ink style dividers

Avoid:
- hard-edged dashboard cards
- heavy gradients
- glossy skeuomorphic effects

Baseline component tokens:

```txt
--radius-card: 12px
--radius-chip: 999px
--border-width-soft: 1px
--shadow-paper-1: 0 2px 6px rgba(42,42,37,0.08)
--shadow-paper-2: 0 6px 18px rgba(42,42,37,0.12)
```

## Iconography Contract

Icon style:
- hand-drawn line icons
- minimal, organic, slightly imperfect geometry

Core icon motifs:
- leaf
- flower
- watering can
- pruning shears
- sun
- cloud

Icon constraints:
- no glossy fills
- no heavy cartoon style
- maintain consistent stroke family and cap style

## Motion and Animation Contract

Motion tone:
- calm, slow enough to feel intentional, never flashy.

Core motion patterns:
- week navigation uses page-turn metaphor
- zone/bed transitions use soft slide
- illustration reveals can use subtle draw-in

Motion timing guidance:

```txt
micro:   120-160ms
standard:200-260ms
page-turn:280-360ms
```

Motion constraints:
- no abrupt, high-energy easing.
- respect reduced-motion system settings.

## Interaction Metaphor Contract

Interaction metaphors:
- flipping through pages
- opening specimen cards
- sliding seasonal strips

Rules:
- metaphor should improve comprehension, not block speed.
- tactile cues should be subtle and consistent across modules.

## Voice and Microcopy Contract

Voice attributes:
- calm
- knowledgeable
- encouraging

Tone transformations:
- avoid: `Task overdue.`
- use: `Good time to inspect your tomatoes.`

Empty-state language:
- avoid technical null-state phrasing.
- use human, growth-oriented prompts (for example: `This bed is waiting for its first planting.`).

## Logo and Mark Direction

Logo direction:
- simple organic mark
- motifs can include leaf, sprout, branch, or garden row
- line weight aligns with illustration system

Use requirements:
- legible at small nav scale
- clear in header lockups
- recognizable as social/avatar icon

## Cross-Module Consistency Contract

Modules that must share one visual language:
- My Property
- Calendar
- My Plants
- Plant Catalogue
- task and AI surfaces

Consistency rule:
- each module may vary layout, but typography, color logic, illustration style, icon system, and motion language must remain unified.

## Anti-Patterns and Design Constraints

Avoid:
- generic SaaS dashboard visuals
- neon or high-saturation color schemes
- corporate enterprise chart aesthetics
- aggressive alert patterns
- cluttered utility-first panel stacking

Constraint principle:
- if a design decision increases urgency noise or technical sterility, reject it.

## Design System Deliverables

Required system outputs:
- color token library
- typography and spacing scale
- illustration style guide
- icon set guidelines
- component pattern library
- motion guidelines
- writing tone guide

Documentation requirements:
- include usage examples and anti-examples for each major token family.

## Accessibility and Readability Requirements

Accessibility:
- maintain sufficient contrast across paper/ink palette variants.
- provide non-color cues for state and priority.
- ensure body text readability at baseline sizes.

Readability:
- prioritize line-length comfort for long-form plant and guidance content.
- avoid decorative typography in critical control or status surfaces.

## Functional Requirements

FR-01 Brand system must define a unified visual identity across all modules.
FR-02 Color system must provide natural muted palette tokens with controlled accent usage.
FR-03 Typography system must define heading/body/utility/accent roles.
FR-04 Illustration-first approach must be supported for plant identity surfaces.
FR-05 Component library must follow paper-based metaphor and calm hierarchy.
FR-06 Iconography must follow hand-drawn line style constraints.
FR-07 Motion guidance must support page-turn and gentle transitions.
FR-08 Microcopy rules must enforce calm, non-punitive language.
FR-09 Empty states must use encouraging, human-centered phrasing.
FR-10 Logo direction must align with illustration line style and multi-size usage.
FR-11 Design system must include explicit anti-pattern constraints.
FR-12 System tokens and style rules must be reusable in product and public surfaces.

## Non-Functional Requirements

Consistency:
- style decisions should reduce module-to-module visual drift.

Maintainability:
- tokenized definitions should minimize one-off styling exceptions.

Performance:
- texture and motion effects should be lightweight and not degrade interaction speed.

## Paid vs Free Surface Behavior

Style and branding are not tier-gated.

Rules:
- visual quality and brand tone must be consistent for free and paid users.
- paid differentiation should appear in capability depth, not aesthetic quality.

## Out of Scope for Module 07

- organization-wide marketing campaign assets
- print collateral design packs
- final trademark/legal filing workflows
- implementation details of front-end theming architecture

## Acceptance Criteria and Test Scenarios

1. Brand coherence test  
Given user navigates across modules, when moving page to page, then visual language remains clearly unified.

2. Color restraint test  
Given primary workflows, when accent colors appear, then they remain sparse and semantic.

3. Typography hierarchy test  
Given dense screens, when scanning, then hierarchy is clear through type/spacing not bright color emphasis.

4. Illustration priority test  
Given plant entities, when both illustration and photo exist, then illustration remains primary identity.

5. Component metaphor test  
Given cards/drawers/panels, when rendered, then surfaces feel paper-like and calm rather than dashboard-like.

6. Icon consistency test  
Given icon set usage, when viewed across modules, then stroke and style remain cohesive.

7. Motion tone test  
Given transitions, when interacting quickly, then motion remains subtle and non-disruptive.

8. Voice test  
Given microcopy in task and AI contexts, when reviewed, then tone is calm and guidance-oriented.

9. Empty-state tone test  
Given empty states, when displayed, then language is encouraging and non-technical.

10. Accessibility test  
Given contrast and status cues, when tested, then readability and non-color semantics are preserved.

11. Public/private parity test  
Given app and public catalogue surfaces, when compared, then both reflect same brand family.

12. Anti-pattern rejection test  
Given new design proposals, when evaluated, then SaaS-dashboard and neon-pattern proposals are rejected by guidelines.

## Open Questions Deferred to Module 10 (Database Architecture)

- how collaborator identity should be represented visually at property, zone, bed, and task levels
- how shared-access states should appear without introducing enterprise dashboard aesthetics
- how role and permission cues should be shown in calm, non-alarmist language
- how multi-user activity annotations should be styled without cluttering journal-like layouts
