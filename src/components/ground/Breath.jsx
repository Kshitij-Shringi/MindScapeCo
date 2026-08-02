import { useRef } from "react";
import { useAppState } from "../../state/AppState.jsx";
import { useBreath } from "../../hooks/useBreath.js";
import { useTone } from "../../hooks/useTone.js";
import { PATTERNS, PATTERN_KEYS } from "../../data.js";
import { RoomHeader, RoomFooter } from "./RoomChrome.jsx";

export default function Breath() {
  const { state, dispatch, quiet } = useAppState();
  const orbRef = useRef(null);

  const cue = useBreath(orbRef, { pattern: state.pattern, breathOn: state.breathOn, quiet });
  useTone(orbRef, { tone: state.tone, breathOn: state.breathOn });

  return (
    <section className="ground-section" aria-labelledby="ms-breath-h">
      <RoomHeader index="02" total="06" label="Breathe with the light" />
      <div className="ground-section-inner breath-grid">
        <div className="breath-copy">
          <h1 id="ms-breath-h">Breathe with the light</h1>
          <p>The ring grows as you breathe in and softens as you breathe out. Choose a pattern that suits you, or just watch.</p>
          <div role="group" aria-label="Breathing pattern" className="chip-row" style={{ marginBottom: 22 }}>
            {PATTERN_KEYS.map((key) => {
              const on = state.pattern === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={"chip" + (on ? " is-on" : "")}
                  aria-pressed={on}
                  onClick={() => dispatch({ type: "setPattern", key })}
                >
                  {PATTERNS[key].label}
                </button>
              );
            })}
          </div>
          <p className="pattern-desc">{PATTERNS[state.pattern].desc}</p>
          <div className="breath-actions">
            <button type="button" data-magnet="1" className="btn-dark-pill" onClick={() => dispatch({ type: "toggleBreath" })}>
              {state.breathOn ? "Pause the breath" : "Start breathing"}
            </button>
            <button
              type="button"
              className={"chip chip--md" + (state.tone ? " is-on" : "")}
              aria-pressed={state.tone}
              onClick={() => dispatch({ type: "toggleTone" })}
            >
              {state.tone ? "Ambient tone on" : "Add a quiet tone"}
            </button>
          </div>
        </div>
        <div className="breath-visual">
          <div className="breath-orb-wrap">
            <div id="ms-breath-orb" ref={orbRef} className="breath-orb" />
            <div aria-hidden="true" className="breath-orb-ring" />
          </div>
          <p role="status" className="breath-cue">{cue}</p>
        </div>
      </div>
      <RoomFooter nextPage="smoke" nextLabel="Next · Clear the mist" />
    </section>
  );
}
