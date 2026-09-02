import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "../components/Logo";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy policy | Marketing a videoprodukcia pre healthcare" },
      {
        name: "description",
        content: "Ako spracovávame vaše osobné údaje pri spolupráci s nami.",
      },
      { property: "og:title", content: "Privacy policy | Marketing a videoprodukcia pre healthcare" },
      {
        property: "og:description",
        content: "Ako spracovávame vaše osobné údaje pri spolupráci s nami.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy policy</h1>
        <div className="space-y-6 text-sm md:text-base text-white/80 leading-relaxed">
          <p>
            Táto stránka popisuje, ako zhromažďujeme, používame a chránime vaše osobné údaje pri používaní našich služieb a kontaktovaní s nami.
          </p>
          <h2 className="text-lg font-semibold text-white mt-8">Aké údaje zhromažďujeme</h2>
          <p>
            Pri vypĺňaní kontaktného formulára alebo kalkulačky môžeme zhromažďovať meno, názov firmy, e-mail, telefónne číslo a informácie o vašich marketingových potrebách.
          </p>
          <h2 className="text-lg font-semibold text-white mt-8">Ako údaje používame</h2>
          <p>
            Údaje používame výlučne na komunikáciu s vami, prípravu ponuky a zlepšovanie našich služieb. Bez vášho súhlasu ich neposkytujeme tretím stranám na marketingové účely.
          </p>
          <h2 className="text-lg font-semibold text-white mt-8">Cookies a analytika</h2>
          <p>
            Na stránke môžeme používať základné analytické nástroje, ktoré nám pomáhajú pochopiť, ako návštevníci používajú stránku. Nezhromažďujeme citlivé zdravotné údaje.
          </p>
          <h2 className="text-lg font-semibold text-white mt-8">Vaše práva</h2>
          <p>
            Máte právo na prístup k svojim údajom, ich opravu, vymazanie alebo obmedzenie spracovania. Kontaktujte nás na e-mailoch uvedených v pätičke úvodnej stránky.
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
