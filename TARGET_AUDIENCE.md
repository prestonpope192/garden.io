# Garden.io Target Audience

Garden.io is for growers managing living systems, not casual ornamental chores, with the strongest fit for people running multiple beds with regenerative intent.

## Stable Section Contract (Canonical Taxonomy)

Use these sections as the shared taxonomy across roadmap, onboarding, copy, and pricing docs:
1. Scope and Lens
2. Audience Prioritization
3. Core Users and Felt Needs
4. Jobs To Be Done
5. Why This Is the Best-Fit Audience Now
6. Pricing and Packaging Implications
7. Messaging Guardrails
8. Fit Tests and Scenarios
9. Research Notes and Sources

## Applied Product Surfaces

- [01-my-property-interface.md](docs/product/specs/01-my-property-interface.md) is the first audience-aligned implementation specification, translating target user needs into the core Property -> Zone -> Bed -> Plant module contract.
- [02-calendar-design.md](docs/product/specs/02-calendar-design.md) is the temporal execution specification, translating the same audience needs into weekly, monthly, and seasonal planning workflows.
- [03-my-plants.md](docs/product/specs/03-my-plants.md) is the plant-identity memory specification, translating audience needs into active plant tracking, wishlist intent, and historical learning loops.
- [04-plant-catalogue-ux.md](docs/product/specs/04-plant-catalogue-ux.md) is the public and in-app knowledge specification, translating audience needs into discoverable guidance, compatibility checks, and confident plant selection.
- [05-task-system.md](docs/product/specs/05-task-system.md) is the operational guidance specification, translating audience needs into calm, context-aware task execution and seasonal follow-through.
- [06-ai-suggestion-system.md](docs/product/specs/06-ai-suggestion-system.md) is the ambient intelligence specification, translating audience needs into actionable, non-intrusive, context-aware guidance.
- [07-style-and-branding.md](docs/product/specs/07-style-and-branding.md) is the brand expression specification, translating audience needs into a calm, analog-inspired visual and verbal identity.
- [08-user-management-shared-access.md](docs/product/specs/08-user-management-shared-access.md) is the collaboration specification, translating audience needs into lightweight household and small-team shared property workflows.
- [09-system-architecture-overview.md](docs/product/specs/09-system-architecture-overview.md) is the systems blueprint specification, translating audience needs into a coherent cross-module architecture.
- [10-database-architecture-postgres.md](docs/product/specs/10-database-architecture-postgres.md) is the persistence architecture specification, translating audience needs into durable, queryable space/time/knowledge data contracts.

## Scope and Lens

- Geography: North America (United States and Canada first).
- Time anchor: current as of March 9, 2026.
- Purpose: product strategy and audience fit, not TAM modeling.
- Regenerative/permaculture lens: behavior-based (soil health, biodiversity, long-horizon planning), not certification-based.
- Product wedge assumption: planning intelligence first; plant intelligence second.

## Audience Prioritization

### Tier 1 (Beachhead): Multi-Bed Home Growers

Profile:
- owner-occupied homes with yards
- typically 4-12+ productive beds, mixed annuals/perennials
- motivated by food quality, resilience, and ecological stewardship

Why this tier first:
- pain is strong enough to pay (task overload, missed windows, fragmented notes)
- complexity is high, but still inside a consumer-grade UX
- aligns directly with Garden.io's notebook + hierarchy model

### Tier 2: Homesteaders and Mixed-Use Properties

Profile:
- larger properties with vegetables, perennial systems, trees, and often small livestock adjacency
- planning horizon spans seasons and years, not just this month

Why this tier second:
- strongest need for memory, rotation, and long-horizon decision support
- high retention potential due to cumulative records and context
- requires deeper planning surfaces but still maps to the current product architecture

### Tier 3: Small Diversified Farms

Profile:
- direct-to-consumer and mixed-crop operations
- stronger requirements around labor timing, harvest windows, and production tracking

