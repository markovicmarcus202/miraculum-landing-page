import { Reveal } from "./Reveal";

const steps = [
  {
    n: 1,
    title: "Úvodný meeting",
    text: "Ujasníme si ciele, cieľovú skupinu a tón komunikácie vašej značky. Zaujíma nás, čo robíte, komu sa prihovárate a aký výsledok má obsah priniesť.",
  },
  {
    n: 2,
    title: "Obsahová stratégia a scenáre",
    text: "Pripravíme stratégiu a konkrétne scenáre pre short-form videá, analyzujeme vaše odvetvie a navrhneme formáty, ktoré majú potenciál zaujať.",
  },
  {
    n: 3,
    title: "Natáčanie obsahu",
    text: "Zabezpečíme profesionálnu produkciu aj vedenie pred kamerou, aby videá pôsobili prirodzene a v súlade s vašou značkou.",
  },
  {
    n: 4,
    title: "Strih, úprava a publikovanie",
    text: "Materiál spracujeme do dynamických videí optimalizovaných pre jednotlivé platformy a publikujeme na vybraných kanáloch.",
  },
  {
    n: 5,
    title: "Správa účtov a optimalizácia",
    text: "Sledujeme výkonnosť a ďalší obsah prispôsobujeme tomu, čo prináša najlepšie výsledky. Cieľom je dlhodobý rast.",
  },
];

export function ProcessTimeline() {
  return (
    <ol className="relative mx-auto max-w-3xl">
      {steps.map((s, i) => (
        <Reveal key={s.n} delay={i * 90}>
          <li className="relative grid grid-cols-[64px_1fr] gap-5 sm:gap-8 pb-12 last:pb-0">
            {/* connector */}
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute left-[32px] top-16 bottom-0 w-px"
                style={{ backgroundColor: "var(--color-brand-green)", opacity: 0.35 }}
              />
            )}
            <div
              className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border text-lg font-extrabold text-brand-green"
              style={{
                borderColor: "var(--color-brand-border-dark)",
                backgroundColor: "rgba(10,15,30,0.9)",
              }}
            >
              {s.n}
            </div>
            <div className="pt-3">
              <h3 className="text-xl md:text-2xl font-extrabold text-white text-pretty">
                {s.title}
              </h3>
              <p className="mt-2.5 text-sm md:text-base text-white/70 leading-relaxed">{s.text}</p>
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
