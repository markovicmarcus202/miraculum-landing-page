import { useState } from "react";

const faqs = [
  {
    question: "Aké služby ponúkate?",
    answer:
      "Ponúkame komplexné marketingové služby zamerané na rast zdravotníckych firiem na sociálnych sieťach: správa sociálnych sietí, tvorba short-form videí, reklamné kampane, obsahová stratégia a scenáre, rast značky a online prítomnosti.",
  },
  {
    question: "Prečo by sme mali investovať do videoobsahu v healthcare?",
    answer:
      "Video vytvára dôveru skôr, ako klient príde do ambulánie. Pacienti sa cez video lepšie zorientujú v procese, poznajú lekára aj prostredie, a sú tak ochotnejší objednať sa alebo využiť vaše služby.",
  },
  {
    question: "Čo znamená 'merateľný marketing' v praxi?",
    answer:
      "Každý krok spájame s číslom: cena za získaného klienta, hodnota objednávky, ušetrené hodiny administratívy. Vidíte presne, čo vám marketing prináša a kde ešte zlepšovať.",
  },
  {
    question: "Nahrádzate interný marketingový tím?",
    answer:
      "Áno. Tvoríme obsah efektívnejšie — s nižšími nákladmi a s merateľnými výsledkami. Spolupracujeme s vaším tímom, dopĺňame ho o to, čo interne nestíhate, a každý krok vyčíslime v konkrétnych číslach.",
  },
  {
    question: "Ako dlho trvá výroba jedného videa?",
    answer:
      "Od konceptu po finálny strih bežne 2–4 týždne. Závisí to od rozsahu — jednoduché rozhovory sú rýchlejšie, komplexnejšie produkcie s viacerými lokáciami trvajú dlhšie. Termín vždy dohodneme dopredu.",
  },
  {
    question: "Čo ak ešte nevieme, aký obsah by sme mali tvoriť?",
    answer:
      "Nechajte to na nás. Prejdeme vaše procesy, konkurenciu a publikum, a navrhneme, ktoré témy a formáty vám prinesú najviac — bez zbytočného plytvania rozpočtom.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="glass glass-edge glass-glow rounded-[16px] transition-all duration-300"
            style={{
              borderColor: isOpen
                ? "color-mix(in oklab, var(--color-brand-green) 40%, transparent)"
                : undefined,
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm md:text-base font-bold text-white">{item.question}</span>
              <span
                className="shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-brand-green transition-transform duration-200"
                style={{ borderColor: "var(--color-brand-border-dark)" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </button>
            <div
              className="px-5 overflow-hidden transition-all duration-300 ease-out"
              style={{
                maxHeight: isOpen ? "320px" : "0px",
                opacity: isOpen ? 1 : 0,
                paddingBottom: isOpen ? "20px" : "0px",
              }}
            >
              <p className="text-sm text-white/70 leading-relaxed">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
