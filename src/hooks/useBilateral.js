import { useEffect, useRef, useState } from "react";
import { gsap } from "../gsap.js";

export function useBilateral(orbRef, containerRef, { bilatOn, tap, quiet, active = true }) {
  const [side, setSide] = useState("Left");
  const tlRef = useRef(null);
  const tapRef = useRef(tap);
  const bilatOnRef = useRef(bilatOn);

  useEffect(() => {
    tapRef.current = tap;
  }, [tap]);

  useEffect(() => {
    bilatOnRef.current = bilatOn;
  }, [bilatOn]);

  useEffect(() => {
    if (!orbRef.current || !containerRef.current) return undefined;
    if (quiet) {
      gsap.set(orbRef.current, { x: 0 });
      setSide("Centre");
      return undefined;
    }
    if (!active) return undefined;

    let disposed = false;

    const build = () => {
      if (disposed || !orbRef.current || !containerRef.current) return;
      const wasPlaying = tlRef.current ? !tlRef.current.paused() : bilatOnRef.current;
      if (tlRef.current) tlRef.current.kill();

      const w = containerRef.current.clientWidth;
      const amp = Math.max(60, w / 2 - 70);
      gsap.set(orbRef.current, { x: 0 });

      const tl = gsap.timeline({
        repeat: -1,
        paused: !wasPlaying,
        onUpdate: () => {
          const x = gsap.getProperty(orbRef.current, "x");
          const pre = tapRef.current ? "Tap " : "";
          if (x < -amp * 0.5) setSide(pre + "left");
          else if (x > amp * 0.5) setSide(pre + "right");
        },
      });
      tl.to(orbRef.current, { x: amp, duration: 0.5, ease: "sine.inOut" })
        .to(orbRef.current, { x: -amp, duration: 1, ease: "sine.inOut" })
        .to(orbRef.current, { x: 0, duration: 0.5, ease: "sine.inOut" });
      tlRef.current = tl;
    };

    build();
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      if (tlRef.current) tlRef.current.kill();
      tlRef.current = null;
    };
  }, [quiet, active]);

  useEffect(() => {
    if (quiet || !active) return;
    const tl = tlRef.current;
    if (!tl) return;
    if (bilatOn) tl.play();
    else tl.pause();
  }, [bilatOn, quiet]);

  return side;
}
