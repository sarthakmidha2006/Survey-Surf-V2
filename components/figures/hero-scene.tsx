"use client";

import {
  AtSign,
  BadgeCheck,
  MessageSquare,
  MessagesSquare,
  MoreHorizontal,
  NotebookPen,
  Phone,
  Smartphone,
  Star,
  Ticket,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { heroScene } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { HeroSourceIcon } from "@/types";

import { HeroLens } from "./hero-lens";
import { HeroParticles } from "./hero-particles";

/**
 * FIG. A — THE PERCEPTION APPARATUS (the cover exhibit).
 *
 * One executive research visualization, built from layered components — never a
 * screenshot. Thousands of scattered customer opinions (the intake stream, a
 * dense <canvas> field on the left) accelerate and compress into a precision
 * optical lens; on the far side they resolve into one clean converging beam that
 * ends at a single glowing red point — the market's one perception.
 *
 * The copy and source chips are real markup, scattered through the stream. The
 * motion is authored in the canvas + CSS and collapses to a still, finished
 * frame under prefers-reduced-motion.
 */

const { chaos, clarity, stats } = heroScene;

const ICONS: Record<HeroSourceIcon, LucideIcon> = {
  reviews: Star,
  reddit: MessageSquare,
  ticket: Ticket,
  g2: BadgeCheck,
  sales: TrendingUp,
  interview: NotebookPen,
  forum: MessagesSquare,
  social: AtSign,
  appstore: Smartphone,
  calls: Phone,
  more: MoreHorizontal,
};

/* ---- apparatus geometry, in percent of the stage (kept in one place so the
   canvas focal, the lens and the beam all agree) ---- */
const FOCAL = { fx: 0.5, fy: 0.43 }; // lens front glass — where the stream compresses in
const RED = { x: 85, y: 44 }; // the single red verdict point

/* The intake evidence, scattered through the stream — a *mix* of real research
   artefacts (review, reddit excerpt, support ticket, interview fragment) and
   plain source labels, not a wall of identical pills. Positions are % of stage. */
type Evidence =
  | { kind: "label"; icon: HeroSourceIcon; label: string; x: number; y: number; r: number }
  | { kind: "review"; tag: string; meta: string; quote: string; x: number; y: number; r: number }
  | { kind: "reddit"; tag: string; meta: string; quote: string; x: number; y: number; r: number }
  | { kind: "ticket"; tag: string; meta: string; x: number; y: number; r: number }
  | { kind: "doc"; tag: string; x: number; y: number; r: number };

const EVIDENCE: Evidence[] = [
  { kind: "label", icon: "reviews", label: "Reviews", x: 7, y: 22, r: -3 },
  { kind: "doc", tag: "Interview 014", x: 25, y: 19, r: 2 },
  { kind: "review", tag: "G2", meta: "4.2", quote: "“Support is slow to respond.”", x: 19, y: 33, r: 2 },
  { kind: "label", icon: "sales", label: "Sales mentions", x: 35, y: 46, r: -2 },
  { kind: "reddit", tag: "r/SaaS", meta: "▲ 214", quote: "“The alternative is just cheaper.”", x: 3, y: 50, r: 3 },
  { kind: "ticket", tag: "Ticket #4471", meta: "High", x: 13, y: 67, r: 2 },
  { kind: "label", icon: "appstore", label: "App store reviews", x: 31, y: 68, r: -2 },
];

function Stars({ filled }: { filled: number }) {
  return (
    <span className="hs-source-stars" aria-hidden="true">
      {"★★★★★".split("").map((s, i) => (
        <span key={i} className={i < filled ? undefined : "dim"}>
          {s}
        </span>
      ))}
    </span>
  );
}

function EvidenceCardBody({ item }: { item: Evidence }) {
  if (item.kind === "label") {
    const Icon = ICONS[item.icon];
    return (
      <>
        <span className="hs-source-ico" aria-hidden="true">
          <Icon size={12} strokeWidth={1.75} />
        </span>
        <span className="hs-source-label">{item.label}</span>
      </>
    );
  }
  return (
    <>
      <span className="hs-source-head">
        <span className="hs-source-tag">{item.tag}</span>
        {"meta" in item ? <span className="hs-source-meta">{item.meta}</span> : null}
      </span>
      {item.kind === "review" ? <Stars filled={4} /> : null}
      {item.kind === "review" || item.kind === "reddit" ? (
        <span className="hs-source-quote">{item.quote}</span>
      ) : (
        <span className="hs-source-lines" aria-hidden="true">
          <span style={{ width: "94%" }} />
          <span style={{ width: item.kind === "doc" ? "72%" : "58%" }} />
        </span>
      )}
    </>
  );
}

export function HeroScene() {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduced) {
      setReady(true);
      return;
    }
    let r1 = 0;
    let r2 = 0;
    r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setReady(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [reduced]);

  return (
    <figure
      className={cn("hs", ready && "is-ready", reduced && "is-reduced")}
      aria-label="How Sibero turns millions of scattered opinions into one market perception"
    >
      <figcaption className="hs-caption">
        FIG. A · The perception apparatus — scattered signals resolved into one
        market perception.
      </figcaption>

      <div className="hs-stage">
        {/* the continuous intake stream — one never-ending flow through the lens
            to the red verdict point */}
        <HeroParticles
          focalX={FOCAL.fx}
          focalY={FOCAL.fy}
          redX={RED.x / 100}
          redY={RED.y / 100}
          count={2000}
        />

        <FullApparatus red={RED} />
      </div>
    </figure>
  );
}

