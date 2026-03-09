# Plant Catalogue UX Module Spec

## Document Status and Scope

- Status: canonical Module 04 product specification.
- Effective date: March 9, 2026.
- Module role: knowledge backbone for plants across Garden.io.
- Audience alignment: North America-first, multi-bed growers and homesteaders, with public educational access for discovery.
- Scope: UX contracts, public vs in-app behavior, integration points, and acceptance criteria.
- Out of scope: backend indexing internals, ranking algorithm internals, and moderation infrastructure implementation details.

Reference sources:
- USDA Plant Hardiness Zones: https://planthardiness.ars.usda.gov
- Cornell Small Farms Program crop planning: https://smallfarms.cornell.edu/resources/crop-planning/
- FAO crop planning tools: https://www.fao.org/land-water/databases-and-software/crop-planning

## Module North Star and Dual-Surface Role

`Plant Catalogue` serves two parallel roles:

1. Knowledge engine inside the application.
2. Public botanical discovery surface outside the app.

North-star statement:
- users should feel they are using a practical botanical encyclopedia that directly supports decisions in their property.

Strategic role split:
- public catalogue drives discovery, trust, and account creation.
- in-app catalogue powers add-plant flows, recommendations, and plant intelligence.

## IA Contract and Navigation Placement

Global IA rule:
- `Plant Catalogue` is a top-navigation item.
- position: right of logo, left of main app modules.

Entry points:
- top navigation (primary entry)
- Add Plant flow in `My Property`
- `My Plants` plant detail and wishlist actions
- AI suggestion cards and recommendation links

Navigation continuity rule:
- catalogue navigation must preserve return context when entered from another module.

## Surface and Access-State Contracts

Surface contract:

```txt
CatalogueSurface = public_web | in_app
```

User access contract:

```txt
CatalogueUserState = public_visitor | authenticated_free | authenticated_paid
```

Entry provenance contract:

```txt
CatalogueEntryOrigin = editorial | community_generated | ai_generated
```

Permissions matrix:
- `public_visitor`: search and view only.
- `authenticated_free`: search, view, add to wishlist, add to property, comment/rate.
- `authenticated_paid`: all free capabilities plus AI plant generation.

## Catalogue Homepage UX

Homepage intent:
- feel like a botanical library with practical next actions.

Required sections:
- search bar
- popular plants
- seasonal plants
- suggested plants for user region (in-app) or generic region hints (public)
- category browser

Example category set:
- trees
- shrubs
- vines
- herbs
- vegetables
- flowers
- groundcovers

## Search Experience Contract

Search must support forgiving and intent-based queries.

Supported query types:
- common name
- Latin name
- use intent (for example pollinator support)
- growing conditions (for example shade, partial shade, dry soil)
- companion intent (for example grows with tomatoes)

Search behavior rules:
- instant feedback after input stabilization
- typo tolerance and synonym support
- query expansion for common gardening phrases

Search result format:
- plant cards with quick summary and compatibility cues.

## Catalogue Search Result Card Contract

Result card fields:
- illustration
- plant name
- plant type
- key uses
- climate compatibility
- origin label if not editorial

Example:
- Borage
- Annual herb
- Uses: pollinator support, companion planting
- Climate: Zones 3-10

Card interaction:
- card click opens plant detail page.
- quick actions (in-app): add to wishlist, add to property.

## Plant Page Information Architecture

Plant page sections:
- header
- quick facts
- growing requirements
- uses
- companion plants
- plants to avoid
- lifecycle timeline
- yield expectations (when applicable)
- regional suitability
- community insights
- comments and photos

Plant page should feel like:
- a botanical field guide entry with practical execution detail.

## Plant Page Header Contract

Header fields:
- illustration
- plant name
- Latin name
- plant type
- average height
- growth habit

Example:
- Blueberry
- Vaccinium corymbosum
- Shrub
- Height: 4-6 ft

## Quick Facts and Growing Requirements Contracts

Quick facts fields:
- sun requirements
- soil preference
- water needs
- pH preference
- cold tolerance
- heat tolerance

Growing requirements fields:
- sun range
- soil type
- water requirements
- spacing
- planting depth
- preferred planting methods: seed, cutting, division, transplant

Clarity rule:
- quick facts prioritize scan speed.
- growing requirements provide deeper implementation guidance.

