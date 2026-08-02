export default function About() {
  return (
    <section id="about" className="section">
      <div className="container about-grid">
        <div data-reveal="1" className="about-portrait">
          <div className="about-portrait-blob" />
          <div role="img" aria-label="Placeholder for a portrait photograph of Sanskruti" className="about-portrait-frame">
            <span className="mono-badge">portrait placeholder</span>
          </div>
        </div>
        <div data-reveal="1">
          <h2 className="h2" style={{ marginBottom: 6 }}>Sanskruti</h2>
          <p className="about-sub">she/her · Psychotherapist</p>
          <div className="about-badges">
            <span>MSc Clinical Psychology</span>
            <span>+2 additional qualifications</span>
            <span>3+ years of therapeutic experience</span>
          </div>
          <p className="about-copy">I offer a thoughtful, inclusive, and collaborative space for adults navigating life's challenges. My practice is trauma-informed, queer-affirmative and disability-inclusive — you are welcome here as you are.</p>
          <p className="about-copy about-copy--muted">Sessions are online, so we can meet from wherever you feel most at ease.</p>
        </div>
      </div>
    </section>
  );
}
