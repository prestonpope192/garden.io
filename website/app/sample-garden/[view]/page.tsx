import { notFound, redirect } from "next/navigation";
import { isSampleGardenEnabled, isSampleGardenView } from "@/lib/sample-garden";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function SampleGardenViewPage({
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

  redirect(`/tour/${view}`);
}