## Uses, Companions, and Conflict Guidance

Uses section supports practical and ecological roles:
- culinary
- medicinal
- pollinator support
- nitrogen fixing
- groundcover
- livestock forage

Companion section:
- list beneficial companion plants with link-through cards.

Plants-to-avoid section:
- list known conflicts and inhibition risks.
- include concise caution language (example: fennel may inhibit nearby plants).

## Lifecycle Timeline and Calendar Integration

Lifecycle timeline includes:
- bed preparation window
- planting window
- maintenance periods
- harvest window
- dormancy

Integration rules:
- lifecycle windows link into Calendar as relevant seasonal signals.
- in-app users can jump from timeline points to date-context in Calendar.

## Yield Expectations and Regional Suitability

Yield expectations (when applicable):
- average yield per plant
- harvest frequency

Regional suitability:
- suitability by hardiness zone and climate profile
- local-fit statement for user region in-app (example: highly suited to Zone 8)

Data confidence rule:
- present broad ranges and avoid precision beyond evidence quality.

## Community Insights and Ratings

Community surfaces:
- rating summaries
- comments
- success reports
- regional success context

Example insight:
- performs well in sandy soil with afternoon shade

Trust rule:
- community insights should complement official plant data, not replace it.

## Photo Contributions and Moderation

Photo contributions can show:
- growth stages
- harvest outcomes
- companion arrangements

Publication rule:
- all public photos pass moderation before public visibility.

Moderation status contract:

```txt
ContributionStatus = pending_review | approved | rejected
```

## AI Plant Generation Workflow

Trigger:
- no catalogue entry found for query.

Prompt state:
- `Plant not found. Generate entry?`

Eligibility:
- available to authenticated paid users.

Generated output requirements:
- full plant page scaffold fields
- growing requirements
- companion suggestions
- lifecycle windows

Origin marking:
- generated entries are labeled `community generated` and `ai generated`.

Post-generation refinement:
- comments and feedback can improve confidence and quality over time.

## Logged-In vs Public Experience

Public visitors can:
- search plants
- view plant pages
- read comments

Public visitors cannot:
- comment
- rate
- generate entries
- add to wishlist
- add to property

Authenticated free users can:
- comment
- rate
- add to wishlist
- add to property

Authenticated paid users additionally can:
- generate plant entries with AI

## Integration with My Property and My Plants

In-app plant actions:
- add to wishlist
- add to property

`Add to property` flow contract:
1. choose zone
2. choose bed
3. set quantity
4. save

Cross-module handshakes:
- to `My Property`: preserves selected plant identity and returns to source when flow exits.
- to `My Plants`: updates wishlist or active plant views immediately after action completion.

## Filtering System Contract

Advanced filters:
- plant type
- sun requirements
- water requirements
- uses
- height
- lifecycle type

Example query:
- perennial herbs that tolerate partial shade

Filter behavior rules:
- active filters are always visible
- filter chips are removable individually
- filtering composes with search query

## SEO and Public Discovery Strategy

Catalogue public pages are search-indexable educational content.

SEO UX requirements:
- high-quality structured plant pages
- stable readable URLs
- clear section headings
- strong internal linking across companion and related plants

Growth-channel behavior:
- public users can discover content first and convert via lightweight account prompts for wishlist and property actions.

## Responsive Behavior (Desktop and Mobile)

### Desktop

Preferred browsing layout:
- left search and filter panel
- center results grid
- right preview drawer

Plant detail pages:
- full-width reading layout with section navigation.

### Mobile

Mobile priorities:
- search first
- swipeable filter chips
- compact plant cards
- vertical plant detail scroll

Interaction rule:
- quick actions remain reachable without obscuring plant facts.

## Empty States and Recovery Paths

Catalogue empty-result state:
- message: `No exact match found. Try related terms or generate an entry.`
- actions:
  - clear filters
  - suggested queries
  - generate entry (eligible users only)

No-community-content state:
- show educational fallback copy instead of blank sections.

## Core User Flows

Flow 1: Search and evaluate
1. open catalogue
2. search `lavender`
3. open plant page
4. review requirements and compatibility
5. add to wishlist

Flow 2: Add to property
1. search plant
2. open plant page
3. click `Add to property`
4. choose zone and bed
5. set quantity
6. save and verify in `My Property` and `My Plants`

