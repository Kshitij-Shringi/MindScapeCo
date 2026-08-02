import { useAppState } from "../../state/AppState.jsx";

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
      <button type="button" className="btn-caps" style={{ fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase" }} onClick={() => dispatch({ type: "goto", page: "hub" })}>
        ← Grounding Sanctuary
      </button>
      <p>{index} / {total} · {label}</p>
    </div>
  );
}

export function RoomFooter({ nextPage, nextLabel }) {
  const { dispatch } = useAppState();
  return (
    <div className="ground-page-footer">
      <p>These are grounding exercises, not a substitute for therapy or crisis support. <a href="#crisis">Crisis resources</a>.</p>
      <div className="ground-page-footer-actions">
        <CalmToggle />
        <button type="button" data-magnet="1" className="btn-dark-pill" onClick={() => dispatch({ type: "goto", page: nextPage })}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
