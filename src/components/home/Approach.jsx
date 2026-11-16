import { useEffect, useRef } from "react";
import { useAppState } from "../../state/AppState.jsx";
import { gsap } from "../../gsap.js";
import { img } from "../../lib/img.js";

const LENSES = [
  { title: "Narrative", seed: "book", body: "The stories we tell about ourselves shape what feels possible. Together we notice them, question them, and make room for new ones." },
  { title: "Existential", seed: "window", body: "Space for the big, quiet questions: meaning, freedom, loss, and how to live alongside uncertainty." },
  { title: "Somatic", seed: "quiet", body: "The body keeps its own record. We listen to it gently, without pushing, so safety can be felt and not just understood." },
  { title: "Culturally responsive", seed: "meadow", body: "Your family, community, language and lived context are part of the work, never an afterthought." },
];

// GSAP split: the title column pins while the lens cards scroll past it.
// Desktop + full motion only; otherwise it is an ordinary stacked layout.
export default function Approach() {
  const { quiet } = useAppState();
  const sectionRef = useRef(null);
  const pinRef = useRef(null);

  useEffect(() => {
    if (quiet || !sectionRef.current) return undefined;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 960px)", () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current.querySelector(".split"),
          start: () => "top " + (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 80) + "px",
          end: "bottom bottom",
          pin: pinRef.current,
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      });
      sectionRef.current.querySelectorAll(".lens").forEach((card) => {
        gsap.fromTo(card.querySelector(".lens-media"),
          { scale: 0.86, opacity: 0.4 },
          { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "top 45%", scrub: true } }
        );
      });
    });
    return () => mm.revert();
  }, [quiet]);

  return (
    <section id="approach" className="ch ch--paper" ref={sectionRef} aria-labelledby="approach-h">
      <div className="wrap split">
        <div className="split-pin" ref={pinRef}>
          <h2 id="approach-h" className="h-display">How I <em>work.</em></h2>
          <p className="split-copy">
            My work is grounded in a relational and humanistic approach, thoughtfully integrating different lenses while remaining culturally responsive to each person's unique story, context, and lived experience.
          </p>
          <p className="split-quote">Collaborative, reflective, and rooted in connection.</p>
        </div>

        <div className="split-list">
          {LENSES.map((l) => (
            <article key={l.title} className="lens group">
              <div className="lens-media">
                <img className="photo" src={img(l.seed, 1200, 800)} alt="" loading="lazy" />
              </div>
              <div className="lens-body">
                <h3>{l.title}</h3>
                <p>{l.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
