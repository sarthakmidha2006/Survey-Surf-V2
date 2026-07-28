"use client";

import { useEffect, useState } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useReveal } from "@/hooks/use-reveal";

/** Locale-independent thousands separator (keeps SSR/CSR output identical). */
function group(n: string): string {
  return n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Split a stat string into an animatable number and its fixed affixes.
 *  "2M+" → {prefix:"", num:2, suffix:"M+"}, "2,341" → {num:2341, sep:true},
 *  "94%" → {num:94, suffix:"%"}. Non-numeric ("Enterprise") → num:null. */
function parseStat(value: string) {
  const m = value.match(/^(\D*?)([\d.,]+)(.*)$/s);
  if (!m) return { prefix: "", num: null as number | null, suffix: "", decimals: 0, sep: false };
  const [, prefix = "", core = "", suffix = ""] = m;
  const sep = core.includes(",");
  const bare = core.replace(/,/g, "");
  const dot = bare.indexOf(".");
  const decimals = dot === -1 ? 0 : bare.length - dot - 1;
  const num = Number(bare);
  return { prefix, num: Number.isFinite(num) ? num : null, suffix, decimals, sep };
}

/**
 * A statistic that counts up smoothly when it scrolls into view. Wraps a stat
 * STRING (e.g. "2M+", "94%", "2,341") so copy stays untouched — the leading
 * number animates 0 → target while prefixes/suffixes stay put. SSR and the
 * no-JS / reduced-motion paths render the final value verbatim.
 */
export function CountUp({
  value,
  duration = 1500,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const { prefix, num, suffix, decimals, sep } = parseStat(value);
  const reduced = useReducedMotion();
  const { ref, inView } = useReveal<HTMLSpanElement>({
    rootMargin: "0px 0px -8% 0px",
  });
  // SSR + no-JS + reduced-motion all render the final number.
  const [n, setN] = useState<number | null>(num);

  useEffect(() => {
    if (num === null) return;
    if (reduced || !inView) {
      setN(num);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic — settles, no bounce
      setN(num * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, inView, num, duration]);

  // Non-numeric stat: render as given, still tagged for consistent styling.
  if (num === null) {
    return <span className={className}>{value}</span>;
  }

  const fixed = (n ?? num).toFixed(decimals);
  const shown = sep ? group(fixed) : fixed;
  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
