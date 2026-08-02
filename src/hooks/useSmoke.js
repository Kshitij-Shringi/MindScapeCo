import { useEffect } from "react";

export function useSmoke(canvasRef, quiet) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    if (quiet) {
      const ctx = canvas.getContext("2d");
      const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      g.addColorStop(0, "#E9D4C2");
      g.addColorStop(0.55, "#DCC3D6");
      g.addColorStop(1, "#C7D0E2");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(199,208,226,.45)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return undefined;
    }

    const cols = 60;
    const rows = 26;
    const a = new Float32Array(cols * rows).fill(1);
    const off = document.createElement("canvas");
    off.width = cols;
    off.height = rows;
    const octx = off.getContext("2d");
    const img = octx.createImageData(cols, rows);
    const ctx = canvas.getContext("2d");
    const pointer = { x: -999, y: -999, active: false };

    const onPtr = (ev) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = ((ev.clientX - r.left) / r.width) * cols;
      pointer.y = ((ev.clientY - r.top) / r.height) * rows;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    canvas.addEventListener("pointermove", onPtr, { passive: true });
    canvas.addEventListener("pointerdown", onPtr, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);

    let raf = null;
    const tick = () => {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          if (pointer.active) {
            const dx = x - pointer.x;
            const dy = (y - pointer.y) * 1.9;
            const d2 = dx * dx + dy * dy;
            if (d2 < 42) a[i] -= (1 - d2 / 42) * 0.28;
          }
          a[i] += (1 - a[i]) * 0.0045;
          if (a[i] < 0) a[i] = 0;
          const o = i * 4;
          img.data[o] = 226;
          img.data[o + 1] = 232;
          img.data[o + 2] = 243;
          img.data[o + 3] = Math.round(a[i] * 242);
        }
      }
      octx.putImageData(img, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      g.addColorStop(0, "#E9C7A8");
      g.addColorStop(0.5, "#DCB8C6");
      g.addColorStop(1, "#C0CBE2");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.filter = "blur(18px)";
      ctx.drawImage(off, -30, -30, canvas.width + 60, canvas.height + 60);
      ctx.restore();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onPtr);
      canvas.removeEventListener("pointerdown", onPtr);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [quiet]);
}
