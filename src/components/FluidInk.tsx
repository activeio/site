"use client";

import { useEffect, useRef } from "react";

/**
 * Soft ink-in-water fluid simulation (stable-fluids style).
 * A coarse velocity grid is advected semi-Lagrangian and projected to be
 * divergence-free each frame; pastel pigments ride the flow. Rendered at
 * grid resolution and upscaled with smoothing for a watercolor softness.
 * Pointer movement stirs the water and trails a little ink.
 */

const PAPER_HEX = "#faf9f5"; // matches --color-background
const INKS = [
  "#c3d3e4", // mist blue
  "#e3cfd5", // dusty rose
  "#ccd9c2", // sage
  "#d5cee4", // lavender gray
  "#e8d9bd", // warm sand
  "#c2d9d4", // celadon
];

const BASE_RES = 150; // grid cells along the longer side
const JACOBI_ITERS = 14;
const MAX_ABSORB = 0.32; // render cap: keeps mixes pastel, never muddy

function hexToRgb(h: string): [number, number, number] {
  return [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
}

export function FluidInk() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const PAPER = hexToRgb(PAPER_HEX);
    // Subtractive pigment per ink: how much each channel is absorbed.
    // The gain pushes accumulation past the pale ink tints so trails read
    // clearly; MAX_ABSORB still caps the rendered depth at pastel.
    const PIGMENT_GAIN = 2.6;
    const PIGMENTS = INKS.map(hexToRgb).map(
      ([r, g, b]) =>
        [
          ((PAPER[0] - r) / 255) * PIGMENT_GAIN,
          ((PAPER[1] - g) / 255) * PIGMENT_GAIN,
          ((PAPER[2] - b) / 255) * PIGMENT_GAIN,
        ] as const
    );

    let W = 0;
    let H = 0;
    let gw = 0;
    let gh = 0;
    let cells = 0;
    let u: Float32Array, v: Float32Array;
    let u0: Float32Array, v0: Float32Array;
    let p: Float32Array, div: Float32Array;
    let dr: Float32Array, dg: Float32Array, db: Float32Array;
    let tmp: Float32Array;
    let img: ImageData;
    let off: HTMLCanvasElement;
    let octx: CanvasRenderingContext2D;

    // drifting emitters on Lissajous-ish paths
    const emitters = Array.from({ length: 4 }, (_, e) => ({
      p1: Math.random() * Math.PI * 2,
      p2: Math.random() * Math.PI * 2,
      s1: 0.00006 + Math.random() * 0.00008,
      s2: 0.00006 + Math.random() * 0.00008,
      colorOffset: e * 2,
    }));

    function allocGrid() {
      const aspect = W / Math.max(H, 1);
      if (aspect >= 1) {
        gw = BASE_RES;
        gh = Math.max(12, Math.round(BASE_RES / aspect));
      } else {
        gh = BASE_RES;
        gw = Math.max(12, Math.round(BASE_RES * aspect));
      }
      cells = gw * gh;
      u = new Float32Array(cells);
      v = new Float32Array(cells);
      u0 = new Float32Array(cells);
      v0 = new Float32Array(cells);
      p = new Float32Array(cells);
      div = new Float32Array(cells);
      dr = new Float32Array(cells);
      dg = new Float32Array(cells);
      db = new Float32Array(cells);
      tmp = new Float32Array(cells);
      off = document.createElement("canvas");
      off.width = gw;
      off.height = gh;
      octx = off.getContext("2d")!;
      img = octx.createImageData(gw, gh);
      seedField();
    }

    // gentle large-scale shear that projection turns into slow swirls
    function seedField() {
      const a = 1 + ((Math.random() * 2) | 0);
      const b = 1 + ((Math.random() * 2) | 0);
      const ph = Math.random() * Math.PI * 2;
      for (let j = 0; j < gh; j++) {
        for (let i = 0; i < gw; i++) {
          const k = i + j * gw;
          u[k] = 0.45 * Math.sin((Math.PI * 2 * a * j) / gh + ph);
          v[k] = 0.45 * Math.sin((Math.PI * 2 * b * i) / gw - ph);
        }
      }
      for (let n = 0; n < 8; n++) {
        splat(
          gw * (0.15 + Math.random() * 0.7),
          gh * (0.15 + Math.random() * 0.7),
          0,
          0,
          PIGMENTS[(Math.random() * PIGMENTS.length) | 0],
          1.1,
          4.5
        );
      }
    }

    function splat(
      x: number,
      y: number,
      vx: number,
      vy: number,
      pig: readonly [number, number, number] | null,
      amt: number,
      rad: number
    ) {
      const r = Math.ceil(rad);
      const ci = Math.round(x);
      const cj = Math.round(y);
      for (let dj = -r; dj <= r; dj++) {
        const j = cj + dj;
        if (j < 1 || j >= gh - 1) continue;
        for (let di = -r; di <= r; di++) {
          const i = ci + di;
          if (i < 1 || i >= gw - 1) continue;
          const w = Math.exp(-(di * di + dj * dj) / (rad * rad * 0.7));
          const k = i + j * gw;
          u[k] += vx * w;
          v[k] += vy * w;
          if (pig) {
            // scale the whole addition by the most-limited channel so a
            // saturating cell keeps its hue instead of clipping to gray
            const addR = pig[0] * amt * w;
            const addG = pig[1] * amt * w;
            const addB = pig[2] * amt * w;
            let t = 1;
            if (addR > 0) t = Math.min(t, (0.45 - dr[k]) / addR);
            if (addG > 0) t = Math.min(t, (0.45 - dg[k]) / addG);
            if (addB > 0) t = Math.min(t, (0.45 - db[k]) / addB);
            if (t > 0) {
              dr[k] += addR * t;
              dg[k] += addG * t;
              db[k] += addB * t;
            }
          }
        }
      }
    }

    function advect(dst: Float32Array, src: Float32Array, dt: number) {
      for (let j = 0; j < gh; j++) {
        for (let i = 0; i < gw; i++) {
          const k = i + j * gw;
          let x = i - u[k] * dt;
          let y = j - v[k] * dt;
          x = Math.max(0, Math.min(gw - 1.001, x));
          y = Math.max(0, Math.min(gh - 1.001, y));
          const i0 = x | 0;
          const j0 = y | 0;
          const i1 = i0 + 1 < gw ? i0 + 1 : i0;
          const j1 = j0 + 1 < gh ? j0 + 1 : j0;
          const fx = x - i0;
          const fy = y - j0;
          const t0 = src[i0 + j0 * gw] * (1 - fx) + src[i1 + j0 * gw] * fx;
          const t1 = src[i0 + j1 * gw] * (1 - fx) + src[i1 + j1 * gw] * fx;
          dst[k] = t0 * (1 - fy) + t1 * fy;
        }
      }
    }

    function bounds() {
      for (let i = 0; i < gw; i++) {
        u[i] = v[i] = 0;
        u[i + (gh - 1) * gw] = v[i + (gh - 1) * gw] = 0;
      }
      for (let j = 0; j < gh; j++) {
        u[j * gw] = v[j * gw] = 0;
        u[gw - 1 + j * gw] = v[gw - 1 + j * gw] = 0;
      }
    }

    function project() {
      for (let j = 1; j < gh - 1; j++) {
        for (let i = 1; i < gw - 1; i++) {
          const k = i + j * gw;
          div[k] = -0.5 * (u[k + 1] - u[k - 1] + v[k + gw] - v[k - gw]);
          p[k] = 0;
        }
      }
      for (let n = 0; n < JACOBI_ITERS; n++) {
        for (let j = 1; j < gh - 1; j++) {
          for (let i = 1; i < gw - 1; i++) {
            const k = i + j * gw;
            p[k] = (div[k] + p[k - 1] + p[k + 1] + p[k - gw] + p[k + gw]) * 0.25;
          }
        }
      }
      for (let j = 1; j < gh - 1; j++) {
        for (let i = 1; i < gw - 1; i++) {
          const k = i + j * gw;
          u[k] -= 0.5 * (p[k + 1] - p[k - 1]);
          v[k] -= 0.5 * (p[k + gw] - p[k - gw]);
        }
      }
    }

    let T = 0; // sim clock, ms

    function emit(dt: number) {
      for (const e of emitters) {
        const ex = gw * (0.5 + 0.36 * Math.sin(T * e.s1 + e.p1));
        const ey = gh * (0.5 + 0.36 * Math.sin(T * e.s2 + e.p2));
        const dx = Math.cos(T * e.s1 + e.p1);
        const dy = Math.cos(T * e.s2 + e.p2);
        const len = Math.hypot(dx, dy) || 1;
        const pig =
          PIGMENTS[
            (Math.floor(T / 8000) + e.colorOffset) % PIGMENTS.length
          ];
        splat(ex, ey, (dx / len) * 0.2 * dt, (dy / len) * 0.2 * dt, pig, 0.18 * dt, 3);
      }
    }

    function step(dtm: number) {
      const dt = Math.min(dtm, 33) / 16.667;
      T += dtm;
      emit(dt);

      advect(u0, u, dt);
      advect(v0, v, dt);
      u.set(u0);
      v.set(v0);
      bounds();
      project();
      bounds();

      advect(tmp, dr, dt);
      dr.set(tmp);
      advect(tmp, dg, dt);
      dg.set(tmp);
      advect(tmp, db, dt);
      db.set(tmp);

      const dk = Math.pow(0.999, dt);
      const vk = Math.pow(0.992, dt);
      for (let n = 0; n < cells; n++) {
        dr[n] *= dk;
        dg[n] *= dk;
        db[n] *= dk;
        u[n] *= vk;
        v[n] *= vk;
      }
    }

    function render() {
      const d = img.data;
      for (let n = 0, q = 0; n < cells; n++, q += 4) {
        let ar = dr[n];
        let ag = dg[n];
        let ab = db[n];
        // cap depth proportionally so saturated cells keep their hue
        const m = Math.max(ar, ag, ab);
        if (m > MAX_ABSORB) {
          const s = MAX_ABSORB / m;
          ar *= s;
          ag *= s;
          ab *= s;
        }
        d[q] = PAPER[0] - ar * 255;
        d[q + 1] = PAPER[1] - ag * 255;
        d[q + 2] = PAPER[2] - ab * 255;
        d[q + 3] = 255;
      }
      octx.putImageData(img, 0, 0);
      ctx!.imageSmoothingEnabled = true;
      ctx!.imageSmoothingQuality = "high";
      ctx!.drawImage(off, 0, 0, W, H);
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas!.width = Math.max(1, Math.round(W * dpr));
      canvas!.height = Math.max(1, Math.round(H * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // rebuild the grid only when proportions changed meaningfully
      const aspect = W / Math.max(H, 1);
      const wantGh =
        aspect >= 1
          ? Math.max(12, Math.round(BASE_RES / aspect))
          : BASE_RES;
      if (!cells || Math.abs(wantGh - gh) > 5) allocGrid();
      render();
    }

    // ---------- animation ----------
    let rafId = 0;
    let running = false;
    let last = 0;

    function frame(now: number) {
      if (!running) return;
      const dt = Math.min(now - last, 100);
      last = now;
      step(dt);
      render();
      rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      rafId = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    // ---------- pointer: stir the water, trail a little ink ----------
    let px: number | null = null;
    let py = 0;
    let strokeColor = (Math.random() * PIGMENTS.length) | 0;

    function onMove(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      if (inside && px !== null && running) {
        const dxg = ((x - px) / Math.max(W, 1)) * gw;
        const dyg = ((y - py) / Math.max(H, 1)) * gh;
        const m = Math.hypot(dxg, dyg);
        if (m > 0.05) {
          const cap = Math.min(m, 2) / m;
          splat(
            (x / W) * gw,
            (y / H) * gh,
            dxg * cap * 0.7,
            dyg * cap * 0.7,
            PIGMENTS[strokeColor],
            0.08,
            2.2
          );
        }
      }
      px = inside ? x : null;
      py = y;
    }

    function onDown(e: PointerEvent) {
      const target = e.target as Element | null;
      if (target?.closest("a, button, input, textarea, select, [role='button']"))
        return;
      const r = canvas!.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      strokeColor = (strokeColor + 1) % PIGMENTS.length;
      splat((x / W) * gw, (y / H) * gh, 0, 0, PIGMENTS[strokeColor], 0.55, 3.2);
      if (!running) {
        for (let n = 0; n < 20; n++) step(16.7);
        render();
      }
    }

    // ---------- go ----------
    resize();
    // brief warm-up so the water is already alive on first paint
    for (let n = 0; n < (reduced ? 150 : 110); n++) step(16.7);
    render();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? start() : stop()
    );
    io.observe(canvas);

    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />
  );
}
