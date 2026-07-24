export function getRealPlantPhotoUrl(url: string | null | undefined) {
  const trimmed = url?.trim();
  if (!trimmed) return null;

  const lower = trimmed.split("?")[0].toLowerCase();
  if (lower.endsWith(".svg")) return null;
  if (lower.includes("/art/plants/") || lower.includes("/art/specimen-")) return null;

  return trimmed;
}

export function getJournalStylePlantImageUrl(url: string | null | undefined) {
  const photoUrl = getRealPlantPhotoUrl(url);
  if (!photoUrl) return null;

  const lower = photoUrl.split("?")[0].toLowerCase();
  if (!lower.includes("/plant-art/")) return null;

  return photoUrl;
}
