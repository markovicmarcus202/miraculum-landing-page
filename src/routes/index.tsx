import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "../components/Logo";
import { TestimonialsRow } from "../components/TestimonialsRow";
import { Reveal } from "../components/Reveal";
import { ProcessTimeline } from "../components/ProcessTimeline";
import { Faq } from "../components/Faq";
import { Services } from "../components/Services";
import { ScrollProgress } from "../components/ScrollProgress";
import { ConsultationDialog } from "../components/ConsultationDialog";

import { handleAnchorClick } from "../lib/scrollToAnchor";
import { trackCta } from "../lib/trackCta";
import { openConsultation } from "../lib/consultationDialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marketing a videoprodukcia pre healthcare" },
      {
        name: "description",
        content:
          "Pomáhame zdravotníckym firmám, ktoré strácajú čas a peniaze na manuálnom marketingu cez Excel, WhatsApp a e-mail.",
      },
      { property: "og:title", content: "Marketing a videoprodukcia pre healthcare" },
      {
        property: "og:description",
        content:
          "Nájdeme miesta, kde vám unikajú peniaze, a každé zlepšenie vyčíslime v eurách.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const navLinks = [
  { href: "#domov", label: "Domov" },
  { href: "#o-nas", label: "O nás" },
  { href: "#sluzby", label: "Služby" },
  { href: "#proces", label: "Proces" },
  { href: "#recenzie", label: "Recenzie" },
  { href: "#kontakt", label: "Kontakt" },
];

const values = [
  {
    title: "Merateľné výsledky",
    text: "Každé zlepšenie vyčíslime v eurách, nie v pocitoch.",
    icon: (
      <>
        <path d="M3 3v18h18" />
        <path d="M7 15l4-4 3 3 5-6" />
      </>
    ),
  },
  {
    title: "Zameranie na healthcare",
    text: "Rozumieme klinikám, ambulanciám a zdravotníckym firmám.",
    icon: (
      <>
        <path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z" />
      </>
    ),
  },
  {
    title: "Bez zbytočnej práce",
    text: "Automatizujeme to, čo teraz beží cez Excel, WhatsApp a e-mail.",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
      </>
    ),
  },
  {
    title: "Video, ktoré predáva",
    text: "Produkcia, ktorá privádza klientov, nie len zbiera lajky.",
    icon: (
      <>
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </>
    ),
  },
];

