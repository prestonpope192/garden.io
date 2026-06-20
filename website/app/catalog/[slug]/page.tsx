import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FieldIcon } from "@/components/field-icons";
import { MarginNote, PlateCard, SpecimenLabel } from "@/components/journal-primitives";
import {
  formatCatalogueValue,
  formatInchesRange,
  getPropagationLabels,
  getProfileIllustration,
  getProfileTags,
  getRating,
  getUseLabels
} from "@/lib/catalogue-format";
import type { GardenPlantProfile } from "@/lib/garden-app-types";
import { getPlantProfiles } from "@/lib/plant-profile-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function formatConfidenceScore(score: GardenPlantProfile["confidence_score"]) {
  if (score === null || score === undefined || score === "") return "Not scored";

  const numericScore = Number(score);
  if (Number.isFinite(numericScore)) {
    if (numericScore >= 0 && numericScore <= 1) return `${Math.round(numericScore * 100)}%`;
    return `${Math.round(numericScore)}%`;
  }

  return String(score);
}

function getRecordStatus(plant: GardenPlantProfile) {
  if (plant.human_verified) return "Human verified";
  if (plant.review_status) return formatCatalogueValue(plant.review_status);
  if (plant.generation_status) return formatCatalogueValue(plant.generation_status);
  return "Public profile";
}

function getSourceSummary(plant: GardenPlantProfile) {
  const sourceCount = typeof plant.source_count === "number" ? `${plant.source_count} source${plant.source_count === 1 ? "" : "s"}` : null;
  const evidenceCount =
    typeof plant.evidence_count === "number" ? `${plant.evidence_count} evidence point${plant.evidence_count === 1 ? "" : "s"}` : null;

  return [sourceCount, evidenceCount].filter(Boolean).join(" · ") || "Source detail pending";
}

