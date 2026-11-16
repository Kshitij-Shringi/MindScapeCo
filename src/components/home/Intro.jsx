import { img } from "../../lib/img.js";

const Pill = ({ seed }) => (
  <span className="pill-img" aria-hidden="true">
    <img className="photo" src={img(seed, 400, 200)} alt="" loading="lazy" />
  </span>
);

export default function Intro() {
  return (
    <section className="ch ch--paper">
      <div className="wrap">
        <p data-reveal="1" className="statement">
          Therapy here is collaborative, <Pill seed="hands" /> reflective, and rooted in <Pill seed="petals" /> connection.
          <span className="statement-soft"> We go at your pace. There's nothing you need to have figured out first.</span>
        </p>
      </div>
    </section>
  );
}
