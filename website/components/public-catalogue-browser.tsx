"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FieldIcon } from "@/components/field-icons";
import { SpecimenLabel } from "@/components/journal-primitives";
import type { GardenPlantProfile } from "@/lib/garden-app-types";
import { getJournalStylePlantImageUrl } from "@/lib/plant-images";
import {
  catalogueCategoryMatches,
  filterCatalogueProfiles,
  formatCatalogueValue,
  formatInchesRange,
  formatPlantTypeLabel,
  formatPlantSummaryLine,
  getProfileTags,
  getRating,
  hasRatingContent,
  hasKnownCatalogueValue,
  getUseLabels
} from "@/lib/catalogue-format";

type PublicCatalogueBrowserProps = {
  initialCategory?: string;
  initialQuery?: string;
  plantProfiles: GardenPlantProfile[];
};

type CatalogueCategory = {
  label: string;
  value: string;
  description: string;
};

const categories: CatalogueCategory[] = [
  { label: "All", value: "all", description: "Every plant you can browse" },
  { label: "Herbs", value: "herb", description: "Kitchen, pollinator, and companion herbs" },
  { label: "Fruit", value: "fruit", description: "Berries, trees, and fruiting plants" },
  { label: "Vegetables", value: "vegetable", description: "Annual crops and bed staples" },
  { label: "Flowers", value: "flower", description: "Blooms for pollinators and color" },
  { label: "Perennials", value: "perennial", description: "Plants that return year after year" }
];

const INITIAL_VISIBLE_COUNT = 6;
const CARE_SUMMARY_FALLBACK = "Check light, water, and room before choosing a spot.";
const SOIL_SUMMARY_FALLBACK = "Check drainage and soil before planting.";
const FEATURED_PLANT_SLUGS = ["apple", "borage", "bouquet-dill", "bell-pepper"];

function getFeaturedProfile(plantProfiles: GardenPlantProfile[]) {
  return (
    FEATURED_PLANT_SLUGS.map((slug) =>
      plantProfiles.find((plant) => plant.slug === slug && getJournalStylePlantImageUrl(plant.primary_image_url))
    ).find(Boolean) ??
    plantProfiles.find((plant) => getJournalStylePlantImageUrl(plant.primary_image_url)) ??
    FEATURED_PLANT_SLUGS.map((slug) => plantProfiles.find((plant) => plant.slug === slug)).find(Boolean) ??
    plantProfiles[0] ??
    null
  );
}

function PlantPhoto({
  alt,
  className,
  height,
  onPhotoError,
  photoUrl,
  priority,
  width
}: {
  alt: string;
  className: string;
  height: number;
  onPhotoError?: (photoUrl: string) => void;
  photoUrl: string | null;
  priority?: boolean;
  width: number;
}) {
  if (!photoUrl) {
    return null;
  }

  return (
    <Image
      alt={alt}
      className={className}
      height={height}
      onError={() => onPhotoError?.(photoUrl)}
      priority={priority}
      src={photoUrl}
      width={width}
    />
  );
}

function getCareSummary(plant: GardenPlantProfile) {
  return plant.short_description ?? plant.why_plant_it ?? CARE_SUMMARY_FALLBACK;
}

function getSoilSummary(plant: GardenPlantProfile) {
  return plant.soil_texture_summary ?? plant.drainage_requirement ?? SOIL_SUMMARY_FALLBACK;
}

