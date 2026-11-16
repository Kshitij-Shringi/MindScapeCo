import { useCallback, useEffect, useRef } from "react";
import { useAppState } from "../../state/AppState.jsx";
import { gsap } from "../../gsap.js";
import { springTo, stopSpring, project, rubberband } from "../../lib/spring.js";
import { CARDS } from "../../data.js";
import { RoomHeader, RoomFooter } from "./RoomChrome.jsx";

const LAST = CARDS.length - 1;

// Resting pose of a card `d` steps from the current one.
function rest(d, quiet) {
  if (quiet) return { xPercent: 0, y: 0, scale: 1, opacity: d === 0 ? 1 : 0 };
  return {
    xPercent: d < 0 ? -46 : d === 0 ? 0 : 4 + d * 2,
    y: d > 0 ? 24 + d * 6 : 0,
    scale: d === 0 ? 1 : 0.96,
    opacity: d === 0 ? 1 : d === 1 ? 0.14 : 0,
  };
}

function mix(a, b, p) {
  const out = {};
  for (const k in a) out[k] = a[k] + (b[k] - a[k]) * p;
  return out;
}

export default function Senses() {
  const { state, dispatch, quiet } = useAppState();
  const cardRefs = useRef([]);
  const wrapRef = useRef(null);
  const cardRef = useRef(state.card);
  // Velocity (xPercent/s) left behind by a released drag, consumed by the next layout.
  const handoff = useRef(null);
  cardRef.current = state.card;

  const layout = useCallback((card) => {
    const flick = handoff.current;
    handoff.current = null;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const d = i - card;
      const on = d === 0;
      const { xPercent, ...pose } = rest(d, quiet);
      el.setAttribute("aria-hidden", on ? "false" : "true");
      el.style.pointerEvents = on ? "auto" : "none";
      el.style.zIndex = on ? 3 : d === 1 ? 1 : 0;
      const tween = { ...pose, x: 0, duration: quiet ? 0.3 : 0.6, ease: "power3.out", overwrite: "auto" };
      if (flick && flick.el === el) {
        // The card the finger let go of continues at the finger's speed.
        springTo(el, "xPercent", xPercent, { velocity: flick.velocity, damping: 1, response: 0.45 });
      } else {
        stopSpring(el);
        tween.xPercent = xPercent;
      }
      gsap.to(el, tween);
    });
  }, [quiet]);

  useEffect(() => {
    layout(state.card);
  }, [state.card, layout]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || quiet) return undefined;
    let drag = null;

    const neighbour = (i) => cardRefs.current[i];

    const onDown = (e) => {
      if (e.button !== 0) return;
      const i = cardRef.current;
      drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, i, el: cardRefs.current[i], engaged: false, samples: [], w: wrap.clientWidth };
    };

    const onMove = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.engaged) {
        const dx = e.clientX - drag.x0;
        const dy = e.clientY - drag.y0;
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
          drag = null; // vertical intent — leave it to page scroll
          return;
        }
        if (Math.abs(dx) < 10) return;
        // Commit to a horizontal drag; re-anchor so the card doesn't jump by the threshold.
        drag.engaged = true;
        drag.x0 = e.clientX;
        wrap.setPointerCapture(e.pointerId);
        wrap.classList.add("is-dragging");
        // Grab the card wherever it is right now, even mid-flight.
        stopSpring(drag.el);
        gsap.killTweensOf(drag.el, "x,xPercent");
      }

      let off = e.clientX - drag.x0;
      const atEdge = (off > 0 && drag.i === 0) || (off < 0 && drag.i === LAST);
      if (atEdge) off = rubberband(off, drag.w);
      gsap.set(drag.el, { x: off });

      drag.samples.push({ x: e.clientX, t: e.timeStamp });
      if (drag.samples.length > 6) drag.samples.shift();

      // The card you're pulling toward rises to meet you as you drag.
      const p = Math.min(1, Math.abs(off) / (drag.w * 0.6));
      const next = neighbour(drag.i + 1);
      const prev = neighbour(drag.i - 1);
      if (next) { gsap.killTweensOf(next); gsap.set(next, off < 0 ? mix(rest(1), rest(0), p) : rest(1)); }
      if (prev) { gsap.killTweensOf(prev); gsap.set(prev, off > 0 ? mix(rest(-1), rest(0), p) : rest(-1)); }
    };

    const onUp = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag;
      drag = null;
      if (!d.engaged) return;
      wrap.classList.remove("is-dragging");

      const off = Number(gsap.getProperty(d.el, "x")) || 0;
      const recent = d.samples.filter((s) => e.timeStamp - s.t < 100);
      let v = 0;
      if (recent.length >= 2 && e.type !== "pointercancel") {
        const a = recent[0];
        const b = recent[recent.length - 1];
        v = ((b.x - a.x) / Math.max(1, b.t - a.t)) * 1000;
      }

      // Choose the destination from where the flick is heading, not where it was released.
      const projected = off + project(v);
      let target = d.i;
      if (projected < -d.w * 0.3 && d.i < LAST) target = d.i + 1;
      else if (projected > d.w * 0.3 && d.i > 0) target = d.i - 1;

      // Fold the drag offset into xPercent so a single value carries on moving.
      gsap.set(d.el, { x: 0, xPercent: Number(gsap.getProperty(d.el, "xPercent")) + (off / d.w) * 100 });
      handoff.current = { el: d.el, velocity: (v / d.w) * 100 };

      if (target === d.i) layout(d.i);
      else dispatch({ type: target > d.i ? "nextCard" : "prevCard" });
    };

    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);
    return () => {
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
      wrap.classList.remove("is-dragging");
    };
  }, [quiet, layout, dispatch]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); dispatch({ type: "nextCard" }); }
    if (e.key === "ArrowLeft") { e.preventDefault(); dispatch({ type: "prevCard" }); }
  };

  return (
    <section className="ground-section" aria-labelledby="ms-cards-h">
      <RoomHeader index="06" total="06" label="5 · 4 · 3 · 2 · 1" />
      <div className="ground-section-inner">
        <h1 id="ms-cards-h">5 · 4 · 3 · 2 · 1</h1>
        <p className="senses-copy">Come back to the room through your senses. Take as long as you like with each card.</p>
        <div
          ref={wrapRef}
          className={"cards-wrap" + (quiet ? "" : " is-draggable")}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label="Grounding cards. Swipe, or use the left and right arrow keys."
          onKeyDown={onKeyDown}
        >
          {CARDS.map((c, i) => (
            <article key={c.step} ref={(el) => (cardRefs.current[i] = el)} className="card-anim">
              <p className="card-step">{c.step}</p>
              <h2 className="card-title">{c.title}</h2>
              <p className="card-body">{c.body}</p>
            </article>
          ))}
        </div>
        <div className="senses-actions">
          <button type="button" data-magnet="1" className="btn-glass btn-glass--sm" disabled={state.card === 0} onClick={() => dispatch({ type: "prevCard" })}>Back</button>
          <button type="button" data-magnet="1" className="btn-light btn-light--sm" disabled={state.card === LAST} onClick={() => dispatch({ type: "nextCard" })}>Next</button>
          <p role="status">Card {state.card + 1} of {CARDS.length}</p>
        </div>
      </div>
      <RoomFooter nextPage="hub" nextLabel="Next · Back to the sanctuary" />
    </section>
  );
}
