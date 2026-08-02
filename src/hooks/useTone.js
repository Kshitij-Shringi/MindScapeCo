import { useEffect, useRef } from "react";
import { gsap } from "../gsap.js";

export function useTone(orbRef, { tone, breathOn }) {
  const acRef = useRef(null);

  useEffect(() => {
    const on = tone && breathOn;
    if (!on) return undefined;

    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return undefined;
    acRef.current = acRef.current || new AC();
    const ac = acRef.current;
    if (ac.state === "suspended") ac.resume();

    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = 174;
    gain.gain.value = 0.012;
    osc.connect(gain).connect(ac.destination);
    osc.start();

    const tick = () => {
      if (!orbRef.current) return;
      const scale = gsap.getProperty(orbRef.current, "scale");
      gain.gain.value = 0.012 + 0.02 * (scale - 0.6);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      try {
        gain.gain.value = 0;
        osc.stop();
      } catch (e) {
        /* already stopped */
      }
    };
  }, [tone, breathOn]);
}
