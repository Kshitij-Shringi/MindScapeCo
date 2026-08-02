import { useEffect } from "react";
import { gsap } from "../gsap.js";

export function useHeroLines(scopeRef, reduced) {
  useEffect(() => {
    if (reduced || !scopeRef.current) return undefined;
    const lines = scopeRef.current.querySelectorAll("[data-hline]");
    if (!lines.length) return undefined;
    gsap.set(lines, { opacity: 0, yPercent: 108, filter: "blur(9px)" });
    const tween = gsap.to(lines, {
      opacity: 1,
      yPercent: 0,
      filter: "blur(0px)",
      duration: 1,
      ease: "power3.out",
      stagger: 0.13,
      delay: 0.12,
    });
    return () => tween.kill();
  }, [reduced]);
}
