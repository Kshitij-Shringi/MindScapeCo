import { useEffect, useRef } from "react";
import { useAppState } from "../../state/AppState.jsx";
import { useReveal } from "../../hooks/useReveal.js";
import { usePageEnter } from "../../hooks/usePageEnter.js";
import { ScrollTrigger } from "../../gsap.js";
import Hero from "./Hero.jsx";
import Marquee from "./Marquee.jsx";
import Intro from "./Intro.jsx";
import AtAGlance from "./AtAGlance.jsx";
import Explore from "./Explore.jsx";
import Approach from "./Approach.jsx";
import Workshops from "./Workshops.jsx";
import About from "./About.jsx";
import Enquiry from "./Enquiry.jsx";

export default function Home() {
  const { state, reduced } = useAppState();
  const ref = useRef(null);
  const visible = state.page === "home";
  useReveal(ref, reduced);
  usePageEnter(ref, visible, reduced);

  // Pins measured while this page was display:none are wrong; re-measure on return.
  useEffect(() => {
    if (!visible) return undefined;
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  return (
    <main id="top" ref={ref} className="home" style={{ display: visible ? "" : "none" }}>
      <Hero />
      <Marquee />
      <Intro />
      <AtAGlance />
      <Explore />
      <Approach />
      <Workshops />
      <About />
      <Enquiry />
    </main>
  );
}
