const ITEMS = [
  { title: "Anxiety & overthinking", radius: "50% 50% 50% 6px" },
  { title: "Burnout & perfectionism", radius: "6px 50% 50% 50%" },
  { title: "Relationships & attachment patterns", radius: "50%", extra: { borderRightColor: "transparent" } },
  { title: "Body image & self-esteem", radius: "50% 6px 50% 6px" },
  { title: "Identity, sexuality & gender", radius: "50%", extra: { borderTopColor: "transparent" } },
  { title: "Complex trauma, shame & grief", radius: "6px", extra: { transform: "rotate(45deg)" } },
  { title: "Numbness & meaning-making", radius: "50%", extra: { borderBottomColor: "transparent", borderLeftColor: "transparent" } },
];

export default function Explore() {
  return (
    <section id="explore" className="section">
      <div className="container">
        <div data-reveal="1" className="explore-head">
          <h2 className="h2">What we might explore</h2>
          <span style={{ fontSize: 14, color: "var(--muted)" }}>Not limited to</span>
        </div>
        <div className="explore-grid">
          {ITEMS.map((item) => (
            <article key={item.title} data-reveal="1" className="card-explore">
              <span aria-hidden="true" className="card-explore-icon" style={{ borderRadius: item.radius, ...item.extra }} />
              <h3>{item.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
