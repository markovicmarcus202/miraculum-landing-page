import { useCallback, useEffect, useRef, useState } from "react";

const testimonials = [
  { name: "MUDr. Jana Kováčová", role: "Klinika Dermalux" },
  { name: "Peter Novák", role: "CEO, MedGroup" },
  { name: "Lucia Horváthová", role: "Marketing, DentaPlus" },
  { name: "Tomáš Bartoš", role: "Riaditeľ, VitaCare" },
];

function PlayIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-brand-green)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}

export function TestimonialsRow() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  const scrollToIndex = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i] as HTMLElement | undefined;
    if (!card) return;
    const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
    track.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        Array.from(track.children).forEach((child, i) => {
          const el = child as HTMLElement;
          const c = el.offsetLeft + el.clientWidth / 2;
          const d = Math.abs(c - center);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    // Start with the first card centered
    requestAnimationFrame(() => scrollToIndex(0));
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [scrollToIndex]);

  return (
    <div>
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-[calc((100vw-260px)/2)] sm:px-6 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((t, i) => {
          const isActive = i === active;
          return (
            <figure
              key={t.name}
              className="snap-center shrink-0 w-[260px] glass glass-hover glass-glow rounded-[16px] transition-all duration-500"
              style={{
                transform: isActive ? "scale(1)" : "scale(0.94)",
                opacity: isActive ? 1 : 0.6,
              }}
            >
              <div
                className="w-full aspect-9/16 flex items-center justify-center relative"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(10,15,30,0.92) 55%, rgba(29,158,117,0.08) 100%)",
                }}
              >
                <PlayIcon size={56} />
              </div>
              <figcaption className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-white font-extrabold text-sm truncate">{t.name}</div>
                  <div
                    className="my-2 h-px w-8"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--color-brand-green-light), var(--color-brand-green))",
                    }}
                  />
                  <div className="text-brand-green-light text-xs truncate">{t.role}</div>
                </div>
                <div
                  className="shrink-0 w-12 h-12 rounded-[10px] border flex items-center justify-center"
                  style={{ borderColor: "rgba(255,255,255,0.12)" }}
                >
                  <PlayIcon />
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>

      {/* dots */}
      <div className="mt-6 flex items-center justify-center gap-2.5">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            type="button"
            aria-label={`Recenzia ${i + 1}`}
            onClick={() => scrollToIndex(i)}
            className="h-2.5 rounded-full transition-all duration-400"
            style={{
              width: i === active ? 24 : 10,
              background:
                i === active
                  ? "linear-gradient(90deg, var(--color-brand-green-light), var(--color-brand-green))"
                  : "rgba(255,255,255,0.18)",
            }}
          />
        ))}
      </div>

      {/* arrows */}
      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Predchádzajúca recenzia"
          onClick={() => scrollToIndex(Math.max(0, active - 1))}
          className="glass glass-hover w-11 h-11 rounded-full flex items-center justify-center text-brand-green-light"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Ďalšia recenzia"
          onClick={() => scrollToIndex(Math.min(testimonials.length - 1, active + 1))}
          className="glass glass-hover w-11 h-11 rounded-full flex items-center justify-center text-brand-green-light"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
