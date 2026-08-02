import { useEffect } from "react";
import { gsap, ScrollTrigger } from "../gsap.js";

export function useScatterScroll(sectionRef, innerRef, quiet) {
  useEffect(() => {
    if (!sectionRef.current || !innerRef.current) return undefined;
    const items = Array.from(sectionRef.current.querySelectorAll("[data-sc]"));
    const sphere = sectionRef.current.querySelector("#ms-sphere");

    const applyScatter = (p) => {
      const e = 1 - Math.pow(1 - p, 3);
      items.forEach((el) => {
        const sx = parseFloat(el.dataset.sx || 0);
        const sy = parseFloat(el.dataset.sy || 0);
        const sr = parseFloat(el.dataset.sr || 0);
        gsap.set(el, {
          x: `${(sx * (1 - e)).toFixed(2)}%`,
          y: `${(sy * (1 - e)).toFixed(2)}%`,
          rotate: sr * (1 - e),
          filter: `blur(${(5 * (1 - e)).toFixed(2)}px)`,
          opacity: 0.55 + 0.45 * e,
        });
      });
      if (sphere) gsap.set(sphere, { opacity: Math.max(0, (e - 0.2) / 0.8), scale: 0.6 + 0.4 * e });
    };

    if (quiet) {
      applyScatter(1);
      return undefined;
    }

    applyScatter(0);
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: () => "+=" + window.innerHeight * 2,
      pin: innerRef.current,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => applyScatter(self.progress),
    });
    return () => st.kill();
  }, [quiet]);
}
