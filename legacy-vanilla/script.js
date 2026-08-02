(() => {
  "use strict";

  var THEMES = ["Anxiety & overthinking", "Burnout & perfectionism", "Relationships & attachment", "Body image & self-esteem", "Identity, sexuality & gender", "Complex trauma, shame & grief", "Numbness & meaning-making", "Something else / not sure yet"];
  var SEEK = ["Individual therapy", "Couples therapy", "Workshop or training", "Not sure yet"];

  var PATTERNS = {
    coherent: { key: "coherent", label: "Coherent 5·5", desc: "Five seconds in, five seconds out. About six breaths a minute — the default, and a good place to start.", phases: [["Breathe in", 5, .62, 1], ["Breathe out", 5, 1, .62]] },
    box: { key: "box", label: "Box 4·4·4·4", desc: "In for four, hold for four, out for four, hold for four. Steadying when your mind is racing.", phases: [["Breathe in", 4, .62, 1], ["Hold", 4, 1, 1], ["Breathe out", 4, 1, .62], ["Hold", 4, .62, .62]] },
    "478": { key: "478", label: "4·7·8", desc: "In for four, hold for seven, a long eight-second exhale. Often used to settle before sleep.", phases: [["Breathe in", 4, .62, 1], ["Hold", 7, 1, 1], ["Long exhale", 8, 1, .6]] },
    sigh: { key: "sigh", label: "Physiological sigh", desc: "A full breath in, a small top-up, then a long exhale. The body's own reset.", phases: [["Breathe in", 2, .6, .9], ["Top up", 1, .9, 1], ["Long exhale", 6, 1, .58], ["Rest", 1, .58, .6]] }
  };
  var PATTERN_KEYS = ["coherent", "box", "478", "sigh"];

  var CARDS = [
    { step: "Five", title: "Five things you can see", body: "Look slowly around you and name five. A corner of the ceiling, the colour of a wall, your own hands. No need to say them out loud." },
    { step: "Four", title: "Four things you can feel", body: "The chair beneath you, fabric against your skin, the temperature of the air, your feet on the floor." },
    { step: "Three", title: "Three things you can hear", body: "Traffic, a fan, your own breathing. Let sounds arrive without deciding whether you like them." },
    { step: "Two", title: "Two things you can smell", body: "Or two smells you like, if there's nothing to notice right now. Memory counts." },
    { step: "One", title: "One thing you can taste", body: "Tea, water, the inside of your own mouth. Then take one more slow breath, and come back when you're ready." }
  ];

  var ROOMS = [
    { key: "scatter", num: "01", title: "Scattered → Calm", blurb: "Scroll slowly and watch an overloaded page settle into order." },
    { key: "breath", num: "02", title: "Breathe with the light", blurb: "A ring that grows and softens with four breathing patterns." },
    { key: "smoke", num: "03", title: "Clear the mist", blurb: "Move slowly through cool fog to uncover the warmth beneath." },
    { key: "bilateral", num: "04", title: "Follow the light", blurb: "A soft orb drifting side to side, with an optional tap cue." },
    { key: "anchor", num: "05", title: "Press and hold", blurb: "Warmth that grows only while you stay, and fades slowly." },
    { key: "senses", num: "06", title: "5 · 4 · 3 · 2 · 1", blurb: "Come back to the room through each of your senses." }
  ];

  var state = { page: "home", themes: [], seek: "", sent: false, calm: false, pattern: "coherent", breathOn: false, tone: false, bilatOn: true, tap: false, card: 0 };
  var reduced = false;
  var gCleanup = [];
  var graf = null;
  var phaseStart = null;
  var ac = null, osc = null, gain = null;
  var raf = null;
  var onMove = null;
  var io = null;

  var $ = function (id) { return document.getElementById(id); };
  var qs = function (sel, root) { return (root || document).querySelector(sel); };
  var qsa = function (sel, root) { return Array.from((root || document).querySelectorAll(sel)); };

  function snapshot() {
    return { page: state.page, calm: state.calm, pattern: state.pattern, breathOn: state.breathOn, tone: state.tone };
  }
  var prev = snapshot();

  function setState(patch) {
    var next = typeof patch === "function" ? patch(state) : patch;
    Object.assign(state, next);
    syncUI();
    var ps = prev;
    prev = snapshot();
    if (ps.page !== state.page || ps.calm !== state.calm) {
      stopGround();
      if (state.page !== "home") startGround();
    }
    if (ps.pattern !== state.pattern) phaseStart = null;
    if (ps.breathOn !== state.breathOn) { phaseStart = null; setTone(state.tone && state.breathOn); }
    if (ps.tone !== state.tone) setTone(state.tone && state.breathOn);
  }

  function quiet() { return reduced || state.calm; }

  // ---------------------------------------------------------------------
  // rendering / DOM sync
  // ---------------------------------------------------------------------

  function buildChip(label, onClick) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = label;
    b.addEventListener("click", onClick);
    return b;
  }

  function setChipState(b, on) {
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  }

  function renderThemes() {
    var host = $("enq-themes");
    if (!host.childElementCount) {
      THEMES.forEach(function (label) {
        host.appendChild(buildChip(label, function () {
          setState(function (s) {
            var has = s.themes.indexOf(label) > -1;
            return { themes: has ? s.themes.filter(function (t) { return t !== label; }) : s.themes.concat(label) };
          });
        }));
      });
    }
    qsa("button", host).forEach(function (b, i) { setChipState(b, state.themes.indexOf(THEMES[i]) > -1); });
  }

  function renderSeek() {
    var host = $("enq-seek");
    if (!host.childElementCount) {
      SEEK.forEach(function (label) {
        host.appendChild(buildChip(label, function () {
          setState({ seek: state.seek === label ? "" : label });
        }));
      });
    }
    qsa("button", host).forEach(function (b, i) { setChipState(b, state.seek === SEEK[i]); });
  }

  function renderRooms() {
    var host = $("rooms-grid");
    if (host.childElementCount) return;
    ROOMS.forEach(function (r) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "room-btn";
      b.setAttribute("data-magnet", "1");
      b.innerHTML =
        '<span style="font-size: 12px; letter-spacing: .2em; color: #5E7095;">' + r.num + '</span>' +
        '<span style="font-family: Newsreader, Georgia, serif; font-size: clamp(22px, 2.4vw, 30px); font-weight: 300; line-height: 1.2; color: #1E2B45;">' + r.title + '</span>' +
        '<span style="font-size: 15px; line-height: 1.65; color: #5E7095;">' + r.blurb + '</span>' +
        '<span style="font-size: 13px; letter-spacing: .12em; text-transform: uppercase; color: #5E7095;">Enter →</span>';
      b.addEventListener("click", function () { show(r.key); });
      host.appendChild(b);
    });
  }

  function renderPatterns() {
    var host = $("patterns-group");
    if (!host.childElementCount) {
      PATTERN_KEYS.forEach(function (key) {
        host.appendChild(buildChip(PATTERNS[key].label, function () { setState({ pattern: key }); }));
      });
    }
    qsa("button", host).forEach(function (b, i) { setChipState(b, state.pattern === PATTERN_KEYS[i]); });
    $("pattern-desc").textContent = PATTERNS[state.pattern].desc;
  }

  function renderCalmButtons() {
    var label = state.calm ? "Calm mode is on — restore motion" : "Calm mode: reduce motion";
    qsa(".calm-btn, #calm-btn-hub").forEach(function (b) {
      b.textContent = label;
      b.classList.toggle("is-on", state.calm);
      b.setAttribute("aria-pressed", state.calm ? "true" : "false");
    });
  }

  function renderBreathToggle() {
    $("breath-toggle").textContent = state.breathOn ? "Pause the breath" : "Start breathing";
  }
  function renderToneToggle() {
    var b = $("tone-toggle");
    b.textContent = state.tone ? "Ambient tone on" : "Add a quiet tone";
    b.classList.toggle("is-on", state.tone);
    b.setAttribute("aria-pressed", state.tone ? "true" : "false");
  }
  function renderBilatToggle() {
    $("bilat-toggle").textContent = state.bilatOn ? "Pause the orb" : "Start the orb";
  }
  function renderTapToggle() {
    var b = $("tap-toggle");
    b.textContent = state.tap ? "Tap cue on" : "Alternating tap cue";
    b.classList.toggle("is-on", state.tap);
    b.setAttribute("aria-pressed", state.tap ? "true" : "false");
  }

  function renderSmokeNote() {
    $("ms-smoke-note").style.display = state.calm ? "block" : "none";
  }

  function renderCards() {
    var host = $("cards-wrap");
    if (!host.childElementCount) {
      CARDS.forEach(function (c) {
        var art = document.createElement("article");
        art.className = "card-anim";
        art.innerHTML =
          '<p style="margin: 0 0 14px; font-size: 13px; letter-spacing: .18em; text-transform: uppercase; color: #5E7095;">' + c.step + '</p>' +
          '<h2 style="margin: 0 0 18px; font-family: Newsreader, Georgia, serif; font-weight: 500; font-size: clamp(1.3rem, 2.4vw, 1.5rem); line-height: 1.2; letter-spacing: -.008em; color: #1E2B45;">' + c.title + '</h2>' +
          '<p style="margin: 0; font-size: 17px; line-height: 1.75; color: #5E7095; max-width: 52ch;">' + c.body + '</p>';
        host.appendChild(art);
      });
    }
    var arts = qsa(".card-anim", host);
    arts.forEach(function (art, i) {
      var d = i - state.card;
      var on = d === 0;
      art.setAttribute("aria-hidden", on ? "false" : "true");
      art.style.pointerEvents = on ? "auto" : "none";
      art.style.zIndex = on ? 3 : d === 1 ? 1 : 0;
      art.style.opacity = on ? 1 : d === 1 ? 0.14 : 0;
      var tx = d < 0 ? -46 : d === 0 ? 0 : 4 + d * 2;
      var ty = d > 0 ? 24 + d * 6 : 0;
      art.style.transform = "translate(" + tx + "%," + ty + "px) scale(" + (d === 0 ? 1 : 0.96) + ")";
    });
    $("card-count").textContent = "Card " + (state.card + 1) + " of 5";
  }

  function renderSent() {
    $("enq-sent").style.opacity = state.sent ? "1" : "0";
  }

  function syncPages() {
    var home = state.page === "home";
    qs("main").style.display = home ? "" : "none";
    $("ms-ground").classList.toggle("is-active", !home);
    qsa("#ms-ground > [data-page]").forEach(function (el) {
      el.classList.toggle("is-active", el.getAttribute("data-page") === state.page);
    });
  }

  function syncUI() {
    syncPages();
    renderThemes();
    renderSeek();
    renderPatterns();
    renderCalmButtons();
    renderBreathToggle();
    renderToneToggle();
    renderBilatToggle();
    renderTapToggle();
    renderSmokeNote();
    renderCards();
    renderSent();
  }

  // ---------------------------------------------------------------------
  // navigation
  // ---------------------------------------------------------------------

  function show(page) {
    setState({ page: page });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function goHome() {
    if (state.page !== "home") setState({ page: "home" });
  }

  function goGrounding() { show("hub"); }

  function enquireWorkshop() {
    setState({ seek: "Workshop or training" });
    var el = $("enquiry");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
  }

  var NAV = ROOMS.reduce(function (acc, r) { acc[r.key] = function () { show(r.key); }; return acc; }, { hub: function () { show("hub"); }, home: function () { show("home"); } });

  // ---------------------------------------------------------------------
  // audio tone
  // ---------------------------------------------------------------------

  function setTone(on) {
    if (!on) {
      if (gain) { try { gain.gain.value = 0; osc.stop(); } catch (e) {} }
      gain = null; osc = null;
      return;
    }
    if (osc) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ac = ac || new AC();
      if (ac.state === "suspended") ac.resume();
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = "sine"; o.frequency.value = 174;
      g.gain.value = 0.012;
      o.connect(g).connect(ac.destination);
      o.start();
      osc = o; gain = g;
    } catch (e) {}
  }

  // ---------------------------------------------------------------------
  // one-time mount effects
  // ---------------------------------------------------------------------

  function initHeroLines() {
    var lines = qsa("[data-hline]");
    if (reduced || !lines.length) return;
    lines.forEach(function (el, i) {
      el.style.opacity = "0";
      el.style.transform = "translateY(108%)";
      el.style.filter = "blur(9px)";
      el.style.transition = "opacity .95s cubic-bezier(.16,.8,.3,1) " + (i * 130 + 120) + "ms, transform 1.05s cubic-bezier(.16,.8,.3,1) " + (i * 130 + 120) + "ms, filter 1.1s ease-out " + (i * 130 + 120) + "ms";
    });
    var done = false;
    var reveal = function () {
      if (done) return;
      done = true;
      lines.forEach(function (el) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; el.style.filter = "blur(0)"; });
    };
    requestAnimationFrame(function () { requestAnimationFrame(reveal); });
    setTimeout(reveal, 240);
    document.addEventListener("visibilitychange", reveal, { once: true });
  }

  function initReveals() {
    var els = qsa("[data-reveal]");
    if (reduced || !("IntersectionObserver" in window)) return;
    els.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      el.style.transition = "opacity 1.1s cubic-bezier(.2,.7,.3,1), transform 1.1s cubic-bezier(.2,.7,.3,1)";
    });
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.style.transitionDelay = (i * 90) + "ms";
        el.style.opacity = "1";
        el.style.transform = "none";
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  function initHeroWarp() {
    var warp = $("ms-hero-warp");
    if (!warp) return;
    var tx = 0, ty = 0, cx = 0, cy = 0;
    onMove = function (e) {
      var r = warp.getBoundingClientRect();
      if (r.bottom < 0) return;
      tx = ((e.clientX - r.left) / r.width - 0.5) * 46;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 30;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    var tick = function () {
      cx += (tx - cx) * 0.03;
      cy += (ty - cy) * 0.03;
      warp.style.transform = "translate3d(" + cx.toFixed(2) + "px," + cy.toFixed(2) + "px,0)";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  // ---------------------------------------------------------------------
  // grounding sanctuary lifecycle (scatter / breath / smoke / bilateral / anchor)
  // ---------------------------------------------------------------------

  function stopGround() {
    (gCleanup || []).forEach(function (fn) { try { fn(); } catch (e) {} });
    gCleanup = [];
    if (graf) cancelAnimationFrame(graf);
    graf = null;
    setTone(false);
  }

  function startGround() {
    var cleanup = gCleanup = [];
    var q = quiet();
    var pg = state.page;
    var on = function (key, id) { return pg === key ? $(id) : null; };
    var scatter = on("scatter", "ms-scatter"), sphere = on("scatter", "ms-sphere");
    var items = pg === "scatter" ? qsa("[data-sc]") : [];
    var orb = on("breath", "ms-breath-orb"), cue = on("breath", "ms-breath-cue");
    var bilat = on("bilateral", "ms-bilat-orb"), side = on("bilateral", "ms-bilat-side");
    var anchor = on("anchor", "ms-anchor"), bloom = on("anchor", "ms-anchor-bloom");
    var ring = $("ms-cursor");
    var canvas = on("smoke", "ms-smoke");

    // --- scattered -> calm ---
    items.forEach(function (el) { el.style.transition = "none"; el.style.willChange = "transform, filter"; });
    var applyScatter = function (p) {
      var e = 1 - Math.pow(1 - p, 3);
      items.forEach(function (el) {
        var sx = parseFloat(el.dataset.sx || 0), sy = parseFloat(el.dataset.sy || 0), sr = parseFloat(el.dataset.sr || 0);
        el.style.transform = "translate(" + (sx * (1 - e)).toFixed(2) + "%," + (sy * (1 - e)).toFixed(2) + "%) rotate(" + (sr * (1 - e)).toFixed(2) + "deg)";
        el.style.filter = "blur(" + (5 * (1 - e)).toFixed(2) + "px)";
        el.style.opacity = (0.55 + 0.45 * e).toFixed(3);
      });
      if (sphere) { sphere.style.opacity = Math.max(0, (e - 0.2) / 0.8).toFixed(3); sphere.style.transform = "scale(" + (0.6 + 0.4 * e).toFixed(3) + ")"; }
    };
    if (q) {
      if (scatter) { scatter.style.height = "auto"; if (scatter.firstElementChild) { scatter.firstElementChild.style.position = "static"; scatter.firstElementChild.style.height = "auto"; scatter.firstElementChild.style.padding = "80px 22px"; } }
      applyScatter(1);
    } else if (scatter) {
      scatter.style.height = "300vh";
      if (scatter.firstElementChild) { scatter.firstElementChild.style.position = "sticky"; scatter.firstElementChild.style.height = "100vh"; }
      applyScatter(0);
    }

    // --- smoke clearer ---
    var smoke = null;
    if (canvas && !q) {
      var cols = 60, rows = 26;
      var a = new Float32Array(cols * rows).fill(1);
      var off = document.createElement("canvas");
      off.width = cols; off.height = rows;
      var octx = off.getContext("2d");
      var img = octx.createImageData(cols, rows);
      var ctx = canvas.getContext("2d");
      var pointer = { x: -999, y: -999, active: false };
      var onPtr = function (ev) {
        var r = canvas.getBoundingClientRect();
        pointer.x = ((ev.clientX - r.left) / r.width) * cols;
        pointer.y = ((ev.clientY - r.top) / r.height) * rows;
        pointer.active = true;
      };
      var onLeave = function () { pointer.active = false; };
      canvas.addEventListener("pointermove", onPtr, { passive: true });
      canvas.addEventListener("pointerdown", onPtr, { passive: true });
      canvas.addEventListener("pointerleave", onLeave);
      cleanup.push(function () { canvas.removeEventListener("pointermove", onPtr); canvas.removeEventListener("pointerdown", onPtr); canvas.removeEventListener("pointerleave", onLeave); });
      smoke = { cols: cols, rows: rows, a: a, off: off, octx: octx, img: img, ctx: ctx, pointer: pointer };
    } else if (canvas) {
      var ctx2 = canvas.getContext("2d");
      var g2 = ctx2.createLinearGradient(0, 0, canvas.width, canvas.height);
      g2.addColorStop(0, "#E9D4C2"); g2.addColorStop(.55, "#DCC3D6"); g2.addColorStop(1, "#C7D0E2");
      ctx2.fillStyle = g2; ctx2.fillRect(0, 0, canvas.width, canvas.height);
      ctx2.fillStyle = "rgba(199,208,226,.45)"; ctx2.fillRect(0, 0, canvas.width, canvas.height);
    }

    // --- anchor ---
    var held = false, bloomV = 0;
    if (anchor) {
      var down = function () { held = true; };
      var up = function () { held = false; };
      var key = function (ev) { if (ev.key === " " || ev.key === "Enter") { held = true; } };
      var keyUp = function () { held = false; };
      anchor.addEventListener("pointerdown", down);
      anchor.addEventListener("keydown", key);
      window.addEventListener("pointerup", up);
      anchor.addEventListener("keyup", keyUp);
      anchor.addEventListener("blur", up);
      cleanup.push(function () { anchor.removeEventListener("pointerdown", down); anchor.removeEventListener("keydown", key); window.removeEventListener("pointerup", up); anchor.removeEventListener("keyup", keyUp); anchor.removeEventListener("blur", up); });
    }

    // --- cursor ring + magnets ---
    var fine = window.matchMedia("(pointer: fine)").matches;
    var magnets = qsa("#ms-ground [data-magnet]");
    var pt = { x: -999, y: -999 };
    var rx = -999, ry = -999;
    if (!q && fine && ring) {
      var mv = function (ev) { pt.x = ev.clientX; pt.y = ev.clientY; ring.style.opacity = "1"; };
      window.addEventListener("pointermove", mv, { passive: true });
      cleanup.push(function () { window.removeEventListener("pointermove", mv); ring.style.opacity = "0"; magnets.forEach(function (m) { m.style.transform = ""; }); });
    }

    if (q) {
      if (orb) orb.style.transform = "scale(.86)";
      if (cue) cue.textContent = "Calm mode: breathe in for five, out for five, at your own pace.";
      if (bilat) bilat.style.transform = "translateX(0)";
      if (side) side.textContent = "Centre";
      if (bloom) { bloom.style.opacity = ".35"; bloom.style.transform = "scale(1)"; }
      return;
    }

    // --- master loop ---
    var t0 = performance.now();
    phaseStart = null;
    var phaseIdx = 0, scale = 0.62, lastCue = "";
    var tick = function (now) {
      var t = (now - t0) / 1000;

      if (scatter) {
        var r = scatter.getBoundingClientRect();
        var span = Math.max(1, scatter.offsetHeight - window.innerHeight);
        applyScatter(Math.min(1, Math.max(0, -r.top / span)));
      }

      if (orb) {
        if (state.breathOn) {
          var ph = PATTERNS[state.pattern].phases;
          if (phaseStart == null) { phaseStart = t; phaseIdx = 0; }
          var p = (t - phaseStart) / ph[phaseIdx][1];
          if (p >= 1) { phaseStart = t; phaseIdx = (phaseIdx + 1) % ph.length; p = 0; }
          var phase = ph[phaseIdx];
          var label = phase[0], from = phase[2], to = phase[3];
          var e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          scale = from + (to - from) * e;
          if (cue && label !== lastCue) { cue.textContent = label; lastCue = label; }
        } else {
          scale += (0.66 - scale) * 0.04;
          if (cue && lastCue !== "") { cue.textContent = "Ready when you are"; lastCue = ""; }
        }
        orb.style.transform = "scale(" + scale.toFixed(3) + ")";
        if (gain) gain.gain.value = 0.012 + 0.02 * (scale - 0.6);
      }

      if (bilat && state.bilatOn) {
        var w = bilat.parentElement.clientWidth;
        var amp = Math.max(60, w / 2 - 70);
        var x = Math.sin(t * Math.PI) * amp;
        bilat.style.transform = "translateX(" + x.toFixed(1) + "px)";
        if (side) {
          var pre = state.tap ? "Tap " : "";
          var s = x < -amp * 0.5 ? pre + "left" : x > amp * 0.5 ? pre + "right" : "";
          if (s && side.textContent !== s) side.textContent = s;
        }
      }

      if (bloom) {
        bloomV += ((held ? 1 : 0) - bloomV) * (held ? 0.012 : 0.006);
        bloom.style.opacity = bloomV.toFixed(3);
        bloom.style.transform = "scale(" + (0.3 + bloomV * 0.9).toFixed(3) + ")";
      }

      if (smoke) {
        var cols = smoke.cols, rows = smoke.rows, a = smoke.a, octx = smoke.octx, img = smoke.img, ctx = smoke.ctx, pointer = smoke.pointer;
        for (var y = 0; y < rows; y++) {
          for (var x2 = 0; x2 < cols; x2++) {
            var i = y * cols + x2;
            if (pointer.active) {
              var dx = x2 - pointer.x, dy = (y - pointer.y) * 1.9;
              var d2 = dx * dx + dy * dy;
              if (d2 < 42) a[i] -= (1 - d2 / 42) * 0.28;
            }
            a[i] += (1 - a[i]) * 0.0045;
            if (a[i] < 0) a[i] = 0;
            var o = i * 4;
            img.data[o] = 226; img.data[o + 1] = 232; img.data[o + 2] = 243;
            img.data[o + 3] = Math.round(a[i] * 242);
          }
        }
        octx.putImageData(img, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        g.addColorStop(0, "#E9C7A8"); g.addColorStop(.5, "#DCB8C6"); g.addColorStop(1, "#C0CBE2");
        ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.filter = "blur(18px)";
        ctx.drawImage(smoke.off, -30, -30, canvas.width + 60, canvas.height + 60);
        ctx.restore();
      }

      if (!q && fine && ring) {
        rx += (pt.x - rx) * 0.18; ry += (pt.y - ry) * 0.18;
        ring.style.transform = "translate3d(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px,0)";
        magnets.forEach(function (m) {
          var r2 = m.getBoundingClientRect();
          var dx2 = pt.x - (r2.left + r2.width / 2), dy2 = pt.y - (r2.top + r2.height / 2);
          var near = Math.abs(dx2) < r2.width / 2 + 30 && Math.abs(dy2) < r2.height / 2 + 30;
          m.style.transform = near ? "translate(" + (dx2 * 0.18).toFixed(1) + "px," + (dy2 * 0.18).toFixed(1) + "px)" : "";
          m.style.transition = near ? "transform .12s linear" : "transform .6s cubic-bezier(.2,.7,.3,1)";
        });
      }

      graf = requestAnimationFrame(tick);
    };
    graf = requestAnimationFrame(tick);
  }

  // ---------------------------------------------------------------------
  // wiring
  // ---------------------------------------------------------------------

  function wireActions() {
    document.addEventListener("click", function (ev) {
      var el = ev.target.closest("[data-action]");
      if (!el) return;
      var action = el.getAttribute("data-action");
      switch (action) {
        case "goHome": goHome(); break;
        case "goGrounding": goGrounding(); break;
        case "enquireWorkshop": enquireWorkshop(); break;
        case "toggleCalm": setState(function (s) { return { calm: !s.calm }; }); break;
        case "toggleBreath": setState(function (s) { return { breathOn: !s.breathOn }; }); break;
        case "toggleTone": setState(function (s) { return { tone: !s.tone }; }); break;
        case "toggleBilat": setState(function (s) { return { bilatOn: !s.bilatOn }; }); break;
        case "toggleTap": setState(function (s) { return { tap: !s.tap }; }); break;
        case "prevCard": setState(function (s) { return { card: Math.max(0, s.card - 1) }; }); break;
        case "nextCard": setState(function (s) { return { card: Math.min(CARDS.length - 1, s.card + 1) }; }); break;
        case "nav.hub": NAV.hub(); break;
        case "nav.home": NAV.home(); break;
        case "nav.scatter": NAV.scatter(); break;
        case "nav.breath": NAV.breath(); break;
        case "nav.smoke": NAV.smoke(); break;
        case "nav.bilateral": NAV.bilateral(); break;
        case "nav.anchor": NAV.anchor(); break;
        case "nav.senses": NAV.senses(); break;
        default: return;
      }
    });

    $("enquiry-form").addEventListener("submit", function (e) {
      e.preventDefault();
      setState({ sent: true });
    });
  }

  function applyMagnetHoverShadows() {
    qsa("[data-hover-shadow]").forEach(function (el) {
      el.style.setProperty("--hover-shadow", el.getAttribute("data-hover-shadow"));
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    renderRooms();
    applyMagnetHoverShadows();
    syncUI();
    wireActions();

    initReveals();
    initHeroLines();
    if (!reduced) initHeroWarp();
    if (state.page !== "home") startGround();
  });
})();
