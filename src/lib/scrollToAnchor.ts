const HEADER_OFFSET = 88;

function targetTop(id: string) {
  const el = document.getElementById(id);
  if (!el) return null;
  return Math.max(el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET, 0);
}

function maxScroll() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

/**
 * Smooth-scrolls to an in-page anchor, compensating for the sticky header.
 * Reveal-on-scroll sections change the document height while scrolling, so we
 * keep re-measuring and correcting until the position is stable.
 */
export function scrollToId(id: string) {
  const first = targetTop(id);
  if (first === null) return;

  window.scrollTo({ top: Math.min(first, maxScroll()), behavior: "smooth" });

  const start = Date.now();
  let stable = 0;

  const correct = () => {
    const top = targetTop(id);
    if (top === null) return;
    const want = Math.min(top, maxScroll());
    const diff = Math.abs(window.scrollY - want);

    if (diff <= 2) {
      stable += 1;
    } else {
      stable = 0;
      // instant correction: a second smooth scroll would fight the first one
      window.scrollTo({ top: want, behavior: "auto" });
    }

    if (stable < 3 && Date.now() - start < 2500) {
      requestAnimationFrame(correct);
    }
  };

  // let the initial smooth scroll run before we start correcting
  setTimeout(() => requestAnimationFrame(correct), 550);
}

export function handleAnchorClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string
) {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  scrollToId(href.slice(1));
  if (window.history.replaceState) {
    window.history.replaceState(null, "", href);
  }
}
