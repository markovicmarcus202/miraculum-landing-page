import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { questions } from "../components/ConsultationDialog";

export const Route = createFileRoute("/leads")({
  head: () => ({
    meta: [
      { title: "Web Leads | Miraculum" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LeadsPage,
});

const FUNCTION_URL = "https://agwydwgvtvfokkmjxycl.supabase.co/functions/v1/leads-api";
const TOKEN_KEY = "miraculum:leads-admin-token";

type Lead = {
  id: string;
  created_at: string;
  phone: string | null;
  email: string | null;
  source: string | null;
  answers: Record<string, string[]>;
  ai_summary: string | null;
  ai_summary_generated_at: string | null;
};

const questionLabel = (id: string) => questions.find((q) => q.id === id)?.question ?? id;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("sk-SK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function LeadsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem(TOKEN_KEY) : null;
    if (stored) setToken(stored);
  }, []);

  useEffect(() => {
    if (!token) return;
    void fetchLeads(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function fetchLeads(t: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(FUNCTION_URL, { headers: { "x-admin-token": t } });
      if (res.status === 401) {
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setError("Nesprávny prístupový kód.");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setLeads(json.leads as Lead[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chyba pri načítaní leadov.");
    } finally {
      setLoading(false);
    }
  }

  async function analyze(lead: Lead) {
    if (!token) return;
    setAnalyzing(true);
    try {
      const res = await fetch(`${FUNCTION_URL}/${lead.id}/analyze`, {
        method: "POST",
        headers: { "x-admin-token": token },
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.message ?? "AI rozbor sa nepodarilo vygenerovať.");
        return;
      }
      const updated = json.lead as Lead;
      setSelected(updated);
      setLeads((prev) => prev?.map((l) => (l.id === updated.id ? updated : l)) ?? prev);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI rozbor sa nepodarilo vygenerovať.");
    } finally {
      setAnalyzing(false);
    }
  }

  const submitToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    sessionStorage.setItem(TOKEN_KEY, tokenInput.trim());
    setToken(tokenInput.trim());
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center px-6">
        <form onSubmit={submitToken} className="glass glass-edge w-full max-w-sm p-6">
          <h1 className="text-lg font-extrabold text-white">Web Leads</h1>
          <p className="mt-1 text-sm text-white/60">Zadaj prístupový kód.</p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="focus-brand mt-4 w-full rounded-lg border bg-transparent px-3 py-2.5 text-white outline-none"
            style={{ borderColor: "var(--color-brand-border-dark)" }}
            placeholder="Prístupový kód"
            autoFocus
          />
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            className="btn-liquid mt-4 w-full rounded-full px-6 py-3 text-sm font-bold text-white"
          >
            Vstúpiť
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-navy px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-white">Web Leads</h1>
          <Link to="/" className="text-sm text-brand-green hover:text-brand-green-light">
            ← Späť na web
          </Link>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        {loading && <p className="mt-4 text-sm text-white/60">Načítavam…</p>}

        {!loading && leads && leads.length === 0 && (
          <p className="mt-8 text-sm text-white/60">Zatiaľ žiadne leady.</p>
        )}

        {!loading && leads && leads.length > 0 && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div className="glass glass-edge divide-y divide-white/10 overflow-hidden">
              {leads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelected(lead)}
                  className="block w-full px-4 py-3 text-left transition-colors hover:bg-white/5"
                  style={{
                    backgroundColor: selected?.id === lead.id ? "rgba(29,158,117,0.12)" : "transparent",
                  }}
                >
                  <p className="text-sm font-bold text-white">{lead.phone ?? lead.email ?? "—"}</p>
                  <p className="mt-0.5 text-xs text-white/50">{formatDate(lead.created_at)}</p>
                  {lead.ai_summary && (
                    <p className="mt-1 text-xs text-brand-green-light">✓ AI rozbor hotový</p>
                  )}
                </button>
              ))}
            </div>

            <div className="glass glass-edge p-6">
              {!selected ? (
                <p className="text-sm text-white/60">Vyber lead vľavo pre detail.</p>
              ) : (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-white/50">{formatDate(selected.created_at)}</p>
                      <p className="text-lg font-extrabold text-white">
                        {selected.phone} · {selected.email}
                      </p>
                      {selected.source && (
                        <p className="mt-0.5 text-xs text-white/40">Zdroj: {selected.source}</p>
                      )}
                    </div>
                    <button
                      onClick={() => analyze(selected)}
                      disabled={analyzing}
                      className="btn-liquid rounded-full px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50"
                    >
                      {analyzing
                        ? "Generujem…"
                        : selected.ai_summary
                          ? "Prerobiť AI rozbor"
                          : "Vygenerovať AI rozbor"}
                    </button>
                  </div>

                  {selected.ai_summary && (
                    <div
                      className="mt-5 rounded-xl border p-4"
                      style={{
                        borderColor: "rgba(29,158,117,0.3)",
                        backgroundColor: "rgba(29,158,117,0.06)",
                      }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green-light">
                        AI rozbor
                      </p>
                      <p className="mt-2 whitespace-pre-line text-sm text-white/85 leading-relaxed">
                        {selected.ai_summary}
                      </p>
                    </div>
                  )}

                  <div className="mt-6 space-y-4">
                    {Object.entries(selected.answers).map(([id, val]) => (
                      <div key={id}>
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/40">
                          {questionLabel(id)}
                        </p>
                        <p className="mt-1 text-sm text-white/85">
                          {Array.isArray(val) ? val.join(", ") : val}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
