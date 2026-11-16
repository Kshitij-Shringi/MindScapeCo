import { gsap } from "../gsap.js";

function headerHeight() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 70;
}

function motionReduced() {
  return document.documentElement.dataset.motion === "reduced";
}

// autoKill: a wheel or touch scroll from the user interrupts the programmatic
// scroll immediately instead of fighting it until the tween finishes.
export function scrollToHash(hash, offset) {
  const el = typeof hash === "string" ? document.querySelector(hash) : hash;
  if (!el) return;
  const offsetY = offset ?? headerHeight();
  gsap.to(window, { duration: motionReduced() ? 0 : 1, ease: "power2.inOut", scrollTo: { y: el, offsetY, autoKill: true } });
}

export function scrollToTop() {
  gsap.to(window, { duration: motionReduced() ? 0 : 1, ease: "power2.inOut", scrollTo: { y: 0, autoKill: true } });
}

export function scrollToTopInstant() {
  gsap.set(window, { scrollTo: 0 });
}

// Crisis resources are visible on every page, so this never changes page.
export function goCrisis(e) {
  e.preventDefault();
  scrollToHash("#crisis");
}
