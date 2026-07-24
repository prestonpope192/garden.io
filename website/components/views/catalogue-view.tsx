"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { SpecimenLabel } from "@/components/journal-primitives";
import type {
  GardenBed,
  GardenPlantProfile
} from "@/lib/garden-app-types";
import { getJournalStylePlantImageUrl } from "@/lib/plant-images";
import {
  formatCatalogueValue,
  formatPlantTypeLabel,
  getCultivarLabel,
  getRating,
  hasRatingContent,
  hasKnownCatalogueValue,
  getUseLabels
} from "./shared";

// How many catalogue cards mount per "Show more" step. The full catalogue is
// 1,000+ profiles; mounting them all at once makes the page unusable on phones.
const CATALOGUE_PAGE_SIZE = 48;

export type CatalogueViewProps = {
  activeBed: GardenBed | null;
  plantProfiles: GardenPlantProfile[];
  addCatalogPlantToBed: (slug: string) => Promise<void>;
  saveWishlist: (slug: string) => Promise<void>;
  isReadOnly?: boolean;
};

const CARE_SUMMARY_FALLBACK = "Start with light, water, and room before choosing a spot.";

function ratingWord(n: number): string {
  if (n >= 4) return "High";
  if (n >= 3) return "Good";
  if (n >= 2) return "Moderate";
  return "Low";
}
const FIT_SUMMARY_FALLBACK = "Look for the right light, water, and room.";

function firstPlainSentence(value: string | null | undefined, maxLength = 96) {
  const cleaned = value
    ?.replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "";

  const firstSegment = cleaned.split(/[.;]/)[0]?.trim() || cleaned;
  if (firstSegment.length <= maxLength) return firstSegment.replace(/[.!?]?$/, ".");
  return `${firstSegment.slice(0, maxLength).trim().replace(/[,\s]+$/, "")}...`;
}

function getFitNote(plant: GardenPlantProfile, useLabels: string[]) {
  const source = plant.notes_for_small_garden ?? (useLabels.length ? useLabels.join(", ") : FIT_SUMMARY_FALLBACK);
  const lower = source.toLowerCase();

  if (lower.includes("compact size") || lower.includes("small spaces")) {
    return "Small beds, edges, and containers.";
  }

  return firstPlainSentence(source) || FIT_SUMMARY_FALLBACK;
}

function getWatchNote(plant: GardenPlantProfile) {
  const plantType = plant.plant_type_code.toLowerCase();

  if (plantType === "herb") {
    return "Harvest timing, heat stress, and flavor.";
  }

  if (plantType === "vine" || plantType === "vegetable" || plantType === "fruit") {
    return "Watering, support, harvest, and pests.";
  }

  if (plantType === "forb" || plantType === "flower") {
    return "Bloom timing, pollinator visits, and deadheading.";
  }

  return firstPlainSentence(plant.short_description ?? plant.why_plant_it) || CARE_SUMMARY_FALLBACK;
}

