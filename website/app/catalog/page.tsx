import Link from "next/link";
import { PublicCatalogueBrowser } from "@/components/public-catalogue-browser";
import { buildDemoGardenSnapshot } from "@/lib/demo-garden-snapshot";
import type { GardenPlantProfile } from "@/lib/garden-app-types";
import { getPlantProfiles } from "@/lib/plant-profile-service";

export const metadata = {
  title: 'Choose Plants | Garden.io',
  description: 'Browse the full plant catalogue and find what grows best in your garden.',
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getPublicPlantProfiles(): Promise<GardenPlantProfile[]> {
  try {
    return (await getPlantProfiles()).filter((plant) => plant.is_published);
  } catch {
    return buildDemoGardenSnapshot([]).plantProfiles.filter((plant) => plant.is_published);
  }
}

export default async function PublicCataloguePage({
  searchParams
}: {
  searchParams?: Promise<{ category?: string; q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const plantProfiles = await getPublicPlantProfiles();

  return (
    <main className="site site--marketing">
      <header className="topbar">
        <div className="topbar__brand">
          <Link className="brand" href="/">
            Garden.io
          </Link>
        </div>

        <nav aria-label="Primary" className="topnav">
          <Link href="/">Home</Link>
          <a href="#browse">Choose plants</a>
        </nav>

        <div className="topbar__actions">
          <Link className="topbar-cta" href="/app/my-property">
            Start your garden
          </Link>
        </div>
      </header>

      <PublicCatalogueBrowser
        initialCategory={resolvedSearchParams?.category}
        initialQuery={resolvedSearchParams?.q}
        plantProfiles={plantProfiles}
      />
    </main>
  );
}