Why this tier third:
- strong fit for planning and recordkeeping pain
- introduces operational expectations (team workflows, cost accounting, logistics) beyond current core
- should be served intentionally without diluting the beachhead product

### Anti-Personas (Not Core for Current Roadmap)

- Decorative-only gardeners with 1-2 small landscape beds and minimal seasonal planning
- "Herbs-only" windowsill users with low complexity and low need for hierarchy/memory features
- Commercial monocrop operations that need full farm ERP, compliance, and enterprise operations tooling

## Core Users and Felt Needs

| Segment | Context | Top Felt Needs | Current Workarounds | Garden.io Relief | Free vs Paid Fit |
| --- | --- | --- | --- | --- | --- |
| Beginner growers (multi-bed transition) | Moving from "a couple plants" to several productive beds for the first time | Calm start; confidence about what to plant and when; trust in climate-relevant guidance | YouTube playlists, seed packet notes, scattered reminders, screenshots | Guided Property -> Zone -> Bed setup, recommended plants, first-season schedule, contextual notes | Free tier proves habit and structure; paid unlock starts when weather-aware planning and proactive reminders prevent misses |
| Hobby growers (seasonal planners) | 4-12+ beds, repeated spring/summer/fall cycles, trying to improve outcomes each year | Continuity across seasons; confidence they are not forgetting key tasks; calmer weekly planning | Wall calendars, spreadsheets, notebook pages, ad hoc phone reminders | Calendar + hierarchy linkage, bed-level timelines, reminders, WeatherIQ summaries, easier review of what happened last season | Free tier supports baseline planning; paid tier value appears when multi-zone scheduling and adaptive suggestions save time weekly |
| Homesteaders (system thinkers) | Diversified production with perennials, annuals, soil-building, and companion planting | Long-horizon continuity; trust in recommendations that fit local conditions; reduced cognitive load | Multiple notebooks, whiteboards, memory, inconsistent historical records | Zone memory, rotation views, guild templates, observation capture, WaterIQ/HarvestIQ context over time | Paid fit is strong due to compound value of memory + planning intelligence across years |
| Small diversified farms (secondary) | Revenue-linked harvest timing and labor coordination across crops/blocks | Confidence in timing decisions; continuity for team handoffs; calm under operational pressure | Clipboards, spreadsheets, generic PM tools, legacy farm logs | Bed/zone planning backbone, harvest timeline visibility, weather-informed planning, clearer record history | Paid fit is clear for planning/reporting, but roadmap must remain explicit about limits vs full farm ops suites |

Emotional outcomes to optimize across all core segments:
- calm: "I can see the week and what matters."
- confidence: "I know what to do next."
- continuity: "I can pick up where I left off, season to season."
- trust: "Recommendations fit my context and history."

## Jobs To Be Done

### Tier 1 JTBD (Multi-Bed Home Growers)

When my growing setup expands beyond a couple simple beds, I want one place that shows what to do, where, and when, so I can keep momentum without feeling overwhelmed.

Product mapping:
- Property hierarchy for spatial clarity
- Calendar for weekly execution
- Notes/observations for memory and learning

### Tier 2 JTBD (Homesteaders)

When I am managing a mixed perennial and annual system across seasons, I want planning and history connected to each zone and bed, so I can make better regenerative decisions year after year.

Product mapping:
- Zone/bed memory and rotation context
- Observation timeline and historical recall
- WaterIQ and HarvestIQ summaries tied to location

### Tier 3 JTBD (Small Diversified Farms)

When crop timing and labor windows affect production outcomes, I want weather-aware planning and harvest visibility in one system, so I can coordinate execution and reduce missed windows.

Product mapping:
- Calendar + reminders for timing control
- HarvestIQ for trend visibility
- WeatherIQ for risk-aware planning

## Why This Is the Best-Fit Audience Now

