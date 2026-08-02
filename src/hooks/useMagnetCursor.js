import { useEffect } from "react";
import { gsap } from "../gsap.js";

export function useMagnetCursor(containerRef, ringRef, active) {
  useEffect(() => {
    if (!active || !containerRef.current || !ringRef.current) return undefined;
    const ring = ringRef.current;
    const magnets = Array.from(containerRef.current.querySelectorAll("[data-magnet]"));
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
    const movers = magnets.map((el) => ({
      el,
      x: gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" }),
      y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" }),
    }));

    gsap.set(ring, { opacity: 0 });

    const onMove = (e) => {
      gsap.set(ring, { opacity: 1 });
      ringX(e.clientX);
      ringY(e.clientY);
      movers.forEach(({ el, x, y }) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const near = Math.abs(dx) < r.width / 2 + 30 && Math.abs(dy) < r.height / 2 + 30;
        x(near ? dx * 0.18 : 0);
        y(near ? dy * 0.18 : 0);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.set(ring, { opacity: 0 });
      movers.forEach(({ el }) => gsap.set(el, { x: 0, y: 0 }));
    };
  }, [active]);
}
