import { useAppState } from "../../state/AppState.jsx";
import { goCrisis } from "../../hooks/useScrollNav.js";

export function CalmToggle({ className = "chip chip--sm" }) {
  const { state, dispatch } = useAppState();
  const label = state.calm ? "Calm mode is on — restore motion" : "Calm mode: reduce motion";
  return (
    <button
      type="button"
      className={className + (state.calm ? " is-on" : "")}
      aria-pressed={state.calm}
      onClick={() => dispatch({ type: "toggleCalm" })}
    >
      {label}
    </button>
  );
}

export function RoomHeader({ index, total, label }) {
  const { dispatch } = useAppState();
  return (
    <div className="ground-page-header">
      <button type="button" className="btn-glass btn-glass--sm" onClick={() => dispatch({ type: "goto", page: "hub" })}>
        <span aria-hidden="true">←</span> Sanctuary
      </button>
      <p className="room-progress">
        <span className="visually-hidden">Room </span>{index} / {total}<span className="visually-hidden">: {label}</span>
        <span className="room-progress-bar" aria-hidden="true"><i style={{ width: (Number(index) / Number(total)) * 100 + "%" }} /></span>
      </p>
    </div>
  );
}

export function RoomFooter({ nextPage, nextLabel }) {
  const { dispatch } = useAppState();
  return (
    <div className="ground-page-footer">
      <p>These are grounding exercises, not a substitute for therapy or crisis support. <a href="#crisis" onClick={goCrisis}>Crisis resources</a>.</p>
      <div className="ground-page-footer-actions">
        <CalmToggle />
        <button type="button" data-magnet="1" className="btn-light btn-light--sm" onClick={() => dispatch({ type: "goto", page: nextPage })}>
          {nextLabel} <span className="btn-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