- Household participation is broad, which makes home grower acquisition viable: U.S. research tied to the National Gardening Survey reported 80% household participation in 2022 and average annual spending of $616, indicating both activity and willingness to invest in gardening workflows ([ABC News / AP](https://abcnews.go.com/Lifestyle/wireStory/record-number-americans-participating-gardening-2024-115658658), [AP News](https://apnews.com/article/gardening-lawn-care-plants-pandemic-c17fb09b6641f2aac8390029bd93b8ca)).
- Canadian participation data confirms scale and property-type fit: 61% of households reported growing fruits, herbs, vegetables, or flowers, rising to 72% among single-detached homes; most growers used yard space, which aligns with Garden.io's zone/bed model ([Statistics Canada](https://www.statcan.gc.ca/o1/en/plus/5993-herb-your-enthusiasm-canadians-kept-gardening-2021)).
- Engagement depth is not limited to private yards: NRPA reported 74% of adults have gardened at some point and more than 33 million people have participated in community gardening, supporting a broad top-of-funnel for serious growers over time ([NRPA](https://www.nrpa.org/about-national-recreation-and-park-association/press-room/new-national-study-highlights-growing-interest-in-gardening-across-generations/)).
- Planning and recordkeeping pain is real and recurring: extension guidance repeatedly emphasizes pre-season planning, in-season watering discipline, and tracking outcomes as core determinants of success, which maps directly to Garden.io's memory + planning proposition ([University of Delaware](https://www.udel.edu/content/dam/udelImages/canr/pdfs/extension/factsheets/planning-veg-garden.pdf), [Iowa State Extension](https://yardandgarden.extension.iastate.edu/how-to/watering-vegetable-garden), [UVM Extension](https://www.uvm.edu/news/extension/gardening-journal-simple-tool-pays), [Cornell Small Farms](https://smallfarms.cornell.edu/2016/10/good-records/)).
- Small farms matter but should remain secondary for now: USDA data shows U.S. agriculture is mostly family farms and that small family farms remain numerically dominant, but serving farm operations deeply adds requirements beyond current scope ([USDA NASS, 2022 Census highlights](https://www.nass.usda.gov/Newsroom/2024/02-13-2024.php), [USDA NASS farm typology release](https://www.nass.usda.gov/Newsroom/archive/2025/08-19-2025.php)).
- Regenerative intent is an adoption bridge, not a niche-only edge case: government and extension guidance increasingly promotes pollinator support, native planting, and ecological garden practices, reinforcing demand for context-aware planning tools ([U.S. Fish & Wildlife Service](https://www.fws.gov/story/2024-06/create-monarch-and-pollinator-haven-your-home-garden)).

## Pricing and Packaging Implications

### Free Tier Role

Free should help users confirm fit and build the habit loop:
- set up a property quickly
- place first zones, beds, and plants
- experience immediate planning clarity
- capture first notes and build memory confidence

Free-tier success metric:
- user returns weekly because the product is now "where the season lives."

### Paid Tier Trigger

Paid conversion should be driven by planning intelligence at scale:
- weather-aware scheduling that adapts by context
- proactive reminder confidence ("what to do, where, and when")
- multi-zone complexity management
- richer historical interpretation across seasons

Position paid as reduced decision load and fewer misses, not generic AI chat novelty.

## Messaging Guardrails

### Do Say

- "A living notebook for your land."
- "Plan by bed and zone, not by disconnected task lists."
- "Stay calm and confident with weather-aware weekly planning."
- "Remember what worked here, in this exact place, last season."
- "Built for growers managing real complexity, not just casual reminders."

### Avoid Saying

- "Farm ERP for everyone."
- "Just another to-do app."
- "Instantly perfect results."
- "For any and every gardener, regardless of complexity."
- "AI chatbot first."

## Fit Tests and Scenarios

1. Fit test: beginner with 1-2 ornamental beds  
Expected: classified as low-fit/anti-persona for current roadmap focus.

2. Fit test: homeowner managing 4-12 productive beds  
Expected: clear Tier 1 fit with strong value from hierarchy + Calendar + reminders.

3. Fit test: homesteader with mixed perennial/annual system  
Expected: clear Tier 2 fit with high need for rotation memory and long-horizon notes.

4. Fit test: small diversified farm  
Expected: Tier 3 fit for planning and records, with explicit scope limits on full ops workflows.

5. Monetization test  
Expected: paid rationale centers on planning confidence, time savings, and reduced misses.

6. Evidence test  
Expected: non-obvious market claims are source-backed and date-scoped.

## Research Notes and Sources

Primary sources used for audience claims:

- [NRPA Park Pulse (Mar 2024): The Rise of Gardening](https://www.nrpa.org/our-work/research-papers/park-pulse/the-rise-of-gardening/)  
Relevance: participation patterns and demographics across U.S. gardeners.

- [NRPA press summary of national gardening study](https://www.nrpa.org/about-national-recreation-and-park-association/press-room/new-national-study-highlights-growing-interest-in-gardening-across-generations/)  
Relevance: concrete topline metrics on lifetime and community gardening participation.

- [Statistics Canada (provided in source set)](https://www150.statcan.gc.ca/n1/daily-quotidien/240320/dq240320a-eng.htm)  
Relevance: included from planning source list; keep for traceability.

- [Statistics Canada: Herb your enthusiasm - Canadians kept gardening in 2021](https://www.statcan.gc.ca/o1/en/plus/5993-herb-your-enthusiasm-canadians-kept-gardening-2021)  
Relevance: household participation and dwelling-type differences used in this memo.

- [AP reporting on 2024 National Gardening Survey (ABC syndication)](https://abcnews.go.com/Lifestyle/wireStory/record-number-americans-participating-gardening-2024-115658658)  
Relevance: U.S. household participation and spending context.

- [AP direct wire copy](https://apnews.com/article/gardening-lawn-care-plants-pandemic-c17fb09b6641f2aac8390029bd93b8ca)  
Relevance: same survey details with clearer full-text access.

- [USDA NASS (Jan 31, 2025): American Farms and Farm Families Report](https://www.nass.usda.gov/Newsroom/2025/01-31-2025.php)  
Relevance: included from planning source list for traceability.

- [USDA NASS (Feb 13, 2024): 2022 Census of Agriculture Highlights](https://www.nass.usda.gov/Newsroom/2024/02-13-2024.php)  
Relevance: farm structure and scale context for Tier 3 framing.

- [USDA NASS farm typology update (Aug 19, 2025)](https://www.nass.usda.gov/Newsroom/archive/2025/08-19-2025.php)  
Relevance: updated distribution of small vs large family farm output and sales role.

- [Cornell Small Farms: Good Records (2016)](https://smallfarms.cornell.edu/2016/10/good-records/)  
Relevance: recordkeeping discipline as a core farm/grower capability.

- [University of Delaware Extension: Planning a Vegetable Garden](https://www.udel.edu/content/dam/udelImages/canr/pdfs/extension/factsheets/planning-veg-garden.pdf)  
Relevance: planning workload and season timing complexity.

- [Iowa State Extension: Watering the Vegetable Garden](https://yardandgarden.extension.iastate.edu/how-to/watering-vegetable-garden)  
Relevance: recurring watering-management complexity and timing.

- [UVM Extension: Keeping Track in the Garden](https://www.uvm.edu/news/extension/keeping-track-garden)  
Relevance: tracking outcomes and weather notes for better decisions.

- [UVM Extension: Gardening journal - simple tool that pays off](https://www.uvm.edu/news/extension/gardening-journal-simple-tool-pays)  
Relevance: updated extension framing on journals as planning/memory infrastructure.

- [U.S. Fish & Wildlife Service: Pollinator-friendly home gardens (Jun 28, 2024)](https://www.fws.gov/story/2024-06/create-monarch-and-pollinator-haven-your-home-garden)  
Relevance: regenerative and pollinator-oriented behavior patterns in household gardening.
