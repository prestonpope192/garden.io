import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FieldIcon } from "@/components/field-icons";
import { SpecimenLabel } from "@/components/journal-primitives";
import {
  formatCatalogueValue,
  formatInchesRange,
  formatPlantSummaryLine,
  getPropagationLabels,
  getProfileTags,
  getRating,
  hasRatingContent,
  hasKnownCatalogueValue,
  getUseLabels,
  getUseSummary
} from "@/lib/catalogue-format";
import { buildDemoGardenSnapshot } from "@/lib/demo-garden-snapshot";
import type { GardenPlantProfile } from "@/lib/garden-app-types";
import { getRealPlantPhotoUrl } from "@/lib/plant-images";
import { getPlantProfiles } from "@/lib/plant-profile-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CARE_SUMMARY_FALLBACK = "Check light, water, and room before choosing a spot.";
const SOIL_SUMMARY_FALLBACK = "Check drainage and soil before planting.";
const FIT_SUMMARY_FALLBACK = "Start with a spot that matches its light, water, and room needs.";

async function getPublicPlantProfile(slug: string): Promise<GardenPlantProfile | null> {
  try {
    const [plant] = await getPlantProfiles(slug);
    return plant ?? null;
  } catch {
    return buildDemoGardenSnapshot([]).plantProfiles.find((plant) => plant.slug === slug) ?? null;
  }
}

function PlantPhoto({ plant }: { plant: GardenPlantProfile }) {
  const photoUrl = getRealPlantPhotoUrl(plant.primary_image_url);

  if (!photoUrl) {
    return null;
  }

  return (
    <Image
      alt={`${plant.display_name} plant image`}
      className="plant-profile-photo-card__image"
      height={420}
      priority
      src={photoUrl}
      width={340}
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const plant = await getPublicPlantProfile((await params).slug);
  if (!plant || !plant.is_published) return {};
  return {
    title: `${plant.display_name} | Garden.io`,
    description: plant.short_description ?? undefined,
  };
}

export default async function PublicPlantDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plant = await getPublicPlantProfile(slug);

  if (!plant || !plant.is_published) {
    notFound();
  }

  const containerRating = getRating(plant, "container_suitability");
  const pollinatorRating = getRating(plant, "pollinator_value");
  const maintenanceRating = getRating(plant, "maintenance_need");
  const careRatings = [
    {
      label: "Container fit",
      rating: containerRating
    },
    {
      label: "Pollinator value",
      rating: pollinatorRating
    },
    {
      label: "Care load",
      rating: maintenanceRating
    }
  ].filter((item) => hasRatingContent(item.rating));
  const propagationLabels = getPropagationLabels(plant);
  const useLabels = getUseLabels(plant);
  const useSummary = getUseSummary(plant);
  const profileTags = getProfileTags(plant);
  const photoUrl = getRealPlantPhotoUrl(plant.primary_image_url);
  const fitSummary =
    plant.notes_for_small_garden ??
    plant.notes_for_homestead ??
    plant.why_plant_it ??
    plant.short_description ??
    FIT_SUMMARY_FALLBACK;
  const plantDetails = [
    ...(hasKnownCatalogueValue(plant.lifecycle_type)
      ? [
          {
            label: "Grows as",
            value: formatCatalogueValue(plant.lifecycle_type)
          }
        ]
      : []),
    {
      label: "Use it for",
      value: useSummary
    },
    ...(propagationLabels.length
      ? [
          {
            label: "Start from",
            value: propagationLabels.join(", ")
          }
        ]
      : [])
  ];

  return (
    <main className="site site--marketing">
      <header className="topbar">
        <div className="topbar__brand">
          <Link className="brand" href="/">
            Garden.io
          </Link>
        </div>

        <nav aria-label="Primary" className="topnav">
          <Link href="/catalog">Choose plants</Link>
        </nav>

        <div className="topbar__actions">
          <Link className="topbar-cta" href="/app/my-property">
            Start your garden
          </Link>
        </div>
      </header>

      <section className="cover-sheet plant-profile-hero">
        <div className="cover-sheet__copy">
          <div className="public-catalogue-hero__folio">
            <SpecimenLabel tone="olive">Plant note</SpecimenLabel>
            <span>Choose plants</span>
          </div>
          <h1>{plant.display_name}</h1>
          <p className="lead">
            <em>{plant.botanical_name_full}</em>
            {plant.cultivar_name ? ` · ${plant.cultivar_name} cultivar` : ""}
          </p>
          <p>{plant.short_description ?? plant.why_plant_it ?? CARE_SUMMARY_FALLBACK}</p>

          <div className="catalog-tags">
            {profileTags.map((tag) => (
              <span className="catalog-tag" key={tag}>
                {tag}
              </span>
            ))}
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
          <article className="plant-profile-photo-card">
            {photoUrl ? (
              <div className="plant-profile-photo-card__media">
                <PlantPhoto plant={plant} />
                {plant.image_attribution ? (
                  <p className="plant-profile-photo-card__credit">Image credit · {plant.image_attribution}</p>
                ) : null}
              </div>
            ) : null}
            <div className="plant-profile-photo-card__body">
              <SpecimenLabel tone="clay">At a glance</SpecimenLabel>
              <p>{plant.display_name}</p>
              <p className="plant-profile-photo-card__subtitle">
                {plant.botanical_name_full}
              </p>
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
                  <dd>{plant.soil_texture_summary ?? plant.drainage_requirement ?? SOIL_SUMMARY_FALLBACK}</dd>
                </div>
              </dl>
              <div className="plant-profile-good-to-know">
                <span>Type</span>
                <strong>{formatPlantSummaryLine(plant)}</strong>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section-card plant-profile-simple-guide">
        <div className="plant-profile-main">
          <section className="plant-profile-section" id="fit">
            <div className="plant-profile-section__header">
              <SpecimenLabel tone="olive">Before you plant</SpecimenLabel>
              <h2>Match it to the garden you have.</h2>
              <p>Check sun, water, soil, and room before you plant.</p>
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
                <strong>{plant.soil_texture_summary ?? plant.drainage_requirement ?? SOIL_SUMMARY_FALLBACK}</strong>
              </article>
              <article className="plant-detail-fact">
                <FieldIcon className="field-icon" name="leaf" />
                <span>Height</span>
                <strong>{formatInchesRange(plant.mature_height_min_in, plant.mature_height_max_in)}</strong>
              </article>
            </div>

            <div className="section-card__split section-card__split--tight plant-profile-fit-grid">
              <article className="paper-panel">
                <h3>Where it belongs</h3>
                <p>{fitSummary}</p>
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
                <h3>Plant details</h3>
                <p>Bloom timing, weather shifts, pests, and what helped.</p>
                <dl className="plant-profile-aside-list">
                  {plantDetails.map((item) => (
                    <div key={item.label}>
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </div>

            {careRatings.length ? (
              <div className="plant-profile-care-strip" aria-label="Care fit">
                {careRatings.map((item) => (
                  <span key={item.label}>
                    {item.label}: {item.rating?.rating ? `${item.rating.rating}/5` : item.rating?.description}
                  </span>
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <aside className="plant-profile-aside plant-profile-aside--simple">
          <SpecimenLabel tone="clay">Add it to your garden</SpecimenLabel>
          <h2>Give it a place to grow.</h2>
          <p>Then remember what happened and what helped.</p>
          <div className="cover-sheet__actions">
            <Link className="folio-link" href="/app/my-property">
              Start your garden
            </Link>
            <Link className="folio-link folio-link--secondary" href="/catalog">
              Back to plants
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
