import { useAppState } from "../state/AppState.jsx";

export default function Footer() {
  const { state, dispatch } = useAppState();

  const goSection = (hash) => (e) => {
    e.preventDefault();
    if (state.page !== "home") dispatch({ type: "gotoHome", hash });
    else document.querySelector("#" + hash)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <p>MindScape <span style={{ color: "var(--muted)" }}>&amp; Co.</span></p>
          <p>A queer-affirmative, trauma-informed, disability-inclusive practice.</p>
        </div>
        <nav aria-label="Footer" className="footer-nav">
          <a href="#approach" onClick={goSection("approach")}>Approach</a>
          <a href="#explore" onClick={goSection("explore")}>What we explore</a>
          <a href="#workshops" onClick={goSection("workshops")}>Workshops</a>
          <a href="#about" onClick={goSection("about")}>About</a>
        </nav>
        <div className="footer-contact">
          <a href="mailto:sanskruti.jkp@gmail.com">sanskruti.jkp@gmail.com</a>
          <a href="tel:+918780978260">+91 87809 78260</a>
          <a href="#privacy">Privacy policy (placeholder)</a>
        </div>
        <p className="footer-copy">© 2026 MindScape &amp; Co.</p>
      </div>
    </footer>
  );
}
