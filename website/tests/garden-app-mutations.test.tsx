// @vitest-environment jsdom
import { createElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { GARDEN_MUTATION_MESSAGES, GardenApp } from "@/components/garden-app";
import type { GardenProperty } from "@/lib/garden-app-types";
import {
  createDeferred,
  createMockSession,
  createMockSupabaseClient,
  stubPlantProfilesFetch
} from "./support/garden-supabase-mock";

// The mocked supabase client instance is swapped in per-test via this holder.
// `vi.mock` factories below are hoisted by Vitest above all imports in this
// file (including the GardenApp import above), so the factory can only close
// over a `vi.hoisted` reference, not a plain `let`.
const supabaseClientHolder = vi.hoisted(() => ({ current: undefined as unknown }));

vi.mock("@/lib/supabase-browser", () => ({
  createBrowserSupabaseClient: () => supabaseClientHolder.current,
  getBrowserSupabaseConfig: () => ({
    supabaseUrl: "https://example.supabase.co",
    supabaseAnonKey: "anon-key"
  })
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: () => undefined,
    replace: () => undefined
  })
}));

const existingProperty: GardenProperty = {
  id: "property-1",
  owner_user_id: "user-1",
  name: "Persisted Garden",
  label: "Garden",
  region: null,
  growing_zone: null,
  season: null,
  notes: null,
  latitude: null,
  longitude: null,
  location_label: null,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z"
};

function renderPropertyView() {
  return render(createElement(GardenApp, { authResult: null, view: "property" }));
}

beforeEach(() => {
  supabaseClientHolder.current = undefined;
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("GardenRecordsApp mutations (mocked Supabase)", () => {
  it("shows the success notice and re-fetches the snapshot after a successful mutation", async () => {
    stubPlantProfilesFetch([]);
    const session = createMockSession();
    const mock = createMockSupabaseClient({ session, tables: {} });
    supabaseClientHolder.current = mock.client;

    renderPropertyView();

    await screen.findByText("Start with the place you grow.");
    expect(mock.countFrom("garden_zones")).toBe(1); // one select during initial load

    fireEvent.change(screen.getByLabelText("Garden name"), {
      target: { value: "New Backyard" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Start your garden" }));

    await screen.findByText(GARDEN_MUTATION_MESSAGES.gardenCreated);

    // The mutation itself hit garden_properties with an insert...
    expect(
      mock.mutations.some((entry) => entry.table === "garden_properties" && entry.op === "insert")
    ).toBe(true);
    // ...and runMutation refetched only the affected table, not the full
    // snapshot.
    expect(mock.countFrom("garden_properties")).toBe(3);
    expect(mock.countFrom("garden_zones")).toBe(1);
  });

  it("shows the failure notice, does not crash, and keeps the previous snapshot on a failed mutation", async () => {
    stubPlantProfilesFetch([]);
    const session = createMockSession();
    const mock = createMockSupabaseClient({
      session,
      tables: {
        garden_properties: {
          insertSingle: { data: null, error: { message: "insert failed" } }
        }
      }
    });
    supabaseClientHolder.current = mock.client;

    renderPropertyView();

    await screen.findByText("Start with the place you grow.");

    fireEvent.change(screen.getByLabelText("Garden name"), {
      target: { value: "Doomed Garden" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Start your garden" }));

    await screen.findByText(GARDEN_MUTATION_MESSAGES.changeFailed);
    expect(screen.getByRole("alert").textContent).toBe(GARDEN_MUTATION_MESSAGES.changeFailed);

    // Didn't crash: the previous (empty) snapshot's first-run form is still shown.
    expect(screen.getByText("Start with the place you grow.")).toBeTruthy();

    // A failed mutation must not trigger a snapshot reload: loadGardenData
    // only ran once, at initial mount.
    expect(mock.countFrom("garden_zones")).toBe(1);
  });

  it("renders the unable-to-load error state when a critical initial select fails", async () => {
    stubPlantProfilesFetch([]);
    const session = createMockSession();
    const mock = createMockSupabaseClient({
      session,
      tables: {
        garden_properties: { select: { data: null, error: { message: "boom" } } }
      }
    });
    supabaseClientHolder.current = mock.client;

    renderPropertyView();

    await screen.findByText("Unable to load your garden. Please refresh and try again.");
    expect(screen.getByRole("alert").textContent).toBe(
      "Unable to load your garden. Please refresh and try again."
    );
  });

  it("keeps previously rendered content visible while a mutation's snapshot reload is pending", async () => {
    stubPlantProfilesFetch([]);
    const session = createMockSession();
    const deferred = createDeferred<{ data: unknown[] | null; error: null }>();
    let reloadRequested = false;

    const mock = createMockSupabaseClient({
      session,
      tables: {
        garden_properties: {
          select: { data: [existingProperty], error: null }
        },
        garden_zones: {
          select: [
            { data: [], error: null }, // initial load: resolves immediately
            () => {
              reloadRequested = true;
              return deferred.promise; // post-mutation targeted reload: held pending until we resolve it
            }
          ]
        }
      }
    });
    supabaseClientHolder.current = mock.client;

    renderPropertyView();

    // "Persisted Garden" appears twice at once (the plot heading and the
    // drawer's scope label), so target the plot heading specifically.
    const gardenHeading = () => screen.getByRole("heading", { level: 2, name: "Persisted Garden" });
    await waitFor(() => expect(gardenHeading()).toBeTruthy());

    fireEvent.click(screen.getByRole("button", { name: "Add first place" }));
    const nameInput = await screen.findByLabelText("Place name");
    fireEvent.change(nameInput, { target: { value: "Kitchen Garden" } });
    fireEvent.click(screen.getByRole("button", { name: "Save this place" }));

    // The reload's garden_zones select is now in flight and held open by
    // the deferred promise; the previously rendered property name must still
    // be on screen the whole time -- no flash to an empty/first-run state.
    await waitFor(() => expect(reloadRequested).toBe(true));
    expect(gardenHeading()).toBeTruthy();

    deferred.resolve({ data: [existingProperty], error: null });

    await screen.findByText(GARDEN_MUTATION_MESSAGES.areaAdded);
    expect(gardenHeading()).toBeTruthy();
  });
});
