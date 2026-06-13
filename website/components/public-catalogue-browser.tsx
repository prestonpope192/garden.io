"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FieldIcon } from "@/components/field-icons";
import { MarginNote, PlateCard, SpecimenLabel } from "@/components/journal-primitives";
import type { GardenPlantProfile } from "@/lib/garden-app-types";
import {
  catalogueCategoryMatches,
  filterCatalogueProfiles,
  formatCatalogueValue,
  formatInchesRange,
  getProfileIllustration,
  getProfileTags,
  getRating,
  getUseLabels
} from "@/lib/catalogue-format";

type PublicCatalogueBrowserProps = {
  plantProfiles: GardenPlantProfile[];
};

type CatalogueCategory = {
  label: string;
  value: string;
  description: string;
};

const categories: CatalogueCategory[] = [
  { label: "All", value: "all", description: "Full public starter collection" },
  { label: "Herbs", value: "herb", description: "Kitchen, pollinator, and companion herbs" },
  { label: "Fruit", value: "fruit", description: "Perennial and seasonal fruiting plants" },
  { label: "Vegetables", value: "vegetable", description: "Annual crops and bed staples" },
  { label: "Flowers", value: "flower", description: "Pollinator and seasonal bloom support" },
  { label: "Perennials", value: "perennial", description: "Long-horizon plants for repeat care" }
];

function getFeaturedProfile(plantProfiles: GardenPlantProfile[]) {
  return plantProfiles.find((plant) => plant.slug === "dill") ?? plantProfiles[0] ?? null;
}

