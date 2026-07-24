import { describe, expect, it } from "vitest";
import { GARDEN_MUTATION_MESSAGES } from "@/components/garden-app";

describe("garden mutation feedback copy", () => {
  it("guides the first garden setup one step at a time", () => {
    expect(GARDEN_MUTATION_MESSAGES.gardenCreated).toBe(
      "Garden started. Add one place you can picture."
    );
    expect(GARDEN_MUTATION_MESSAGES.gardenUpdated).toBe("Garden details updated.");
    expect(GARDEN_MUTATION_MESSAGES.areaAdded).toBe("Place added. Now give the first plant a bed.");
    expect(GARDEN_MUTATION_MESSAGES.areaUpdated).toBe("Place details updated.");
    expect(GARDEN_MUTATION_MESSAGES.areaRemoved).toBe("Place removed.");
    expect(GARDEN_MUTATION_MESSAGES.bedAdded).toBe("Bed added. Choose the plant for this spot.");
    expect(GARDEN_MUTATION_MESSAGES.bedUpdated).toBe("Bed details updated.");
    expect(GARDEN_MUTATION_MESSAGES.plantAdded).toBe(
      "Plant added. Add a note when you see a change."
    );
    expect(GARDEN_MUTATION_MESSAGES.plantUpdated).toBe("Plant details updated.");
    expect(GARDEN_MUTATION_MESSAGES.careAdded).toBe("Added to weekly care.");
    expect(GARDEN_MUTATION_MESSAGES.careCompleted).toBe("Marked done.");
    expect(GARDEN_MUTATION_MESSAGES.careReopened).toBe("Added back to weekly care.");
    expect(GARDEN_MUTATION_MESSAGES.careUpdated).toBe("Care updated.");
    expect(GARDEN_MUTATION_MESSAGES.careRemoved).toBe("Removed from weekly care.");
    expect(GARDEN_MUTATION_MESSAGES.plantIdeaSaved).toBe("Added to plants to try.");
    expect(GARDEN_MUTATION_MESSAGES.plantIdeaRemoved).toBe("Removed from plants to try.");
    expect(GARDEN_MUTATION_MESSAGES.plantGrowing).toBe("Marked as growing again.");
    expect(GARDEN_MUTATION_MESSAGES.noteSaved).toBe("Note kept with your garden.");
    expect(GARDEN_MUTATION_MESSAGES.noteRemoved).toBe("Note removed from your garden.");
    expect(GARDEN_MUTATION_MESSAGES.addGardenFirst).toBe("Start your garden first so notes and care have a place to land.");
    expect(GARDEN_MUTATION_MESSAGES.resultSaved).toBe("Kept in this plant's journal.");
    expect(GARDEN_MUTATION_MESSAGES.resultRemoved).toBe("Removed from this plant's journal.");
    expect(GARDEN_MUTATION_MESSAGES.savedToGarden).toBe("Kept in your garden.");
    expect(GARDEN_MUTATION_MESSAGES.changeFailed).toBe("That change didn't go through. Check the details and try again.");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Plant added to bed.");
    expect(GARDEN_MUTATION_MESSAGES.gardenCreated).not.toContain("Garden created");
    expect(GARDEN_MUTATION_MESSAGES.gardenCreated).not.toContain("place to grow");
    expect(GARDEN_MUTATION_MESSAGES.gardenCreated).not.toContain("first area");
    expect(GARDEN_MUTATION_MESSAGES.areaAdded).not.toContain("Area created");
    expect(GARDEN_MUTATION_MESSAGES.areaAdded).not.toContain("Area added");
    expect(GARDEN_MUTATION_MESSAGES.areaAdded).not.toContain("Now add a bed");
    expect(GARDEN_MUTATION_MESSAGES.bedAdded).not.toContain("Bed created");
    expect(GARDEN_MUTATION_MESSAGES.bedAdded).not.toContain("Now add a plant");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Your garden is saved. Now name one area.");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Area saved. Now name one bed.");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Bed saved. Now add the plant.");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Plant saved to your garden. Add a note when you notice something.");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Unable to save that change");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("check the fields");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Task added");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Task completed");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Care item");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("care item");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("care plan");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("This Week");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Result saved");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Garden saved.");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Area saved.");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Area details");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Bed saved.");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Plant saved.");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Note saved to your garden.");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Start your garden first, then you can save notes.");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Saved to this plant's journal.");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Saved to your garden.");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Result removed");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("plant's history");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Back in growing plants");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("plant idea");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Saved for later");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("saved plants");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("care reminders can live here");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("when something changes");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Add the first area next");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Add the first bed next");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("Add the first plant next");
    expect(Object.values(GARDEN_MUTATION_MESSAGES).join(" ")).not.toContain("details saved");
  });
});
