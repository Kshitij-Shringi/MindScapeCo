import { useAppState } from "../../state/AppState.jsx";
import { ROOMS } from "../../data.js";
import { CalmToggle } from "./RoomChrome.jsx";

export default function Hub() {
  const { dispatch } = useAppState();

  return (
    <div>
      <section className="hub-hero">
        <div className="hub-hero-inner">
          <p className="hub-hero-kicker">Grounding Sanctuary · six rooms</p>
          <h1 className="serif">Take a moment. There's nothing to do here but arrive.</h1>
          <p className="hub-hero-copy">Each exercise has its own quiet room. Stay for one breath or ten minutes — take them in any order.</p>
          <div className="hub-hero-actions">
            <CalmToggle />
            <button type="button" className="btn-ghost-pill" onClick={() => dispatch({ type: "goto", page: "home" })}>Back to the main site</button>
          </div>
        </div>
      </section>

      <section className="ground-section">
        <div className="room-grid">
          {ROOMS.map((r) => (
            <button key={r.key} type="button" data-magnet="1" className="room-btn" onClick={() => dispatch({ type: "goto", page: r.key })}>
              <span className="room-num">{r.num}</span>
              <span className="room-title">{r.title}</span>
              <span className="room-blurb">{r.blurb}</span>
              <span className="room-enter">Enter →</span>
            </button>
          ))}
        </div>
        <p className="hub-footnote">
          These are grounding exercises, not a substitute for therapy or crisis support. <a href="#crisis">Crisis resources</a> ·{" "}
          <a href="#enquiry" onClick={(e) => { e.preventDefault(); dispatch({ type: "gotoHome", hash: "enquiry" }); }}>Get in touch with Sanskruti</a>
        </p>
      </section>
    </div>
  );
}
