import { useEffect, useRef, useState } from "react";
import { useAppState } from "../state/AppState.jsx";
import { ScrollTrigger } from "../gsap.js";
import { scrollToHash, scrollToTop, goCrisis } from "../hooks/useScrollNav.js";

export default function Header() {
  const { state, dispatch } = useAppState();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el || !("ResizeObserver" in window)) return undefined;
    const apply = () => {
      document.documentElement.style.setProperty("--header-h", el.offsetHeight + "px");
      ScrollTrigger.refresh();
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The divider only appears once content actually scrolls under the header.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const goTop = (e) => {
    e.preventDefault();
    setOpen(false);
    if (state.page !== "home") {
      dispatch({ type: "gotoHome", hash: "top" });
    } else {
      scrollToTop();
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
    <header className={"site-header" + (scrolled ? " is-scrolled" : "") + (open ? " is-open" : "")} ref={headerRef}>
      <div className="header-inner">
        <a href="#top" onClick={goTop} className="brand">
          MindScape <span>&amp; Co.</span>
        </a>

        <button
          type="button"
          className={"nav-toggle" + (open ? " is-open" : "")}
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
          <a href="#explore" className="nav-link" onClick={goSection("explore")}>Explore</a>
          <a href="#workshops" className="nav-link" onClick={goSection("workshops")}>Workshops</a>
          <a href="#about" className="nav-link" onClick={goSection("about")}>About</a>
          <a href="#crisis" className="nav-link" onClick={(e) => { setOpen(false); goCrisis(e); }}>Crisis support</a>
          <button type="button" className="nav-link nav-breathe" onClick={goGrounding}>
            <span className="nav-breathe-dot" aria-hidden="true" />Take a breath
          </button>
          <a href="#enquiry" className="btn-light btn-light--nav" onClick={goSection("enquiry")}>
            Book a consultation
          </a>
        </nav>
      </div>
    </header>
  );
}
