import { redirect } from "next/navigation";

function buildMyPropertyRedirect(searchParams: Record<string, string | string[] | undefined> | undefined) {
  const nextParams = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (Array.isArray(value)) {
      for (const item of value) nextParams.append(key, item);
    } else if (value) {
      nextParams.set(key, value);
    }
  }

  const query = nextParams.toString();
  return `/app/my-property${query ? `?${query}` : ""}`;
}

export default async function PrototypeNotebookHome({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  redirect(buildMyPropertyRedirect(await searchParams));
}
