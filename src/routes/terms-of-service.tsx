import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "../components/Logo";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms of service | Marketing a videoprodukcia pre healthcare" },
      {
        name: "description",
        content: "Všeobecné podmienky spolupráce pri marketingu a videoprodukcii pre healthcare.",
      },
      { property: "og:title", content: "Terms of service | Marketing a videoprodukcia pre healthcare" },
      {
        property: "og:description",
        content: "Všeobecné podmienky spolupráce pri marketingu a videoprodukcii pre healthcare.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsOfService,
});

function TermsOfService() {
  return (
    <div className="min-h-screen bg-brand-navy text-white">
      <header
        className="border-b"
        style={{ borderColor: "var(--color-brand-border-dark)" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white">
            <Logo size={36} className="text-white" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-brand-green hover:bg-brand-green-dark transition-colors shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Späť na úvod
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of service</h1>
        <div className="space-y-6 text-sm md:text-base text-white/80 leading-relaxed">
          <p>
            Tieto podmienky upravujú používanie našej webstránky a základné pravidlá spolupráce pri marketingových a videoprodukčných službách pre zdravotnícke subjekty.
          </p>
          <h2 className="text-lg font-semibold text-white mt-8">Služby</h2>
          <p>
            Poskytujeme marketingovú stratégiu, videoprodukciu, analýzu procesov a konzultácie pre firmy v oblasti healthcare. Konkrétny rozsah a cena sú vždy dohodnuté v samostatnej ponuke.
          </p>
          <h2 className="text-lg font-semibold text-white mt-8">Zodpovednosť za obsah</h2>
          <p>
            Klient zodpovedá za poskytnutie pravdivých informácií o službách a dodržiavanie príslušnej zdravotníckej a reklamnej legislatívy. My pomáhame pripraviť obsah, ktorý je etický, overiteľný a v súlade so zákonom.
          </p>
          <h2 className="text-lg font-semibold text-white mt-8">Kalkulačka a odhady</h2>
          <p>
            Kalkulačka na stránke slúži iba ako hrubý orientačný odhad. Presné čísla a možnosti úspor ukáže až individuálna diagnostika a ponuka na mieru.
          </p>
          <h2 className="text-lg font-semibold text-white mt-8">Zmeny podmienok</h2>
          <p>
            Podmienky môžeme časom aktualizovať. Aktuálna verzia je vždy dostupná na tejto stránke. Používaním stránky vyjadrujete súhlas s aktuálnym znením.
          </p>
          <p className="text-brand-gray text-xs pt-6">
            Posledná aktualizácia: júl 2026.
          </p>
          <div className="pt-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold text-white bg-brand-green hover:bg-brand-green-dark transition-colors shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              Späť na úvod
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
