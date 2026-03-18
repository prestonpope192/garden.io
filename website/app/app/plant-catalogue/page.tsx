import Image from "next/image";
import { FieldIcon } from "@/components/field-icons";
import { InkStamp, JournalPage, JournalSpread, MarginNote, PlateCard, SpecimenLabel } from "@/components/journal-primitives";

const specimenFacts = [
  "Latin name, common name, and family are treated as plate headers rather than hidden metadata.",
  "Add-to-property actions stay connected to the notebook context rather than feeling like a store catalogue.",
  "Community corrections and climate-specific success notes can live as marginalia under the core record."
];

export default function PlantCataloguePage() {
  return (
    <JournalSpread>
      <JournalPage
        folio="41"
        label="Plant catalogue"
        side="left"
        subtitle="Reference layer"
        title="Field guide meets add flow"
      >
        <div className="page-stack">
          <div className="field-block">
            <SpecimenLabel tone="olive">Reference behavior</SpecimenLabel>
            <ul className="note-list">
              {specimenFacts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>

          <MarginNote icon="sprout" title="Herbarium mode">
            <p>
              Future mode: user photo in, specimen-style plate out. The notebook keeps the plant record expressive without turning
              the product into a chatbot gallery.
            </p>
          </MarginNote>
        </div>
      </JournalPage>

      <JournalPage
        folio="42"
        label="Catalogue detail"
        side="right"
        subtitle="Prototype species card"
        title="Solanum lycopersicum"
      >
        <div className="page-stack">
          <PlateCard
            plateNumber="41"
            subtitle="Tomato · Solanaceae"
            title="Cherokee Purple"
            illustration={
              <Image
                alt="Sepia tomato herbarium sheet with specimen-style notes."
                className="specimen-art"
                height={430}
                src="/art/specimen-tomato.svg"
                width={360}
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
                <dd>Rich, warm, well-fed</dd>
              </div>
            </dl>
          </PlateCard>

          <InkStamp>Ready for add flow</InkStamp>
        </div>
      </JournalPage>
    </JournalSpread>
  );
}
