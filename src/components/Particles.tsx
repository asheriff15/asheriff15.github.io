"use client";

import { useEffect, useRef } from "react";

// Lightweight particle field: drifting points joined by faint lines when close.
// Mostly grey, with a few points in the deck's red.
export default function Particles({ density = 0.00007 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    type P = { x: number; y: number; vx: number; vy: number; red: boolean };
    let pts: P[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(24, Math.round(w * h * density));
      pts = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        red: i % 9 === 0,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.strokeStyle = `rgba(176,176,178,${0.12 * (1 - d / 120)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = p.red ? "rgba(208,0,0,0.9)" : "rgba(176,176,178,0.45)";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.red ? 2 : 1.4, 0, Math.PI * 2); ctx.fill();
      }
    };

    const tick = () => {
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    resize();
    if (reduce) draw(); else tick();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [density]);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 w-full h-full" />;
}
