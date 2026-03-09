import React from "react";
import { WaitlistForm } from "@/components/waitlist-form";

const valuePillars = [
  {
    title: "Space-first planning",
    description:
      "Navigate your property as it actually exists: Property -> Zone -> Bed -> Plant. Know where work belongs before the week gets busy."
  },
  {
    title: "Time-first execution",
    description:
      "Use a seasonal calendar that turns context into weekly priorities. See what matters now, next, and soon."
  },
  {
    title: "Knowledge that compounds",
    description:
      "Capture observations, yields, and outcomes so each season improves the next one with less guesswork."
  }
];

const moduleHighlights = [
  {
    name: "My Property",
    summary:
      "The spatial home for your garden, farm, or homestead with context-aware tasks and actions at every level."
  },
  {
    name: "Calendar",
    summary:
      "A weekly planner tied to real beds and plants, with weather-aware signals and planning windows."
  },
  {
    name: "My Plants",
    summary:
      "Your active, wishlist, and archived plant memory across seasons and locations."
  },
  {
    name: "Plant Catalogue",
    summary:
      "A practical field-guide style knowledge base connected directly to add-plant flows and recommendations."
  },
  {
    name: "Ambient AI",
    summary:
      "Quiet, contextual guidance in the flow of work. Suggestions, warnings, and opportunities, not a noisy chatbot."
  }
];

const audienceFit = [
  "Home growers managing 4 to 12+ productive beds",
  "Homesteaders balancing annuals, perennials, and soil-building work",
  "Small diversified farms that need planning and record continuity"
];

const audienceNotFit = [
  "Decorative-only 1 to 2 bed users with low planning depth",
  "Windowsill herb users looking for a simple reminder app",
  "Large monocrop operations needing full ERP and compliance suites"
];

const marketSignals = [
  {
    metric: "80%",
    detail:
      "U.S. household participation in gardening activities (2022 National Gardening Survey, reported by AP in 2024).",
    href: "https://apnews.com/article/gardening-lawn-care-plants-pandemic-c17fb09b6641f2aac8390029bd93b8ca"
  },
  {
    metric: "61%",
    detail:
      "Canadian households growing fruits, herbs, vegetables, or flowers; 72% in single-detached homes.",
    href: "https://www.statcan.gc.ca/o1/en/plus/5993-herb-your-enthusiasm-canadians-kept-gardening-2021"
  },
  {
    metric: "33M+",
    detail: "People engaged in community gardening in U.S. research highlighted by NRPA.",
    href:
      "https://www.nrpa.org/about-national-recreation-and-park-association/press-room/new-national-study-highlights-growing-interest-in-gardening-across-generations/"
  }
];

const faqs = [
  {
    q: "Who is Garden.io built for first?",
    a: "Our beachhead is multi-bed home growers and homesteaders in North America who need planning intelligence, memory, and context."
  },
  {
    q: "Is this a task app?",
    a: "No. Tasks are a byproduct of your property record, plant lifecycle, weather, and observations. The core experience is place-aware growing."
  },
  {
    q: "What is included in early access?",
    a: "Core hierarchy navigation, contextual notes, calendar planning surfaces, and guided add flows. Premium intelligence surfaces roll out in staged waves."
  },
  {
    q: "Why join the waitlist now?",
    a: "Early users shape templates, planning defaults, and recommendation quality before public launch."
  }
];

