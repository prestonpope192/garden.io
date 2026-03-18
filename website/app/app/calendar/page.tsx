import Image from "next/image";
import { FieldIcon } from "@/components/field-icons";
import { InkStamp, JournalPage, JournalSpread, MarginNote, PlateCard, SpecimenLabel } from "@/components/journal-primitives";

const weeklyTasks = [
  { day: "Mon", task: "Inspect cucumbers for beetle damage", context: "North row · Bed 02" },
  { day: "Tue", task: "Deep water apple guild circles", context: "Orchard · Tree ring set" },
  { day: "Thu", task: "Harvest basil and note regrowth", context: "Kitchen garden · Bed 03" },
  { day: "Sat", task: "Mulch wind-exposed path edge", context: "Pollinator strip" }
];

const signals = [
  "Warm spell begins Friday afternoon; tomato pruning is safer before noon.",
  "Rain chance Saturday could replace one irrigation pass in the north beds.",
  "Blueberry harvest window opens in five days based on last season's notes."
];

export default function CalendarPage() {
  return (
    <JournalSpread>
      <JournalPage
        folio="21"
        label="Calendar spread"
        side="left"
        subtitle="Week view · Orchard context"
        title="Seasonal planner"
      >
        <div className="page-stack">
          <div className="field-block">
            <SpecimenLabel tone="olive">This week</SpecimenLabel>
            <div className="timeline-list">
              {weeklyTasks.map((task) => (
                <div className="timeline-list__row" key={task.task}>
                  <span className="timeline-list__day">{task.day}</span>
                  <div>
                    <strong>{task.task}</strong>
                    <p>{task.context}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <MarginNote icon="calendar" title="Weather watch">
            <ul className="note-list">
              {signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </MarginNote>
        </div>
      </JournalPage>

      <JournalPage
        folio="22"
        label="Calendar detail"
        side="right"
        subtitle="Prototype weekly timeline"
        title="Planner linked back to place"
      >
        <div className="page-stack">
          <PlateCard
            plateNumber="21"
            subtitle="Weekly field planner"
            title="Signals, tasks, and gentle prompts"
            illustration={
              <Image
                alt="Sepia botanical planner study with bloom and date callouts."
                className="specimen-art"
                height={430}
                src="/art/specimen-calendar-bloom.svg"
                width={360}
              />
            }
          >
            <dl className="detail-list">
              <div className="detail-list__row">
                <dt>
                  <FieldIcon className="field-icon" name="calendar" />
                  Default view
                </dt>
                <dd>Weekly timeline</dd>
              </div>
              <div className="detail-list__row">
                <dt>
                  <FieldIcon className="field-icon" name="water" />
                  Weather proposals
                </dt>
                <dd>Suggest, never auto-apply</dd>
              </div>
              <div className="detail-list__row">
                <dt>
                  <FieldIcon className="field-icon" name="journal" />
                  Deep links
                </dt>
                <dd>Return to Bed or Plant context</dd>
              </div>
            </dl>
          </PlateCard>

          <InkStamp>Stamped after review · June 12</InkStamp>
        </div>
      </JournalPage>
    </JournalSpread>
  );
}
