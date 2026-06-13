"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { SpecimenLabel } from "@/components/journal-primitives";
import type {
  GardenBed,
  GardenPlantProfile
} from "@/lib/garden-app-types";
import {
  formatCatalogueValue,
  formatInchesRange,
  getCultivarLabel,
  getProfileIllustration,
  getRating
} from "./shared";

export type CatalogueViewProps = {
  activeBed: GardenBed | null;
  plantProfiles: GardenPlantProfile[];
  addCatalogPlantToBed: (slug: string) => Promise<void>;
  saveWishlist: (slug: string) => Promise<void>;
};

type SortKey = "name" | "type";

// Derive a human-readable label from plant_type_code
function typeLabel(code: string): string {
  const map: Record<string, string> = {
    herb: "Herbs",
    fruit: "Fruit",
    vegetable: "Vegetables",
    flower: "Flowers",
    tree: "Trees",
    shrub: "Shrubs",
    vine: "Vines",
    groundcover: "Groundcovers",
    bulb: "Bulbs",
    fern: "Ferns",
    grass: "Grasses",
  };
  return map[code] ?? code.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Build sorted, deduped list of type chips
function buildTypeChips(profiles: GardenPlantProfile[]): Array<{ code: string; label: string; count: number }> {
  const counts: Record<string, number> = {};
  for (const p of profiles) {
    counts[p.plant_type_code] = (counts[p.plant_type_code] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([code, count]) => ({ code, label: typeLabel(code), count }));
}

// ExpandableFieldNotes — per-card expanded section
function FieldNotes({ plant }: { plant: GardenPlantProfile }) {
  const overrides = plant.cultivar_overrides ?? [];
  const hasSoil = plant.drainage_requirement || plant.soil_texture_summary;
  const hasSmallGarden = Boolean(plant.notes_for_small_garden);
  const hasHomestead = Boolean(plant.notes_for_homestead);

  return (
    <div className="beta-cat-field-notes">
      {plant.why_plant_it ? (
        <div className="beta-cat-field-notes__section">
          <span className="beta-cat-field-notes__label">Why grow it</span>
          <p>{plant.why_plant_it}</p>
        </div>
      ) : null}

      {plant.primary_use_cases ? (
        <div className="beta-cat-field-notes__section">
          <span className="beta-cat-field-notes__label">Primary uses</span>
          <p>{plant.primary_use_cases}</p>
        </div>
      ) : null}

      {hasSoil ? (
        <div className="beta-cat-field-notes__section">
          <span className="beta-cat-field-notes__label">Soil &amp; drainage</span>
          {plant.drainage_requirement ? (
            <p>
              <strong>Drainage:</strong> {formatCatalogueValue(plant.drainage_requirement)}
            </p>
          ) : null}
          {plant.soil_texture_summary ? <p>{plant.soil_texture_summary}</p> : null}
        </div>
      ) : null}

      {hasSmallGarden ? (
        <div className="beta-cat-field-notes__section">
          <span className="beta-cat-field-notes__label">Small garden notes</span>
          <p>{plant.notes_for_small_garden}</p>
        </div>
      ) : null}

      {hasHomestead ? (
        <div className="beta-cat-field-notes__section">
          <span className="beta-cat-field-notes__label">Homestead notes</span>
          <p>{plant.notes_for_homestead}</p>
        </div>
      ) : null}

      {overrides.length > 0 ? (
        <div className="beta-cat-field-notes__section">
          <span className="beta-cat-field-notes__label">Cultivar differences</span>
          <ul className="beta-cat-overrides-list">
            {overrides.map((o) => (
              <li key={`${plant.slug}-${o.field_key}`}>
                <strong>{o.field_key.replaceAll("_", " ")}</strong>
                {o.source_notes ? <span> — {o.source_notes}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

// Individual catalogue card
function CatalogCard({
  plant,
  activeBed,
  addCatalogPlantToBed,
  saveWishlist,
}: {
  plant: GardenPlantProfile;
  activeBed: GardenBed | null;
  addCatalogPlantToBed: (slug: string) => Promise<void>;
  saveWishlist: (slug: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);

  const containerRating = getRating(plant, "container_suitability");
  const pollinatorRating = getRating(plant, "pollinator_value");
  const maintenanceRating = getRating(plant, "maintenance_need");

  const hasFieldNotes =
    Boolean(plant.why_plant_it) ||
    Boolean(plant.primary_use_cases) ||
    Boolean(plant.drainage_requirement) ||
    Boolean(plant.soil_texture_summary) ||
    Boolean(plant.notes_for_small_garden) ||
    Boolean(plant.notes_for_homestead) ||
    (plant.cultivar_overrides?.length ?? 0) > 0;

  return (
    <article className="beta-catalogue-card" key={plant.slug}>
      <div className="beta-cat-card__image-col">
        <Image
          alt={plant.display_name}
          className="specimen-art specimen-art--small"
          height={220}
          src={getProfileIllustration(plant)}
          width={180}
        />
      </div>
      <div className="beta-cat-card__body">
        <SpecimenLabel tone="clay">{plant.family_name ?? plant.plant_type_code}</SpecimenLabel>
        <div className="beta-catalogue-card__heading">
          <h2>{plant.display_name}</h2>
          <span>{getCultivarLabel(plant)}</span>
        </div>
        <p><em>{plant.botanical_name_full}</em></p>
        <p className="beta-cat-card__desc">{plant.short_description ?? "No summary yet."}</p>

        <dl className="detail-list">
          <div className="detail-list__row">
            <dt>Sun</dt>
            <dd>{formatCatalogueValue(plant.preferred_light)}</dd>
          </div>
          <div className="detail-list__row">
            <dt>Water</dt>
            <dd>{formatCatalogueValue(plant.water_need_level)}</dd>
          </div>
          <div className="detail-list__row">
            <dt>Height</dt>
            <dd>{formatInchesRange(plant.mature_height_min_in, plant.mature_height_max_in)}</dd>
          </div>
          <div className="detail-list__row">
            <dt>Fit</dt>
            <dd>{plant.notes_for_small_garden ?? plant.primary_use_cases ?? "TBD"}</dd>
          </div>
        </dl>

        <div className="beta-catalogue-metrics" aria-label={`${plant.display_name} ratings`}>
          {containerRating ? <span>Container {containerRating.rating}/5</span> : null}
          {pollinatorRating ? <span>Pollinator {pollinatorRating.rating}/5</span> : null}
          {maintenanceRating ? <span>Care {maintenanceRating.rating}/5</span> : null}
        </div>

        {hasFieldNotes ? (
          <div className="beta-cat-expand">
            <button
              aria-expanded={expanded}
              className="beta-cat-expand__toggle"
              type="button"
              onClick={() => setExpanded((v) => !v)}
            >
              <span className="beta-cat-expand__icon" aria-hidden="true">
                {expanded ? "−" : "+"}
              </span>
              Field notes
            </button>
            <div
              className="beta-cat-expand__panel"
              data-open={expanded ? "true" : "false"}
              hidden={!expanded}
            >
              <FieldNotes plant={plant} />
            </div>
          </div>
        ) : null}

        <p className="beta-catalogue-card__status">
          {formatCatalogueValue(plant.review_status)} · {plant.source_count ?? 0} sources
        </p>

        <div className="beta-card-actions">
          <button
            className="button"
            type="button"
            onClick={() => addCatalogPlantToBed(plant.slug)}
          >
            Add to {activeBed?.name ?? "bed"}
          </button>
          <button
            className="folio-button"
            type="button"
            onClick={() => saveWishlist(plant.slug)}
          >
            Save wishlist
          </button>
        </div>
      </div>
    </article>
  );
}

export function CatalogueView({
  activeBed,
  plantProfiles,
  addCatalogPlantToBed,
  saveWishlist,
}: CatalogueViewProps) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("name");

  const typeChips = useMemo(() => buildTypeChips(plantProfiles), [plantProfiles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = plantProfiles;

    if (q) {
      result = result.filter(
        (p) =>
          p.display_name.toLowerCase().includes(q) ||
          (p.botanical_name_full ?? "").toLowerCase().includes(q) ||
          (p.family_name ?? "").toLowerCase().includes(q)
      );
    }

    if (activeType) {
      result = result.filter((p) => p.plant_type_code === activeType);
    }

    return [...result].sort((a, b) => {
      if (sort === "type") {
        const typeCmp = a.plant_type_code.localeCompare(b.plant_type_code);
        if (typeCmp !== 0) return typeCmp;
      }
      return a.display_name.localeCompare(b.display_name);
    });
  }, [plantProfiles, query, activeType, sort]);

  const hasFilters = Boolean(query.trim()) || activeType !== null;

  if (plantProfiles.length === 0) {
    return (
      <section className="beta-panel">
        <SpecimenLabel tone="clay">Live catalogue</SpecimenLabel>
        <p className="beta-cat-empty__note">No catalogue profiles loaded yet.</p>
      </section>
    );
  }

  return (
    <div className="beta-cat-root">
      {/* Toolbar */}
      <div className="beta-cat-toolbar">
        <div className="beta-cat-search">
          <label className="beta-cat-search__label" htmlFor="cat-search">
            <svg aria-hidden="true" className="beta-cat-search__icon" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" />
              <line stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" x1="10.5" x2="14.5" y1="10.5" y2="14.5" />
            </svg>
          </label>
          <input
            className="beta-cat-search__input"
            id="cat-search"
            placeholder="Search by name, botanical name, or family…"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="beta-cat-toolbar__row">
          <div className="beta-cat-type-chips" role="group" aria-label="Filter by type">
            <button
              aria-pressed={activeType === null}
              className={`beta-cat-chip${activeType === null ? " is-active" : ""}`}
              type="button"
              onClick={() => setActiveType(null)}
            >
              All <small>{plantProfiles.length}</small>
            </button>
            {typeChips.map(({ code, label, count }) => (
              <button
                aria-pressed={activeType === code}
                className={`beta-cat-chip${activeType === code ? " is-active" : ""}`}
                key={code}
                type="button"
                onClick={() => setActiveType(activeType === code ? null : code)}
              >
                {label} <small>{count}</small>
              </button>
            ))}
          </div>

          <div className="beta-cat-sort">
            <label className="beta-cat-sort__label" htmlFor="cat-sort">Sort</label>
            <select
              className="beta-cat-sort__select"
              id="cat-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="name">Name A–Z</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results meta row */}
      <div className="beta-cat-results-meta">
        <span>
          {filtered.length === plantProfiles.length
            ? `${filtered.length} profiles in catalogue`
            : `${filtered.length} of ${plantProfiles.length} profiles`}
        </span>
        {hasFilters ? (
          <button
            className="beta-cat-clear"
            type="button"
            onClick={() => {
              setQuery("");
              setActiveType(null);
            }}
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {/* Card grid or empty state */}
      {filtered.length === 0 ? (
        <div className="beta-cat-empty">
          <p className="beta-cat-empty__heading">No specimens match your search</p>
          <p className="beta-cat-empty__note">
            Try broadening your query, or{" "}
            <button
              className="beta-cat-clear beta-cat-clear--inline"
              type="button"
              onClick={() => {
                setQuery("");
                setActiveType(null);
              }}
            >
              clear all filters
            </button>{" "}
            to browse the full field guide.
          </p>
        </div>
      ) : (
        <div className="beta-catalogue-grid">
          {filtered.map((plant) => (
            <CatalogCard
              activeBed={activeBed}
              addCatalogPlantToBed={addCatalogPlantToBed}
              key={plant.slug}
              plant={plant}
              saveWishlist={saveWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
