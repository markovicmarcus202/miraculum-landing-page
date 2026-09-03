import { Reveal } from "./Reveal";

const points = [
  {
    them: "Ste jeden z desiatok klientov, ktorému sa venujú medzi iným.",
    us: "Sme malý tím — poznáme váš biznis do detailu a záleží nám na výsledku.",
  },
  {
    them: "Neviete, čo sa deje s vašou kampaňou, kým nepríde mesačný report.",
    us: "Vždy viete, čo sa aktuálne deje — máte nás k dispozícii 24/7.",
  },
  {
    them: "Komunikujete cez account managera, ktorý všetko len posúva ďalej.",
    us: "Hovoríte priamo s ľuďmi, ktorí to reálne robia.",
  },
  {
    them: "Dostanete rovnaké šablónovité riešenie ako každý iný klient.",
    us: "Všetko je šité na mieru vášmu biznisu a odvetviu.",
  },
  {
    them: "Zmena alebo úprava trvá týždne, kým sa dostane k správnemu človeku.",
    us: "Zmeny riešime v priebehu dní, nie týždňov.",
  },
];

export function Comparison() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-24">
      <Reveal as="h2" className="text-3xl md:text-4xl font-extrabold mb-10 max-w-2xl text-pretty">
        Prečo nie veľká agentúra?
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Reveal>
          <div className="glass glass-edge p-6 sm:p-8 h-full">
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
                style={{ borderColor: "var(--color-brand-border-dark)" }}
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </span>
              <h3 className="text-lg font-extrabold text-white/70">Veľká agentúra</h3>
            </div>
            <ul className="mt-6 space-y-4">
              {points.map((p) => (
                <li key={p.them} className="text-sm text-white/60 leading-relaxed">
                  {p.them}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="glass glass-edge glass-glow p-6 sm:p-8 h-full" style={{ borderColor: "rgba(29,158,117,0.3)" }}>
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(29,158,117,0.15)" }}
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-green-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <h3 className="text-lg font-extrabold text-white">Miraculum</h3>
            </div>
            <ul className="mt-6 space-y-4">
              {points.map((p) => (
                <li key={p.us} className="text-sm text-white/85 leading-relaxed">
                  {p.us}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
