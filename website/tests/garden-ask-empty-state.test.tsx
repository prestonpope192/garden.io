// @vitest-environment jsdom
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { GardenAskView } from "@/components/views/garden-ask-view";

const diagnosis = {
  summary: "Give the plant a drink and check the soil again tomorrow.",
  causes: [],
  actions: ["Water slowly at the soil line."],
  follow_up: "Watch for leaves that stay wilted after watering."
};

function renderEmptyAsk(overrides: { askGarden?: typeof vi.fn } = {}) {
  const quickLog = vi.fn(async () => undefined);
  const addTask = vi.fn(async () => undefined);
  const updateTaskStatus = vi.fn(async () => undefined);
  const askGarden = overrides.askGarden ?? vi.fn(async () => diagnosis);

  render(
    createElement(GardenAskView, {
      activeProperty: null,
      zones: [],
      beds: [],
      plants: [],
      observations: [],
      tasks: [],
      isSaving: false,
      quickLog,
      addTask,
      updateTaskStatus,
      askGarden,
      promptExamples: ["What should I do first?"]
    })
  );

  return { quickLog, addTask, askGarden };
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("GardenAskView without a saved property", () => {
  it("answers a text question while keeping note and care persistence disabled", async () => {
    const { quickLog, addTask, askGarden } = renderEmptyAsk();
    const prompt = screen.getByRole("textbox", { name: "Ask about your garden" });

    fireEvent.change(prompt, { target: { value: "Why are my leaves wilting?" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await screen.findByRole("heading", { name: diagnosis.summary });
    expect(askGarden).toHaveBeenCalledWith(
      expect.objectContaining({
        symptoms: "Why are my leaves wilting?",
        imageDataUrl: null
      })
    );
    expect(screen.getByRole("link", { name: "Get started" }).getAttribute("href")).toBe("/app/my-garden");
    expect((screen.getByRole("button", { name: "Keep note" }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("button", { name: "Add to weekly care" }) as HTMLButtonElement).disabled).toBe(true);
    expect(quickLog).not.toHaveBeenCalled();
    expect(addTask).not.toHaveBeenCalled();
  });

  it("submits a photo question before setup without calling persistence handlers", async () => {
    const askGarden = vi.fn(async () => diagnosis);
    const { quickLog, addTask } = renderEmptyAsk({ askGarden });
    const fileInput = document.querySelector('input[type="file"]');
    const photo = new File(["photo bytes"], "garden.jpg", { type: "image/jpeg" });
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:garden-photo"),
      revokeObjectURL: vi.fn()
    });
    class FailingImage {
      onerror: (() => void) | null = null;

      set src(_value: string) {
        this.onerror?.();
      }
    }
    vi.stubGlobal("Image", FailingImage);

    expect(fileInput).not.toBeNull();
    fireEvent.change(fileInput as HTMLInputElement, { target: { files: [photo] } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await screen.findByRole("heading", { name: diagnosis.summary });
    expect(askGarden).toHaveBeenCalledWith(
      expect.objectContaining({
        symptoms: "",
        imageDataUrl: expect.stringMatching(/^data:image\/jpeg;base64,/)
      })
    );
    expect((screen.getByRole("button", { name: "Keep note" }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("button", { name: "Add to weekly care" }) as HTMLButtonElement).disabled).toBe(true);
    expect(quickLog).not.toHaveBeenCalled();
    expect(addTask).not.toHaveBeenCalled();
  });
});
