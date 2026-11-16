import { useAppState } from "../../state/AppState.jsx";
import { scrollToHash } from "../../hooks/useScrollNav.js";
import { img } from "../../lib/img.js";

// 4-col dense grid: A 2x2 + B 2x1 + C 1x1 + D 1x1 + E 4x1 = 12 cells = 4x3, no voids.
export default function AtAGlance() {
  const { dispatch } = useAppState();
  const goGrounding = () => dispatch({ type: "goto", page: "hub" });

  return (
    <section className="ch ch--paper ch--flush-top" aria-labelledby="glance-h">
      <div className="wrap">
        <div data-reveal="1" className="ch-head">
          <h2 id="glance-h" className="h-display">A quiet place to <em>begin.</em></h2>
          <p className="ch-sub">Everything you might want to know before reaching out, in one glance.</p>
        </div>

        <div className="bento">
          <article data-reveal="1" className="bento-card bento-a group">
            <div className="bento-media">
              <img className="photo" src={img("window-light", 1200, 1200)} alt="" loading="lazy" />
            </div>
            <div className="bento-a-body">
              <p className="bento-kicker">Format</p>
              <h3>Online therapy for individuals &amp; couples.</h3>
              <p>Meet from wherever you feel most at ease: your room, a parked car, a quiet corner at work.</p>
            </div>
          </article>

          <article data-reveal="1" className="bento-card bento-b">
            <p className="bento-kicker">Who</p>
            <p className="bento-figure">18&ndash;45</p>
            <p className="bento-copy">Adults navigating anxiety, relationships, identity, burnout, grief, or simply the feeling that something is off.</p>
          </article>

          <article data-reveal="1" className="bento-card bento-c">
            <p className="bento-kicker">Practice</p>
            <p className="bento-statement">Trauma-informed, queer-affirmative, disability-inclusive.</p>
          </article>

          <a
            href="#workshops"
            data-reveal="1"
            className="bento-card bento-d group"
            onClick={(e) => { e.preventDefault(); scrollToHash("#workshops"); }}
          >
            <p className="bento-kicker">Also</p>
            <p className="bento-statement">Trainings &amp; reflective workshops.</p>
            <span className="bento-link">See workshops <span aria-hidden="true">→</span></span>
          </a>

          <article data-reveal="1" className="bento-card bento-e">
            <div className="bento-e-orb" aria-hidden="true"><span /><span /><span /></div>
            <div className="bento-e-body">
              <p className="bento-kicker">Grounding Sanctuary</p>
              <h3>Before you read on, take a moment to breathe.</h3>
              <p>Six quiet rooms of grounding exercises you can use any time. No sign-up, nothing to say out loud.</p>
            </div>
            <button type="button" className="btn-light" onClick={goGrounding}>
              Step inside <span className="btn-arrow" aria-hidden="true">→</span>
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}
