import { useEffect, useRef } from "react";
import { gsap } from "../gsap.js";

// Cross-fades a page in when it becomes visible, so switching between the main
// site and the sanctuary rooms doesn't teleport. Opacity only — no transform,
// so ScrollTrigger measurements and pinning inside the page stay exact.
export function usePageEnter(ref, visible, quiet) {
  const wasVisible = useRef(visible);

  useEffect(() => {
    const prev = wasVisible.current;
    wasVisible.current = visible;
    if (!visible || prev || !ref.current) return undefined;
    const tween = gsap.fromTo(
      ref.current,
      { opacity: 0 },
      { opacity: 1, duration: quiet ? 0.2 : 0.42, ease: "power2.out", clearProps: "opacity" }
    );
    return () => tween.kill();
  }, [visible]);
}
