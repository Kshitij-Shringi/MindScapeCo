import { useEffect, useRef } from "react";
import { useAppState } from "../../state/AppState.jsx";
import { scrollToHash } from "../../hooks/useScrollNav.js";
import { gsap } from "../../gsap.js";
import { img } from "../../lib/img.js";

const CARDS = [
  { title: "Reflective spaces for teams and student groups", seed: "forest-path", body: "Facilitated conversations where people can slow down, listen, and make sense of what they're carrying together." },
  { title: "Psychoeducation on burnout, boundaries and rest", seed: "sand", body: "Practical, compassionate sessions on how stress shows up, and what sustainable effort can look like." },
  { title: "Trauma-informed and queer-affirmative practice", seed: "calm", body: "For organisations and practitioners who want their spaces to feel genuinely safe for everyone who walks in." },
];

// Card stacking: the stage pins, and each next card rises over the last while
// the one beneath recedes. Reduced motion shows them as a plain list.
export default function Workshops() {
  const { dispatch, quiet } = useAppState();
  const stageRef = useRef(null);

  useEffect(() => {
    if (quiet || !stageRef.current) return undefined;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 720px)", () => {
      const cards = gsap.utils.toArray(".stack-card", stageRef.current);
      gsap.set(cards.slice(1), { yPercent: 115 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stageRef.current,
          start: "center center",
          end: () => "+=" + window.innerHeight * (cards.length - 1) * 0.9,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      cards.slice(1).forEach((card, i) => {
        tl.to(card, { yPercent: 0, duration: 1 }, i)
          .to(cards[i], { scale: 0.92, yPercent: -6, filter: "brightness(0.55)", duration: 1 }, i);
      });
    });
    return () => mm.revert();
  }, [quiet]);

  const enquireWorkshop = () => {
    dispatch({ type: "setSeek", label: "Workshop or training" });
    scrollToHash("#enquiry");
  };

  return (
    <section id="workshops" className="ch ch--night" aria-labelledby="workshops-h">
      <div className="wrap">
        <div data-reveal="1" className="ch-head ch-head--split">
          <h2 id="workshops-h" className="h-display">Workshops &amp; <em>trainings.</em></h2>
          <div>
            <p className="ch-sub">Psychoeducational trainings and reflective workshops for groups, teams and communities: spaces for self-understanding, meaningful dialogue, and collective learning.</p>
            <button type="button" className="btn-light btn-light--sm" onClick={enquireWorkshop}>
              Enquire about a workshop <span className="btn-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="stack" ref={stageRef}>
          {CARDS.map((c, i) => (
            <article key={c.title} className="stack-card group" style={{ zIndex: i + 1 }}>
              <div className="stack-body">
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
              <div className="stack-media">
                <img className="photo" src={img(c.seed, 1200, 900)} alt="" loading="lazy" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
