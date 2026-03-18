# Style and Branding Module Spec

## Document Status and Scope

- Status: canonical Module 07 product specification.
- Effective date: March 18, 2026.
- Module role: cross-product visual and verbal identity system.
- Scope: brand identity, typography, color tokens, illustration language, motion tone, shell/layout behavior, and reusable UI primitives.
- Out of scope: logo source files, sound design implementation, and production art approval workflow.

## Brand North Star

Garden.io should feel like a living botanical notebook.

Opening the product should feel closer to unfolding a field journal, herbarium sheet, or naturalist folio than opening a generic software dashboard.

Emotional targets:
- calm
- confidence
- continuity
- stewardship

Behavioral rule:
- the interface should feel tactile and deliberate without becoming ornamental clutter or blocking speed.

## Primary Visual Metaphor

Core reference language:
- 18th–19th century botanical plates
- naturalist field notebooks
- herbarium sheets
- charcoal botanical studies

Digital translation rules:
- screens are treated as journal pages and spreads
- metadata should feel like specimen labels and folio marks
- AI guidance should appear as marginalia, not detached chatbot chrome
- navigation should preserve a left-page context / right-page detail rhythm whenever practical

## Token Contract

Base palette:

```txt
--paper:         #F6F1E7
--paper-soft:    #FBF7EF
--paper-shadow:  #E8DFC9
--paper-deep:    #CBBFA1
--ink:           #2B2B2B
--ink-soft:      #6C5A3A
--ink-muted:     #867454
--olive:         #5A654F
--clay:          #7B6045
--berry:         #714D4D
--gold:          #A78545
--line:          rgba(94,74,46,0.24)
--line-strong:   rgba(94,74,46,0.42)
```

Usage rules:
- paper and ink dominate every screen
- olive, clay, berry, and gold are sparse semantic accents
- avoid pure white, pure black, glossy gradients, and synthetic SaaS neons
- page surfaces may use low-contrast texture, fiber noise, or vignette layers

## Typography Contract

Primary type system:
- body/editorial text: `EB Garamond`
- scientific labels and headings: `Ibarra Real Nova`
- handwritten annotations and marginalia: `Caveat`

Role rules:
- H1/H2/H3 use `Ibarra Real Nova`
- body paragraphs, descriptive text, and longer notes use `EB Garamond`
- margin notes, observational callouts, and soft handwritten overlays use `Caveat`
- handwritten type must remain supplemental and should never carry core navigation or dense task text

Fallback behavior:
- use strong serif fallbacks for body and heading roles
- preserve legibility and hierarchy if web fonts fail to load

## Surface and Layout Contract

Surface hierarchy:
- public website: cover sheet and folio treatment, readable and conventional
- product shell: strongest page/spread metaphor
- elevated components: clipped notes, specimen cards, and ink-stamped controls

Shared shell primitives:
- `JournalShell`
- `JournalSpread`
- `JournalPage`
- `SpecimenLabel`
- `MarginNote`
- `PlateCard`
- `InkStamp`
- `FieldIcon`

Layout behavior:
- product routes should prefer spread compositions over dashboard card grids
- left-page context / right-page detail is the default mental model for core product modules
- page edges, folio numbers, specimen labels, and narrow gutters should reinforce structure

## Interaction and Motion Contract

Motion tone:
- slow
- deliberate
- organic

Rules:
- strongest skeuomorphic motion belongs in the product shell, not the marketing site
- page-turn behavior is allowed in prototype/product contexts where it improves spatial comprehension
- public marketing pages should use lighter transitions only
- always respect `prefers-reduced-motion` with a non-flip fallback

Timing guidance:

```txt
micro:      140-180ms
standard:   220-300ms
page-turn:  900-1200ms
```

## Illustration and Iconography Contract

Illustration style:
- botanical linework
- sepia or charcoal tonal treatment
- restrained wash fills
- paper-aware presentation

Iconography style:
- hand-drawn, imperfect geometry
- line-first, not glossy or cartooned
- motifs include sun, water, soil, pollinator, journal, and seasonal planning

Asset policy:
- prototype assets can ship as normalized local SVG studies
- future AI-assisted or custom artwork must match the same sepia/charcoal system and sizing behavior
- artwork remains supportive; comprehension must not depend on it

## Module-Specific Guidance

`My Property`
- should be the flagship expression of the notebook metaphor
- Property → Zone → Bed → Plant should feel like moving through pages in a land journal

`Calendar`
- should read like a seasonal planner rather than a generic productivity grid

`My Plants`
- should feel like a specimen cabinet of living records

`Plant Catalogue`
- should feel like a field guide connected directly to add flows and contextual use

## Accessibility and Restraint Rules

- contrast must remain readable on paper-toned surfaces
- texture layers must stay low contrast and non-distracting
- motion must never block navigation or hide critical actions
- decorative script and art should never replace clear labels, semantic structure, or accessible controls
