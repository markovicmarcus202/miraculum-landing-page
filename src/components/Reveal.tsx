import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof HTMLElementTagNameMap;
  y?: number;
};

export function Reveal({ children, delay = 0, className = "", as = "div", y = 24 }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as any;
  return (
    <Tag
      ref={ref as any}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(10px)",
        transform: visible
          ? "translate3d(0,0,0) scale(1)"
          : `translate3d(0, ${y}px, 0) scale(0.97)`,
        transition: [
          `opacity 900ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          `transform 1100ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          `filter 900ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        ].join(", "),
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </Tag>
  );
}