function Landing() {
  return (
    <div id="domov" className="relative min-h-screen bg-brand-navy text-white">
      <ScrollProgress />
      <ConsultationDialog />
      <div className="aurora" aria-hidden="true" />
      <div className="grid-global" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <div className="relative z-10">
        {/* HEADER / NAV */}
        <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
          <div
            className="max-w-6xl mx-auto rounded-full border px-3 sm:px-5 h-14 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:flex md:justify-between"
            style={{
              backgroundColor: "rgba(10,15,30,0.62)",
              borderColor: "rgba(255,255,255,0.09)",
              backdropFilter: "blur(22px) saturate(160%)",
            }}
          >
            <a
              href="#domov"
              onClick={(e) => handleAnchorClick(e, "#domov")}
              className="flex items-center gap-2 text-white pl-1"
            >
              <Logo size={34} className="text-white" />
            </a>
            <nav className="hidden md:flex items-center gap-6 text-[13px] text-white/70">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleAnchorClick(e, l.href)}
                  className="focus-brand hover:text-white transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => {
                trackCta({ cta: "Nezáväzná konzultácia", location: "header" });
                openConsultation("header");
              }}
              className="btn-liquid inline-flex shrink-0 items-center rounded-full px-4 py-2 text-[13px] font-bold text-white"
            >
              Nezáväzná konzultácia
            </button>
          </div>
        </header>

        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-16 md:pt-28 md:pb-24">
            <Reveal
              as="h1"
              delay={90}
              className="display text-[2.6rem] md:text-[4.75rem] font-black leading-[1.06] tracking-tight max-w-4xl text-pretty text-shimmer"
            >
              Máte tím aj klientov, ale strácate čas a peniaze na ručnom marketingu?
            </Reveal>

            <Reveal delay={220} className="mt-9 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  trackCta({ cta: "Vyplniť formulár", location: "hero" });
                  openConsultation("hero");
                }}
                className="btn-liquid btn-shine inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold text-white"
              >
                Vyplniť formulár
                <span className="btn-arrow" aria-hidden="true">→</span>
              </button>
              <a
                href="#sluzby"
                onClick={(e) => handleAnchorClick(e, "#sluzby")}
                className="focus-brand inline-flex items-center justify-center rounded-full border px-6 py-4 text-sm font-bold text-white/85 hover:text-white transition-colors"
                style={{ borderColor: "var(--color-brand-border-dark)" }}
              >
                Pozrieť služby
              </a>
            </Reveal>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="recenzie" className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <Reveal className="mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-pretty">
              Čo hovoria ľudia, s ktorými sme pracovali?
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <TestimonialsRow />
          </Reveal>
          <Reveal delay={200} className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => {
                trackCta({ cta: "Vyplniť formulár", location: "recenzie" });
                openConsultation("recenzie");
              }}
              className="btn-liquid inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-bold text-white"
            >
              Chcem podobné výsledky
              <span className="btn-arrow" aria-hidden="true">→</span>
            </button>
          </Reveal>
        </section>

        {/* ABOUT US */}
        <section id="o-nas" className="py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal>
              <div className="glass glass-edge glass-glow p-6 sm:p-8 md:p-12">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-green-light mb-4">
                  O nás
                </p>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white max-w-3xl text-pretty">
                  Malý tím, s ktorým budete v priamom kontakte.
                </h2>
                <p className="mt-5 max-w-3xl text-sm md:text-base text-white/70 leading-relaxed">
                  Nie sme veľká agentúra s desiatkami klientov na jedného človeka. Sme tím, ktorý
                  pozná váš biznis, dvíha telefón a rieši veci priamo s vami — od prvého rozhovoru
                  až po výsledky, ktoré si spolu odsledujeme.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* VALUES */}
        <section className="max-w-6xl mx-auto px-6 pb-20 md:pb-24">
          <Reveal as="h2" className="text-3xl md:text-4xl font-extrabold mb-10 max-w-2xl text-pretty">
            V čom sme iní?
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <div className="glass glass-edge glass-hover glass-glow p-5 h-full">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-brand-green)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {v.icon}
                  </svg>
                  <h3 className="mt-4 text-base font-extrabold text-white">{v.title}</h3>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Services />

        {/* PROCESS */}
        <section id="proces" className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <Reveal as="h2" className="text-3xl md:text-4xl font-extrabold mb-12 max-w-2xl text-pretty">
            Ako to celé prebieha?
          </Reveal>
          <ProcessTimeline />
          <Reveal delay={150} className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => {
                trackCta({ cta: "Vyplniť formulár", location: "proces" });
                openConsultation("proces");
              }}
              className="btn-liquid btn-shine inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-bold text-white"
            >
              Vyplniť formulár
              <span className="btn-arrow" aria-hidden="true">→</span>
            </button>
          </Reveal>
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <Reveal as="h2" className="text-3xl md:text-4xl font-extrabold mb-10 max-w-2xl text-pretty">
            FAQ
          </Reveal>
          <Reveal delay={120}>
            <Faq />
          </Reveal>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-6xl mx-auto px-6 pb-20 md:pb-24">
          <Reveal>
            <div className="glass glass-edge glass-glow p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white text-pretty">
                Zistite za minútu, čo vo vašom marketingu opraviť ako prvé.
              </h2>
              <p className="mt-4 text-sm md:text-base text-white/70">
                8 krátkych otázok. Ozveme sa do 24 hodín s konkrétnym návrhom.
              </p>
              <button
                type="button"
                onClick={() => {
                  trackCta({ cta: "Nezáväzná konzultácia", location: "final-cta" });
                  openConsultation("final-cta");
                }}
                className="btn-liquid btn-shine mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-white"
              >
                Nezáväzná konzultácia
                <span className="btn-arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </Reveal>
        </section>

        {/* FOOTER */}
        <footer
          id="kontakt"
          className="border-t"
          style={{ borderColor: "var(--color-brand-border-dark)" }}
        >
          <div className="max-w-6xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 text-white">
                <Logo size={28} className="text-white" />
              </div>
              <p className="mt-4 text-sm text-brand-gray max-w-xs">
                Marketing a videoprodukcia pre healthcare — merateľné výsledky, menej zbytočnej
                práce.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-green-light mb-4">
                Kontakt
              </p>
              <ul className="space-y-3 text-sm text-white/80">
                <li>
                  Marcus Markovič
                  <div>
                    <a
                      href="tel:+421910677657"
                      className="text-brand-green hover:text-brand-green-light transition-colors"
                    >
                      +421 910 677 657
                    </a>
                  </div>
                  <div>
                    <a
                      href="mailto:markovicmarcus202@gmail.com"
                      className="text-brand-green hover:text-brand-green-light transition-colors"
                    >
                      markovicmarcus202@gmail.com
                    </a>
                  </div>
                </li>
                <li>
                  Šimon Stančík
                  <div>
                    <a
                      href="tel:+421910557401"
                      className="text-brand-green hover:text-brand-green-light transition-colors"
                    >
                      +421 910 557 401
                    </a>
                  </div>
                  <div>
                    <a
                      href="mailto:simon.stancik.sk@gmail.com"
                      className="text-brand-green hover:text-brand-green-light transition-colors"
                    >
                      simon.stancik.sk@gmail.com
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-green-light mb-4">
                Navigácia
              </p>
              <ul className="space-y-2 text-sm text-white/80">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={(e) => handleAnchorClick(e, l.href)}
                      className="hover:text-brand-green-light transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t" style={{ borderColor: "var(--color-brand-border-dark)" }}>
            <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row gap-3 sm:gap-6 justify-between items-start sm:items-center text-xs text-brand-gray">
              <span>© {new Date().getFullYear()} Miraculum.</span>
              <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                <Link to="/privacy-policy" className="hover:text-brand-green-light transition-colors">
                  Privacy policy
                </Link>
                <Link
                  to="/terms-of-service"
                  className="hover:text-brand-green-light transition-colors"
                >
                  Terms of service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
