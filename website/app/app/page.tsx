import Image from "next/image";
import Link from "next/link";
import { FieldIcon } from "@/components/field-icons";
import { InkStamp, JournalPage, JournalSpread, MarginNote, PlateCard, SpecimenLabel } from "@/components/journal-primitives";

const modules = [
  {
    href: "/app/my-property",
    title: "My Property",
    summary: "Move through Property → Zone → Bed → Plant as a tactile journal instead of a disconnected software tree.",
    icon: "journal" as const
  },
  {
    href: "/app/calendar",
    title: "Calendar",
    summary: "Translate weather, seasonal signals, and scoped tasks into a weekly field planner.",
    icon: "calendar" as const
  },
  {
    href: "/app/my-plants",
    title: "My Plants",
    summary: "Treat active plants, wishlist ideas, and archived lessons as specimen records that compound over time.",
    icon: "leaf" as const
  },
  {
    href: "/app/plant-catalogue",
    title: "Plant Catalogue",
    summary: "Connect hand-labeled plant knowledge directly to add flows and contextual recommendations.",
    icon: "sprout" as const
  }
];

export default function PrototypeNotebookHome() {
  return (
    <JournalSpread>
      <JournalPage
        folio="01"
        label="Notebook overview"
        side="left"
        subtitle="Prototype journal shell"
        title="A folio for space, time, and plant memory"
      >
        <div className="page-stack">
          <div className="field-block">
            <SpecimenLabel tone="olive">Design direction</SpecimenLabel>
            <p>
              The prototype app shell borrows from botanical plates, field notebooks, and specimen labels. The layout favors
              calm reading, visible place context, and slower motion that feels intentional.
            </p>
          </div>

          <MarginNote icon="journal" title="Navigation rule">
            <p>Public website remains a marketing folio. The strongest book-spread mechanics live in the product shell.</p>
          </MarginNote>

          <div className="field-block">
            <SpecimenLabel tone="clay">Shared components</SpecimenLabel>
            <ul className="note-list">
              <li>Journal shell and spread layout</li>
              <li>Specimen labels, margin notes, and ink stamps</li>
              <li>Botanical line icons and normalized sepia illustration assets</li>
            </ul>
          </div>
        </div>
      </JournalPage>

      <JournalPage
        folio="02"
        label="Module index"
        side="right"
        subtitle="Clickable prototype routes"
        title="Open a module"
      >
        <div className="page-stack">
          <PlateCard
            plateNumber="01"
            subtitle="Prototype cover study"
            title="Living notebook spread"
            illustration={
              <Image
                alt="Sepia botanical notebook composition with specimen labels."
                className="specimen-art"
                height={420}
                src="/art/specimen-herbarium-sheet.svg"
                width={360}
              />
            }
          >
            <div className="prototype-module-grid">
              {modules.map((module) => (
                <Link className="prototype-module-card" href={module.href} key={module.href}>
                  <FieldIcon className="field-icon" name={module.icon} />
                  <strong>{module.title}</strong>
                  <span>{module.summary}</span>
                </Link>
              ))}
            </div>
          </PlateCard>

          <InkStamp>Prototype edition · Clickable only</InkStamp>
        </div>
      </JournalPage>
    </JournalSpread>
  );
}