Flow 3: Generate missing entry
1. search rare plant
2. receive no-entry state
3. select `Generate entry`
4. AI creates draft entry with required sections
5. entry appears with generation labels

Flow 4: Community contribution
1. authenticated user opens plant page
2. adds comment/rating/photo
3. contribution enters moderation flow when needed
4. approved contribution appears publicly

## Functional Requirements

FR-01 Catalogue is accessible as top-navigation module.
FR-02 Catalogue supports both public-web and in-app surfaces.
FR-03 Homepage includes search, popular, seasonal, regional, and category sections.
FR-04 Search supports name, Latin name, use intent, conditions, and companion-intent queries.
FR-05 Search results render plant cards with compatibility cues.
FR-06 Plant pages include core guide sections and practical decision content.
FR-07 Companion and conflict sections link to related plant pages.
FR-08 Lifecycle timeline integrates with Calendar signal surfaces.
FR-09 Regional suitability reflects hardiness and climate compatibility.
FR-10 Community ratings/comments are available with user-state permissions.
FR-11 Photo contributions require moderation before public display.
FR-12 AI generation is available only for authenticated paid users.
FR-13 Generated entries are clearly labeled by origin.
FR-14 Add-to-property and add-to-wishlist actions are available in-app with proper permission checks.
FR-15 Add-to-property flow routes through zone and bed selection.
FR-16 Advanced filters compose with search and remain visible.
FR-17 Public pages support SEO-oriented educational discovery.
FR-18 Module preserves return context when entered from other modules.

## Non-Functional Requirements

Accessibility:
- search, filters, cards, and section navigation are keyboard and assistive-tech accessible.
- icons and ratings include text alternatives.
- contrast and typography support long-form reading comfort.

Performance:
- search interactions should feel immediate for common queries.
- plant pages should prioritize fast first contentful load for public SEO traffic.
- filter changes should not trigger full-page blocking transitions.

Clarity:
- botanical detail should remain understandable for non-experts.
- caution and compatibility language should be concise and actionable.
- origin labels for generated content should be explicit.

## Paid vs Free Surface Behavior

Public:
- browse and read only.

Authenticated free:
- browse, comment, rate, add to wishlist, add to property.

Authenticated paid:
- all free capabilities plus AI plant entry generation.

Gating principle:
- knowledge access remains broad.
- advanced generation capability is premium.

## Out of Scope for Module 04

- full task generation engine behavior
- task prioritization algorithms
- notification policy internals
- full moderation tooling implementation details
- enterprise taxonomy governance workflows

## Acceptance Criteria and Test Scenarios

1. Public browse test  
Given public visitor, when searching and opening plant pages, then content is readable and action restrictions are enforced.

2. In-app action test  
Given authenticated user, when choosing add-to-wishlist and add-to-property, then downstream modules update correctly.

3. Search intent test  
Given condition-based query like `plants for shade`, when search executes, then relevant plants appear with compatibility cues.

4. Companion linking test  
Given companion list on plant page, when user selects a companion, then linked plant page opens successfully.

5. Conflict warning test  
Given a plant with known conflicts, when page renders, then plants-to-avoid warning appears with concise rationale.

6. Lifecycle integration test  
Given lifecycle timeline event, when user opens Calendar link, then temporal context opens correctly.

7. Regional suitability test  
Given logged-in user with region profile, when plant page loads, then localized suitability summary appears.

8. AI generation permission test  
Given missing entry, when free user attempts generation, then paywall/upgrade prompt appears; paid user can proceed.

9. Origin label test  
Given generated entry, when displayed, then `community generated` and `ai generated` labels are visible.

10. Community moderation test  
Given user photo upload, when submission is pending, then it is not publicly visible until approved.

11. Filter composition test  
Given active filters and search query, when filters are adjusted, then results update and active chips stay visible.

12. SEO discoverability test  
Given public plant page, when crawled and viewed, then it presents structured educational content and internal related links.

## Open Questions Deferred to Module 10 (Database Architecture)

- how community contribution permissions should vary by role (owner, editor, viewer)
- how team moderation responsibilities should be assigned for shared property communities
- how public-vs-private contribution defaults should work for household and farm teams
- how contributor identity should be displayed for ratings, comments, and photos
