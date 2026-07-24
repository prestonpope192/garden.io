import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CalendarView, overdueBacklogTasks } from "@/components/views/calendar-view";
import { GardenAskView } from "@/components/views/garden-ask-view";
import type { GardenProperty, GardenTask } from "@/lib/garden-app-types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: () => undefined
  })
}));

function isoDaysFromToday(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const property: GardenProperty = {
  id: "property-1",
  owner_user_id: "user-1",
  name: "Backyard Garden",
  label: "Garden",
  region: "Central Texas",
  growing_zone: "8b",
  season: "Summer",
  notes: null,
  latitude: null,
  longitude: null,
  location_label: null,
  created_at: "2026-06-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z"
};

function makeTask(overrides: Partial<GardenTask>): GardenTask {
  return {
    id: "task-1",
    property_id: property.id,
    zone_id: null,
    bed_id: null,
    plant_instance_id: null,
    title: "Prune suckers",
    notes: null,
    due_on: isoDaysFromToday(-20),
    status: "open",
    completed_at: null,
    created_at: "2026-06-01T00:00:00Z",
    updated_at: "2026-06-01T00:00:00Z",
    ...overrides
  };
}

const noop = async () => undefined;

function renderCalendar(tasks: GardenTask[]) {
  return renderToStaticMarkup(
    createElement(CalendarView, {
      tasks,
      zones: [],
      beds: [],
      plants: [],
      updateTaskStatus: noop,
      updateTask: noop,
      addTask: noop,
      season: null,
      region: null,
      property
    })
  );
}

function renderAskView(tasks: GardenTask[]) {
  return renderToStaticMarkup(
    createElement(GardenAskView, {
      activeProperty: property,
      zones: [],
      beds: [],
      plants: [],
      observations: [],
      tasks,
      isSaving: false,
      quickLog: noop,
      addTask: noop,
      updateTaskStatus: noop
    })
  );
}

describe("overdueBacklogTasks", () => {
  const todayISO = isoDaysFromToday(0);
  const weekMonday = new Date(`${todayISO}T00:00:00`);

  it("includes open tasks that fell due before the visible week", () => {
    const overdue = makeTask({ id: "old", due_on: isoDaysFromToday(-20) });
    expect(overdueBacklogTasks([overdue], todayISO, weekMonday)).toHaveLength(1);
  });

  it("excludes done tasks and tasks due within the visible week", () => {
    const done = makeTask({ id: "done", status: "done" });
    const thisWeek = makeTask({ id: "this-week", due_on: todayISO });
    expect(overdueBacklogTasks([done, thisWeek], todayISO, weekMonday)).toHaveLength(0);
  });

  it("sorts the backlog oldest first", () => {
    const older = makeTask({ id: "older", due_on: isoDaysFromToday(-30) });
    const newer = makeTask({ id: "newer", due_on: isoDaysFromToday(-10) });
    const backlog = overdueBacklogTasks([newer, older], todayISO, weekMonday);
    expect(backlog.map((task) => task.id)).toEqual(["older", "newer"]);
  });
});

describe("Weekly care overdue surfacing", () => {
  it("pins overdue tasks from earlier weeks instead of hiding them", () => {
    const html = renderCalendar([makeTask({ title: "Prune suckers on the acanthus" })]);

    expect(html).toContain("Overdue");
    expect(html).toContain("1 item is waiting from earlier");
    expect(html).toContain("Prune suckers on the acanthus");
    expect(html).toContain("Nothing new this week");
    expect(html).not.toContain("All clear this week");
  });

  it("keeps the all-clear message when nothing is overdue", () => {
    const html = renderCalendar([makeTask({ due_on: isoDaysFromToday(3), title: "Water the herb bed" })]);

    expect(html).not.toContain("waiting from earlier");
  });
});

describe("Today memory chip care count", () => {
  it("counts overdue care as waiting instead of reporting no urgent care", () => {
    const html = renderAskView([makeTask({})]);

    expect(html).toContain("1 care item waiting");
    expect(html).not.toContain("No urgent care today");
  });

  it("keeps today wording when nothing is overdue", () => {
    const html = renderAskView([makeTask({ due_on: isoDaysFromToday(0) })]);

    expect(html).toContain("1 care item today");
  });

  it("reports no urgent care when every task is done or future", () => {
    const html = renderAskView([
      makeTask({ status: "done" }),
      makeTask({ id: "future", due_on: isoDaysFromToday(5) })
    ]);

    expect(html).toContain("No urgent care today");
  });
});