export default function HomePage() {
  return (
    <main className="site">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Garden.io home">
          Garden.io
        </a>
        <nav className="topnav" aria-label="Primary">
          <a href="#why">Why</a>
          <a href="#fit">For Who</a>
          <a href="#product">Product</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="topbar-cta" href="#join">
          Join Waitlist
        </a>
      </header>

      <section className="section hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">North America early access - 2026</p>
          <h1>The living notebook for growers managing real complexity.</h1>
          <p className="lead">
            Garden.io helps you plan by space and time, then learn season after season. It is built
            for growers running living systems, not ornamental chores.
          </p>
          <ul className="chip-row" aria-label="Primary value points">
            <li>Calm weekly planning</li>
            <li>Context-aware guidance</li>
            <li>Long-term garden memory</li>
          </ul>
        </div>

        <aside className="signup-panel" aria-label="Waitlist signup">
          <h2>Get launch access</h2>
          <p>
            Join the waitlist for product updates, private beta invites, and release notes as Garden.io
            rolls out.
          </p>
          <WaitlistForm idPrefix="hero" submitLabel="Request Early Access" />
          <p className="trust-note">
            We only use your email for Garden.io updates. No spam and easy unsubscribe.
          </p>
        </aside>
      </section>

      <section className="section" id="why">
        <div className="section-header">
          <p className="eyebrow">Why this exists</p>
          <h2>Growing breaks when memory, timing, and context are split across tools.</h2>
          <p>
            Most growers juggle notes, reminders, weather apps, and memory. Garden.io unifies the
            land map, weekly planner, and plant history into one calm workflow.
          </p>
        </div>

        <div className="grid three-up">
          {valuePillars.map((pillar) => (
            <article className="paper-card" key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="fit">
        <div className="section-header">
          <p className="eyebrow">Audience fit</p>
          <h2>Built for growers managing living systems.</h2>
          <p>
            We are intentionally optimizing for multi-bed regenerative-minded growers where planning
            depth and continuity matter.
          </p>
        </div>

        <div className="grid two-up">
          <article className="paper-card">
            <h3>Best fit right now</h3>
            <ul>
              {audienceFit.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="paper-card muted-card">
            <h3>Not the focus today</h3>
            <ul>
              {audienceNotFit.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section" id="product">
        <div className="section-header">
          <p className="eyebrow">Product</p>
          <h2>One system across space, time, and plant knowledge.</h2>
          <p>
            You move through your property by place, execute by week, and improve with accumulated
            records. The tools reinforce each other.
          </p>
        </div>

        <div className="grid modules-grid">
          {moduleHighlights.map((module) => (
            <article className="paper-card" key={module.name}>
              <h3>{module.name}</h3>
              <p>{module.summary}</p>
            </article>
          ))}
        </div>

        <article className="paper-card disclosure-card">
          <h3>What we share publicly vs what we keep private before launch</h3>
          <p>
            We publish outcomes, workflows, and who Garden.io is for. We do not publish proprietary
            recommendation logic, full model internals, or complete data weighting methods before
            launch.
          </p>
          <p>
            This keeps the message useful for growers while protecting product differentiation.
          </p>
        </article>
      </section>

      <section className="section" id="signals" aria-labelledby="signals-title">
        <div className="section-header">
          <p className="eyebrow">Why now</p>
          <h2 id="signals-title">The audience is large, active, and ready for better planning tools.</h2>
        </div>

        <div className="grid three-up stats-grid">
          {marketSignals.map((signal) => (
            <article className="paper-card stat-card" key={signal.metric}>
              <p className="stat-metric">{signal.metric}</p>
              <p>{signal.detail}</p>
              <a href={signal.href} target="_blank" rel="noreferrer">
                Source
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section join" id="join">
        <div className="section-header">
          <p className="eyebrow">Waitlist</p>
          <h2>Join early access and help shape the first production release.</h2>
          <p>
            We are onboarding in controlled waves to keep quality high. Waitlist users get first access
            to pilot cohorts and release updates.
          </p>
        </div>
        <div className="join-panel">
          <WaitlistForm idPrefix="join" submitLabel="Join the Waitlist" />
        </div>
      </section>

      <section className="section" id="faq">
        <div className="section-header">
          <p className="eyebrow">FAQ</p>
          <h2>Questions growers ask before joining.</h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.q} className="faq-item">
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>Garden.io - The living notebook for growing.</p>
        <p>Designed for growers managing real land, real seasons, and real complexity.</p>
      </footer>
    </main>
  );
}
