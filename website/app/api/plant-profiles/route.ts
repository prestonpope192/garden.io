import { NextResponse } from "next/server";
import { getPlantProfiles } from "@/lib/plant-profile-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug")?.trim();
    const profiles = await getPlantProfiles(slug || undefined);

    return NextResponse.json({ ok: true, profiles });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unable to load plant profiles."
      },
      { status: 500 }
    );
  }
}
