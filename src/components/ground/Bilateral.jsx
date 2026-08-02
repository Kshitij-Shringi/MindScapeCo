import { useRef } from "react";
import { useAppState } from "../../state/AppState.jsx";
import { useBilateral } from "../../hooks/useBilateral.js";
import { RoomHeader, RoomFooter } from "./RoomChrome.jsx";

export default function Bilateral() {
  const { state, dispatch, quiet } = useAppState();
  const orbRef = useRef(null);
  const containerRef = useRef(null);

  const side = useBilateral(orbRef, containerRef, {
    bilatOn: state.bilatOn,
    tap: state.tap,
    quiet,
    active: state.page === "bilateral",
  });

  return (
    <section className="ground-section" aria-labelledby="ms-bilat-h">
      <RoomHeader index="04" total="06" label="Follow the light" />
      <div className="ground-section-inner">
        <h1 id="ms-bilat-h">Follow the light, side to side</h1>
        <div className="bilat-copy">
          <p>Let your eyes travel with the orb as it drifts left and right. If you prefer touch, tap along with the alternating cue — a gentle butterfly hug.</p>
          <p>A gentle grounding exercise to follow with your eyes — this is not EMDR therapy.</p>
        </div>
        <div ref={containerRef} className="bilat-stage">
          <div ref={orbRef} className="bilat-orb" aria-hidden="true" />
          <p role="status" className="bilat-side">{side}</p>
        </div>
        <div className="bilat-actions">
          <button type="button" data-magnet="1" className="btn-dark-pill" onClick={() => dispatch({ type: "toggleBilat" })}>
            {state.bilatOn ? "Pause the orb" : "Start the orb"}
          </button>
          <button
            type="button"
            className={"chip chip--md" + (state.tap ? " is-on" : "")}
            aria-pressed={state.tap}
            onClick={() => dispatch({ type: "toggleTap" })}
          >
            {state.tap ? "Tap cue on" : "Alternating tap cue"}
          </button>
        </div>
      </div>
      <RoomFooter nextPage="anchor" nextLabel="Next · Press and hold" />
    </section>
  );
}
