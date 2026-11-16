import { useEffect, useRef, useState } from "react";
import { gsap } from "../gsap.js";
import { PATTERNS } from "../data.js";

const REST_SCALE = 0.66;

export function useBreath(orbRef, { pattern, breathOn, quiet }) {
  const [cue, setCue] = useState("Ready when you are");
  const tlRef = useRef(null);
  const leadRef = useRef(null);
  const breathOnRef = useRef(breathOn);
  breathOnRef.current = breathOn;

  // Start the cycle from wherever the orb is now: ease into the pattern's first
  // pose, then hand over to the loop — never jump.
  const begin = () => {
    const tl = tlRef.current;
    if (!tl || !orbRef.current) return;
    const first = PATTERNS[pattern].phases[0];
    if (leadRef.current) leadRef.current.kill();
    setCue(first[0]);
    leadRef.current = gsap.to(orbRef.current, {
      scale: first[2],
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => tl.play(0),
    });
  };

  // Standalone tweens are tracked and killed by hand: `overwrite: true` would
  // also kill the tweens nested inside the paused breathing timeline.
  const settle = (duration) => {
    if (leadRef.current) leadRef.current.kill();
    leadRef.current = gsap.to(orbRef.current, { scale: REST_SCALE, duration, ease: "power2.out" });
  };

  useEffect(() => {
    if (!orbRef.current) return undefined;
    if (quiet) {
      if (leadRef.current) leadRef.current.kill();
      gsap.set(orbRef.current, { scale: 0.86 });
      setCue("Calm mode: breathe in for five, out for five, at your own pace.");
      return undefined;
    }

    const tl = gsap.timeline({ repeat: -1, paused: true });
    PATTERNS[pattern].phases.forEach(([label, seconds, from, to]) => {
      tl.fromTo(orbRef.current, { scale: from }, {
        scale: to,
        duration: seconds,
        ease: "power1.inOut",
        immediateRender: false,
        onStart: () => setCue(label),
      });
    });
    tlRef.current = tl;
    if (breathOnRef.current) begin();
    else settle(0.6);

    return () => {
      tl.kill();
      if (leadRef.current) leadRef.current.kill();
      tlRef.current = null;
    };
  }, [pattern, quiet]);

  useEffect(() => {
    if (quiet) return undefined;
    const tl = tlRef.current;
    if (!tl) return undefined;
    if (breathOn) {
      begin();
    } else {
      tl.pause();
      settle(1.2);
      setCue("Ready when you are");
    }
    return undefined;
  }, [breathOn, quiet]);

  return cue;
}
