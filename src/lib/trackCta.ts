/**
 * Lightweight CTA click tracking.
 *
 * Currently pushes to the dataLayer (when present) and keeps a local
 * fallback log, so no analytics vendor is required yet.
 *
 * TODO(analytics): drop the real provider call in here (GA4 / Meta / CRM)
 * — nothing else in the UI needs to change.
 */
export type CtaEvent = {
  cta: string;
  location: string;
  meta?: Record<string, string | number | boolean>;
};

const STORAGE_KEY = "miraculum:cta-events";

export function trackCta({ cta, location, meta }: CtaEvent) {
  const payload = {
    event: "cta_click",
    cta,
    location,
    ...meta,
    timestamp: new Date().toISOString(),
  };

  if (typeof window === "undefined") return;

  try {
    const w = window as unknown as { dataLayer?: unknown[] };
    if (Array.isArray(w.dataLayer)) w.dataLayer.push(payload);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    stored.push(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored.slice(-50)));
  } catch {
    // tracking must never break the UI
  }
}
