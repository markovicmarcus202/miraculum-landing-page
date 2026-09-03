import { useEffect, useState } from "react";
import { z } from "zod";
import { onConsultationOpen } from "../lib/consultationDialog";
import { trackCta } from "../lib/trackCta";

type Question =
  | { id: string; type: "single" | "multi"; question: string; options: string[] }
  | { id: string; type: "contact"; question: string };

export const questions: Question[] = [
  {
    id: "problem",
    type: "multi",
    question: "Aký problém aktuálne riešite?",
    options: [
      "Nemám dostatok nových klientov",
      "Marketing nefunguje / neviem čo funguje",
      "Strácam čas na administratíve",
      "Nemám prehľad v číslach a výkonnosti",
    ],
  },
  {
    id: "social_realistic",
    type: "single",
    question: "Myslíte si, že je pre vás reálne získavať klientov cez sociálne siete?",
    options: [
      "Áno, verím tomu",
      "Skôr áno, ale neviem ako na to",
      "Neviem / nie som si istý",
      "Nie, nemyslím si to",
    ],
  },
  {
    id: "industry",
    type: "single",
    question: "V akom odvetví medicíny podnikáte?",
    options: [
      "Zubná klinika",
      "Estetická medicína",
      "Ambulancia / poliklinika",
      "Iné zdravotnícke odvetvie",
    ],
  },
  {
    id: "acquisition",
    type: "single",
    question: "Ako sa k vám klienti najčastejšie dostavajú dnes?",
    options: [
      "Odporúčania a ústna reklama",
      "Sociálne siete",
      "Platená reklama",
      "Google / web",
    ],
  },
  {
    id: "fear",
    type: "single",
    question: "Aký je váš najväčší strach?",
    options: [
      "Že investujem peniaze a nič to neprinesie",
      "Že to nebudeme stíhať spracovať (viac dopytov ako kapacita)",
      "Že konkurencia bude rásť rýchlejšie",
      "Iné",
    ],
  },
  {
    id: "recurring_system",
    type: "single",
    question: "Máte systém, ktorý vám mesačne generuje stálych klientov?",
    options: [
      "Áno, funguje nám to",
      "Čiastočne, ale nie je to stabilné",
      "Nie, spoliehame sa na náhodu",
      "Nie, a chceme to zmeniť",
    ],
  },
  {
    id: "budget",
    type: "single",
    question: "Aký je váš mesačný rozpočet?",
    options: ["do 500 €", "500 – 1 500 €", "1 500 – 3 000 €", "3 000 € a viac", "Ešte neviem"],
  },
  {
    id: "goal",
    type: "single",
    question: "Čo je pre vás najdôležitejšie?",
    options: [
      "Viac objednávok a klientov",
      "Silnejšia značka a dôvera",
      "Menej administratívy a ručnej práce",
      "Prehľad v číslach a výkonnosti",
    ],
  },
  {
    id: "contact",
    type: "contact",
    question: "Kontakt",
  },
];

const contactSchema = z.object({
  email: z.string().trim().email({ message: "Zadajte platný e-mail" }).max(255),
  phone: z
    .string()
    .trim()
    .min(6, { message: "Zadajte platné telefónne číslo" })
    .max(30)
    .regex(/^[+\d\s()-]+$/, { message: "Telefón môže obsahovať iba čísla a +, -, (, )" }),
});

type Answers = Record<string, string[]>;
type Contact = z.infer<typeof contactSchema>;

const emptyContact: Contact = { email: "", phone: "" };

const SUPABASE_URL = "https://agwydwgvtvfokkmjxycl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnd3lkd2d2dHZmb2trbWp4eWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NTU0NjcsImV4cCI6MjEwMTUzMTQ2N30.fexrI2DkgN0tOOJuBGypyYc0rpsXacXkit3E0TfF7qc";

