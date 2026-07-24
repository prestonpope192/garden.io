import { notFound } from "next/navigation";
import { GardenAppPreview } from "@/components/garden-app-preview";
import { buildDemoGardenSnapshot } from "@/lib/demo-garden-snapshot";
import { isSampleGardenEnabled, isSampleGardenView } from "@/lib/sample-garden";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function TourViewPage({
  params
}: {
  params: Promise<{ view: string }>;
}) {
  if (!isSampleGardenEnabled()) {
    notFound();
  }

  const { view } = await params;
  if (!isSampleGardenView(view)) {
    notFound();
  }

  return (
    <GardenAppPreview
      basePath="/tour"
      snapshot={buildDemoGardenSnapshot([])}
      view={view}
    />
  );
}
