const ITEMS = [
  { kicker: "Format", value: "Online therapy for individuals & couples" },
  { kicker: "Also", value: "Psychoeducational trainings & reflective workshops" },
  { kicker: "Who", value: "Adults aged 18–45" },
  { kicker: "Practice", value: "Trauma-informed, queer-affirmative, disability-inclusive" },
];

export default function AtAGlance() {
  return (
    <section className="section">
      <div className="container">
        <h2 data-reveal="1" className="h2" style={{ marginBottom: 34 }}>At a glance</h2>
        <div className="glance-grid">
          {ITEMS.map((item) => (
            <div key={item.kicker} data-reveal="1" className="glance-card">
              <p className="glance-kicker">{item.kicker}</p>
              <p className="glance-value serif">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
