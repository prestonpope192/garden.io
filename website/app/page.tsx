import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SpecimenLabel } from "@/components/journal-primitives";
import { isSampleGardenEnabled } from "@/lib/sample-garden";

const featuredPlants = [
  {
    slug: "apple",
    name: "Apple",
    careFocus: "Bloom, prune, harvest",
    imageUrl: "https://koeawpuagswysumwuidc.supabase.co/storage/v1/object/public/plant-art/apple.jpg",
    note: "Compare this year's bloom and harvest before next year's pruning."
  },
  {
    slug: "borage",
    name: "Borage",
    careFocus: "Pollinators and reseeding",
    imageUrl: "https://koeawpuagswysumwuidc.supabase.co/storage/v1/object/public/plant-art/borage.jpg",
    note: "Remember where it bloomed, self-seeded, and brought bees."
  },
  {
    slug: "bouquet-dill",
    name: "Bouquet Dill",
    careFocus: "Cuttings and seed heads",
    imageUrl: "https://koeawpuagswysumwuidc.supabase.co/storage/v1/object/public/plant-art/bouquet-dill.jpg",
    note: "Know when to sow again, cut stems, and let seed form."
  }
];

const trackingLoop = [
  {
    title: "Capture what changed",
    description: "Notes and photos stay with the right plant, bed, and season."
  },
  {
    title: "Ask from your own notes",
    description: "Advice can use what you planted, where it grows, and what happened before."
  },
  {
    title: "Turn answers into care",
    description: "Save a useful step to weekly care or keep it in the plant journal."
  }
];

const planningSignals = [
  {
    title: "Wishlist becomes next steps",
    description: "Save what you want to grow and Garden.io keeps planting windows, bed fit, and prep notes close by."
  },
  {
    title: "Timed to your season",
    description: "Advice shifts around frost dates, heat, rain patterns, and the plants already growing in each bed."
  },
  {
    title: "Care stays connected",
    description: "Weekly care can stay tied to the plants, notes, and places that made the task matter."
  }
];

export default function HomePage() {
  const heroPlant = featuredPlants[0];
  const sampleGardenEnabled = isSampleGardenEnabled();

  return (
    <main className="site site--marketing">
      <header className="topbar">
        <div className="topbar__brand">
          <a className="brand" href="#top">
            Garden.io
          </a>
        </div>

        <nav aria-label="Primary" className="topnav">
          <a href="#planning">Plan garden</a>
          <a href="#plants">Choose plants</a>
          <Link href="/catalog">Browse plants</Link>
        </nav>

      </header>

      <section className="cover-sheet home-hero" id="top">
        <div className="cover-sheet__copy">
          <h1>Your garden, smarter.</h1>
          <p className="lead">
            Save what you notice. Get care advice that remembers your plants.
          </p>

          <div className="cover-sheet__actions">
            <Link className="folio-link" href="/app/my-property">
              Start your garden
            </Link>
            {sampleGardenEnabled ? (
              <Link className="folio-link folio-link--secondary" href="/tour">
                Tour a garden journal
              </Link>
            ) : null}
          </div>

          <p className="home-fit-note">Start with one plant. Add more when the season gives you a reason.</p>
        </div>

        <div className="home-hero__media" aria-label={`${heroPlant.name} journal-style plant image`}>
          <Image
            alt={`${heroPlant.name} journal-style plant image.`}
            className="home-hero__photo"
            height={760}
            priority
            src={heroPlant.imageUrl}
            width={1080}
          />
          <div className="home-hero__panel">
            <span>{heroPlant.name}</span>
            <strong>First bloom</strong>
            <p>Apr. 12. Compare fruit set and harvest later.</p>
          </div>
        </div>
      </section>

      <section className="home-section home-loop" id="how">
        <div className="home-section__header">
          <SpecimenLabel tone="clay">Growing record</SpecimenLabel>
          <h2>Care advice that knows your garden.</h2>
          <p>Garden.io automatically connects notes, photos, beds, and plant history so every answer has context.</p>
        </div>

        <div className="home-promise-grid">
          {trackingLoop.map((item) => (
            <article className="home-promise" key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-planning" id="planning">
        <div className="home-section__header">
          <SpecimenLabel tone="olive">Planning</SpecimenLabel>
          <h2>A planting plan from your wishlist and garden notes.</h2>
          <p>
            Add the plants you want, then keep timing, placement, and care decisions next to the beds, seasons, and notes
            that shape them.
          </p>
        </div>

        <div className="home-planning__grid">
          <div className="home-planning__schedule" aria-label="Example garden planning notes">
            <div>
              <span>Early March</span>
              <strong>Start tomatoes indoors</strong>
              <p>Based on last frost, seed-starting lead time, and your sunny south bed.</p>
            </div>
            <div>
              <span>Late April</span>
              <strong>Plant borage near strawberries</strong>
              <p>Uses your wishlist, pollinator goals, and open edge space from last season.</p>
            </div>
            <div>
              <span>After two dry weeks</span>
              <strong>Mulch new fruiting plants</strong>
              <p>Weather patterns and notes trigger care timing before stress shows up.</p>
            </div>
          </div>

          <div className="home-planning__signals">
            {planningSignals.map((item) => (
              <article className="home-planning__signal" key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-plants" id="plants">
        <div className="home-section__header">
          <SpecimenLabel tone="clay">Your plants</SpecimenLabel>
          <h2>Each plant keeps its own story.</h2>
          <p>Track disease pressure, diagnoses, fruiting history, harvests, and care notes so every season starts smarter.</p>
        </div>

        <div className="home-plant-grid">
          {featuredPlants.map((plant) => (
            <Link aria-label={`View ${plant.name} in plant catalogue`} className="home-plant-card" href={`/catalog/${plant.slug}`} key={plant.slug}>
              <Image
                alt={`${plant.name} journal-style plant image.`}
                className="home-plant-card__image"
                height={520}
                loading="eager"
                src={plant.imageUrl}
                width={720}
              />
              <span>{plant.name}</span>
              <strong>{plant.careFocus}</strong>
              <p>{plant.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section home-closing" id="start">
        <div className="home-section__header">
          <SpecimenLabel tone="olive">Begin the record</SpecimenLabel>
          <h2>Start with one plant.</h2>
          <p>Name where it grows. The journal keeps the rest.</p>
        </div>
        <div className="cover-sheet__actions">
          <Link className="folio-link" href="/app/my-property">
            Start your garden
          </Link>
          {sampleGardenEnabled ? (
            <Link className="folio-link folio-link--secondary" href="/tour">
              Tour a garden journal
            </Link>
          ) : null}
        </div>
      </section>

      <footer className="site-footer">
        <p>Garden.io</p>
        <nav aria-label="Footer" className="site-footer__nav">
          <Link href="/catalog">Browse plants</Link>
        </nav>
        <p className="site-footer__copy">&copy; 2026 Garden.io</p>
      </footer>
    </main>
  );
}
