"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { synthClusters, synthReadout } from "@/lib/content";

/** Number of signal marks in the field. Enough to read as "thousands". */
const N = 900;
/** One full noise → cluster → convergence → dissolve cycle, in ms. */
const LOOP = 11_000;
/** Inset (px) so marks and cluster centres stay off the field edge. */
const PAD = 12;
/** Base opacity of a settled signal mark. */
const MARK_ALPHA = 0.55;

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
function seg(t: number, a: number, b: number): number {
  return clamp01((t - a) / (b - a));
}
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
/** Smooth cubic ease, in and out. */
function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface Field {
  nx: Float32Array; // noise position (0–1)
  ny: Float32Array;
  cx: Float32Array; // cluster position (0–1)
  cy: Float32Array;
  ox: Float32Array; // convergence jitter around centre
  oy: Float32Array;
  ci: Uint8Array; // owning cluster index
}

/** Build the point field once — noise, cluster and convergence targets. */
function buildField(): Field {
  const nx = new Float32Array(N);
  const ny = new Float32Array(N);
  const cx = new Float32Array(N);
  const cy = new Float32Array(N);
  const ox = new Float32Array(N);
  const oy = new Float32Array(N);
  const ci = new Uint8Array(N);

  // Distribute points across clusters, weighted by their signal counts.
  const weights = synthClusters.map((c) => Number(c.count.replace(/,/g, "")));
  const total = weights.reduce((a, b) => a + b, 0);

  let idx = 0;
  for (let c = 0; c < synthClusters.length; c++) {
    const share = c === synthClusters.length - 1 ? N - idx : Math.round((weights[c]! / total) * N);
    const cluster = synthClusters[c]!;
    for (let k = 0; k < share && idx < N; k++, idx++) {
      // Scattered noise — fills the whole field.
      nx[idx] = 0.03 + Math.random() * 0.94;
      ny[idx] = 0.03 + Math.random() * 0.94;
      // Cluster target — a soft disc around the cluster centre.
      const ang = Math.random() * Math.PI * 2;
      const rad = Math.pow(Math.random(), 0.7) * 0.11;
      cx[idx] = clamp01(cluster.x + Math.cos(ang) * rad);
      cy[idx] = clamp01(cluster.y + Math.sin(ang) * rad * 1.15);
      // Convergence jitter — a tight core at the centre.
      ox[idx] = (Math.random() - 0.5) * 0.03;
      oy[idx] = (Math.random() - 0.5) * 0.03;
      ci[idx] = c;
    }
  }
  return { nx, ny, cx, cy, ox, oy, ci };
}

/**
 * FIG. 3.2 — The synthesis engine. Thousands of scattered signals organise
 * themselves: noise resolves into four labelled clusters, then the clusters
 * converge onto a single perception — the blind spot. Not a particle toy; a
 * scientific clustering instrument, rendered dark so you feel you're looking
 * inside the machine. Loops continuously; renders a static clustered frame for
 * reduced-motion. Decorative (aria-hidden).
 */
