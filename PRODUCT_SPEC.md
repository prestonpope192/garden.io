# Garden.io

## The Living Notebook for Growing

A planning, memory, and intelligence system for gardens, farms, and homesteads.

Garden.io acts like a beautiful field notebook that thinks with you.

Instead of feeling like software, it should feel like:
- a gardener's journal
- a seasonal planner
- a map of the land
- a memory of everything grown there

## Companion Docs

- [TARGET_AUDIENCE.md](TARGET_AUDIENCE.md): source of truth for target users, felt needs, tiering, and anti-personas.
- [01-my-property-interface.md](docs/product/specs/01-my-property-interface.md): canonical module spec for the Property -> Zone -> Bed -> Plant experience.
- [02-calendar-design.md](docs/product/specs/02-calendar-design.md): canonical module spec for temporal planning, weather signals, and calendar-driven execution.
- [03-my-plants.md](docs/product/specs/03-my-plants.md): canonical module spec for plant-centric browsing, wishlist management, and historical plant memory.
- [04-plant-catalogue-ux.md](docs/product/specs/04-plant-catalogue-ux.md): canonical module spec for public and in-app plant knowledge, discovery, and add-to-property flows.
- [05-task-system.md](docs/product/specs/05-task-system.md): canonical module spec for generation, prioritization, and contextual execution of garden work.
- [06-ai-suggestion-system.md](docs/product/specs/06-ai-suggestion-system.md): canonical module spec for ambient recommendations, diagnosis, and context-aware AI guidance.
- [07-style-and-branding.md](docs/product/specs/07-style-and-branding.md): canonical module spec for visual identity, component aesthetics, and cross-module brand consistency.
- [08-user-management-shared-access.md](docs/product/specs/08-user-management-shared-access.md): canonical module spec for property-scoped collaboration, permissions, and lightweight shared workflows.
- [09-system-architecture-overview.md](docs/product/specs/09-system-architecture-overview.md): canonical architecture blueprint connecting space, time, and knowledge layers across all modules.
- [10-database-architecture-postgres.md](docs/product/specs/10-database-architecture-postgres.md): canonical database architecture spec with full PostgreSQL DDL, FK topology, indexing strategy, and RLS model.

---

## Core Product Idea

Garden.io is not primarily a task manager.

It is a living record of a property and everything growing on it, where planning, learning, and observation naturally produce tasks and insights.

The product revolves around one central experience:

exploring your property and its plants.

---

## Core Entity

Users create a Property.

The user selects what they call it:
- Garden
- Farm
- Homestead
- Orchard
- Ranch
- Vineyard
- Custom name

Internally it is simply:

Property

Hierarchy:

Property  
-> Zones  
-> Beds  
-> Plants

This hierarchy becomes the core navigation system of the app.

---

## Core Navigation Model

The entire product revolves around browsing the property.

Navigation feels like flipping through a notebook or field guide, not like navigating software.

Users move through levels:

Property -> Zone -> Bed -> Plant

The experience should feel visual and spatial.

Possible browsing interactions:
- swipe between zones
- flip between beds like cards
- zoom between levels
- optional map view

Map view is optional. Cards and visual groupings can represent areas.

---

## Layout Concept

Main layout has three persistent areas.

### Left Hierarchy Rail

Persistent structural navigator for spatial context.

Allows movement across:
- Property
- Zone
- Bed
- Plant

This panel is the map of place.

### Main Body (center)

Shows the current level content and planning surfaces.

This is where the visual exploration happens.

### Right Drawer

Context panel that can switch between modes:
- Info
- Tasks
- Actions

Examples:

Info
- description of the zone
- soil notes
- purpose

Tasks
- upcoming tasks
- past tasks
- reminders

Actions
- add plant
- add note
- add task
- upload photo

---

## Primary Modules

The app has only a few top-level modules.

Everything else lives inside them.

### My Property

The core navigation experience.

Browse:

Property -> Zones -> Beds -> Plants

Everything about growing lives here.

### Calendar

The consolidated schedule.

Contains:
- upcoming tasks
- seasonal events
- weather data
- reminders

### My Plants

Personal plant lists.

Tabs:
- Growing
- Wishlist
- Archived

### Plant Catalogue

A global plant knowledge base.

Accessible from:
- Add Plant flow
- My Plants
- Search page
- Public website

---

## Onboarding Flow

