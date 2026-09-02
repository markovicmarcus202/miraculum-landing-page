import { createFileRoute, Link } from "@tanstack/react-router";
import CrmDemo from "../components/CrmDemo.jsx";

export const Route = createFileRoute("/crm-ukazka")({
  head: () => ({
    meta: [
      { title: "Ukážka CRM pre kliniky | Miraculum" },
      {
        name: "description",
        content:
          "Živá ukážka interného CRM systému pre kliniky — pacienti, objednávky, faktúry a úlohy na jednom mieste.",
      },
      { property: "og:title", content: "Ukážka CRM pre kliniky | Miraculum" },
      {
        property: "og:description",
        content: "Pozrite si, ako vyzerá interný systém, ktorý staviame pre kliniky a ambulancie.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CrmDemoPage,
});

function CrmDemoPage() {
  return (
    <div className="min-h-screen bg-brand-navy">
      <div className="px-6 py-4">
        <Link to="/" className="text-sm text-brand-green hover:text-brand-green-light">
          ← Späť na Miraculum
        </Link>
      </div>
      <CrmDemo />
    </div>
  );
}