export function SynthesisEngine() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clusterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const convergeRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState(reduced ? 1 : 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const field = buildField();
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
    const mx = (v: number) => PAD + v * (cssW - PAD * 2);
    const my = (v: number) => PAD + v * (cssH - PAD * 2);

    function setLabelOpacity(clOp: number, cvOp: number) {
      for (const el of clusterRefs.current) if (el) el.style.opacity = String(clOp);
      if (convergeRef.current) convergeRef.current.style.opacity = String(cvOp);
    }

    function draw(f: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, cssW, cssH);

      const cxCenter = mx(0.5);
      const cyCenter = my(0.5);

      // Convergence threads — cluster centres drawn toward the core.
      const threadOp = seg(f, 0.56, 0.64) * (1 - seg(f, 0.86, 0.95));
      if (threadOp > 0.001) {
        ctx.lineWidth = 1;
        for (let c = 0; c < synthClusters.length; c++) {
          const cl = synthClusters[c]!;
          ctx.strokeStyle = cl.signal
            ? `rgba(166,58,43,${0.5 * threadOp})`
            : `rgba(210,205,190,${0.28 * threadOp})`;
          ctx.beginPath();
          ctx.moveTo(mx(cl.x), my(cl.y));
          ctx.lineTo(cxCenter, cyCenter);
          ctx.stroke();
        }
      }

      // The signal marks.
      for (let i = 0; i < N; i++) {
        let x: number;
        let y: number;
        let a: number;
        if (f < 0.08) {
          x = field.nx[i]!;
          y = field.ny[i]!;
          a = MARK_ALPHA;
        } else if (f < 0.4) {
          const t = ease(seg(f, 0.08, 0.4));
          x = lerp(field.nx[i]!, field.cx[i]!, t);
          y = lerp(field.ny[i]!, field.cy[i]!, t);
          a = MARK_ALPHA;
        } else if (f < 0.56) {
          x = field.cx[i]!;
          y = field.cy[i]!;
          a = MARK_ALPHA;
        } else if (f < 0.8) {
          const t = ease(seg(f, 0.56, 0.8));
          x = lerp(field.cx[i]!, 0.5 + field.ox[i]!, t);
          y = lerp(field.cy[i]!, 0.5 + field.oy[i]!, t);
          a = lerp(MARK_ALPHA, 0.06, t);
        } else if (f < 0.9) {
          x = 0.5 + field.ox[i]!;
          y = 0.5 + field.oy[i]!;
          a = 0.06;
        } else {
          const t = ease(seg(f, 0.9, 1));
          x = lerp(0.5 + field.ox[i]!, field.nx[i]!, t);
          y = lerp(0.5 + field.oy[i]!, field.ny[i]!, t);
          a = lerp(0.06, MARK_ALPHA, t);
        }
        const px = mx(x);
        const py = my(y);
        // Signal-cluster marks carry a faint warm tint once clustered.
        if (field.ci[i] === synthClusters.findIndex((c) => c.signal) && f > 0.4 && f < 0.8) {
          ctx.fillStyle = `rgba(196,96,80,${a})`;
        } else {
          ctx.fillStyle = `rgba(232,228,216,${a})`;
        }
        ctx.fillRect(px - 0.75, py - 0.75, 1.5, 1.5);
      }

      // The converged core — the one perception.
      const coreP =
        f < 0.62 ? 0 : f < 0.8 ? ease(seg(f, 0.62, 0.8)) : f < 0.9 ? 1 : 1 - ease(seg(f, 0.9, 0.98));
      if (coreP > 0.001) {
        const r = 2 + coreP * 6;
        ctx.beginPath();
        ctx.arc(cxCenter, cyCenter, r * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(166,58,43,${0.16 * coreP})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cxCenter, cyCenter, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(166,58,43,${0.95 * coreP})`;
        ctx.fill();
      }

      // Annotation opacities + phase readout.
      const clOp = seg(f, 0.12, 0.22) * (1 - seg(f, 0.56, 0.64));
      const cvOp = seg(f, 0.66, 0.78) * (1 - seg(f, 0.92, 1));
      setLabelOpacity(clOp, cvOp);

      const nextPhase = f < 0.08 ? 0 : f < 0.56 ? 1 : 2;
      setPhase((p) => (p === nextPhase ? p : nextPhase));
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);

    if (reduced) {
      // A single, informative still: clusters formed, labelled.
      draw(0.46);
      setLabelOpacity(1, 0);
      return () => observer.disconnect();
    }

    let raf = 0;
    let last = 0;
    let clock = 0;
    let visible = false;

    const loop = (now: number) => {
      if (!last) last = now;
      const dt = now - last;
      last = now;
      if (visible) clock += dt;
      draw((clock % LOOP) / LOOP);
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
        // Reset the frame delta so the virtual clock resumes smoothly.
        last = 0;
      },
      { threshold: 0.08 },
    );
    io.observe(wrap);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  const signalIndex = synthClusters.findIndex((c) => c.signal);
  const footText = [synthReadout.noiseLabel, "4 clusters holding", synthReadout.convergeLabel][phase];

  return (
    <figure className="engine-core" aria-hidden="true">
      <div className="ec-head">
        <span className="ec-title">
          <i className="ec-live" />
          Synthesis engine · SS-SYNTH
        </span>
        <span className="ec-phases">
          {synthReadout.phases.map((label, i) => (
            <span key={label} className={i === phase ? "is-on" : undefined}>
              {label}
            </span>
          ))}
        </span>
      </div>

      <div className="ec-field" ref={wrapRef}>
        <canvas ref={canvasRef} className="ec-canvas" />

        {synthClusters.map((cluster, i) => (
          <span
            key={cluster.label}
            ref={(el) => {
              clusterRefs.current[i] = el;
            }}
            className={"ec-cluster" + (cluster.signal ? " is-signal" : "")}
            style={{ left: `${cluster.x * 100}%`, top: `${cluster.y * 100}%` }}
          >
            <b>{cluster.label}</b>
            <i>{cluster.count}</i>
          </span>
        ))}

        <span className="ec-converge" ref={convergeRef}>
          <b>1 perception</b>
          <i>{synthReadout.blindSpot}</i>
        </span>

        <span className="ec-corner tl" />
        <span className="ec-corner tr" />
        <span className="ec-corner bl" />
        <span className="ec-corner br" />
      </div>

      <div className="ec-foot">
        <span className="ec-foot-l">{footText}</span>
        <span className="ec-foot-m">{synthReadout.method}</span>
        <span className="ec-foot-r">conf 91%</span>
      </div>

      {/* signalIndex kept meaningful for the tinting logic above */}
      <span hidden data-signal={signalIndex} />
    </figure>
  );
}
