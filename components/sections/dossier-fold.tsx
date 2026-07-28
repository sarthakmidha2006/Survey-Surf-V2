"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { useDossierGate } from "@/components/dossier-gate";
import { sectionIds } from "@/lib/constants";

/**
 * How long the fold takes, in either direction. One number for two motions: the
 * CSS animates height and opacity over it (handed down as `--fold-dur`) and the
 * scroll glides run on the same clock, so opening and filing away each read as
 * a single gesture rather than as an animation plus a jump.
 */
const FOLD_MS = 560;

/**
 * The way back is the same gesture, but a long way back needs more room: the
 * glide takes the fold's clock as its floor and stretches with the distance to a
 * hard ceiling, so a reader on the last page is carried back rather than flung.
 */
function glideDuration(distance: number) {
  return Math.min(900, Math.max(FOLD_MS, distance / 4.5));
}

/** Anchors that live inside the fold — a link landing on one must open it. */
const FOLD_ANCHORS: string[] = [
  sectionIds.continued,
  sectionIds.multiplier,
  sectionIds.sources,
  sectionIds.dossier,
  sectionIds.philosophy,
];

/** The reader taking the page over — the one thing that outranks any scroll of
 *  ours, in either the glide or the arrival below. */
const INPUT = ["wheel", "touchstart", "keydown"] as const;

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The masthead is sticky and opaque: anything landing at the top of the window
 *  has to start below its line or it simply disappears behind it. */
const barHeight = () =>
  document.querySelector<HTMLElement>(".masthead")?.offsetHeight ?? 0;

/** Pin the height the fold currently occupies, so it has somewhere to animate
 *  from — and so the phase change that follows can never flash it open. */
const pinHeight = (fold: HTMLElement) => {
  fold.style.height = `${fold.getBoundingClientRect().height}px`;
};

/**
 * closed  · filed away, clipped to nothing
 * opening · unfolding — the measured height is animating up
 * open     · simply page: no clip, no measured height
 * leaving  · still open, carrying the reader back to the transition band
 * closing  · folding shut in place — the measured height is animating down
 */
type Phase = "closed" | "opening" | "open" | "leaving" | "closing";

/**
 * The fold — the issue's second half, bound in and opened on request.
 *
 * Nothing here is a copy and nothing is unmounted: the multiplier, the listening
 * chapter, the dossier and the closing stance are the same components in the
 * same order they always were, with every figure, tab and reveal intact. The
 * fold clips them to nothing until the reader asks for them, and clips them
 * away again when the reader is done — the state of the file, never a rebuild of
 * it.
 *
 * WHY IT READS AS A DOCUMENT RATHER THAN AN ACCORDION
 *
 *  1 · Height and opacity move together, on a symmetric ease, so the second
 *      half unfolds and refolds instead of appearing and vanishing.
 *  2 · Nothing above the fold ever moves — it grows and shrinks downward — so
 *      the reader's place in the page is preserved by construction.
 *  3 · Opening, the glide to the first page runs *alongside* the unfold: the
 *      fold's top edge never moves, so the target is fixed from the first frame
 *      and only the document's height has to catch up, which is why the glide
 *      re-clamps to whatever scroll the page allows each frame.
 *  4 · Closing is the reverse order, and deliberately sequential: a reader deep
 *      inside the file is carried back to the transition band FIRST, and only
 *      then does the fold shut. Nobody is left halfway down a collapsing page.
 *  5 · The resting place is chosen to survive the collapse (`restingScroll`), so
 *      the fold shuts with the page perfectly still rather than being yanked up
 *      by a document that has run out of length underneath it.
 *
 * The collapse is gated behind `.js` in CSS, so without JavaScript the issue is
 * simply one continuous read.
 */
