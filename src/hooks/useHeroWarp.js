import { useEffect } from "react";
import { gsap } from "../gsap.js";

export function useHeroWarp(warpRef, reduced) {
  useEffect(() => {
    if (reduced || !warpRef.current) return undefined;
    const el = warpRef.current;
    const xTo = gsap.quickTo(el, "x", { duration: 1.3, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 1.3, ease: "power3" });
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0) return;
      xTo(((e.clientX - r.left) / r.width - 0.5) * 46);
      yTo(((e.clientY - r.top) / r.height - 0.5) * 30);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);
}
