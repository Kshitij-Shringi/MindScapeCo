import { useRef } from "react";
import { useAppState } from "../../state/AppState.jsx";
import { useHeroWarp } from "../../hooks/useHeroWarp.js";
import { useHeroLines } from "../../hooks/useHeroLines.js";
import { scrollToHash } from "../../hooks/useScrollNav.js";
import { img } from "../../lib/img.js";

export default function Hero() {
  const { dispatch, reduced } = useAppState();
  const warpRef = useRef(null);
  const linesRef = useRef(null);

  useHeroWarp(warpRef, reduced);
  useHeroLines(linesRef, reduced);

  const goGrounding = () => dispatch({ type: "goto", page: "hub" });

  return (
    <section id="hero" className="hx" ref={linesRef}>
      <div className="hx-media" ref={warpRef} aria-hidden="true">
        <img className="photo" src={img("stillwater", 2200, 1400)} alt="" fetchpriority="high" />
      </div>
      <div className="hx-wash" aria-hidden="true" />
      <div className="hx-grain" aria-hidden="true" />

      <div className="hx-inner">
        <h1 className="hx-title">
          <span className="hx-line"><span data-hline="1">You don't have to carry it all</span></span>
          <span className="hx-line"><span data-hline="1"><em>on your own.</em></span></span>
        </h1>
        <p data-hline="1" className="hx-lede">
          Thoughtful, inclusive online therapy for adults. A collaborative space to feel heard, and to begin at your own pace.
        </p>
        <div data-hline="1" className="hx-actions">
          <a
            href="#enquiry"
            className="btn-light"
            onClick={(e) => { e.preventDefault(); scrollToHash("#enquiry"); }}
          >
            Start with a conversation
            <span className="btn-arrow" aria-hidden="true">→</span>
          </a>
          <button type="button" className="btn-glass" onClick={goGrounding}>
            Take a breath first
          </button>
        </div>
      </div>

      <div className="hx-scroll" aria-hidden="true"><span /></div>
    </section>
  );
}
