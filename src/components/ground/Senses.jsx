import { useEffect, useRef } from "react";
import { useAppState } from "../../state/AppState.jsx";
import { gsap } from "../../gsap.js";
import { CARDS } from "../../data.js";
import { RoomHeader, RoomFooter } from "./RoomChrome.jsx";

export default function Senses() {
  const { state, dispatch } = useAppState();
  const cardRefs = useRef([]);

  useEffect(() => {
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const d = i - state.card;
      const on = d === 0;
      const tx = d < 0 ? -46 : d === 0 ? 0 : 4 + d * 2;
      const ty = d > 0 ? 24 + d * 6 : 0;
      el.setAttribute("aria-hidden", on ? "false" : "true");
      el.style.pointerEvents = on ? "auto" : "none";
      el.style.zIndex = on ? 3 : d === 1 ? 1 : 0;
      gsap.to(el, {
        opacity: on ? 1 : d === 1 ? 0.14 : 0,
        xPercent: tx,
        y: ty,
        scale: on ? 1 : 0.96,
        duration: 1,
        ease: "power3.out",
        overwrite: true,
      });
    });
  }, [state.card]);

  return (
    <section className="ground-section" aria-labelledby="ms-cards-h">
      <RoomHeader index="06" total="06" label="5 · 4 · 3 · 2 · 1" />
      <div className="ground-section-inner">
        <h1 id="ms-cards-h">5 · 4 · 3 · 2 · 1</h1>
        <p className="senses-copy">Come back to the room through your senses. Take as long as you like with each card.</p>
        <div className="cards-wrap">
          {CARDS.map((c, i) => (
            <article key={c.step} ref={(el) => (cardRefs.current[i] = el)} className="card-anim">
              <p className="card-step">{c.step}</p>
              <h2 className="card-title">{c.title}</h2>
              <p className="card-body">{c.body}</p>
            </article>
          ))}
        </div>
        <div className="senses-actions">
          <button type="button" data-magnet="1" className="btn-ghost-pill btn-ghost-pill--filled" onClick={() => dispatch({ type: "prevCard" })}>Back</button>
          <button type="button" data-magnet="1" className="btn-dark-pill btn-dark-pill--sm" onClick={() => dispatch({ type: "nextCard" })}>Next</button>
          <p role="status">Card {state.card + 1} of {CARDS.length}</p>
        </div>
      </div>
      <RoomFooter nextPage="hub" nextLabel="Next · Back to the sanctuary" />
    </section>
  );
}
