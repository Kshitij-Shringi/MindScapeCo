import { gsap } from "../gsap.js";

export function scrollToHash(hash, offset = 70) {
  const el = typeof hash === "string" ? document.querySelector(hash) : hash;
  if (!el) return;
  gsap.to(window, { duration: 1, ease: "power2.inOut", scrollTo: { y: el, offsetY: offset } });
}

export function scrollToTopInstant() {
  gsap.set(window, { scrollTo: 0 });
}