/** Sends the lead to Supabase (web_leads table). Falls back to localStorage if the request fails. */
async function submitLead(payload: {
  answers: Answers;
  phone: string;
  email: string;
  source: string;
  timestamp: string;
}) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/web_leads`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        prefer: "return=minimal",
      },
      body: JSON.stringify({
        answers: payload.answers,
        phone: payload.phone,
        email: payload.email,
        source: payload.source,
      }),
    });
    if (!res.ok) throw new Error(`Supabase insert failed: ${res.status}`);
  } catch {
    // Never break the UI for the visitor — keep a local fallback copy.
    try {
      const stored = JSON.parse(localStorage.getItem("miraculum:leads") ?? "[]");
      stored.push(payload);
      localStorage.setItem("miraculum:leads", JSON.stringify(stored.slice(-50)));
    } catch {
      /* never break the UI */
    }
  }
}

export function ConsultationDialog() {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("unknown");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [errors, setErrors] = useState<Partial<Record<keyof Contact, string>>>({});
  const [done, setDone] = useState(false);

  useEffect(
    () =>
      onConsultationOpen((location) => {
        setSource(location);
        setStep(0);
        setDone(false);
        setErrors({});
        setOpen(true);
      }),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const q = questions[step];
  const selected = answers[q.id] ?? [];
  const isLast = step === questions.length - 1;

  const pick = (option: string) => {
    setAnswers((prev) => {
      const current = prev[q.id] ?? [];
      if (q.type === "multi") {
        return {
          ...prev,
          [q.id]: current.includes(option)
            ? current.filter((o) => o !== option)
            : [...current, option],
        };
      }
      return { ...prev, [q.id]: [option] };
    });
    if (q.type === "single") setTimeout(() => setStep((s) => Math.min(s + 1, questions.length - 1)), 160);
  };

  const submit = () => {
    const parsed = contactSchema.safeParse(contact);
    if (!parsed.success) {
      const next: Partial<Record<keyof Contact, string>> = {};
      for (const issue of parsed.error.issues) {
        next[issue.path[0] as keyof Contact] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    trackCta({ cta: "Dotazník odoslaný", location: source });
    submitLead({ ...parsed.data, answers, source, timestamp: new Date().toISOString() });
    setDone(true);
  };

  const progress = ((step + (done ? 1 : 0)) / questions.length) * 100;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Nezáväzná konzultácia — dotazník"
    >
      <button
        type="button"
        aria-label="Zavrieť dotazník"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/70"
        style={{ backdropFilter: "blur(6px)" }}
      />
      <div
        className="glass glass-edge relative w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6 sm:p-8"
        style={{ backgroundColor: "rgba(10,15,30,0.94)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-green-light">
            {done ? "Hotovo" : `Otázka ${step + 1} / ${questions.length}`}
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Zavrieť"
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div
          className="mt-3 h-px w-full"
          style={{ backgroundColor: "var(--color-brand-border-dark)" }}
        >
          <div
            className="h-px transition-all"
            style={{ width: `${progress}%`, backgroundColor: "var(--color-brand-green)" }}
          />
        </div>

        {done ? (
          <div className="py-10 text-center">
            <h2 className="text-2xl font-extrabold text-white">Ďakujeme! Ozveme sa vám</h2>
            <p className="mt-3 text-sm text-white/70">
              Vaše odpovede máme. Ozveme sa do 24 hodín na uvedené kontaktné údaje.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-liquid mt-8 inline-flex items-center rounded-full px-6 py-3 text-sm font-bold text-white"
            >
              Zavrieť
            </button>
          </div>
        ) : (
          <>
            <h2 className="mt-5 text-xl sm:text-2xl font-extrabold leading-[1.2] tracking-tight text-white text-pretty">
              {q.question}
            </h2>

            {q.type === "contact" ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["phone", "Telefónne číslo", "+421 900 000 000"],
                    ["email", "Váš e-mail", "info@klinika.sk"],
                  ] as [keyof Contact, string, string][]
                ).map(([field, label, placeholder]) => (
                  <label key={field} className="block text-sm">
                    <span className="text-white/70 leading-relaxed">{label}</span>
                    <input
                      value={contact[field]}
                      onChange={(e) => setContact({ ...contact, [field]: e.target.value })}
                      placeholder={placeholder}
                      className="focus-brand mt-2 w-full rounded-lg border bg-transparent px-3 py-2.5 text-white outline-none"
                      style={{ borderColor: "var(--color-brand-border-dark)" }}
                    />
                    {errors[field] && (
                      <span className="mt-1 block text-xs text-brand-green-light">
                        {errors[field]}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            ) : (
              <div className="mt-6 grid gap-2.5">
                {q.options.map((option) => {
                  const active = selected.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => pick(option)}
                      className="focus-brand flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm text-white/85 transition-colors hover:text-white"
                      style={{
                        borderColor: active
                          ? "var(--color-brand-green)"
                          : "var(--color-brand-border-dark)",
                        backgroundColor: active ? "rgba(29,158,117,0.12)" : "transparent",
                      }}
                    >
                      {option}
                      <span
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 rounded-full border"
                        style={{
                          borderColor: active
                            ? "var(--color-brand-green)"
                            : "var(--color-brand-border-dark)",
                          backgroundColor: active ? "var(--color-brand-green)" : "transparent",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-7 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="focus-brand text-sm text-white/60 hover:text-white transition-colors disabled:opacity-30"
              >
                ← Späť
              </button>
              {isLast ? (
                <button
                  type="button"
                  onClick={submit}
                  className="btn-liquid inline-flex items-center rounded-full px-6 py-3 text-sm font-bold text-white"
                >
                  Odoslať dotazník →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={q.type === "multi" && selected.length === 0}
                  className="btn-liquid inline-flex items-center rounded-full px-6 py-3 text-sm font-bold text-white disabled:opacity-40"
                >
                  Ďalej →
                </button>
              )}
            </div>

            <p className="mt-5 text-xs text-brand-gray">
              9 krátkych otázok, zaberie to približne minútu. Nič si tým nezaväzujete.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
