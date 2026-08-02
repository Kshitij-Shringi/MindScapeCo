import { useRef } from "react";
import { useAppState } from "../../state/AppState.jsx";
import { useSmoke } from "../../hooks/useSmoke.js";
import { RoomHeader, RoomFooter } from "./RoomChrome.jsx";

export default function Smoke() {
  const { state, quiet } = useAppState();
  const canvasRef = useRef(null);
  const active = state.page === "smoke";

  useSmoke(canvasRef, quiet || !active);

  return (
    <section className="ground-section" aria-labelledby="ms-smoke-h">
      <RoomHeader index="03" total="06" label="Clear the mist" />
      <div className="ground-section-inner">
        <h1 id="ms-smoke-h">Clear the mist</h1>
        <p className="smoke-copy">Move your cursor or finger slowly across the fog. The warmth underneath is always there — the mist just drifts back when you stop.</p>
        <div className="smoke-frame">
          <canvas ref={canvasRef} width={1200} height={520} aria-hidden="true" className="smoke-canvas" />
          <p className={"smoke-note" + (quiet ? " is-visible" : "")}>A warm, still image sits beneath a soft mist. Calm mode is on, so the mist is at rest.</p>
        </div>
        <p className="smoke-footnote">Nothing is hidden here — the exercise is simply moving slowly and noticing.</p>
      </div>
      <RoomFooter nextPage="bilateral" nextLabel="Next · Follow the light" />
    </section>
  );
}
