import { gsap } from "../gsap.js";

// Apple-style spring driven by GSAP's ticker. Parameterised by damping ratio
// (1 = no overshoot) and response (seconds, not a duration), mapped to
// stiffness/damping with unit mass. Always starts from the element's live value
// and accepts an initial velocity, so a drag can hand off into it seamlessly.
const running = new WeakMap();

export function stopSpring(el) {
  const stop = running.get(el);
  if (stop) stop();
}

export function springTo(el, prop, to, { velocity = 0, damping = 1, response = 0.4, onComplete } = {}) {
  stopSpring(el);
  gsap.killTweensOf(el, prop);

  const k = Math.pow((2 * Math.PI) / response, 2);
  const c = (4 * Math.PI * damping) / response;
  let x = Number(gsap.getProperty(el, prop)) || 0;
  let v = velocity;
  const step = 1 / 240;

  const tick = (time, deltaMs) => {
    let remaining = Math.min(deltaMs / 1000, 0.064);
    while (remaining > 0) {
      const dt = Math.min(step, remaining);
      v += (-k * (x - to) - c * v) * dt;
      x += v * dt;
      remaining -= dt;
    }
    if (Math.abs(v) < 0.02 && Math.abs(x - to) < 0.02) {
      x = to;
      stop();
      gsap.set(el, { [prop]: x });
      if (onComplete) onComplete();
      return;
    }
    gsap.set(el, { [prop]: x });
  };

  const stop = () => {
    gsap.ticker.remove(tick);
    if (running.get(el) === stop) running.delete(el);
  };

  running.set(el, stop);
  gsap.ticker.add(tick);
  return stop;
}

// Apple's momentum projection (Designing Fluid Interfaces): where a flick would
// come to rest under scroll-like deceleration. Velocity in units/s.
export function project(velocity, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

// Progressive resistance past a boundary instead of a hard stop.
export function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
