import type { GardenAppView } from "@/components/garden-app-preview";

export const sampleGardenViews: GardenAppView[] = ["ask", "property", "calendar", "plants", "catalogue"];

export function isSampleGardenEnabled() {
  return process.env.NEXT_PUBLIC_DISABLE_SAMPLE_GARDEN !== "true";
}

export function isSampleGardenView(view: string): view is GardenAppView {
  return sampleGardenViews.includes(view as GardenAppView);
}
