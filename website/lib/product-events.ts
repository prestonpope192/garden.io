export const PRODUCT_EVENTS = [
  "app_opened",
  "observation_saved",
  "care_task_added",
  "care_task_completed",
  "diagnosis_saved"
] as const;

export type ProductEventName = (typeof PRODUCT_EVENTS)[number];
export type ProductEventMetadata = Record<string, string | number | boolean | null>;

export function isProductEventName(value: unknown): value is ProductEventName {
  return typeof value === "string" && PRODUCT_EVENTS.includes(value as ProductEventName);
}

export function sanitizeProductEventMetadata(value: unknown): ProductEventMetadata {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const output: ProductEventMetadata = {};
  for (const [key, item] of Object.entries(value)) {
    if (!/^[a-z][a-z0-9_]{0,40}$/.test(key)) continue;
    if (typeof item === "string") output[key] = item.slice(0, 120);
    else if (typeof item === "number" && Number.isFinite(item)) output[key] = item;
    else if (typeof item === "boolean" || item === null) output[key] = item;
  }
  return output;
}

export function recordProductEvent(eventName: ProductEventName, metadata: ProductEventMetadata = {}) {
  if (typeof window === "undefined") return;
  void fetch("/api/analytics/events", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventName, metadata })
  }).catch(() => undefined);
}
