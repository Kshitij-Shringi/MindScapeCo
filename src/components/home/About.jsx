export default function About() {
  return (
    <section id="about" className="ch ch--paper" aria-labelledby="about-h">
      <div className="wrap about">
        <div data-reveal="1" className="about-portrait group">
          <div role="img" aria-label="Placeholder for a portrait photograph of Sanskruti" className="about-frame">
            <span className="about-frame-note">Portrait to come</span>
          </div>
        </div>

        <div data-reveal="1" className="about-body">
          <h2 id="about-h" className="h-display">Sanskruti</h2>
          <p className="about-role">she/her &middot; Psychotherapist</p>
          <p className="about-lead">
            I offer a thoughtful, inclusive, and collaborative space for adults navigating life's challenges. My practice is trauma-informed, queer-affirmative and disability-inclusive. <em>You are welcome here as you are.</em>
          </p>
          <dl className="about-facts">
            <div><dt>Training</dt><dd>MSc Clinical Psychology, plus two additional qualifications</dd></div>
            <div><dt>Experience</dt><dd>3+ years of therapeutic work</dd></div>
            <div><dt>Sessions</dt><dd>Online, so we can meet from wherever you feel most at ease</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}
