import { notFound, redirect } from "next/navigation";
import { isSampleGardenEnabled } from "@/lib/sample-garden";

export default function SampleGardenPage() {
  if (!isSampleGardenEnabled()) {
    notFound();
  }

  redirect("/tour/ask");
}
