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
      onEnter: (batch) => gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power2.out",
        stagger: 0.09,
        overwrite: true,
        // Once revealed, hand transform/opacity back to CSS (clearing GSAP's inline
        // styles) so hover/focus states defined in stylesheet rules — which lose to
        // inline styles regardless of specificity — can actually take effect again.
        onComplete: () => gsap.set(batch, { clearProps: "transform,translate,opacity" }),
      }),
    });
    return () => batches.forEach((t) => t.kill());
  }, [reduced]);
}