export default async function PublicPlantDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [plant] = await getPlantProfiles(slug);

  if (!plant || !plant.is_published) {
    notFound();
  }

  const containerRating = getRating(plant, "container_suitability");
  const pollinatorRating = getRating(plant, "pollinator_value");
  const maintenanceRating = getRating(plant, "maintenance_need");
  const propagationLabels = getPropagationLabels(plant);
  const useLabels = getUseLabels(plant);
  const profileTags = getProfileTags(plant);
  const cultivarOverrides = plant.cultivar_overrides ?? [];
  const recordStatus = getRecordStatus(plant);
  const confidenceScore = formatConfidenceScore(plant.confidence_score);
  const sourceSummary = getSourceSummary(plant);

  return (
    <main className="site site--marketing">
      <header className="topbar">
        <div className="topbar__brand">
          <Link className="brand" href="/">
            Garden.io
          </Link>
        </div>

        <nav aria-label="Primary" className="topnav">
          <Link href="/catalog">Plant Catalogue</Link>
          <Link href="/app/my-property">App</Link>
        </nav>

        <div className="topbar__actions">
          <Link className="topbar-secondary" href="/catalog">
            Back to Catalog
          </Link>
          <Link className="topbar-cta" href="/#join">
            Join Waitlist
          </Link>
        </div>
      </header>

      <section className="cover-sheet plant-profile-hero">
        <div className="cover-sheet__copy">
          <div className="public-catalogue-hero__folio">
            <SpecimenLabel tone="olive">Public plant profile</SpecimenLabel>
            <span>Specimen sheet · {recordStatus}</span>
          </div>
          <h1>{plant.display_name}</h1>
          <p className="lead">
            <em>{plant.botanical_name_full}</em> · {plant.family_name ?? plant.plant_type_code}
            {plant.cultivar_name ? ` · ${plant.cultivar_name} cultivar` : ""}
          </p>
          <p>{plant.short_description ?? plant.why_plant_it ?? "No summary yet."}</p>

          <div className="cover-sheet__actions">
            <Link className="folio-link" href="/catalog">
              Browse catalogue
            </Link>
            <Link className="folio-link folio-link--secondary" href="/#join">
              Get launch access
            </Link>
          </div>

          <div className="catalog-tags">
            {profileTags.map((tag) => (
              <span className="catalog-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className="plant-profile-record-strip" aria-label="Profile record status">
            <div>
              <span>Record</span>
              <strong>{recordStatus}</strong>
            </div>
            <div>
              <span>Confidence</span>
              <strong>{confidenceScore}</strong>
            </div>
            <div>
              <span>Evidence</span>
              <strong>{sourceSummary}</strong>
            </div>
          </div>

          <div className="plant-profile-hero__facts" aria-label="Plant quick facts">
            <div>
              <span>Sun</span>
              <strong>{formatCatalogueValue(plant.preferred_light)}</strong>
            </div>
            <div>
              <span>Water</span>
              <strong>{formatCatalogueValue(plant.water_need_level)}</strong>
            </div>
            <div>
              <span>Height</span>
              <strong>{formatInchesRange(plant.mature_height_min_in, plant.mature_height_max_in)}</strong>
            </div>
          </div>
        </div>

        <div className="cover-sheet__aside">
          <PlateCard
            plateNumber="41"
            subtitle={`${plant.botanical_name_full} · ${plant.family_name ?? "Plant profile"}`}
            title={plant.display_name}
            illustration={
              <>
                <Image alt={plant.display_name} className="specimen-art" height={420} priority src={getProfileIllustration(plant)} width={340} />
                {plant.image_attribution ? (
                  <p className="specimen-art__credit">Illustration · {plant.image_attribution}</p>
                ) : null}
              </>
            }
          >
            <dl className="detail-list">
              <div className="detail-list__row">
                <dt>
                  <FieldIcon className="field-icon" name="sun" />
                  Sun
                </dt>
                <dd>{formatCatalogueValue(plant.preferred_light)}</dd>
              </div>
              <div className="detail-list__row">
                <dt>
                  <FieldIcon className="field-icon" name="water" />
                  Water
                </dt>
                <dd>{formatCatalogueValue(plant.water_need_level)}</dd>
              </div>
              <div className="detail-list__row">
                <dt>
                  <FieldIcon className="field-icon" name="soil" />
                  Soil
                </dt>
                <dd>{plant.soil_texture_summary ?? plant.drainage_requirement ?? "Soil TBD"}</dd>
              </div>
            </dl>
            <div className="catalogue-plate-note">
              <span>Profile origin</span>
              <strong>{recordStatus}</strong>
            </div>
          </PlateCard>
        </div>
      </section>

      <section className="section-card plant-profile-guide">
        <aside className="plant-profile-nav" aria-label="Plant profile sections">
          <SpecimenLabel tone="clay">Field guide</SpecimenLabel>
          <a href="#quick-facts">Quick facts</a>
          <a href="#requirements">Growing requirements</a>
          <a href="#lifecycle">Lifecycle sheet</a>
          <a href="#fit">Where it fits</a>
          <a href="#community">Community notes</a>
        </aside>

        <div className="plant-profile-main">
          <section className="plant-profile-section" id="quick-facts">
            <div className="plant-profile-section__header">
              <SpecimenLabel tone="olive">Quick facts</SpecimenLabel>
              <h2>Scan the plant before you commit bed space.</h2>
            </div>
            <div className="plant-detail-facts">
              <article className="plant-detail-fact">
                <FieldIcon className="field-icon" name="sun" />
                <span>Sun</span>
                <strong>{formatCatalogueValue(plant.preferred_light)}</strong>
              </article>
              <article className="plant-detail-fact">
                <FieldIcon className="field-icon" name="water" />
                <span>Water</span>
                <strong>{formatCatalogueValue(plant.water_need_level)}</strong>
              </article>
              <article className="plant-detail-fact">
                <FieldIcon className="field-icon" name="soil" />
                <span>Soil</span>
                <strong>{plant.soil_texture_summary ?? plant.drainage_requirement ?? "TBD"}</strong>
              </article>
              <article className="plant-detail-fact">
                <FieldIcon className="field-icon" name="leaf" />
                <span>Mature height</span>
                <strong>{formatInchesRange(plant.mature_height_min_in, plant.mature_height_max_in)}</strong>
              </article>
            </div>
          </section>

          <section className="plant-profile-section" id="requirements">
            <div className="plant-profile-section__header">
              <SpecimenLabel tone="olive">Growing requirements</SpecimenLabel>
              <h2>Practical conditions and planting methods.</h2>
            </div>
            <div className="plant-requirements-grid">
              <dl className="detail-list plant-requirements-list">
                <div className="detail-list__row">
                  <dt>Lifecycle</dt>
                  <dd>{formatCatalogueValue(plant.lifecycle_type)}</dd>
                </div>
                <div className="detail-list__row">
                  <dt>Growth habit</dt>
                  <dd>{formatCatalogueValue(plant.growth_habit)}</dd>
                </div>
                <div className="detail-list__row">
                  <dt>Growth rate</dt>
                  <dd>{formatCatalogueValue(plant.growth_rate_code)}</dd>
                </div>
                <div className="detail-list__row">
                  <dt>Drainage</dt>
                  <dd>{plant.drainage_requirement ?? "TBD"}</dd>
                </div>
                <div className="detail-list__row">
                  <dt>Fertility</dt>
                  <dd>{formatCatalogueValue(plant.fertility_need)}</dd>
                </div>
                <div className="detail-list__row">
                  <dt>Spread</dt>
                  <dd>{formatInchesRange(plant.mature_width_min_in, plant.mature_width_max_in)}</dd>
                </div>
              </dl>

              <article className="paper-panel paper-panel--muted">
                <SpecimenLabel tone="clay">Planting methods</SpecimenLabel>
                {propagationLabels.length ? (
                  <div className="catalog-tags">
                    {propagationLabels.map((label) => (
                      <span className="catalog-tag" key={label}>
                        {label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>Planting method guidance is pending for this entry.</p>
                )}
              </article>
            </div>
          </section>

          <section className="plant-profile-section plant-profile-section--sheet" id="lifecycle">
            <div className="plant-profile-section__header">
              <SpecimenLabel tone="olive">Lifecycle sheet</SpecimenLabel>
              <h2>How this plant behaves through the garden record.</h2>
            </div>
            <div className="plant-lifecycle-sheet">
              <article>
                <span>01</span>
                <strong>Lifecycle</strong>
                <p>{formatCatalogueValue(plant.lifecycle_type)}</p>
              </article>
              <article>
                <span>02</span>
                <strong>Habit</strong>
                <p>{formatCatalogueValue(plant.growth_habit)}</p>
              </article>
              <article>
                <span>03</span>
                <strong>Propagation</strong>
                <p>{propagationLabels.length ? propagationLabels.join(", ") : "Method guidance pending"}</p>
              </article>
              <article>
                <span>04</span>
                <strong>Garden role</strong>
                <p>{useLabels.length ? useLabels.join(", ") : plant.primary_use_cases ?? "Use case pending"}</p>
              </article>
            </div>
          </section>

          <section className="plant-profile-section" id="fit">
            <div className="plant-profile-section__header">
              <SpecimenLabel tone="olive">Where it fits</SpecimenLabel>
              <h2>{plant.primary_use_cases ?? "Fit notes pending"}</h2>
            </div>
            <div className="section-card__split section-card__split--tight">
              <article className="paper-panel">
                <h3>Garden fit</h3>
                <p>
                  {plant.notes_for_small_garden ??
                    plant.notes_for_homestead ??
                    "This public profile helps growers evaluate plant fit before organizing a property, zone, or bed."}
                </p>
                {useLabels.length ? (
                  <div className="catalog-tags">
                    {useLabels.map((label) => (
                      <span className="catalog-tag" key={label}>
                        {label}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>

              <article className="paper-panel paper-panel--muted">
                <h3>Cultivar notes</h3>
                <p>{plant.cultivar_description ?? plant.why_plant_it ?? plant.short_description ?? "No cultivar notes yet."}</p>
                {cultivarOverrides.length ? (
                  <p className="plant-profile-fineprint">{cultivarOverrides.length} cultivar-specific overrides are attached to this profile.</p>
                ) : null}
              </article>
            </div>
          </section>

          <section className="plant-profile-section" id="community">
            <div className="plant-profile-section__header">
              <SpecimenLabel tone="olive">Community notes</SpecimenLabel>
              <h2>Public reading stays broad; participation happens in-app.</h2>
            </div>
            <div className="feature-grid">
              <article className="feature-card">
                <strong>Container fit</strong>
                <p>{containerRating ? `${containerRating.rating ?? "TBD"}/5 · ${containerRating.description ?? "No note yet."}` : "Not rated yet."}</p>
              </article>
              <article className="feature-card">
                <strong>Pollinator value</strong>
                <p>{pollinatorRating ? `${pollinatorRating.rating ?? "TBD"}/5 · ${pollinatorRating.description ?? "No note yet."}` : "Not rated yet."}</p>
              </article>
              <article className="feature-card">
                <strong>Care load</strong>
                <p>{maintenanceRating ? `${maintenanceRating.rating ?? "TBD"}/5 · ${maintenanceRating.description ?? "No note yet."}` : "Not rated yet."}</p>
              </article>
            </div>
          </section>
        </div>

        <aside className="plant-profile-aside">
          <MarginNote icon="journal" title="Record quality">
            <dl className="plant-profile-aside-list">
              <div>
                <dt>Status</dt>
                <dd>{recordStatus}</dd>
              </div>
              <div>
                <dt>Confidence</dt>
                <dd>{confidenceScore}</dd>
              </div>
              <div>
                <dt>Sources</dt>
                <dd>{sourceSummary}</dd>
              </div>
            </dl>
          </MarginNote>
          <MarginNote icon="sprout" title="Save it in Garden.io">
            <p>Inside the app, this profile can become a wishlist plant or move into a specific zone and bed.</p>
            <Link className="folio-link folio-link--small" href="/#join">
              Join waitlist
            </Link>
          </MarginNote>
        </aside>
      </section>
    </main>
  );
}