export function DossierFold({ children }: { children: ReactNode }) {
  const { open, openNow } = useDossierGate();
  const foldRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("closed");
  // The state the fold currently reflects, so the effect below reacts to
  // CHANGES of the gate and does nothing on mount.
  const shown = useRef(open);
  // Bumped by every gesture: an async sequence that has been superseded by the
  // next press checks this and stands down.
  const gesture = useRef(0);
  // An arrival waiting on the fold to take up its space: what to land on, and
  // whether the page underneath it is still settling.
  const jump = useRef<{ id: string; hold: boolean } | null>(null);
  // Only inert once we know JavaScript is running: without it the fold is never
  // collapsed, so the second half has to stay reachable.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  /**
   * Carry the window to `top`. Returns a promise that settles when the glide
   * does — or the moment the reader takes the page over, because a page being
   * scrolled by hand is no longer ours to move.
   */
  const glideTo = useCallback((top: number, token: number) => {
    return new Promise<void>((done) => {
      const from = window.scrollY;
      const span = Math.abs(top - from);
      if (span < 2 || reducedMotion()) {
        window.scrollTo({ top, behavior: "instant" });
        done();
        return;
      }

      const duration = glideDuration(span);
      const started = performance.now();
      let stopped = false;
      const takeOver = () => {
        stopped = true;
      };
      window.addEventListener("wheel", takeOver, { passive: true });
      window.addEventListener("touchstart", takeOver, { passive: true });
      const release = () => {
        window.removeEventListener("wheel", takeOver);
        window.removeEventListener("touchstart", takeOver);
        done();
      };

      const step = (now: number) => {
        if (stopped || gesture.current !== token) return release();
        const t = Math.min(1, (now - started) / duration);
        // Symmetric ease — out of rest and back into rest, like the fold.
        const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
        // Opening, the document is still growing underneath the glide, so the
        // target may not be reachable yet; re-clamp every frame.
        const limit =
          document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({
          top: Math.max(0, Math.min(from + (top - from) * eased, limit)),
          behavior: "instant",
        });
        if (t < 1) requestAnimationFrame(step);
        else release();
      };

      requestAnimationFrame(step);
    });
  }, []);

  /**
   * Where the page should come to rest before the fold shuts: the transition
   * band, or as close to it as a document without the fold in it can still
   * scroll. Taking the shorter of the two is what keeps the collapse still —
   * scroll to the band itself and the browser has to claw the page back up as
   * the length disappears underneath it.
   */
  const restingScroll = useCallback((fold: HTMLElement) => {
    const band = document.getElementById(sectionIds.invitation);
    const bandTop = band
      ? band.getBoundingClientRect().top + window.scrollY - barHeight()
      : 0;
    const afterCollapse =
      document.documentElement.scrollHeight -
      fold.getBoundingClientRect().height -
      window.innerHeight;
    return Math.max(0, Math.min(bandTop, afterCollapse));
  }, []);

  // ── The gesture: react to the gate, in whichever direction it moved ────────
  useEffect(() => {
    if (shown.current === open) return;
    shown.current = open;
    const fold = foldRef.current;
    if (!fold) return;
    const token = ++gesture.current;

    if (open) {
      if (reducedMotion()) {
        // No unfold to travel alongside, so the arrival is a jump. The page is
        // already settled — this is a press, not a load — so it needs no holding.
        jump.current = { id: sectionIds.continued, hold: false };
        setPhase("open");
        return;
      }
      pinHeight(fold);
      setPhase("opening");
      return;
    }

    // Filing away: back to the band first, then shut. Both steps check the
    // token, so a reader who changes their mind mid-return is obeyed.
    const close = async () => {
      const rest = restingScroll(fold);
      if (window.scrollY > rest + 2) {
        setPhase("leaving");
        await glideTo(rest, token);
        if (gesture.current !== token) return;
      }
      if (reducedMotion()) {
        setPhase("closed");
        fold.style.height = "0px";
        return;
      }
      pinHeight(fold);
      setPhase("closing");
    };
    void close();
  }, [open, glideTo, restingScroll]);

  // ── The unfold: measure, animate, then hand the height back to the layout ──
  useEffect(() => {
    if (phase !== "opening") return;
    const fold = foldRef.current;
    if (!fold) return;
    const token = gesture.current;

    // Clipped, so the content's own height is the fold's scroll height.
    const target = fold.scrollHeight;
    const frame = requestAnimationFrame(() => {
      fold.style.height = `${target}px`;
    });

    const settle = () => {
      if (gesture.current !== token) return;
      // From here the second half is simply page: no clip, no fixed height, so
      // it reflows with the window like every other chapter.
      fold.style.height = "";
      setPhase("open");
    };
    const onEnd = (event: TransitionEvent) => {
      if (event.target === fold && event.propertyName === "height") settle();
    };
    fold.addEventListener("transitionend", onEnd);
    // Belt and braces: a transition that never fires must not trap the fold.
    const guard = window.setTimeout(settle, FOLD_MS + 240);

    // The glide into the first page runs with the unfold, not after it.
    const foldTop = fold.getBoundingClientRect().top + window.scrollY;
    void glideTo(foldTop - barHeight(), token);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(guard);
      fold.removeEventListener("transitionend", onEnd);
    };
  }, [phase, glideTo]);

  // ── Arrivals that are not animated: the reduced-motion press, and a deep
  //    link that lands inside the file.
  //
  //    Both have to WAIT for the fold to take up its space, which is the whole
  //    reason they are a separate effect rather than a line in the handlers that
  //    ask for them. Scroll in the same tick as the state change and the jump is
  //    clamped to a document still only as long as the front page — every anchor
  //    lands on the same wrong line, a few thousand pixels short of the file it
  //    just opened. Keyed on the phase, this runs after the commit that gave the
  //    fold its height.
  useEffect(() => {
    const arrival = jump.current;
    if (!arrival || phase !== "open") return;
    jump.current = null;

    const target = document.getElementById(arrival.id);
    if (!target) return;
    // Each target names its own clearance under the masthead, so nothing here
    // has to know how tall the bar is.
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;

    const land = () => {
      const aim = target.getBoundingClientRect().top + window.scrollY - margin;
      if (Math.abs(aim - window.scrollY) > 1) {
        window.scrollTo({ top: aim, behavior: "instant" });
      }
    };
    land();
    // A press on a page that has been sitting there needs nothing more: one
    // jump, and it is where it was asked to be.
    if (!arrival.hold) return;

    // A COLD LOAD IS DIFFERENT — IT IS STILL SETTLING, AND ALREADY SCROLLING.
    //
    // Two things move the page out from under a jump taken that early. The
    // stylesheet asks for smooth scrolling, so the browser's own attempt at the
    // fragment is an ANIMATION still in flight — aimed at where the anchor sat
    // while the file was closed, which is nowhere near where it sits once the
    // file is open. And the load is still reflowing underneath both of us as the
    // fonts arrive and the figures take their measured sizes.
    //
    // So a cold arrival is held rather than fired once: re-taken every frame for
    // as long as a load takes to settle, which quietly outlives the browser's
    // animation instead of racing it. The one thing that ends it early is the
    // reader — any real input hands the page straight back, because a page being
    // scrolled by hand is no longer ours to place.
    const deadline = performance.now() + 800;
    let released = false;
    const release = () => {
      released = true;
      for (const event of INPUT) window.removeEventListener(event, release);
    };
    for (const event of INPUT) {
      window.addEventListener(event, release, { passive: true });
    }
    const hold = () => {
      if (released) return;
      if (performance.now() > deadline) return release();
      land();
      requestAnimationFrame(hold);
    };
    requestAnimationFrame(hold);

    return release;
  }, [phase]);

  // ── The refold: shut from the pinned height, in place ─────────────────────
  useEffect(() => {
    if (phase !== "closing") return;
    const fold = foldRef.current;
    if (!fold) return;
    const token = gesture.current;

    const frame = requestAnimationFrame(() => {
      fold.style.height = "0px";
    });

    const settle = () => {
      if (gesture.current !== token) return;
      // The inline zero is left in place: it agrees with the closed state, and
      // clearing it before the phase lands would flash the file back open.
      setPhase("closed");
    };
    const onEnd = (event: TransitionEvent) => {
      if (event.target === fold && event.propertyName === "height") settle();
    };
    fold.addEventListener("transitionend", onEnd);
    const guard = window.setTimeout(settle, FOLD_MS + 240);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(guard);
      fold.removeEventListener("transitionend", onEnd);
    };
  }, [phase]);

  // A link that lands inside the second half — a shared URL, or a chapter
  // anchor — must arrive with the file open and on the page it asked for. The
  // browser gave up on that anchor before the fold had any height, so the jump
  // is handed to the arrival effect above, which takes it once it can land.
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash || !FOLD_ANCHORS.includes(hash)) return;
    shown.current = true;
    jump.current = { id: hash, hold: true };
    openNow();
    setPhase("open");
  }, [openNow]);

  const collapsed = hydrated && phase === "closed";

  return (
    <div
      ref={foldRef}
      id={sectionIds.continued}
      className="dossier-fold"
      data-phase={phase}
      style={{ "--fold-dur": `${FOLD_MS}ms` } as CSSProperties}
      inert={collapsed}
      aria-hidden={collapsed || undefined}
    >
      {children}
    </div>
  );
}
