import { useAppState } from "../../state/AppState.jsx";
import { ROOMS } from "../../data.js";
import { CalmToggle } from "./RoomChrome.jsx";
import { goCrisis } from "../../hooks/useScrollNav.js";
import { img } from "../../lib/img.js";

const ROOM_IMG = {
  scatter: "drift",
  breath: "gr-anchor",
  smoke: "lull",
  bilateral: "bough",
  anchor: "gr-smoke",
  senses: "lagoon",
};

export default function Hub() {
  const { dispatch } = useAppState();

  return (
    <div>
      <section className="hub-hero">
        <div className="hub-hero-media" aria-hidden="true">
          <img className="photo" src={img("driftwood", 2200, 1400)} alt="" />
        </div>
        <div className="hub-hero-wash" aria-hidden="true" />
        <div className="hub-hero-inner">
          <p className="hub-hero-kicker">Grounding Sanctuary</p>
          <h1>Take a moment. There's nothing to do here <em>but arrive.</em></h1>
          <p className="hub-hero-copy">Each exercise has its own quiet room. Stay for one breath or ten minutes, and take them in any order.</p>
          <div className="hub-hero-actions">
            <CalmToggle />
            <button type="button" className="btn-glass btn-glass--sm" onClick={() => dispatch({ type: "goto", page: "home" })}>Back to the main site</button>
          </div>
        </div>
      </section>

      <section className="ground-section ground-section--hub">
        {/* 4-col dense grid: scatter 2x1 + breath 1x2 + four 1x1 = 8 cells = 4x2, no voids. */}
        <div className="room-grid">
          {ROOMS.map((r) => (
            <button
              key={r.key}
              type="button"
              data-magnet="1"
              className={"room-btn group room-btn--" + r.key}
              onClick={() => dispatch({ type: "goto", page: r.key })}
            >
              <span className="room-media" aria-hidden="true">
                <img className="photo" src={img(ROOM_IMG[r.key], 1200, 900)} alt="" loading="lazy" />
              </span>
              <span className="room-body">
                <span className="room-title">{r.title}</span>
                <span className="room-blurb">{r.blurb}</span>
              </span>
              <span className="room-enter" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
        <p className="hub-footnote">
          These are grounding exercises, not a substitute for therapy or crisis support. <a href="#crisis" onClick={goCrisis}>Crisis resources</a> ·{" "}
          <a href="#enquiry" onClick={(e) => { e.preventDefault(); dispatch({ type: "gotoHome", hash: "enquiry" }); }}>Get in touch with Sanskruti</a>
        </p>
      </section>
    </div>
  );
}
