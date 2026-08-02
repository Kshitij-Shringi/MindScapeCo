import { useEffect, useRef } from "react";
import { useAppState } from "../../state/AppState.jsx";
import { useMagnetCursor } from "../../hooks/useMagnetCursor.js";
import { gsap } from "../../gsap.js";
import Hub from "./Hub.jsx";
import Scatter from "./Scatter.jsx";
import Breath from "./Breath.jsx";
import Smoke from "./Smoke.jsx";
import Bilateral from "./Bilateral.jsx";
import Anchor from "./Anchor.jsx";
import Senses from "./Senses.jsx";

const PAGES = [
  ["hub", Hub],
  ["scatter", Scatter],
  ["breath", Breath],
  ["smoke", Smoke],
  ["bilateral", Bilateral],
  ["anchor", Anchor],
  ["senses", Senses],
];

export default function GroundingSanctuary() {
  const { state, quiet, fine } = useAppState();
  const containerRef = useRef(null);
  const ringRef = useRef(null);
  const prevPageRef = useRef(state.page);

  const active = state.page !== "home";
  useMagnetCursor(containerRef, ringRef, active && !quiet && fine);

  useEffect(() => {
    if (state.page !== prevPageRef.current) {
      gsap.killTweensOf(window);
      gsap.set(window, { scrollTo: 0 });
    }
    prevPageRef.current = state.page;
  }, [state.page]);

  return (
    <div id="ms-ground" ref={containerRef} className="ground-root" style={{ display: active ? "block" : "none" }}>
      <div className="ground-cursor" ref={ringRef} aria-hidden="true" />
      {PAGES.map(([key, Comp]) => (
        <div key={key} style={{ display: state.page === key ? "block" : "none" }}>
          <Comp />
        </div>
      ))}
    </div>
  );
}