export function PublicCatalogueBrowser({ plantProfiles }: PublicCatalogueBrowserProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [previewSlug, setPreviewSlug] = useState(getFeaturedProfile(plantProfiles)?.slug ?? "");

  const filteredProfiles = useMemo(() => {
    return filterCatalogueProfiles(plantProfiles, query, activeCategory);
  }, [activeCategory, plantProfiles, query]);

  const previewProfile =
    filteredProfiles.find((profile) => profile.slug === previewSlug) ??
    filteredProfiles[0] ??
    getFeaturedProfile(plantProfiles);

  const visibleCategories = categories.map((category) => ({
    ...category,
    count: plantProfiles.filter((profile) => catalogueCategoryMatches(profile, category.value)).length
  }));

  return (
    <>
      <section className="cover-sheet public-catalogue-hero">
        <div className="cover-sheet__copy">
          <div className="public-catalogue-hero__folio">
            <SpecimenLabel tone="olive">Public plant catalogue</SpecimenLabel>
            <span>Folio 04 · Search index</span>
          </div>
          <h1>Plant Catalogue</h1>
          <p className="lead">
            A searchable field guide for checking plant fit, growing conditions, and useful garden roles before anything goes into a bed.
          </p>

          <div className="public-catalogue-search" role="search">
            <label className="sr-only" htmlFor="catalogue-search">
              Search public plant catalogue
            </label>
            <FieldIcon className="field-icon" name="journal" />
            <input
              id="catalogue-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search plants, shade, pollinators..."
            />
          </div>

          <div className="public-catalogue-index-tabs" aria-label="Catalogue groups">
            {visibleCategories.map((category) => (
              <button
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

          <div className="public-catalogue-hero__meta" aria-label="Catalogue summary">
            <div>
              <strong>{plantProfiles.length}</strong>
              <span>published profiles</span>
            </div>
            <div>
              <strong>{visibleCategories.filter((category) => category.count > 0).length - 1}</strong>
              <span>browsing groups</span>
            </div>
            <div>
              <strong>Read-only</strong>
              <span>public field guide</span>
            </div>
          </div>
        </div>

        <div className="cover-sheet__aside">
          {previewProfile ? (
            <PlateCard
              plateNumber="41"
              subtitle={`${previewProfile.botanical_name_full} · ${previewProfile.family_name ?? "Plant profile"}`}
              title={previewProfile.display_name}
              illustration={
                <Image
                  alt={`${previewProfile.display_name} specimen illustration.`}
                  className="specimen-art"
                  height={420}
                  priority
                  src={getProfileIllustration(previewProfile)}
                  width={340}
                />
              }
            >
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
                  <dd>{previewProfile.soil_texture_summary ?? previewProfile.drainage_requirement ?? "Soil TBD"}</dd>
                </div>
              </dl>
              <div className="catalogue-plate-note">
                <span>Selected specimen</span>
                <strong>
                  {formatCatalogueValue(previewProfile.lifecycle_type)} · {formatCatalogueValue(previewProfile.plant_type_code)}
                </strong>
              </div>
              <Link className="folio-link" href={`/catalog/${previewProfile.slug}`}>
                Open field guide
              </Link>
            </PlateCard>
          ) : null}
        </div>
      </section>

      <section className="section-card public-catalogue-workbench" id="browse">
        <aside className="public-catalogue-filters" aria-label="Catalogue filters">
          <SpecimenLabel tone="clay">Botanical index</SpecimenLabel>
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

          <MarginNote icon="sprout" title="Public access">
            <p>Visitors can search and read. Wishlist and add-to-property actions become available inside Garden.io.</p>
          </MarginNote>
        </aside>

        <div className="public-catalogue-results">
          <div className="public-catalogue-results__header">
            <div>
              <SpecimenLabel tone="olive">Specimen index</SpecimenLabel>
              <h2>{filteredProfiles.length === 1 ? "1 matching plant" : `${filteredProfiles.length} matching plants`}</h2>
            </div>
            {(query || activeCategory !== "all") ? (
              <button
                className="folio-button"
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("all");
                }}
              >
                Clear filters
              </button>
            ) : null}
          </div>

          {filteredProfiles.length ? (
            <div className="public-catalogue-list">
              {filteredProfiles.map((plant, index) => {
                const containerRating = getRating(plant, "container_suitability");
                const uses = getUseLabels(plant);
                const plateNumber = String(index + 1).padStart(2, "0");

                return (
                  <article
                    className={previewProfile?.slug === plant.slug ? "public-catalogue-row is-previewed" : "public-catalogue-row"}
                    key={plant.slug}
                  >
                    <button
                      aria-label={`Preview ${plant.display_name}`}
                      className="public-catalogue-row__preview"
                      type="button"
                      onClick={() => setPreviewSlug(plant.slug)}
                    >
                      <Image
                        alt=""
                        className="specimen-art specimen-art--small"
                        height={180}
                        priority={index < 4}
                        src={getProfileIllustration(plant)}
                        width={140}
                      />
                    </button>
                    <div className="public-catalogue-row__body">
                      <div className="public-catalogue-row__folio" aria-label={`Catalogue plate ${plateNumber}`}>
                        <span>Plate {plateNumber}</span>
                        <span>
                          {formatCatalogueValue(plant.lifecycle_type)} · {formatCatalogueValue(plant.plant_type_code)}
                        </span>
                      </div>
                      <div className="public-catalogue-row__title">
                        <div>
                          <h3>{plant.display_name}</h3>
                          <p className="public-catalogue-row__taxonomy">
                            <em>{plant.botanical_name_full}</em>
                            <span>{plant.family_name ?? formatCatalogueValue(plant.plant_type_code)}</span>
                          </p>
                        </div>
                        <Link className="folio-link folio-link--small" href={`/catalog/${plant.slug}`}>
                          Details
                        </Link>
                      </div>

                      <p>{plant.short_description ?? plant.why_plant_it ?? "Profile summary pending."}</p>

                      <dl className="public-catalogue-metrics">
                        <div>
                          <dt>Sun</dt>
                          <dd>{formatCatalogueValue(plant.preferred_light)}</dd>
                        </div>
                        <div>
                          <dt>Water</dt>
                          <dd>{formatCatalogueValue(plant.water_need_level)}</dd>
                        </div>
                        <div>
                          <dt>Height</dt>
                          <dd>{formatInchesRange(plant.mature_height_min_in, plant.mature_height_max_in)}</dd>
                        </div>
                        <div>
                          <dt>Container</dt>
                          <dd>{containerRating?.rating ? `${containerRating.rating}/5` : "TBD"}</dd>
                        </div>
                      </dl>

                      <div className="catalog-tags">
                        {[...getProfileTags(plant), ...uses].slice(0, 6).map((tag) => (
                          <span className="catalog-tag" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="public-catalogue-empty">
              <SpecimenLabel tone="clay">No exact match</SpecimenLabel>
              <h3>No exact match found. Try related terms or clear filters.</h3>
              <p>Public visitors can keep browsing the starter collection. AI-generated entries are reserved for paid in-app accounts.</p>
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

        <aside className="public-catalogue-preview" aria-label="Selected plant preview">
          {previewProfile ? (
            <>
              <SpecimenLabel tone="olive">Margin record</SpecimenLabel>
              <h2>{previewProfile.display_name}</h2>
              <p>{previewProfile.why_plant_it ?? previewProfile.short_description ?? "This public profile is ready for review."}</p>
              <dl className="detail-list">
                <div className="detail-list__row">
                  <dt>Lifecycle</dt>
                  <dd>{formatCatalogueValue(previewProfile.lifecycle_type)}</dd>
                </div>
                <div className="detail-list__row">
                  <dt>Type</dt>
                  <dd>{formatCatalogueValue(previewProfile.plant_type_code)}</dd>
                </div>
                <div className="detail-list__row">
                  <dt>Soil</dt>
                  <dd>{previewProfile.soil_texture_summary ?? previewProfile.drainage_requirement ?? "TBD"}</dd>
                </div>
              </dl>
              <Link className="folio-link" href={`/catalog/${previewProfile.slug}`}>
                Read profile
              </Link>
            </>
          ) : null}
        </aside>
      </section>
    </>
  );
}
