"use client";

import type { MotionValue } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

import {
  buildField,
  convergeThreadOpacity,
  coreStrength,
  CORE,
  PAD,
  sample,
  type Particle,
} from "@/components/figures/engine/engine-geometry";
import { synthClusters } from "@/lib/content";

/** Ink and red, read from the design tokens so the field never hardcodes brand. */
function readTokens() {
  if (typeof window === "undefined") return { ink: "29,27,22", red: "166,58,43" };
  const s = getComputedStyle(document.documentElement);
  const toTriple = (v: string, fallback: string) => {
    const m = v.trim().match(/#?([0-9a-f]{6})/i);
    if (m) {
      const hex = m[1]!;
      return `${parseInt(hex.slice(0, 2), 16)},${parseInt(hex.slice(2, 4), 16)},${parseInt(hex.slice(4, 6), 16)}`;
    }
    return fallback;
  };
  return {
    ink: toTriple(s.getPropertyValue("--color-ink"), "29,27,22"),
    red: toTriple(s.getPropertyValue("--color-red"), "166,58,43"),
  };
}

/**
 * FIG. 03 — the particle field. Hundreds of scattered opinions rain in, migrate
 * into four themes, collapse onto a single perception, and settle as its core.
 * Rendered to a 2-D canvas because it is the only way to move this many marks at
 * 60 fps; driven deterministically by the scroll `progress` MotionValue and
 * redrawn only when that value changes (idle when the page is still). The
 * instrument, not a toy — decorative for assistive tech (aria-hidden).
 */
export function EngineField({
  progress,
  count = 640,
  children,
}: {
  progress: MotionValue<number>;
  count?: number;
  /** Overlay layers (source rail, clusters, core label, branch) share the
   *  field's measured box, so they sit exactly over the marks. */
  children?: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const field: Particle[] = buildField(count);
    const { ink, red } = readTokens();
    let cssW = 0;
    let cssH = 0;

    function resize() {
      if (!canvas || !ctx || !wrap) return;
      const rect = wrap.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Map a 0–1 field coordinate to a padded pixel coordinate.
    const mx = (v: number) => PAD * cssW + v * (cssW - PAD * cssW * 2);
    const my = (v: number) => PAD * cssH + v * (cssH - PAD * cssH * 2);

    function draw(p: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, cssW, cssH);

      const coreX = mx(CORE.x);
      const coreY = my(CORE.y);

      // Cluster → core "gravity" threads, during convergence.
      const threadOp = convergeThreadOpacity(p);
      if (threadOp > 0.001) {
        ctx.lineWidth = 1;
        for (let c = 0; c < synthClusters.length; c++) {
          const cl = synthClusters[c]!;
          ctx.strokeStyle = cl.signal
            ? `rgba(${red},${0.55 * threadOp})`
            : `rgba(${ink},${0.14 * threadOp})`;
          ctx.beginPath();
          ctx.moveTo(mx(cl.x), my(cl.y));
          ctx.lineTo(coreX, coreY);
          ctx.stroke();
        }
      }

      // The marks.
      for (let i = 0; i < field.length; i++) {
        const P = field[i]!;
        const s = sample(p, P);
        if (s.a <= 0.002) continue;
        const px = mx(s.x);
        const py = my(s.y);
        // The signal cluster carries a warm tint once it has formed.
        const warm = P.signal && p > 0.34 && p < 0.72;
        ctx.fillStyle = warm
          ? `rgba(${red},${s.a})`
          : `rgba(${ink},${s.a})`;
        ctx.fillRect(px - 1, py - 1, 2, 2);
      }

      // The one perception — a solid red node with a soft halo.
      const core = coreStrength(p);
      if (core > 0.001) {
        const r = 3 + core * 5;
        const g = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, r * 6);
        g.addColorStop(0, `rgba(${red},${0.22 * core})`);
        g.addColorStop(1, `rgba(${red},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(coreX, coreY, r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(coreX, coreY, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${red},${0.96 * core})`;
        ctx.fill();

        // A thin ring — the instrument focusing on the reading.
        ctx.beginPath();
        ctx.arc(coreX, coreY, r + 6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${red},${0.4 * core})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      draw(progress.get());
    });
    ro.observe(wrap);

    // Redraw only when scroll progress changes — coalesced to one rAF.
    let raf = 0;
    let pending = false;
    const schedule = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(() => {
        pending = false;
        draw(progress.get());
      });
    };
    const unsub = progress.on("change", schedule);
    draw(progress.get());

    return () => {
      unsub();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [progress, count]);

  return (
    <div className="engine-field" ref={wrapRef}>
      <canvas ref={canvasRef} className="engine-canvas" aria-hidden="true" />
      {children}
      <span className="engine-tick engine-tick--tl" aria-hidden="true" />
      <span className="engine-tick engine-tick--tr" aria-hidden="true" />
      <span className="engine-tick engine-tick--bl" aria-hidden="true" />
      <span className="engine-tick engine-tick--br" aria-hidden="true" />
    </div>
  );
}
