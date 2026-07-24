# Stitch References

Imported from Stitch project `garden.io` (`projects/6971513088865518209`).

Purpose:
- treat Stitch as the visual and layout source of truth
- keep repo product specs and current code as the behavior source of truth
- separate implementation-target screens from reference-only docs and assets

Structure:
- `manifest.json`: screen inventory, route mapping, and implementation priority
- `raw/html/`: raw imported or source-linked HTML references
- `raw/screenshots/`: raw imported or source-linked screenshot references

Route mapping baseline:
- `/app/my-property`: property, zone, and bed field journal variants plus the older My Property nav screens
- `/app/calendar`: `Calendar - Weekly Planner` plus calendar product spec upload
- `/app/plant-catalogue`: `Plant Catalogue - Herbs Search` and `Plant Catalogue (Updated Nav)` plus catalogue spec upload
- `/app/my-plants`: derived from shared Stitch journal language plus the uploaded My Plants spec

Classification rules:
- uploaded markdown/spec screens are `reference-only`
- raw design/image assets are `reference-only`
- field journal, calendar, catalogue, and app-route mock screens are `implementation-target`
- duplicate visual variants remain imported because they are useful for composition and system extraction
