import { useRef } from "react";
import { useAppState } from "../../state/AppState.jsx";
import { useHeroWarp } from "../../hooks/useHeroWarp.js";
import { useHeroLines } from "../../hooks/useHeroLines.js";

export default function Hero() {
  const { dispatch, reduced } = useAppState();
  const warpRef = useRef(null);
  const linesRef = useRef(null);

  useHeroWarp(warpRef, reduced);
  useHeroLines(linesRef, reduced);

  const goGrounding = () => dispatch({ type: "goto", page: "hub" });

  return (
    <section id="hero" className="hero" ref={linesRef}>
      <div className="hero-warp" ref={warpRef} aria-hidden="true">
        <div className="hero-blob-a" />
        <div className="hero-blob-b" />
        <div className="hero-blob-c" />
      </div>

      <div className="hero-inner">
        <div className="hero-grid">
          <div>
            <h1 className="hero-title">
              <span className="hero-title-line"><span data-hline="1">You don't have</span></span>
              <span className="hero-title-line"><span data-hline="1">to carry it all</span></span>
              <span className="hero-title-line"><span data-hline="1">on your own.</span></span>
            </h1>
            <p data-hline="1" className="hero-lede">
              Thoughtful, inclusive online therapy for adults — a collaborative space to feel heard, and to begin at your own pace.
            </p>
            <div data-hline="1" className="hero-actions">
              <a href="#enquiry" data-magnet="1" className="btn-peach btn-peach--lg" style={{ "--hover-shadow": "0 12px 30px rgba(30,43,69,.18)" }}>
                Start with a conversation
              </a>
              <button type="button" className="btn-underline" onClick={goGrounding}>or take a breath first</button>
            </div>
          </div>

          <div className="hero-orb-wrap">
            <div aria-hidden="true" className="hero-orb-ring">
              <div className="ring-1" />
              <div className="ring-2" />
              <div className="ring-orb" />
            </div>
            <button type="button" className="btn-caps" style={{ fontSize: 13, letterSpacing: ".18em", textTransform: "uppercase" }} onClick={goGrounding}>
              breathe with me
            </button>
          </div>
        </div>

        <div className="hero-footer-row">
          <p className="hero-tags">Trauma-informed · Queer-affirmative · Disability-inclusive</p>
          <p className="hero-scroll">Scroll <span className="hero-scroll-line" aria-hidden="true" /></p>
        </div>
      </div>
    </section>
  );
}
