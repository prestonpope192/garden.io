import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FieldIcon } from "@/components/field-icons";
import { InkStamp, MarginNote, PlateCard, SpecimenLabel } from "@/components/journal-primitives";
import { WaitlistForm } from "@/components/waitlist-form";

const productPillars = [
  {
    title: "Space-first planning",
    description: "Navigate Property → Zone → Bed → Plant before the week gets noisy."
  },
  {
    title: "Seasonal memory",
    description: "Keep notes, outcomes, and plant records attached to the exact place they happened."
  },
  {
    title: "Ambient guidance",
    description: "Suggestions live in context as margin notes and planning cues, not as a generic chatbot."
  }
];

const prototypeModules = [
  {
    href: "/app/my-property",
    title: "My Property",
    summary: "The spatial notebook for land, zones, beds, and live plant records."
  },
  {
    href: "/app/calendar",
    title: "Calendar",
    summary: "The temporal mirror of the property hierarchy, tuned for weekly field planning."
  },
  {
    href: "/app/my-plants",
    title: "My Plants",
    summary: "A specimen cabinet of active, wishlist, and archived plant memory."
  },
  {
    href: "/app/plant-catalogue",
    title: "Plant Catalogue",
    summary: "Reference entries that feel like a field guide instead of a sterile database."
  }
];

const audienceFit = [
  "Home growers managing 4 to 12+ productive beds",
  "Homesteaders balancing annuals, perennials, and soil-building work",
  "Small diversified farms that need continuity across spaces and seasons"
];

const audienceNotFit = [
  "Decorative-only one or two bed users with low planning depth",
  "Windowsill herb users looking for a simple reminder app",
  "Large monocrop operations needing full ERP and compliance suites"
];

const fieldSignals = [
  {
    label: "Notebook rule",
    note: "Plan by bed and zone, not by disconnected task lists."
  },
  {
    label: "Emotional target",
    note: "Calm, confidence, continuity, and trust."
  },
  {
    label: "Why now",
    note: "Growers already keep notebooks. Garden.io becomes the digital evolution of that habit."
  }
];

const marketSignals = [
  {
    metric: "80%",
    detail: "U.S. household participation in gardening activities in the 2022 National Gardening Survey, reported by AP in 2024."
  },
  {
    metric: "61%",
    detail: "Canadian households growing fruits, herbs, vegetables, or flowers, with higher participation in single-detached homes."
  },
  {
    metric: "33M+",
    detail: "People engaged in community gardening in U.S. research highlighted by NRPA."
  }
];

const faqs = [
  {
    q: "Who is Garden.io built for first?",
    a: "The first audience is multi-bed home growers and homesteaders in North America who need one calm system for place, timing, and memory."
  },
  {
    q: "Is this a task app?",
    a: "No. Tasks are a byproduct of the property record, seasonal timing, and observation history."
  },
  {
    q: "What is included in early access?",
    a: "Core hierarchy navigation, contextual notes, calendar planning surfaces, and guided add flows."
  },
  {
    q: "Can I preview the direction before the product is built?",
    a: "Yes. This site now includes a clickable prototype shell that shows the notebook-style product direction."
  }
];

