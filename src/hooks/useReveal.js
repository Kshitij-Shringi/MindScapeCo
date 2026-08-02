import { useEffect } from "react";
import { gsap, ScrollTrigger } from "../gsap.js";

export function useReveal(scopeRef, reduced) {
  useEffect(() => {
    if (reduced || !scopeRef.current) return undefined;
    const els = scopeRef.current.querySelectorAll("[data-reveal]");
    if (!els.length) return undefined;
    gsap.set(els, { opacity: 0, y: 18 });
    const batches = ScrollTrigger.batch(els, {
      start: "top 88%",
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: "power2.out", stagger: 0.09, overwrite: true }),
    });
    return () => batches.forEach((t) => t.kill());
  }, [reduced]);
}
