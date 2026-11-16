const WORDS = [
  "Trauma-informed",
  "Queer-affirmative",
  "Disability-inclusive",
  "Online, wherever you are",
  "Individuals & couples",
  "At your own pace",
];

// Two identical tracks side by side; the CSS keyframe slides the pair by
// exactly one track width, so the loop seam is invisible.
export default function Marquee() {
  const track = (hidden) => (
    <ul className="mq-track" aria-hidden={hidden || undefined}>
      {WORDS.map((w) => (
        <li key={w}>
          <span>{w}</span>
          <i aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <section className="mq" aria-label="Practice values">
      <div className="mq-row">
        {track(false)}
        {track(true)}
      </div>
    </section>
  );
}