export default function HomePage() {
  return (
    <main className="site site--marketing">
      <header className="topbar">
        <div className="topbar__brand">
          <SpecimenLabel tone="olive">Field edition 01</SpecimenLabel>
          <a className="brand" href="#top">
            Garden.io
          </a>
        </div>

        <nav aria-label="Primary" className="topnav">
          <a href="#why">Why</a>
          <a href="#prototype">Prototype</a>
          <a href="#fit">Fit</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="topbar__actions">
          <Link className="topbar-secondary" href="/app">
            Open Prototype
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
            Garden.io turns land, timing, and plant memory into one tactile system with a botanical field-journal feel. It should
            feel like opening a field notebook, not logging into a generic productivity app.
          </p>

          <div className="cover-sheet__actions">
            <a className="folio-link" href="#join">
              Request Early Access
            </a>
            <Link className="folio-link folio-link--secondary" href="/app">
              View prototype notebook
            </Link>
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
            subtitle="Early access specimen"
            title="Cherokee Purple Tomato"
            illustration={
              <Image
                alt="Sepia botanical tomato illustration."
                className="specimen-art"
                height={420}
                src="/art/specimen-tomato.svg"
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

          <MarginNote icon="journal" title="Notebook marginalia">
            <p>Prune lower stems early. Companion plant: basil. Harvest window expected in late June if nights stay warm.</p>
          </MarginNote>
        </div>
      </section>

      <section className="section-card" id="why">
        <div className="section-card__header">
          <SpecimenLabel tone="clay">Why this exists</SpecimenLabel>
          <h2>Growing breaks when memory, timing, and context are split across tools.</h2>
          <p>
            Most growers juggle notebooks, screenshots, weather apps, seed packet notes, and memory. Garden.io unifies those
            fragments into one calm surface that stays tied to real places and real seasons.
          </p>
        </div>

        <div className="annotated-grid">
          {fieldSignals.map((signal) => (
            <article className="annotation-card" key={signal.label}>
              <span className="annotation-card__label">{signal.label}</span>
              <p>{signal.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card" id="prototype">
        <div className="section-card__header">
          <SpecimenLabel tone="olive">Prototype routes</SpecimenLabel>
          <h2>The public site stays readable. The prototype shell carries the stronger notebook metaphor.</h2>
          <p>
            The routes below are live in this repo now. They show the future Garden.io product as a set of spreads, specimen
            labels, margin notes, and slower paper-like interactions.
          </p>
        </div>

        <div className="prototype-route-grid">
          {prototypeModules.map((module) => (
            <Link className="prototype-route-card" href={module.href} key={module.href}>
              <SpecimenLabel>{module.title}</SpecimenLabel>
              <strong>{module.title}</strong>
              <span>{module.summary}</span>
            </Link>
          ))}
        </div>

        <InkStamp>Click any route to open the notebook shell</InkStamp>
      </section>

      <section className="section-card">
        <div className="section-card__header">
          <SpecimenLabel tone="clay">Disclosure boundary</SpecimenLabel>
          <h2>What we share publicly vs what we keep private before launch</h2>
          <p>
            We share the workflows, who Garden.io is for, and the shape of the experience. We do not publish proprietary
            recommendation logic, full model internals, or complete weighting methods before launch.
          </p>
        </div>
      </section>

      <section className="section-card" id="fit">
        <div className="section-card__split">
          <article className="paper-panel">
            <SpecimenLabel tone="olive">Best fit right now</SpecimenLabel>
            <h3>Built for growers managing living systems.</h3>
            <ul className="note-list">
              {audienceFit.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

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

      <section className="section-card" id="signals">
        <div className="section-card__header">
          <SpecimenLabel tone="olive">Why now</SpecimenLabel>
          <h2>The audience is large, active, and ready for better planning tools.</h2>
        </div>

        <div className="annotated-grid">
          {marketSignals.map((signal) => (
            <article className="annotation-card" key={signal.metric}>
              <span className="annotation-card__label">{signal.metric}</span>
              <p>{signal.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card section-card--join" id="join">
        <div className="section-card__split">
          <article className="paper-panel">
            <SpecimenLabel tone="olive">Waitlist</SpecimenLabel>
            <h2>Join early access and help shape the first production release.</h2>
            <p>
              Early users help tune templates, planning defaults, and recommendation quality before public launch. Join the
              notebook list to get pilot invites and release notes.
            </p>
            <WaitlistForm idPrefix="join" submitLabel="Join the Waitlist" />
            <p className="trust-note">We only use your email for Garden.io updates. No spam and easy unsubscribe.</p>
          </article>

          <article className="paper-panel paper-panel--illustrated">
            <PlateCard
              className="plate-card--compact"
              plateNumber="23"
              subtitle="Prototype shell study"
              title="Oak Orchard folio"
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
                Left page: context and hierarchy. Right page: detail, tasks, and notes. The live prototype shell shows how that
                metaphor can carry the actual product.
              </p>
            </PlateCard>
          </article>
        </div>
      </section>

      <section className="section-card" id="faq">
        <div className="section-card__header">
          <SpecimenLabel tone="clay">FAQ</SpecimenLabel>
          <h2>Questions growers ask before joining the notebook.</h2>
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
    </main>
  );
}
