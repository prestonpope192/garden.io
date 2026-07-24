import Link from "next/link";
import { SpecimenLabel } from "@/components/journal-primitives";

export default function NotFound() {
  return (
    <main className="garden-auth">
      <section className="garden-auth__panel">
        <SpecimenLabel tone="clay">Unlabeled specimen</SpecimenLabel>
        <h1>This page isn&apos;t in the journal.</h1>
        <p>The link may be old, or this page may have moved to a different spread.</p>
        <div className="garden-auth__links">
          <Link className="garden-auth__secondary" href="/">
            Back to Garden.io
          </Link>
          <Link className="garden-auth__secondary" href="/app/my-property">
            Open your garden
          </Link>
          <Link className="garden-auth__secondary" href="/catalog">
            Choose plants
          </Link>
        </div>
      </section>
    </main>
  );
}
