import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { openConsultation } from "../lib/consultationDialog";

const services = [
  {
    title: "Organic content",
    description:
      "Reels, TikTok a Shorts, ktoré budujú dôveru a privádzajú pacientov bez platenej reklamy.",
    icon: (
      <>
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </>
    ),
  },
  {
    title: "Meta ads",
    description:
      "Kampane na Facebooku a Instagrame nastavené na objednávky, nie na lajky — s jasným reportom.",
    icon: (
      <>
        <path d="M3 3v18h18" />
        <path d="M7 15l4-4 3 3 5-6" />
      </>
    ),
  },
  {
    title: "Interné systémy",
    description:
      "Automatizujeme to, čo dnes beží cez Excel, WhatsApp a e-mail — menej ručnej práce, menej chýb.",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
      </>
    ),
  },
  {
    title: "CRM na mieru",
    description:
      "Pacienti, objednávky, faktúry a úlohy na jednom mieste. Pozrite si živú ukážku systému.",
    to: "/crm-ukazka",
    linkLabel: "Zobraziť ukážku CRM →",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" />
        <path d="M8 13h5" />
        <path d="M8 16h8" />
      </>
    ),
  },
  {
    title: "Weby a landing pages",
    description:
      "Rýchle stránky, ktoré vysvetlia službu a dovedú návštevníka k objednávke — nie len vizitka.",
    icon: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </>
    ),
  },
  {
    title: "Branding a rebranding",
    description:
      "Logo, farby, tón komunikácie a vizuálny systém, ktorý vyzerá dôveryhodne v zdravotníctve.",
    icon: (
      <>
        <path d="M12 2l3 6 6 1-4.5 4.3 1 6.2-5.5-3-5.5 3 1-6.2L3 9l6-1z" />
      </>
    ),
  },
];

export function Services() {
  return (
    <section id="sluzby" className="max-w-6xl mx-auto px-6 py-20 md:py-24">
      <Reveal as="h2" className="text-3xl md:text-4xl font-extrabold mb-10 max-w-2xl text-pretty">
        Aké služby ponúkame?
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 100}>
            <div className="glass glass-edge glass-hover glass-glow p-5 h-full flex flex-col">
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
                {s.icon}
              </svg>
              <h3 className="mt-4 text-base font-extrabold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{s.description}</p>
              {s.to && (
                <Link
                  to={s.to}
                  className="focus-brand mt-4 inline-flex text-sm font-bold text-brand-green hover:text-brand-green-light transition-colors"
                >
                  {s.linkLabel}
                </Link>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120} className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={() => openConsultation("sluzby")}
          className="btn-liquid btn-shine inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-bold text-white"
        >
          Vyplniť formulár
          <span className="btn-arrow" aria-hidden="true">→</span>
        </button>
      </Reveal>
    </section>
  );
}
