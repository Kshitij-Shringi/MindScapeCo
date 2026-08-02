import { gsap } from "../gsap.js";

function headerHeight() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 70;
}

export function scrollToHash(hash, offset) {
  const el = typeof hash === "string" ? document.querySelector(hash) : hash;
  if (!el) return;
  const offsetY = offset ?? headerHeight();
  gsap.to(window, { duration: 1, ease: "power2.inOut", scrollTo: { y: el, offsetY } });
}

export function scrollToTopInstant() {
  gsap.set(window, { scrollTo: 0 });
}
