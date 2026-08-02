import { useEffect } from "react";
import { AppStateProvider, useAppState } from "./state/AppState.jsx";
import { scrollToHash } from "./hooks/useScrollNav.js";
import { gsap, ScrollTrigger } from "./gsap.js";
import Header from "./components/Header.jsx";
import Home from "./components/home/Home.jsx";
import GroundingSanctuary from "./components/ground/GroundingSanctuary.jsx";
import Crisis from "./components/Crisis.jsx";
import Footer from "./components/Footer.jsx";

function Shell() {
  const { state, dispatch } = useAppState();

  useEffect(() => {
    if (state.page !== "home" || !state.pendingHash) return;
    const hash = state.pendingHash;
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        if (hash === "top") gsap.to(window, { duration: 1, ease: "power2.inOut", scrollTo: { y: 0 } });
        else scrollToHash("#" + hash);
        dispatch({ type: "clearPendingHash" });
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [state.page, state.pendingHash]);

  return (
    <>
      <Header />
      <div className="page-spacer" aria-hidden="true" />
      <Home />
      <GroundingSanctuary />
      <Crisis />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}
