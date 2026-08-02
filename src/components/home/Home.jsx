import { useRef } from "react";
import { useAppState } from "../../state/AppState.jsx";
import { useReveal } from "../../hooks/useReveal.js";
import Hero from "./Hero.jsx";
import Intro from "./Intro.jsx";
import Explore from "./Explore.jsx";
import Approach from "./Approach.jsx";
import AtAGlance from "./AtAGlance.jsx";
import GroundingTeaser from "./GroundingTeaser.jsx";
import Workshops from "./Workshops.jsx";
import About from "./About.jsx";
import Enquiry from "./Enquiry.jsx";

export default function Home() {
  const { state, reduced } = useAppState();
  const ref = useRef(null);
  useReveal(ref, reduced);

  return (
    <main id="top" ref={ref} style={{ display: state.page === "home" ? "" : "none" }}>
      <Hero />
      <Intro />
      <Explore />
      <Approach />
      <AtAGlance />
      <GroundingTeaser />
      <Workshops />
      <About />
      <Enquiry />
    </main>
  );
}