/** The built apparatus over the live particle flow — captions, scattered
 *  evidence, the lens + its mount, and the glowing red verdict point. */
function FullApparatus({ red }: { red: { x: number; y: number } }) {
  return (
    <>
      {/* top captions */}
      <div className="hs-label hs-label--chaos">
          <span className="hs-label-title">{chaos.title}</span>
          <span className="hs-label-detail">{chaos.detail}</span>
        </div>
        <div className="hs-label hs-label--clarity">
          <span className="hs-label-title">{clarity.title}</span>
          <span className="hs-label-detail">{clarity.detail}</span>
        </div>

        {/* the intake evidence — a mix of artefacts + labels, scattered */}
        <ul className="hs-sources" aria-label="Signal sources">
          {EVIDENCE.map((item, i) => (
            <li
              className={cn("hs-source", item.kind !== "label" && "hs-source--card")}
              key={i}
              style={
                {
                  "--x": `${item.x}%`,
                  "--y": `${item.y}%`,
                  "--r": `${item.r}deg`,
                  "--i": i,
                } as CSSProperties
              }
            >
              <EvidenceCardBody item={item} />
            </li>
          ))}
        </ul>

        {/* the lens, held by a single minimal laboratory clamp */}
        <span className="hs-lens-shadow" aria-hidden="true" />
        <span className="hs-lens-clamp" aria-hidden="true" />
        <HeroLens />

        {/* the resolved beam is drawn on the canvas (volumetric rays); here we
            add only the crisp red verdict point + a short soft flare */}
        <span
          className="hs-verdict-line"
          aria-hidden="true"
          style={{ "--x": `${red.x}%`, "--y": `${red.y}%` } as CSSProperties}
        />
        <span
          className="hs-verdict"
          aria-hidden="true"
          style={{ "--x": `${red.x}%`, "--y": `${red.y}%` } as CSSProperties}
        >
          <span className="hs-verdict-core" />
          <span className="hs-verdict-ring" />
        </span>

        {/* the running ledger */}
        <aside className="hs-stats" aria-label="Study at a glance">
          {stats.map((s, i) => (
            <div className={cn("hs-stat", !s.value && "hs-stat--note")} key={s.label}>
              <span className="hs-stat-label">{s.label}</span>
              {s.value ? <span className="hs-stat-val">{s.value}</span> : null}
              {i < stats.length - 1 ? <span className="hs-stat-rule" /> : null}
            </div>
          ))}
        </aside>
    </>
  );
}
