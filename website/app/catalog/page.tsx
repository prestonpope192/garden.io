import Link from "next/link";
import { PublicCatalogueBrowser } from "@/components/public-catalogue-browser";
import { getPlantProfiles } from "@/lib/plant-profile-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function PublicCataloguePage() {
  const plantProfiles = (await getPlantProfiles()).filter((plant) => plant.is_published);

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
          <a href="#browse">Browse Plants</a>
          <a href="#how">How it works</a>
        </nav>

        <div className="topbar__actions">
          <Link className="topbar-secondary" href="/app/my-property">
            Explore App
          </Link>
          <Link className="topbar-cta" href="/#join">
            Join Waitlist
          </Link>
        </div>
      </header>

      <PublicCatalogueBrowser plantProfiles={plantProfiles} />
    </main>
  );
}
