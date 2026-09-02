import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "../components/Logo";

export const Route = createFileRoute("/logo-greenscreen")({
  head: () => ({
    meta: [
      { title: "Logo greenscreen export" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LogoGreenscreen,
});

function LogoGreenscreen() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div
        style={{
          width: 1080,
          height: 1080,
          borderRadius: 48,
          backgroundColor: "#00FF00",
        }}
        className="flex items-center justify-center"
      >
        <Logo size={Math.round(1080 * 0.8)} className="text-white" />
      </div>
    </div>
  );
}
