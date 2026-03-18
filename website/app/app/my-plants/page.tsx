import Image from "next/image";
import { FieldIcon } from "@/components/field-icons";
import { JournalPage, JournalSpread, MarginNote, PlateCard, SpecimenLabel } from "@/components/journal-primitives";

const plantGroups = [
  {
    plate: "31",
    title: "Cherokee Purple",
    subtitle: "Active · Kitchen Garden",
    src: "/art/specimen-tomato.svg",
    notes: "Fruit set ahead of last season. Basil companion remains strong."
  },
  {
    plate: "32",
    title: "Scarlet Runner Bean",
    subtitle: "Wishlist · North fence",
    src: "/art/specimen-bean-vine.svg",
    notes: "Candidate for warm path trellis with pollinator value."
  },
  {
    plate: "33",
    title: "Calendula",
    subtitle: "Archived note · Pollinator strip",
    src: "/art/specimen-calendar-bloom.svg",
    notes: "Reseeding was strongest in the driest edge zone."
  }
];

export default function MyPlantsPage() {
  return (
    <JournalSpread>
      <JournalPage
        folio="31"
        label="My Plants"
        side="left"
        subtitle="Growing · Wishlist · Archived"
        title="Specimen memory"
      >
        <div className="page-stack">
          <div className="field-block">
            <SpecimenLabel tone="olive">Collection logic</SpecimenLabel>
            <p>
              Plants are shown as living records, not isolated entries. Each card links identity, placement, notes, and seasonal
              lessons into one plate-like record.
            </p>
          </div>

          <MarginNote icon="leaf" title="Why this matters">
            <p>
              Browsing plants this way supports continuity: what worked here, in this place, under these conditions, last season?
            </p>
          </MarginNote>
        </div>
      </JournalPage>

      <JournalPage
        folio="32"
        label="Plant records"
        side="right"
        subtitle="Static prototype cards"
        title="Collection cabinet"
      >
        <div className="page-stack">
          <div className="prototype-plate-grid">
            {plantGroups.map((plant) => (
              <PlateCard
                className="plate-card--compact"
                illustration={
                  <Image alt={plant.title} className="specimen-art specimen-art--small" height={260} src={plant.src} width={220} />
                }
                key={plant.plate}
                plateNumber={plant.plate}
                subtitle={plant.subtitle}
                title={plant.title}
              >
                <p>{plant.notes}</p>
              </PlateCard>
            ))}
          </div>

          <div className="field-block field-block--split">
            <div className="inline-metric">
              <FieldIcon className="field-icon" name="sprout" />
              <span>12 active plants in the current notebook</span>
            </div>
            <div className="inline-metric">
              <FieldIcon className="field-icon" name="journal" />
              <span>4 archived notes ready for seasonal review</span>
            </div>
          </div>
        </div>
      </JournalPage>
    </JournalSpread>
  );
}
