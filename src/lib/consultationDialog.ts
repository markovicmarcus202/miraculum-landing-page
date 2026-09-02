const EVENT = "miraculum:open-consultation";

/** Opens the 8-step consultation questionnaire from anywhere in the UI. */
export function openConsultation(location: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { location } }));
}

export function onConsultationOpen(handler: (location: string) => void) {
  const listener = (e: Event) => {
    const detail = (e as CustomEvent<{ location?: string }>).detail;
    handler(detail?.location ?? "unknown");
  };
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
