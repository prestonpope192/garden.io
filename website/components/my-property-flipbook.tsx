"use client";

import React from "react";
import Image from "next/image";
import { forwardRef, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { FieldIcon } from "@/components/field-icons";
import { InkStamp, JournalPage, MarginNote, PlateCard, SpecimenLabel } from "@/components/journal-primitives";

type PageTurnHandle = {
  pageFlip: () => {
    flip: (page: number, corner?: "top" | "bottom") => void;
    flipNext: (corner?: "top" | "bottom") => void;
    flipPrev: (corner?: "top" | "bottom") => void;
  };
};

type SpreadData = {
  key: string;
  folio: string;
  label: string;
  title: string;
  subtitle: string;
  breadcrumb: string;
  contextHeading: string;
  contextList: string[];
  focusNote: string;
  illustration: {
    src: string;
    alt: string;
  };
  facts: Array<{ label: string; value: string; icon: "sun" | "water" | "soil" | "pollinator" | "leaf" | "calendar" }>;
  notes: string[];
  stamp: string;
  aiNote: string;
};

const spreads: SpreadData[] = [
  {
    key: "property",
    folio: "12",
    label: "Property spread",
    title: "Oak Orchard",
    subtitle: "Homestead ledger · Zone 8b · Early summer",
    breadcrumb: "Oak Orchard / All zones",
    contextHeading: "Whole-property context",
    contextList: [
      "4 active zones, 11 beds, 37 plant records",
      "Frost risk has cleared. Irrigation watch begins this week.",
      "North row and pollinator strip are carrying the most active work."
    ],
    focusNote: "Seasonal watch: mulch exposed orchard circles before the next heat swing.",
    illustration: {
      src: "/art/specimen-herbarium-sheet.svg",
      alt: "Sepia botanical notebook study showing a property map and clipped specimens."
    },
    facts: [
      { label: "Beds", value: "11 active", icon: "leaf" },
      { label: "Water", value: "2 dry zones", icon: "water" },
      { label: "Soil", value: "Mulch refresh due", icon: "soil" },
      { label: "Calendar", value: "7 tasks this week", icon: "calendar" }
    ],
    notes: [
      "Perennial border woke earlier than last season after the mild February.",
      "South fence still reads warmer by late afternoon; keep tomato succession there.",
      "Pollinator path is holding bee activity through the clover strip."
    ],
    stamp: "Surveyed weekly",
    aiNote: "Suggested next action: review the orchard edge and schedule mulch before Saturday wind."
  },
  {
    key: "zone",
    folio: "13",
    label: "Zone spread",
    title: "North Row",
    subtitle: "Fruit corridor · Wind-sheltered edge",
    breadcrumb: "Oak Orchard / North Row",
    contextHeading: "Zone context",
    contextList: [
      "Three beds share the same morning light and damp spring soil.",
      "Companion herbs are suppressing weeds along the stone path.",
      "Most urgent work is structural: tie, prune, and inspect for split stems."
    ],
    focusNote: "Watch pollinator rhythm after the next bloom wave and capture notes by bed.",
    illustration: {
      src: "/art/specimen-bean-vine.svg",
      alt: "Sepia linework of a climbing vine with hand-labeled specimen callouts."
    },
    facts: [
      { label: "Sun", value: "Morning to mid-day", icon: "sun" },
      { label: "Water", value: "Even moisture", icon: "water" },
      { label: "Soil", value: "Compost-rich loam", icon: "soil" },
      { label: "Pollinators", value: "High activity", icon: "pollinator" }
    ],
    notes: [
      "The stone edging is warming quickly and could extend basil planting along the row.",
      "Bee traffic peaks around 10 a.m. near the flowering dill patch.",
      "Shade pocket at the far end remains safest for lettuce succession."
    ],
    stamp: "Annotated in field",
    aiNote: "Suggested companion adjustment: keep basil nearest the warm path and move dill to the cooler pocket."
  },
  {
    key: "bed",
    folio: "14",
    label: "Bed spread",
    title: "Tree 03 Circle",
    subtitle: "Apple guild bed · Moisture-retentive ring",
    breadcrumb: "Oak Orchard / North Row / Tree 03 Circle",
    contextHeading: "Bed context",
    contextList: [
      "Apple trunk center with comfrey, chive, and clover companion ring.",
      "Two tasks are due soon: prune suckers and refresh surface mulch.",
      "Fruit set is stable, but the south-facing side is carrying more heat stress."
    ],
    focusNote: "Bed is ready for a small observation log after the next rain to compare moisture retention.",
    illustration: {
      src: "/art/specimen-calendar-bloom.svg",
      alt: "Sepia botanical plate with bloom timing and specimen labels."
    },
    facts: [
      { label: "Sun", value: "6+ hours", icon: "sun" },
      { label: "Water", value: "Deep soak only", icon: "water" },
      { label: "Soil", value: "Mulched clay loam", icon: "soil" },
      { label: "Calendar", value: "Prune this week", icon: "calendar" }
    ],
    notes: [
      "Comfrey ring is shading the soil well but needs one trim before it crowds the chives.",
      "South-side fruit set looks strongest; mark that side for harvest comparison later.",
      "Mulch depth is inconsistent after the last wind event."
    ],
    stamp: "Task window open",
    aiNote: "Suggested action: top up mulch around the south arc before logging another watering event."
  },
  {
    key: "plant",
    folio: "15",
    label: "Plant spread",
    title: "Cherokee Purple Tomato",
    subtitle: "Live plant record · Bed 03 · First fruit set",
    breadcrumb: "Oak Orchard / Kitchen Garden / Bed 03 / Cherokee Purple",
    contextHeading: "Plant context",
    contextList: [
      "First fruit set is visible and lower stems need another pruning pass.",
      "Growth rate is ahead of last season by roughly one week.",
      "Basil companion is thriving and suppressing splashback near the stem."
    ],
    focusNote: "Capture stem-pruning notes after the next pass so this plant becomes next season's reference entry.",
    illustration: {
      src: "/art/specimen-tomato.svg",
      alt: "Sepia botanical tomato study with fruit, blossoms, and specimen notes."
    },
    facts: [
      { label: "Sun", value: "Full", icon: "sun" },
      { label: "Water", value: "Medium", icon: "water" },
      { label: "Soil", value: "Rich and mulched", icon: "soil" },
      { label: "Pollinators", value: "Buzzing daily", icon: "pollinator" }
    ],
    notes: [
      "Lower suckers are returning quickly after warm weather; weekly pruning is enough.",
      "Fruit shoulders have stayed clean after mulching; continue current watering rhythm.",
      "Companion basil is strong enough to keep as the default pairing for this bed."
    ],
    stamp: "Observed June 12",
    aiNote: "Suggested care note: prune lower stems early and keep basil in place as the companion anchor."
  }
];

type FlipPageProps = {
  children: ReactNode;
};

const FlipPage = forwardRef<HTMLDivElement, FlipPageProps>(function FlipPage({ children }, ref) {
  return (
    <div className="flipbook-sheet" ref={ref}>
      {children}
    </div>
  );
});

function DetailList({ facts }: Pick<SpreadData, "facts">) {
  return (
    <dl className="detail-list">
      {facts.map((fact) => (
        <div className="detail-list__row" key={fact.label}>
          <dt>
            <FieldIcon className="field-icon" name={fact.icon} />
            {fact.label}
          </dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ContextPage({ spread }: { spread: SpreadData }) {
  return (
    <JournalPage
      side="left"
      folio={spread.folio}
      label={spread.label}
      subtitle={spread.breadcrumb}
      title={spread.title}
    >
      <div className="page-stack">
        <div className="field-block">
          <SpecimenLabel tone="olive">{spread.contextHeading}</SpecimenLabel>
          <ul className="note-list">
            {spread.contextList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <MarginNote icon="journal" title="Margin observation">
          <p>{spread.focusNote}</p>
        </MarginNote>

        <div className="field-block">
          <SpecimenLabel tone="clay">Recent notebook lines</SpecimenLabel>
          <ul className="note-list note-list--script">
            {spread.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </JournalPage>
  );
}

function DetailPage({ spread }: { spread: SpreadData }) {
  return (
    <JournalPage
      side="right"
      folio={String(Number(spread.folio) + 1)}
      label={`${spread.label} detail`}
      subtitle={spread.subtitle}
      title={spread.title}
    >
      <div className="page-stack">
        <PlateCard
          className="plate-card--compact"
          plateNumber={spread.folio}
          subtitle={spread.subtitle}
          title={spread.title}
          illustration={
            <Image
              alt={spread.illustration.alt}
              className="specimen-art"
              height={480}
              src={spread.illustration.src}
              width={420}
            />
          }
        >
          <DetailList facts={spread.facts} />
        </PlateCard>

        <div className="field-block field-block--split">
          <MarginNote icon="leaf" title="AI margin note">
            <p>{spread.aiNote}</p>
          </MarginNote>
          <InkStamp>{spread.stamp}</InkStamp>
        </div>
      </div>
    </JournalPage>
  );
}

export function MyPropertyFlipbook() {
  const bookRef = useRef<PageTurnHandle | null>(null);
  const [activeSpread, setActiveSpread] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mediaQuery.matches);

    sync();
    mediaQuery.addEventListener("change", sync);

    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  const pages = useMemo(
    () =>
      spreads.flatMap((spread) => [
        <FlipPage key={`${spread.key}-context`}>
          <ContextPage spread={spread} />
        </FlipPage>,
        <FlipPage key={`${spread.key}-detail`}>
          <DetailPage spread={spread} />
        </FlipPage>
      ]),
    []
  );

  const jumpToSpread = (spreadIndex: number) => {
    setActiveSpread(spreadIndex);

    if (reducedMotion) {
      return;
    }

    bookRef.current?.pageFlip().flip(spreadIndex * 2, "top");
  };

  const current = spreads[activeSpread];

  return (
    <section className="flipbook-prototype">
      <div className="flipbook-prototype__toolbar">
        <div>
          <SpecimenLabel tone="olive">Property journal</SpecimenLabel>
          <h1 className="prototype-route-title">My Property</h1>
          <p className="prototype-route-copy">
            Browse a Property → Zone → Bed → Plant sequence as a botanical notebook spread instead of a utility dashboard.
          </p>
        </div>

        <div className="flipbook-prototype__controls">
          <button
            className="folio-button"
            onClick={() => jumpToSpread(Math.max(activeSpread - 1, 0))}
            type="button"
          >
            Previous page
          </button>
          <button
            className="folio-button"
            onClick={() => jumpToSpread(Math.min(activeSpread + 1, spreads.length - 1))}
            type="button"
          >
            Next page
          </button>
        </div>
      </div>

      <div className="flipbook-stage-list" role="tablist" aria-label="My Property levels">
        {spreads.map((spread, index) => (
          <button
            key={spread.key}
            aria-pressed={index === activeSpread}
            className={`folio-tab ${index === activeSpread ? "is-active" : ""}`}
            onClick={() => jumpToSpread(index)}
            type="button"
          >
            {spread.title}
          </button>
        ))}
      </div>

      {reducedMotion ? (
        <div className="reduced-motion-spread">
          <ContextPage spread={current} />
          <DetailPage spread={current} />
        </div>
      ) : (
        <div className="flipbook-prototype__book">
          <HTMLFlipBook
            ref={bookRef}
            autoSize
            className="prototype-book"
            clickEventForward
            disableFlipByClick={false}
            drawShadow
            flippingTime={1200}
            height={760}
            maxHeight={1100}
            maxShadowOpacity={0.16}
            maxWidth={1220}
            minHeight={500}
            minWidth={320}
            mobileScrollSupport={false}
            onFlip={(event) => setActiveSpread(Math.floor(event.data / 2))}
            renderOnlyPageLengthChange
            showPageCorners
            showCover={false}
            size="stretch"
            startPage={0}
            startZIndex={0}
            style={{}}
            swipeDistance={24}
            useMouseEvents
            usePortrait
            width={1180}
          >
            {pages}
          </HTMLFlipBook>
        </div>
      )}
    </section>
  );
}
