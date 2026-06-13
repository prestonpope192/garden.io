import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FieldIcon } from "@/components/field-icons";
import { MarginNote, PlateCard, SpecimenLabel } from "@/components/journal-primitives";
import { plantCatalogueEntries } from "@/lib/plant-catalogue-data";
import { WaitlistForm } from "@/components/waitlist-form";

const productPillars = [
  {
    title: "Space-first planning",
    description: "Move through Property, Zone, Bed, and Plant so work always stays tied to place."
  },
  {
    title: "Seasonal memory",
    description: "Keep notes, outcomes, and observations attached to the exact beds and plants where they happened."
  },
  {
    title: "Calm guidance",
    description: "See suggestions in context as part of the workflow instead of relying on disconnected task lists."
  }
];

const productFeatures = [
  {
    href: "/app/my-property",
    title: "My Property",
    summary: "Navigate your land the way it actually exists: Property → Zone → Bed → Plant."
  },
  {
    href: "/app/calendar",
    title: "Calendar",
    summary: "Turn weather, timing windows, and plant context into a calmer weekly planning rhythm."
  },
  {
    href: "/app/my-plants",
    title: "My Plants",
    summary: "Keep active plants, wishlist ideas, and past seasons in one plant memory system."
  },
  {
    href: "/catalog",
    title: "Plant Catalogue",
    summary: "Browse public plant profiles before login, then carry those records into the rest of the app."
  }
];

const audienceProfiles = [
  {
    title: "Multi-bed home growers",
    summary: "You are managing several productive beds and need one place to track what to do, where, and when."
  },
  {
    title: "Homesteaders",
    summary: "You are balancing annuals, perennials, soil work, and longer-term system thinking across seasons."
  },
  {
    title: "Small diversified farms",
    summary: "You need better continuity across beds, timing windows, harvest notes, and recurring seasonal work."
  }
];

const audienceNotFit = [
  "Decorative-only one or two bed users with low planning depth",
  "Windowsill herb users looking for a simple reminder app",
  "Large monocrop operations needing full ERP and compliance suites"
];

const whyCards = [
  {
    label: "For your land",
    note: "See the property structure clearly before the week turns into disconnected tasks."
  },
  {
    label: "For your memory",
    note: "Keep notes, outcomes, and observations tied to the exact plant or bed they belong to."
  },
  {
    label: "For your week",
    note: "Turn timing, weather, and context into calmer next actions that feel grounded in the season."
  }
];

const catalogPreview = plantCatalogueEntries.slice(0, 3);

const faqs = [
  {
    q: "Who is Garden.io built for first?",
    a: "Garden.io is built first for multi-bed home growers and homesteaders who need one calm system for place, timing, and memory."
  },
  {
    q: "Can I use the plant catalogue without logging in?",
    a: "Yes. The public plant catalogue is designed as an open front door so growers can browse profiles before signing up."
  },
  {
    q: "Is this just a task app?",
    a: "No. Tasks are a byproduct of the property record, seasonal timing, and observation history."
  },
  {
    q: "What is included in early access?",
    a: "Core hierarchy navigation, contextual notes, calendar planning surfaces, and guided add flows."
  }
];

