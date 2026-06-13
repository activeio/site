"use client";

import { useEffect, useRef } from "react";

/**
 * Suminagashi (Japanese ink marbling) canvas background.
 * New ink drops push existing rings outward (classic sqrt(d^2 + r^2)
 * marbling displacement); a slow rotating "breeze" keeps the pattern
 * drifting. Pointer movement stirs the ink, clicks drop fresh rings.
 */

const PAPER = "#faf9f5"; // matches --color-background
const INKS = [
  "#c3d3e4", // mist blue
  "#e3cfd5", // dusty rose
  "#ccd9c2", // sage
  "#d5cee4", // lavender gray
  "#e8d9bd", // warm sand
  "#c2d9d4", // celadon
];

const MAX_DROPS = 90; // polygons kept alive before the oldest fades out
const CIRCLE_VERTS = 80; // vertices of a fresh drop
const MAX_VERTS = 600; // cap after adaptive subdivision
const MAX_SEG = 7; // px: split polygon edges longer than this
const GROW_MS = 460; // how long a fresh drop blooms open from a speck to full size
const GROW_START = 0.6; // px: radius of a drop on its first frame
const MAX_GROWING = 12; // cap concurrent blooms so a click-storm degrades gracefully

type Pt = { x: number; y: number };
type Drop = {
  pts: Pt[];
  color: string;
  alpha: number;
  fading: boolean;
  // While a drop blooms open these track its growth; cleared once full size.
  growing?: boolean;
  gCx?: number;
  gCy?: number;
  gTarget?: number;
  gAge?: number;
  gPrevR?: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[(Math.random() * arr.length) | 0];
// Ease-out so the ink spreads fast then settles, the way a real drop blooms.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function Suminagashi() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let W = 0;
    let H = 0;
    const drops: Drop[] = [];

    // ---------- geometry ----------
    function makeCircle(cx: number, cy: number, r: number): Pt[] {
      const pts: Pt[] = new Array(CIRCLE_VERTS);
      for (let i = 0; i < CIRCLE_VERTS; i++) {
        const a = (i / CIRCLE_VERTS) * Math.PI * 2;
        pts[i] = { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
      }
      return pts;
    }

    // A new drop of radius r at (cx, cy) pushes every existing point
    // from distance d to sqrt(d^2 + r^2). skipGrowing leaves other
    // still-blooming drops untouched so concurrent drops grow independently.
    function deformByDrop(
      cx: number,
      cy: number,
      r: number,
      skipGrowing = false,
      exceptDrop: Drop | null = null
    ) {
      const r2 = r * r;
      for (const d of drops) {
        if (skipGrowing && d.growing && d !== exceptDrop) continue;
        for (const p of d.pts) {
          const dx = p.x - cx;
          const dy = p.y - cy;
          const d2 = Math.max(dx * dx + dy * dy, 1e-9);
          const s = Math.sqrt(1 + r2 / d2);
          p.x = cx + dx * s;
          p.y = cy + dy * s;
        }
      }
    }

    // Stylus line: points are dragged parallel to the stroke, strength
    // falling off with distance from the line.
    function tine(
      ax: number,
      ay: number,
      dirx: number,
      diry: number,
      z: number,
      lambda: number
    ) {
      const len = Math.hypot(dirx, diry) || 1;
      const mx = dirx / len;
      const my = diry / len;
      const nx = -my;
      const ny = mx;
      for (const d of drops) {
        for (const p of d.pts) {
          const dist = Math.abs((p.x - ax) * nx + (p.y - ay) * ny);
          const f = (z * lambda) / (dist + lambda);
          p.x += mx * f;
          p.y += my * f;
        }
      }
    }

    // Insert midpoints on edges that deformation has stretched too far.
    function resample(drop: Drop) {
      const pts = drop.pts;
      if (pts.length >= MAX_VERTS) return;
      const maxSeg2 = MAX_SEG * MAX_SEG;
      let needed = false;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % pts.length];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        if (dx * dx + dy * dy > maxSeg2) {
          needed = true;
          break;
        }
      }
      if (!needed) return;
      const out: Pt[] = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % pts.length];
        out.push(a);
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        if (dx * dx + dy * dy > maxSeg2 && out.length < MAX_VERTS) {
          out.push({ x: a.x + dx / 2, y: a.y + dy / 2 });
        }
      }
      drop.pts = out;
    }

    function resampleAll() {
      for (const d of drops) resample(d);
    }

    function capDrops() {
      let extra = drops.length - MAX_DROPS;
      for (let i = 0; extra > 0 && i < drops.length; i++) {
        if (!drops[i].fading && !drops[i].growing) {
          drops[i].fading = true;
          extra--;
        }
      }
    }

    // Instant placement: deform the field once and drop a full-size ring.
    // Used for the seeded composition and the reduced-motion static render.
    function placeDrop(x: number, y: number, r: number, color: string) {
      deformByDrop(x, y, r, true); // skip in-flight blooms so they stay independent
      resampleAll();
      drops.push({ pts: makeCircle(x, y, r), color, alpha: 1, fading: false });
      capDrops();
    }

    // Bloom placement: the drop starts as a speck and opens up over GROW_MS,
    // pushing the settled ink outward a little each frame. Because marbling
    // displacements add in quadrature (sqrt(d^2 + r^2)), spreading one r-drop
    // across many small steps lands on the exact same field an instant drop
    // would — it just reads as ink blooming instead of a ring popping in.
    function spawnDrop(x: number, y: number, r: number, color: string) {
      drops.push({
        pts: makeCircle(x, y, GROW_START),
        color,
        alpha: 1,
        fading: false,
        growing: true,
        gCx: x,
        gCy: y,
        gTarget: r,
        gAge: 0,
        gPrevR: 0,
      });
      capDrops();
    }

    function growingCount() {
      let n = 0;
      for (const d of drops) if (d.growing) n++;
      return n;
    }

    function addDrop(x: number, y: number, r: number, color: string) {
      // Bloom while the loop is live, but cap concurrent blooms so a burst of
      // clicks (3 rings each) can't pile up full-field deform passes per frame;
      // extras drop in instantly, which reads fine amid a click storm.
      if (running && growingCount() < MAX_GROWING) spawnDrop(x, y, r, color);
      else placeDrop(x, y, r, color);
    }

    // Advance every blooming drop one frame. A single deform pass grows the
    // drop's OWN ring (it is the exception to skipGrowing) and pushes the
    // settled field by just this frame's increment; other still-growing drops
    // are left alone so concurrent blooms stay independent. Displacing the
    // drop's existing points (rather than redrawing a circle) lets it keep any
    // breeze/stir it picks up mid-bloom, so there's no jump when it settles.
    function growDrops(dt: number) {
      const gdt = Math.min(dt, 40); // a refocus dt spike shouldn't over-bloom in one step
      for (const d of drops) {
        if (!d.growing) continue;
        d.gAge = (d.gAge ?? 0) + gdt;
        const f = easeOut(Math.min(d.gAge / GROW_MS, 1));
        const rEff = (d.gTarget ?? 0) * f;
        const prev = d.gPrevR ?? 0;
        const dr = Math.sqrt(Math.max(rEff * rEff - prev * prev, 0));
        if (dr > 0.001) deformByDrop(d.gCx!, d.gCy!, dr, true, d);
        d.gPrevR = rEff;
        if (f >= 1) d.growing = false;
      }
    }

    // ---------- auto inking: wandering clusters of alternating rings ----------
    const cluster = {
      x: 0,
      y: 0,
      ink: INKS[0],
      second: PAPER,
      left: 0,
      parity: 0,
    };

    function newCluster() {
      cluster.x = rand(W * 0.12, W * 0.88);
      cluster.y = rand(H * 0.12, H * 0.88);
      cluster.ink = pick(INKS);
      cluster.second = Math.random() < 0.3 ? pick(INKS) : PAPER;
      cluster.left = (6 + Math.random() * 8) | 0;
      cluster.parity = 0;
    }

    function clusterDrop() {
      if (W < 10 || H < 10) return;
      if (cluster.left <= 0) newCluster();
      cluster.left--;
      cluster.x = Math.min(Math.max(cluster.x + rand(-14, 14), W * 0.08), W * 0.92);
      cluster.y = Math.min(Math.max(cluster.y + rand(-14, 14), H * 0.08), H * 0.92);
      const color = cluster.parity++ % 2 === 0 ? cluster.ink : cluster.second;
      addDrop(cluster.x + rand(-5, 5), cluster.y + rand(-5, 5), rand(16, 46), color);
    }

    function seed(clusters: number, dropsEach: number) {
      for (let c = 0; c < clusters; c++) {
        newCluster();
        for (let i = 0; i < dropsEach; i++) clusterDrop();
      }
      newCluster();
    }

    // ---------- rendering ----------
    function draw() {
      ctx!.globalAlpha = 1;
      ctx!.fillStyle = PAPER;
      ctx!.fillRect(0, 0, W, H);
      for (const d of drops) {
        const pts = d.pts;
        ctx!.globalAlpha = d.alpha;
        ctx!.fillStyle = d.color;
        ctx!.beginPath();
        ctx!.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx!.lineTo(pts[i].x, pts[i].y);
        ctx!.closePath();
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas!.width = Math.max(1, Math.round(W * dpr));
      canvas!.height = Math.max(1, Math.round(H * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    // ---------- animation ----------
    let t = 0;
    let dropTimer = 0;

    // Slow rotating breeze; a full turn (~60 s) cancels net drift.
    function ambient(dt: number) {
      t += dt;
      const ang = t * 0.000105;
      const ax = W / 2 + Math.cos(t * 0.00007) * W * 0.25;
      const ay = H / 2 + Math.sin(t * 0.00009) * H * 0.25;
      tine(ax, ay, Math.cos(ang), Math.sin(ang), 0.0032 * dt, 160);
    }

    function tick(dt: number) {
      ambient(dt);
      growDrops(dt); // bloom open any drops added since last frame

      dropTimer -= dt;
      if (dropTimer <= 0) {
        dropTimer = rand(900, 1700);
        clusterDrop();
      }

      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        if (d.fading) {
          d.alpha -= dt * 0.00035;
          if (d.alpha <= 0) drops.splice(i, 1);
        }
      }

      resampleAll();
    }

    let rafId = 0;
    let running = false;
    let last = 0;

    function frame(now: number) {
      if (!running) return;
      const dt = Math.min(now - last, 100);
      last = now;
      tick(dt);
      draw();
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

    // ---------- pointer interaction (scoped to the canvas area) ----------
    let px: number | null = null;
    let py = 0;

    function onMove(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      if (inside && px !== null && (running || reduced)) {
        const dx = x - px;
        const dy = y - py;
        const speed = Math.hypot(dx, dy);
        if (speed > 2) {
          const z = Math.min(speed * 0.08, 2.2) * (e.buttons ? 2.5 : 1);
          tine(x, y, dx, dy, z, e.buttons ? 90 : 50);
          if (!running) {
            resampleAll(); // reduced motion: redraw the static frame after a stir
            draw();
          }
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
      addDrop(x, y, rand(24, 42), pick(INKS));
      addDrop(x, y, rand(14, 26), PAPER);
      addDrop(x, y, rand(10, 20), pick(INKS));
      if (!running) draw();
    }

    // ---------- go ----------
    resize();
    seed(reduced ? 5 : 3, reduced ? 10 : 8);
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? start() : stop()
    );
    io.observe(canvas);

    // Interaction stays on even under reduced motion: clicks place instant
    // (non-animated) drops and pointer moves stir the otherwise-static pattern.
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

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