function typeLabel(code: string): string {
  const map: Record<string, string> = {
    forb: "Flowers",
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
  return map[code] ?? formatPlantTypeLabel(code);
}

function buildTypeChips(profiles: GardenPlantProfile[]): Array<{ code: string; label: string; count: number }> {
  const counts: Record<string, number> = {};
  for (const p of profiles) {
    counts[p.plant_type_code] = (counts[p.plant_type_code] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([code, count]) => ({ code, label: typeLabel(code), count }));
}

function FieldNotes({ plant }: { plant: GardenPlantProfile }) {
  const overrides = plant.cultivar_overrides ?? [];
  const hasSoil = plant.drainage_requirement || plant.soil_texture_summary;
  const hasSmallGarden = Boolean(plant.notes_for_small_garden);
  const hasHomestead = Boolean(plant.notes_for_homestead);
  const useLabels = getUseLabels(plant);

  return (
    <div className="garden-cat-field-notes">
      {plant.why_plant_it ? (
        <div className="garden-cat-field-notes__section">
          <span className="garden-cat-field-notes__label">Why grow it</span>
          <p>{plant.why_plant_it}</p>
        </div>
      ) : null}

      {plant.primary_use_cases ? (
        <div className="garden-cat-field-notes__section">
          <span className="garden-cat-field-notes__label">Best for</span>
          <p>{useLabels.join(", ")}</p>
        </div>
      ) : null}

      {hasSoil ? (
        <div className="garden-cat-field-notes__section">
          <span className="garden-cat-field-notes__label">Soil &amp; drainage</span>
          {plant.drainage_requirement ? (
            <p>
              <strong>Drainage:</strong> {formatCatalogueValue(plant.drainage_requirement)}
            </p>
          ) : null}
          {plant.soil_texture_summary ? <p>{plant.soil_texture_summary}</p> : null}
        </div>
      ) : null}

      {hasSmallGarden ? (
        <div className="garden-cat-field-notes__section">
          <span className="garden-cat-field-notes__label">Small garden notes</span>
          <p>{plant.notes_for_small_garden}</p>
        </div>
      ) : null}

      {hasHomestead ? (
        <div className="garden-cat-field-notes__section">
          <span className="garden-cat-field-notes__label">Homestead notes</span>
          <p>{plant.notes_for_homestead}</p>
        </div>
      ) : null}

      {overrides.length > 0 ? (
        <div className="garden-cat-field-notes__section">
          <span className="garden-cat-field-notes__label">Variety notes</span>
          <ul className="garden-cat-overrides-list">
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

function CatalogCard({
  plant,
  activeBed,
  addCatalogPlantToBed,
  saveWishlist,
  isReadOnly = false,
}: {
  plant: GardenPlantProfile;
  activeBed: GardenBed | null;
  addCatalogPlantToBed: (slug: string) => Promise<void>;
  saveWishlist: (slug: string) => Promise<void>;
  isReadOnly?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const photoUrl = getJournalStylePlantImageUrl(plant.primary_image_url);

  const containerRating = getRating(plant, "container_suitability");
  const pollinatorRating = getRating(plant, "pollinator_value");
  const maintenanceRating = getRating(plant, "maintenance_need");
  const useLabels = getUseLabels(plant);
  const fitNote = getFitNote(plant, useLabels);
  const watchNote = getWatchNote(plant);
  const careRatings = [
    {
      label: "Containers",
      rating: containerRating
    },
    {
      label: "Pollinators",
      rating: pollinatorRating
    },
    {
      label: "Care needs",
      rating: maintenanceRating
    }
  ].filter((item) => hasRatingContent(item.rating));

  const hasFieldNotes =
    Boolean(plant.why_plant_it) ||
    Boolean(plant.primary_use_cases) ||
    Boolean(plant.drainage_requirement) ||
    Boolean(plant.soil_texture_summary) ||
    Boolean(plant.notes_for_small_garden) ||
    Boolean(plant.notes_for_homestead) ||
    (plant.cultivar_overrides?.length ?? 0) > 0;

  return (
    <article className="garden-catalogue-card" key={plant.slug}>
      {photoUrl ? (
        <div className="garden-cat-card__image-col">
          <Image
            alt={plant.display_name}
            className="catalogue-photo catalogue-photo--small"
            height={220}
            src={photoUrl}
            width={180}
          />
        </div>
      ) : (
        <div aria-hidden="true" className="garden-cat-card__image-col">
          <div className="garden-cat-card__placeholder">
            <span>{plant.display_name.trim().charAt(0).toUpperCase() || "?"}</span>
          </div>
        </div>
      )}
      <div className="garden-cat-card__body">
        <SpecimenLabel tone="clay">
          {hasKnownCatalogueValue(plant.lifecycle_type)
            ? formatCatalogueValue(plant.lifecycle_type)
            : formatPlantTypeLabel(plant.plant_type_code)}
        </SpecimenLabel>
        <div className="garden-catalogue-card__heading">
          <h2>{plant.display_name}</h2>
          <span>{getCultivarLabel(plant)}</span>
        </div>

        <dl aria-label={`${plant.display_name} planting notes`} className="detail-list garden-cat-fit-list">
          <div className="detail-list__row garden-cat-fit-list__spot">
            <dt>Best spot</dt>
            <dd>{fitNote}</dd>
          </div>
          <div className="detail-list__row">
            <dt>Sun</dt>
            <dd>{formatCatalogueValue(plant.preferred_light)}</dd>
          </div>
          <div className="detail-list__row">
            <dt>Water</dt>
            <dd>{formatCatalogueValue(plant.water_need_level)}</dd>
          </div>
          <div className="detail-list__row garden-cat-fit-list__memory">
            <dt>Good to remember</dt>
            <dd>{watchNote}</dd>
          </div>
        </dl>

        {careRatings.length ? (
          <div className="garden-catalogue-metrics" aria-label={`${plant.display_name} planting basics`}>
            {careRatings.map((item) => (
              <span key={item.label}>
                {item.label}{" "}
                {item.rating?.rating
                  ? `${ratingWord(Number(item.rating.rating))} (${item.rating.rating}/5)`
                  : item.rating?.description}
              </span>
            ))}
          </div>
        ) : null}

        {hasFieldNotes && !isReadOnly ? (
          <div className="garden-cat-expand">
            <button
              aria-expanded={expanded}
              className="garden-cat-expand__toggle"
              type="button"
              onClick={() => setExpanded((v) => !v)}
            >
              <span className="garden-cat-expand__icon" aria-hidden="true">
                {expanded ? "−" : "+"}
              </span>
              Field notes
            </button>
            {expanded ? (
              <div className="garden-cat-expand__panel">
                <FieldNotes plant={plant} />
              </div>
            ) : null}
          </div>
        ) : null}

        {isReadOnly ? null : (
          <div className="garden-card-actions">
            <button
              className="button"
              type="button"
              disabled={!activeBed}
              title={!activeBed ? "Select a bed in My Garden first" : undefined}
              onClick={() => addCatalogPlantToBed(plant.slug)}
            >
              Plant in {activeBed?.name ?? "a bed"}
            </button>
            <button
              className="folio-button"
              type="button"
              onClick={() => saveWishlist(plant.slug)}
            >
              Add to plants to try
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export function CatalogueView({
  activeBed,
  plantProfiles,
  addCatalogPlantToBed,
  saveWishlist,
  isReadOnly = false,
}: CatalogueViewProps) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(CATALOGUE_PAGE_SIZE);

  // A fresh search or kind filter restarts the visible window.
  useEffect(() => {
    setVisibleCount(CATALOGUE_PAGE_SIZE);
  }, [query, activeType]);

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

    return [...result].sort((a, b) => a.display_name.localeCompare(b.display_name));
  }, [plantProfiles, query, activeType]);

  const hasFilters = Boolean(query.trim()) || activeType !== null;
  const activeTypeLabel = activeType
    ? typeChips.find((chip) => chip.code === activeType)?.label ?? "Selected kind"
    : "Every kind";
  const clearFilters = () => {
    setQuery("");
    setActiveType(null);
  };

  if (plantProfiles.length === 0) {
    return (
      <section className="garden-panel">
        <SpecimenLabel tone="clay">Choose plants</SpecimenLabel>
        <p className="garden-cat-empty__note">No plants to choose from yet.</p>
      </section>
    );
  }

  return (
    <div className="garden-cat-root">
      <div className="garden-cat-toolbar">
        <div className="garden-cat-search">
          <label className="garden-cat-search__label" htmlFor="cat-search">
            <svg aria-hidden="true" className="garden-cat-search__icon" fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" />
              <line stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" x1="10.5" x2="14.5" y1="10.5" y2="14.5" />
            </svg>
          </label>
          <input
            className="garden-cat-search__input"
            id="cat-search"
            placeholder="Search plants…"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="garden-cat-toolbar__row">
          <p className="garden-cat-filter-summary">
            <span>Showing</span>
            {activeTypeLabel}
          </p>
          {isReadOnly ? null : (
            <div className="garden-cat-toolbar__actions">
              {hasFilters ? (
                <button className="garden-cat-clear" type="button" onClick={clearFilters}>
                  Show every kind
                </button>
              ) : null}
              <button
                aria-expanded={showFilters}
                className="folio-button"
                type="button"
                onClick={() => setShowFilters((value) => !value)}
              >
                {showFilters ? "Hide plant kinds" : "Browse by kind"}
              </button>
            </div>
          )}
        </div>

        {showFilters && !isReadOnly ? (
          <div className="garden-cat-toolbar__controls">
            <div className="garden-cat-type-chips" role="group" aria-label="Plant kinds">
              <button
                aria-pressed={activeType === null}
                className={`garden-cat-chip${activeType === null ? " is-active" : ""}`}
                type="button"
                onClick={() => setActiveType(null)}
              >
                All <small>{plantProfiles.length}</small>
              </button>
              {typeChips.map(({ code, label, count }) => (
                <button
                  aria-pressed={activeType === code}
                  className={`garden-cat-chip${activeType === code ? " is-active" : ""}`}
                  key={code}
                  type="button"
                  onClick={() => setActiveType(activeType === code ? null : code)}
                >
                  {label} <small>{count}</small>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="garden-cat-results-meta">
        <span>
          {filtered.length === plantProfiles.length
            ? `${filtered.length} plant${filtered.length === 1 ? "" : "s"} to choose from`
            : `${filtered.length} of ${plantProfiles.length} plants to choose from`}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="garden-cat-empty">
          <p className="garden-cat-empty__heading">No plants match that search</p>
          <p className="garden-cat-empty__note">
            Try broadening your query, or{" "}
            <button
              className="garden-cat-clear garden-cat-clear--inline"
              type="button"
              onClick={() => {
                setQuery("");
                setActiveType(null);
              }}
            >
              show every kind
            </button>{" "}
            to start over.
          </p>
        </div>
      ) : (
        <>
          <div className="garden-catalogue-grid">
            {filtered.slice(0, visibleCount).map((plant) => (
              <CatalogCard
                activeBed={activeBed}
                addCatalogPlantToBed={addCatalogPlantToBed}
                isReadOnly={isReadOnly}
                key={plant.slug}
                plant={plant}
                saveWishlist={saveWishlist}
              />
            ))}
          </div>
          {filtered.length > visibleCount ? (
            <div className="garden-catalogue-more">
              <button
                className="folio-button"
                type="button"
                onClick={() => setVisibleCount((count) => count + CATALOGUE_PAGE_SIZE)}
              >
                Show more plants
              </button>
              <span>
                Showing {visibleCount} of {filtered.length}
              </span>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
