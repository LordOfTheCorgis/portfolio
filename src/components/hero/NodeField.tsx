"use client";

import { useEffect, useRef } from "react";

type Node = {
  col: number;
  row: number;
  color: [number, number, number];
  born: number;
  life: number;
};

const GAP = 30;
const DOT = 2;
const RGB = {
  fg: [235, 219, 178] as [number, number, number],
  green: [184, 187, 38] as [number, number, number],
  amber: [250, 189, 47] as [number, number, number],
  aqua: [142, 192, 124] as [number, number, number],
  orange: [254, 128, 25] as [number, number, number],
  red: [251, 73, 52] as [number, number, number],
  blue: [131, 165, 152] as [number, number, number],
};

function pick(): [number, number, number] {
  const r = Math.random();
  if (r < 0.5) return RGB.green;
  if (r < 0.72) return RGB.amber;
  if (r < 0.84) return RGB.aqua;
  if (r < 0.92) return RGB.blue;
  if (r < 0.97) return RGB.orange;
  return RGB.red;
}

export default function NodeField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0,
      h = 0,
      cols = 0,
      rows = 0,
      dpr = 1;
    const nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let running = true;
    let lastSpawn = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / GAP);
      rows = Math.ceil(h / GAP);
    };

    const spawn = (now: number) => {
      nodes.push({
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * rows),
        color: pick(),
        born: now,
        life: 1800 + Math.random() * 3200,
      });
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = `rgba(${RGB.fg.join(",")},0.055)`;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.fillRect(c * GAP + GAP / 2 - DOT / 2, r * GAP + GAP / 2 - DOT / 2, DOT, DOT);
        }
      }

      if (mouse.x > -1) {
        const R = 150;
        const c0 = Math.max(0, Math.floor((mouse.x - R) / GAP));
        const c1 = Math.min(cols - 1, Math.ceil((mouse.x + R) / GAP));
        const r0 = Math.max(0, Math.floor((mouse.y - R) / GAP));
        const r1 = Math.min(rows - 1, Math.ceil((mouse.y + R) / GAP));
        for (let r = r0; r <= r1; r++) {
          for (let c = c0; c <= c1; c++) {
            const x = c * GAP + GAP / 2;
            const y = r * GAP + GAP / 2;
            const d = Math.hypot(x - mouse.x, y - mouse.y);
            if (d > R) continue;
            const a = (1 - d / R) ** 2 * 0.55;
            ctx.fillStyle = `rgba(${RGB.amber.join(",")},${a})`;
            ctx.fillRect(x - DOT / 2 - 0.5, y - DOT / 2 - 0.5, DOT + 1, DOT + 1);
          }
        }
      }

      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        const t = (now - n.born) / n.life;
        if (t >= 1) {
          nodes.splice(i, 1);
          continue;
        }
        const env = t < 0.15 ? t / 0.15 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
        const x = n.col * GAP + GAP / 2;
        const y = n.row * GAP + GAP / 2;
        ctx.fillStyle = `rgba(${n.color.join(",")},${0.12 * env})`;
        ctx.fillRect(x - 5, y - 5, 10, 10);
        ctx.fillStyle = `rgba(${n.color.join(",")},${0.9 * env})`;
        ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
      }
    };

    const loop = (now: number) => {
      if (!running) return;
      if (now - lastSpawn > 90 && nodes.length < cols * rows * 0.06) {
        spawn(now);
        lastSpawn = now;
      }
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (reduce) {

      for (let i = 0; i < 24; i++) spawn(-1000);
      nodes.forEach((n) => (n.life = 1e9));
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onMove = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      mouse.x = e.clientX - b.left;
      mouse.y = e.clientY - b.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const parent = canvas.parentElement ?? canvas;
    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(([e]) => {
      if (reduce) return;
      const visible = e.isIntersecting;
      if (visible && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!visible && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });
    ro.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
    />
  );
}
