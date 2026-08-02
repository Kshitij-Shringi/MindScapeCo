import { useEffect, useRef, useState } from "react";
import { gsap } from "../gsap.js";
import { PATTERNS } from "../data.js";

export function useBreath(orbRef, { pattern, breathOn, quiet }) {
  const [cue, setCue] = useState("Ready when you are");
  const tlRef = useRef(null);

  useEffect(() => {
    if (!orbRef.current) return undefined;
    if (quiet) {
      gsap.set(orbRef.current, { scale: 0.86 });
      setCue("Calm mode: breathe in for five, out for five, at your own pace.");
      return undefined;
    }

    const phases = PATTERNS[pattern].phases;
    const tl = gsap.timeline({ repeat: -1, paused: true });
    gsap.set(orbRef.current, { scale: phases[0][2] });
    phases.forEach(([label, seconds, , to]) => {
      tl.to(orbRef.current, {
        scale: to,
        duration: seconds,
        ease: "power1.inOut",
        onStart: () => setCue(label),
      });
    });
    tlRef.current = tl;
    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, [pattern, quiet]);

  useEffect(() => {
    if (quiet) return undefined;
    const tl = tlRef.current;
    if (!tl) return undefined;
    if (breathOn) {
      tl.play();
    } else {
      tl.pause();
      gsap.to(orbRef.current, { scale: 0.66, duration: 1.2, ease: "power2.out", overwrite: true });
      setCue("Ready when you are");
    }
    return undefined;
  }, [breathOn, quiet]);

  return cue;
}
