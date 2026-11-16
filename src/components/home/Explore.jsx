import { useState } from "react";
import { img } from "../../lib/img.js";

const ITEMS = [
  { title: "Anxiety & overthinking", seed: "rain", body: "When your mind won't stop rehearsing, replaying, or bracing for what might go wrong." },
  { title: "Burnout & perfectionism", seed: "dusk", body: "For the tiredness rest doesn't fix, and the voice that says it's never quite enough." },
  { title: "Relationships & attachment", seed: "pine", body: "Understanding the patterns you keep finding yourself in, with others and with yourself." },
  { title: "Body image & self-esteem", seed: "linen", body: "Softening the way you see and speak to yourself, at a pace that feels safe." },
  { title: "Identity, sexuality & gender", seed: "horizon", body: "An affirming space to explore who you are, without having to explain or defend it." },
  { title: "Complex trauma, shame & grief", seed: "harbor", body: "Carefully, slowly, with your nervous system's limits respected throughout." },
  { title: "Numbness & meaning-making", seed: "fern", body: "When things feel flat or far away, and you're looking for what matters again." },
];

// Horizontal accordion: slices widen on hover/focus (desktop); on narrow
// screens the same buttons stack and expand vertically.
export default function Explore() {
  const [active, setActive] = useState(0);

  return (
    <section id="explore" className="ch ch--night" aria-labelledby="explore-h">
      <div className="wrap">
        <div data-reveal="1" className="ch-head ch-head--split">
          <h2 id="explore-h" className="h-display">What we might <em>explore.</em></h2>
          <p className="ch-sub">Not limited to these. If what you're carrying doesn't have a name yet, that's a fine place to start too.</p>
        </div>

        <div data-reveal="1" className="acc">
          {ITEMS.map((item, i) => {
            const on = active === i;
            return (
              <button
                key={item.title}
                type="button"
                className={"acc-slice" + (on ? " is-on" : "")}
                aria-expanded={on}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className="acc-media" aria-hidden="true">
                  <img className="photo" src={img(item.seed, 900, 1200)} alt="" loading="lazy" />
                </span>
                <span className="acc-shade" aria-hidden="true" />
                <span className="acc-spine">{item.title}</span>
                <span className="acc-body">
                  <span className="acc-title">{item.title}</span>
                  <span className="acc-text">{item.body}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
