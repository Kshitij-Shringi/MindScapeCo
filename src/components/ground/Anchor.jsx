import { useRef } from "react";
import { useAppState } from "../../state/AppState.jsx";
import { useAnchor } from "../../hooks/useAnchor.js";
import { RoomHeader, RoomFooter } from "./RoomChrome.jsx";

export default function AnchorRoom() {
  const { quiet } = useAppState();
  const anchorRef = useRef(null);
  const bloomRef = useRef(null);

  useAnchor(anchorRef, bloomRef, quiet);

  return (
    <section className="ground-section" aria-labelledby="ms-anchor-h">
      <RoomHeader index="05" total="06" label="Press and hold" />
      <div className="ground-section-inner anchor-grid">
        <div className="anchor-copy">
          <h1 id="ms-anchor-h">Press and hold</h1>
          <p>Hold the anchor down and the warmth grows. Let go and it fades, slowly. Nothing here rewards rushing.</p>
          <p>Keyboard: focus the anchor and hold the space bar.</p>
        </div>
        <div className="anchor-btn-wrap">
          <button type="button" ref={anchorRef} aria-label="Press and hold the anchor" className="anchor-btn">
            <span ref={bloomRef} aria-hidden="true" className="anchor-bloom" />
            <span className="anchor-label">Hold</span>
          </button>
        </div>
      </div>
      <RoomFooter nextPage="senses" nextLabel="Next · 5 · 4 · 3 · 2 · 1" />
    </section>
  );
}
