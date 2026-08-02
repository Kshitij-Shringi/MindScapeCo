import { useState } from "react";
import { useAppState } from "../state/AppState.jsx";
import { gsap } from "../gsap.js";
import { scrollToHash } from "../hooks/useScrollNav.js";

export default function Header() {
  const { state, dispatch } = useAppState();
  const [open, setOpen] = useState(false);

  const goTop = (e) => {
    e.preventDefault();
    setOpen(false);
    if (state.page !== "home") {
      dispatch({ type: "gotoHome", hash: "top" });
    } else {
      gsap.to(window, { duration: 1, ease: "power2.inOut", scrollTo: { y: 0 } });
    }
  };

  const goSection = (hash) => (e) => {
    e.preventDefault();
    setOpen(false);
    if (state.page !== "home") {
      dispatch({ type: "gotoHome", hash });
    } else {
      scrollToHash("#" + hash);
    }
  };

  const goGrounding = () => {
    setOpen(false);
    dispatch({ type: "goto", page: "hub" });
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#top" onClick={goTop} className="brand">
          MindScape <span>&amp; Co.</span>
        </a>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav aria-label="Primary" className={"nav-primary" + (open ? " is-open" : "")}>
          <a href="#approach" className="nav-link" onClick={goSection("approach")}>Approach</a>
          <a href="#explore" className="nav-link" onClick={goSection("explore")}>What we explore</a>
          <a href="#workshops" className="nav-link" onClick={goSection("workshops")}>Workshops</a>
          <a href="#about" className="nav-link" onClick={goSection("about")}>About</a>
          <a href="#crisis" className="nav-link" onClick={() => setOpen(false)}>Crisis support</a>
          <button type="button" className="btn-underline" onClick={goGrounding}>Take a breath</button>
          <a
            href="#enquiry"
            data-magnet="1"
            className="btn-peach btn-peach--sm"
            style={{ "--hover-shadow": "0 8px 22px rgba(30,43,69,.16)" }}
            onClick={goSection("enquiry")}
          >
            Book a consultation
          </a>
        </nav>
      </div>
    </header>
  );
}