export default function HomePage() {
  return (
    <main className="site site--marketing">
      <header className="topbar">
        <div className="topbar__brand">
          <a className="brand" href="#top">
            Garden.io
          </a>
        </div>

        <nav aria-label="Primary" className="topnav">
          <a href="#why">Why</a>
          <a href="#features">Features</a>
          <a href="#audience">Who It&apos;s For</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="topbar__actions">
          <Link className="topbar-secondary" href="/catalog">
            Catalog
          </Link>
          <a className="topbar-cta" href="#join">
            Join Waitlist
          </a>
        </div>
      </header>

      <section className="cover-sheet" id="top">
        <div className="cover-sheet__copy">
          <SpecimenLabel>Plate 001 · Public folio</SpecimenLabel>
          <h1>The living notebook for growers managing real complexity.</h1>
          <p className="lead">
            Garden.io turns land, timing, and plant memory into one tactile system. Start in the public plant catalogue, then
            carry that knowledge into place-based planning across properties, zones, beds, and plants.
          </p>

          <div className="cover-sheet__actions">
            <Link className="folio-link" href="/catalog">
              Browse Plant Catalog
            </Link>
            <a className="folio-link folio-link--secondary" href="#join">
              Request Early Access
            </a>
          </div>

          <div className="chip-row">
            {productPillars.map((pillar) => (
              <div className="chip-row__item" key={pillar.title}>
                <strong>{pillar.title}</strong>
                <span>{pillar.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cover-sheet__aside">
          <PlateCard
            plateNumber="17"
            subtitle="Public catalog profile"
            title="Cherokee Purple Tomato"
            illustration={
              <Image alt="Sepia botanical tomato illustration." className="specimen-art" height={420} src="/art/specimen-tomato.svg" width={340} />
            }
          >
            <dl className="detail-list">
              <div className="detail-list__row">
                <dt>
                  <FieldIcon className="field-icon" name="sun" />
                  Sun
                </dt>
                <dd>Full</dd>
              </div>
              <div className="detail-list__row">
                <dt>
                  <FieldIcon className="field-icon" name="water" />
                  Water
                </dt>
                <dd>Medium</dd>
              </div>
              <div className="detail-list__row">
                <dt>
                  <FieldIcon className="field-icon" name="soil" />
                  Soil
                </dt>
                <dd>Rich</dd>
              </div>
            </dl>
          </PlateCard>

          <MarginNote icon="sprout" title="Public plant catalogue">
            <p>Browse starter plant profiles without logging in, then move from plant knowledge into planning and place-aware records.</p>
          </MarginNote>
        </div>
      </section>

      <section className="section-card" id="why">
        <div className="section-card__header">
          <SpecimenLabel tone="clay">Why Garden.io</SpecimenLabel>
          <h2>Growing gets harder when place, timing, and memory are split apart.</h2>
          <p>
            Most growers juggle notebooks, screenshots, weather apps, seed packet notes, and memory. Garden.io brings those
            fragments back together so the system feels grounded in real land and real seasons.
          </p>
        </div>

        <div className="annotated-grid">
          {whyCards.map((card) => (
            <article className="annotation-card" key={card.label}>
              <span className="annotation-card__label">{card.label}</span>
              <p>{card.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card" id="features">
        <div className="section-card__header">
          <SpecimenLabel tone="olive">What it does</SpecimenLabel>
          <h2>One system across place, time, plant memory, and public plant knowledge.</h2>
          <p>
            Garden.io is designed so each part of the product reinforces the others. The plant catalogue is public. The rest of
            the app turns that knowledge into planning, memory, and context-aware action.
          </p>
        </div>

        <div className="feature-grid">
          {productFeatures.map((feature) => (
            <Link className="feature-card feature-card--link" href={feature.href} key={feature.title}>
              <strong>{feature.title}</strong>
              <p>{feature.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__header">
          <SpecimenLabel tone="olive">Plant catalogue</SpecimenLabel>
          <h2>Start with the public catalogue before you ever log in.</h2>
          <p>
            The catalog is the most accessible public surface in Garden.io. Browse plant profiles, compare fit, and understand
            how each entry will later connect to planning and plant records inside the app.
          </p>
        </div>

        <div className="catalog-preview-grid">
          {catalogPreview.map((plant) => (
            <Link className="catalog-preview-card" href={`/catalog/${plant.slug}`} key={plant.slug}>
              <Image alt={plant.commonName} className="specimen-art specimen-art--small" height={240} src={plant.illustration} width={200} />
              <div className="catalog-preview-card__body">
                <SpecimenLabel>{plant.commonName}</SpecimenLabel>
                <strong>{plant.latinName}</strong>
                <span>{plant.summary}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="section-actions">
          <Link className="folio-link" href="/catalog">
            Browse all catalog plants
          </Link>
        </div>
      </section>

      <section className="section-card" id="audience">
        <div className="section-card__header">
          <SpecimenLabel tone="clay">Who it&apos;s for</SpecimenLabel>
          <h2>Built for growers managing living systems, not ornamental chores.</h2>
          <p>
            The strongest fit is people who already feel the pain of fragmented notes, missed timing windows, and too many places
            to keep track of what happened.
          </p>
        </div>

        <div className="feature-grid">
          {audienceProfiles.map((profile) => (
            <article className="feature-card" key={profile.title}>
              <strong>{profile.title}</strong>
              <p>{profile.summary}</p>
            </article>
          ))}
        </div>

        <div className="section-card__split section-card__split--tight">
          <article className="paper-panel paper-panel--muted">
            <SpecimenLabel tone="clay">Not the focus today</SpecimenLabel>
            <h3>Not every grower needs this much structure.</h3>
            <ul className="note-list">
              {audienceNotFit.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section-card section-card--join" id="join">
        <div className="section-card__split">
          <article className="paper-panel">
            <SpecimenLabel tone="olive">Waitlist</SpecimenLabel>
            <h2>Join early access and help shape the first production release.</h2>
            <p>
              Early users help tune templates, planning defaults, and recommendation quality before public launch. Join the list
              for launch updates and access waves.
            </p>
            <WaitlistForm idPrefix="join" submitLabel="Join the Waitlist" />
            <p className="trust-note">We only use your email for Garden.io updates. No spam and easy unsubscribe.</p>
          </article>

          <article className="paper-panel paper-panel--illustrated">
            <PlateCard
              className="plate-card--compact"
              plateNumber="23"
              subtitle="Product flow"
              title="Property, planning, and plant records"
              illustration={
                <Image
                  alt="Sepia herbarium-style botanical notebook illustration."
                  className="specimen-art"
                  height={400}
                  src="/art/specimen-herbarium-sheet.svg"
                  width={320}
                />
              }
            >
              <p>
                Start in the public catalogue, then move into property structure, weekly planning, and long-term plant memory as
                the season unfolds.
              </p>
            </PlateCard>
          </article>
        </div>
      </section>

      <section className="section-card" id="faq">
        <div className="section-card__header">
          <SpecimenLabel tone="clay">FAQ</SpecimenLabel>
          <h2>Questions growers ask before joining.</h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq) => (
            <details className="faq-item" key={faq.q}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <p>Garden.io</p>
        <p>Prototype website v0.1</p>
      </footer>
    </main>
  );
}