export function PublicCatalogueBrowser({
  initialCategory = "all",
  initialQuery = "",
  plantProfiles
}: PublicCatalogueBrowserProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(
    categories.some((category) => category.value === initialCategory) ? initialCategory : "all"
  );
  const [previewSlug, setPreviewSlug] = useState(getFeaturedProfile(plantProfiles)?.slug ?? "");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [showFilters, setShowFilters] = useState(false);
  const [failedPhotoUrls, setFailedPhotoUrls] = useState<Set<string>>(() => new Set());

  const markPhotoFailed = useCallback((photoUrl: string) => {
    setFailedPhotoUrls((current) => {
      if (current.has(photoUrl)) {
        return current;
      }

      return new Set(current).add(photoUrl);
    });
  }, []);

  const getUsablePhotoUrl = useCallback(
    (plant: GardenPlantProfile) => {
      const photoUrl = getJournalStylePlantImageUrl(plant.primary_image_url);
      return photoUrl && !failedPhotoUrls.has(photoUrl) ? photoUrl : null;
    },
    [failedPhotoUrls]
  );

  const filteredProfiles = useMemo(() => {
    return filterCatalogueProfiles(plantProfiles, query, activeCategory);
  }, [activeCategory, plantProfiles, query]);

  useEffect(() => {
    if (!filteredProfiles.length) return;
    setPreviewSlug((currentSlug) =>
      filteredProfiles.some((profile) => profile.slug === currentSlug)
        ? currentSlug
        : (getFeaturedProfile(filteredProfiles)?.slug ?? filteredProfiles[0].slug)
    );
  }, [filteredProfiles]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [activeCategory, query]);

  const previewProfile =
    filteredProfiles.find((profile) => profile.slug === previewSlug) ??
    getFeaturedProfile(filteredProfiles) ??
    getFeaturedProfile(plantProfiles);

  const activeCategoryName =
    categories.find((category) => category.value === activeCategory)?.label ?? "plants";
  const hasActiveSearch = Boolean(query.trim());
  const hasFilters = activeCategory !== "all" || hasActiveSearch;
  const showSidePreview = showFilters || hasFilters;
  const showRowTags = showFilters || hasFilters;
  const workbenchMode = showFilters ? "is-filtering" : showSidePreview ? "is-previewing" : "is-simple";
  const previewPhotoUrl = previewProfile ? getUsablePhotoUrl(previewProfile) : null;
  const resultsHeading = hasActiveSearch
    ? `${filteredProfiles.length} ${filteredProfiles.length === 1 ? "plant" : "plants"} for "${query.trim()}"`
    : activeCategory === "all"
      ? `${filteredProfiles.length} ${filteredProfiles.length === 1 ? "plant" : "plants"}`
      : `${filteredProfiles.length} ${activeCategoryName.toLowerCase()} plants`;
  const visibleProfiles = filteredProfiles.slice(0, visibleCount);

  const visibleCategories = categories.map((category) => ({
    ...category,
    count: plantProfiles.filter((profile) => catalogueCategoryMatches(profile, category.value)).length
  }));
  const filterSummary =
    activeCategory === "all" ? "All plant kinds" : activeCategoryName;
  const clearFilters = () => {
    setQuery("");
    setActiveCategory("all");
  };

  return (
    <>
      <section className="cover-sheet public-catalogue-hero">
        <div className="cover-sheet__copy">
          <div className="public-catalogue-hero__folio">
            <SpecimenLabel tone="olive">Plant notes</SpecimenLabel>
            <span>Choose plants</span>
          </div>
          <h1>Choose a plant for the spot you have.</h1>
          <p className="lead">
            Check sun, water, soil, and room before you plant.
          </p>

          <div className="public-catalogue-search" role="search">
            <label className="sr-only" htmlFor="catalogue-search">
              Search plants
            </label>
            <FieldIcon className="field-icon" name="journal" />
            <input
              id="catalogue-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Search plants, shade, pollinators..."
            />
          </div>

          <div className="public-catalogue-filter-summary">
            <p>{filterSummary}</p>
            <div className="public-catalogue-filter-summary__actions">
  {null}
              <button
                aria-expanded={showFilters}
                className="folio-link folio-link--secondary"
                type="button"
                onClick={() => setShowFilters((value) => !value)}
              >
                {showFilters ? "Hide plant kinds" : "Browse by kind"}
              </button>
            </div>
          </div>

          {showFilters ? (
            <div className="public-catalogue-index-tabs" aria-label="Plant kinds">
              {visibleCategories.map((category) => (
                <button
                  aria-pressed={activeCategory === category.value}
                  className={activeCategory === category.value ? "is-active" : ""}
                  key={category.value}
                  type="button"
                  onClick={() => setActiveCategory(category.value)}
                >
                  <span>{category.label}</span>
                  <small>{category.count}</small>
                </button>
              ))}
            </div>
          ) : null}

          <div className="public-catalogue-hero__meta" aria-label="Plant choosing summary">
            <div>
              <strong>{filteredProfiles.length}</strong>
              <span>
                {query || activeCategory !== "all"
                  ? `${filteredProfiles.length === 1 ? "matching plant" : "matching plants"}`
                  : `${filteredProfiles.length === 1 ? "plant" : "plants"} to choose from`}
              </span>
            </div>
            <div>
              <strong>Match the spot</strong>
              <span>sun, water, and room</span>
            </div>
            <div>
              <strong>Good to remember</strong>
              <span>what changed and what helped</span>
            </div>
          </div>
        </div>

        <div className="cover-sheet__aside">
          {previewProfile ? (
            <article className="plant-profile-photo-card public-catalogue-feature-card">
              {previewPhotoUrl ? (
                <div className="plant-profile-photo-card__media">
                  <PlantPhoto
                    alt={`${previewProfile.display_name} plant.`}
                    className="plant-profile-photo-card__image public-catalogue-feature-card__image"
                    height={420}
                    onPhotoError={markPhotoFailed}
                    photoUrl={previewPhotoUrl}
                    priority
                    width={340}
                  />
                  {previewProfile.image_attribution ? (
                    <p className="plant-profile-photo-card__credit">Image credit · {previewProfile.image_attribution}</p>
                  ) : null}
                </div>
              ) : null}
              <div className="plant-profile-photo-card__body">
                <SpecimenLabel tone="clay">Plant note</SpecimenLabel>
                <h2>{previewProfile.display_name}</h2>
                <p className="plant-profile-photo-card__subtitle">
                  <em>{previewProfile.botanical_name_full}</em>
                </p>
                <p>{getCareSummary(previewProfile)}</p>
                <dl className="detail-list">
                  <div className="detail-list__row">
                    <dt>
                      <FieldIcon className="field-icon" name="sun" />
                      Sun
                    </dt>
                    <dd>{formatCatalogueValue(previewProfile.preferred_light)}</dd>
                  </div>
                  <div className="detail-list__row">
                    <dt>
                      <FieldIcon className="field-icon" name="water" />
                      Water
                    </dt>
                    <dd>{formatCatalogueValue(previewProfile.water_need_level)}</dd>
                  </div>
                  <div className="detail-list__row">
                    <dt>
                      <FieldIcon className="field-icon" name="soil" />
                      Soil
                    </dt>
                    <dd>{getSoilSummary(previewProfile)}</dd>
                  </div>
                </dl>
                <div className="plant-profile-good-to-know">
                  <span>Type</span>
                  <strong>{formatPlantSummaryLine(previewProfile)}</strong>
                </div>
                <Link className="folio-link" href={`/catalog/${previewProfile.slug}`}>
                  View plant
                </Link>
              </div>
            </article>
          ) : null}
        </div>
      </section>

      <section className={`section-card public-catalogue-workbench ${workbenchMode}`} id="browse">
        {showFilters ? (
          <aside className="public-catalogue-filters" aria-label="Plant kinds">
            <SpecimenLabel tone="clay">Plant kinds</SpecimenLabel>
            <div className="public-catalogue-filter-list">
              {visibleCategories.map((category) => (
                <button
                  className={activeCategory === category.value ? "is-active" : ""}
                  key={category.value}
                  type="button"
                  onClick={() => setActiveCategory(category.value)}
                >
                  <span>
                    <strong>{category.label}</strong>
                    <small>{category.description}</small>
                  </span>
                  <b>{category.count}</b>
                </button>
              ))}
            </div>
          </aside>
        ) : null}

        <div className="public-catalogue-results">
          <div className="public-catalogue-results__header">
            <div>
              <SpecimenLabel tone="olive">Plants to choose from</SpecimenLabel>
              <h2>{resultsHeading}</h2>
            </div>
            {hasFilters ? (
              <button
                className="folio-button"
                type="button"
                onClick={clearFilters}
              >
                Show every kind
              </button>
            ) : null}
          </div>

          {filteredProfiles.length ? (
            <>
              <div className="public-catalogue-list">
                {visibleProfiles.map((plant, index) => {
                  const containerRating = getRating(plant, "container_suitability");
                  const showContainerRating = hasRatingContent(containerRating);
                  const rowPhotoUrl = getUsablePhotoUrl(plant);
                  const hasPhoto = Boolean(rowPhotoUrl);
                  const uses = showRowTags ? getUseLabels(plant) : [];
                  const heightLabel = formatInchesRange(plant.mature_height_min_in, plant.mature_height_max_in);
                  return (
                    <article
                      className={[
                        "public-catalogue-row",
                        previewProfile?.slug === plant.slug ? "is-previewed" : "",
                        hasPhoto ? "" : "public-catalogue-row--text-only"
                      ].filter(Boolean).join(" ")}
                      key={plant.slug}
                    >
                      {hasPhoto ? (
                        <button
                          aria-label={`See ${plant.display_name} details`}
                          className="public-catalogue-row__preview"
                          type="button"
                          onClick={() => setPreviewSlug(plant.slug)}
                        >
                          <PlantPhoto
                            alt={`${plant.display_name} plant image`}
                            className="public-catalogue-photo public-catalogue-photo--small"
                            height={180}
                            onPhotoError={markPhotoFailed}
                            photoUrl={rowPhotoUrl}
                            priority={index < INITIAL_VISIBLE_COUNT}
                            width={140}
                          />
                        </button>
                      ) : null}
                      <div className="public-catalogue-row__body">
                        <div className="public-catalogue-row__folio" aria-label={`${plant.display_name} basic facts`}>
                          <span>{formatPlantSummaryLine(plant)}</span>
                        </div>
                        <div className="public-catalogue-row__title">
                          <div>
                            <h3>{plant.display_name}</h3>
                            <p className="public-catalogue-row__taxonomy">
                              <em>{plant.botanical_name_full}</em>
                            </p>
                          </div>
                          <Link aria-label={`View ${plant.display_name}`} className="folio-link folio-link--small" href={`/catalog/${plant.slug}`}>
                            View plant
                          </Link>
                        </div>

                        <p>{getCareSummary(plant)}</p>

                        <dl className="public-catalogue-metrics">
                          <div>
                            <dt>Sun</dt>
                            <dd>{formatCatalogueValue(plant.preferred_light)}</dd>
                          </div>
                          <div>
                            <dt>Water</dt>
                            <dd>{formatCatalogueValue(plant.water_need_level)}</dd>
                          </div>
                          {heightLabel === "Not listed" ? null : (
                            <div>
                              <dt>Height</dt>
                              <dd>{heightLabel}</dd>
                            </div>
                          )}
                          {showContainerRating ? (
                            <div>
                              <dt>Container</dt>
                              <dd>{containerRating?.rating ? `${containerRating.rating}/5` : containerRating?.description}</dd>
                            </div>
                          ) : null}
                        </dl>

                        {showRowTags ? (
                          <div className="catalog-tags">
                            {[...getProfileTags(plant), ...uses].slice(0, 6).map((tag) => (
                              <span className="catalog-tag" key={tag}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
              {visibleProfiles.length < filteredProfiles.length ? (
                <div className="public-catalogue-load-more">
                  <p>
                    {visibleProfiles.length} of {filteredProfiles.length} plants in view.
                  </p>
                  <button
                    className="folio-button"
                    type="button"
                    onClick={() => setVisibleCount((count) => count + INITIAL_VISIBLE_COUNT)}
                  >
                    Show more plants
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="public-catalogue-empty">
              <SpecimenLabel tone="clay">No match yet</SpecimenLabel>
              <h3>No exact match found. Try related terms or show every kind.</h3>
              <p>Try a simpler word like herb, shade, pollinator, or container.</p>
              <div className="catalog-tags">
                {["pollinator", "partial shade", "herb", "container"].map((suggestion) => (
                  <button className="catalog-tag" key={suggestion} type="button" onClick={() => setQuery(suggestion)}>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {showSidePreview ? (
          <aside className="public-catalogue-preview" aria-label="Plant notes">
            {previewProfile ? (
              <>
                <SpecimenLabel tone="olive">Plant notes</SpecimenLabel>
                <h2>{previewProfile.display_name}</h2>
                <p>{getCareSummary(previewProfile)}</p>
                <dl className="detail-list">
                  {hasKnownCatalogueValue(previewProfile.lifecycle_type) ? (
                    <div className="detail-list__row">
                      <dt>Grows as</dt>
                      <dd>{formatCatalogueValue(previewProfile.lifecycle_type)}</dd>
                    </div>
                  ) : null}
                  <div className="detail-list__row">
                    <dt>Type</dt>
                    <dd>{formatPlantTypeLabel(previewProfile.plant_type_code)}</dd>
                  </div>
                  <div className="detail-list__row">
                    <dt>Soil</dt>
                    <dd>{getSoilSummary(previewProfile)}</dd>
                  </div>
                </dl>
                <Link className="folio-link" href={`/catalog/${previewProfile.slug}`}>
                  View plant
                </Link>
              </>
            ) : null}
          </aside>
        ) : null}
      </section>
    </>
  );
}