Simple checklist:
1. Create Property
2. Create Zone
3. Create Bed
4. Add Plant

Once a plant exists in a bed, the system becomes alive.

Tasks, suggestions, and insights begin appearing.

---

## Plant Catalogue Strategy

The catalogue grows dynamically.

If a plant does not exist:

User searches (example: "Jerusalem artichoke")

If missing, user can select:

Generate plant entry

AI creates the plant record with:
- characteristics
- lifecycle
- planting data
- companions
- growing requirements

Users can then:
- comment
- rate
- suggest edits
- flag incorrect data

This creates a crowdsourced plant intelligence system.

---

## Community Knowledge

Users can contribute:
- ratings
- comments
- success photos
- corrections

Ratings help identify what works best in specific climates.

Example insight:

"Blueberries perform well in Zone 7 sandy soils."

These comments are public.

---

## Guild Templates

Instead of "guilds" as a strict concept, they become templates.

Examples:
- Apple Tree Guild
- Pizza Garden
- Pollinator Bed
- Tea Garden
- Three Sisters Bed

Users can:
- apply templates to beds
- modify them
- save custom templates
- share templates with the community

---

## Notes and Observations

Users should easily record observations.

Examples:
- photo of pest damage
- voice note about watering
- observation about yield

These notes attach to:
- Plant
- Bed
- Zone
- Property

The system should automatically connect notes to context.

---

## AI Interaction Philosophy

AI should feel ambient and intelligent, not like a chatbot.

Avoid heavy chat interfaces.

Instead AI appears as:
- Suggestions
- Insights
- Warnings
- Recommendations

Examples:

On a bed page:

Suggested companions

"Consider adding basil to improve tomato flavor and pest resistance."

On calendar:

"Rain expected this week - irrigation may not be needed."

On plant page:

"Leaves appear nitrogen deficient."

AI interaction should also exist through a small widget for:
- photo diagnosis
- questions
- adding reminders

---

## Weather Intelligence

Weather lives primarily inside the Calendar module.

Features:
- forecast
- historical weather
- growing conditions

WeatherIQ generates insights like:
- frost risk
- rainfall patterns
- heat stress periods

WeatherIQ appears also as small summaries within zones and beds.

---

## Water Intelligence

Lives on the Bed level.

WaterIQ analyzes:
- plant needs
- weather
- soil conditions

Output:

Suggested watering schedule.

---

## Harvest Intelligence

HarvestIQ tracks:
- harvest events
- yield estimates
- seasonal trends

Harvest tracking can occur at:
- Plant
- Bed
- Zone
- Property

---

## Rotation Planning

Rotation planning integrates into the hierarchy.

Accessible on:
- Bed
- Zone

Users can scroll forward or backward in time.

Interaction should feel like flipping through seasonal pages.

Timeline moves in weekly increments.

---

## Garden Memory

Historical records.

Contains:
- past plantings
- yields
- notes
- weather patterns

This feature should exist quietly in the background.

Most users will access it occasionally.

---

## Aesthetic Direction

The interface must not feel digital.

Inspiration:
- botanical notebooks
- vintage field journals
- herbarium sheets
- gardening books

Visual elements:
- hand-drawn borders
- pencil or charcoal plant illustrations
- textured paper backgrounds
- elegant serif typography

Plants should have illustrated drawings, not just photos.

Animations can include:
- subtle plant movement
- page turning transitions
- sketch-style reveals

The product should feel like a living botanical journal.

---

## Freemium Model

### Free Tier

- one property
- limited number of plants
- plant catalogue access
- wishlist feature
- community comments and ratings
- monthly planning email

Restrictions:
- no AI assistant
- no plant generation
- no advanced analytics
- no SMS reminders
- no weather insights
- no weekly reports

### Paid Tier

- multiple properties
- unlimited plants
- AI features
- plant health diagnosis
- generate new plant entries
- WeatherIQ
- WaterIQ
- HarvestIQ
- weekly garden reports
- text reminders
- advanced planning tools

---

## Weekly Garden Reports (Paid)

Users receive a weekly overview.

Example:

This week in your garden
- plant cucumbers
- prune raspberries
- harvest lettuce

Watch for
- aphids
- heat stress

Weather summary
- 1.2 inches rain expected

---

## Why This Product Works

Garden.io succeeds because it combines three needs:
- memory
- planning
- learning

Gardeners already keep notebooks.

This product becomes the digital evolution of that notebook.
