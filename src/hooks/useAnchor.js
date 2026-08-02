import { useEffect } from "react";
import { gsap } from "../gsap.js";

export function useAnchor(anchorRef, bloomRef, quiet) {
  useEffect(() => {
    if (!anchorRef.current || !bloomRef.current) return undefined;
    const anchor = anchorRef.current;
    const bloom = bloomRef.current;

    if (quiet) {
      gsap.set(bloom, { opacity: 0.35, scale: 1 });
      return undefined;
    }

    gsap.set(bloom, { opacity: 0, scale: 0.3 });
    const press = () => gsap.to(bloom, { opacity: 1, scale: 1.2, duration: 1.3, ease: "power2.out", overwrite: true });
    const release = () => gsap.to(bloom, { opacity: 0, scale: 0.3, duration: 2.2, ease: "power2.out", overwrite: true });
    const onKeyDown = (ev) => {
      if (ev.repeat) return;
      if (ev.key === " " || ev.key === "Enter") press();
    };

    anchor.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    anchor.addEventListener("keydown", onKeyDown);
    anchor.addEventListener("keyup", release);
    anchor.addEventListener("blur", release);
    return () => {
      anchor.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      anchor.removeEventListener("keydown", onKeyDown);
      anchor.removeEventListener("keyup", release);
      anchor.removeEventListener("blur", release);
    };
  }, [quiet]);
}
