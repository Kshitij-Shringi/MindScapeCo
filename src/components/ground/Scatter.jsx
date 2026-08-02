import { useRef } from "react";
import { useAppState } from "../../state/AppState.jsx";
import { useScatterScroll } from "../../hooks/useScatterScroll.js";
import { RoomHeader, RoomFooter } from "./RoomChrome.jsx";

export default function Scatter() {
  const { quiet, state } = useAppState();
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const active = state.page === "scatter";

  useScatterScroll(sectionRef, innerRef, quiet || !active);

  return (
    <div>
      <div style={{ padding: "clamp(70px, 10vh, 110px) 22px 0" }}>
        <RoomHeader index="01" total="06" label="Scattered → Calm" />
      </div>
      <section id="ms-scatter" ref={sectionRef} aria-labelledby="ms-scatter-h" className={quiet ? "" : "scatter-section"}>
        <div ref={innerRef} className={quiet ? "" : "scatter-inner"} style={quiet ? { padding: "80px 22px" } : undefined}>
          <div className="scatter-stage">
            <div data-sc="1" data-sx="-14" data-sy="-16" data-sr="-7" className="scatter-heading">
              <h2 id="ms-scatter-h">When everything is at once</h2>
              <p>Thoughts scattered, edges blurred, nothing quite in its place. Scroll gently — and let it settle.</p>
            </div>
            <div data-sc="1" data-sx="42" data-sy="10" data-sr="9" className="scatter-card">
              <p>Nothing has to be solved in this minute. Notice the weight of your body where it rests.</p>
            </div>
            <div data-sc="1" data-sx="-30" data-sy="18" data-sr="6" aria-hidden="true" className="scatter-square" />
            <div data-sc="1" data-sx="26" data-sy="-22" data-sr="-11" aria-hidden="true" className="scatter-ring" />
            <div id="ms-sphere" aria-hidden="true" className="scatter-sphere" />
          </div>
        </div>
      </section>
      <div style={{ padding: "0 22px clamp(70px, 10vh, 110px)" }}>
        <RoomFooter nextPage="breath" nextLabel="Next · Breathe with the light" />
      </div>
    </div>
  );
}
