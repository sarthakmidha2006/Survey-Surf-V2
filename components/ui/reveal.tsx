"use client";

import { createElement, type ElementType, type HTMLAttributes } from "react";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

interface RevealProps extends HTMLAttributes<HTMLElement> {
  /** Element to render — keeps the reveal on the real node, no extra wrapper. */
  as?: ElementType;
  once?: boolean;
  /**
   * A CHAPTER-SCALE entrance: the mark that opens a new chapter of the issue,
   * or the seam that bridges two. It waits until it is properly inside the
   * window and then takes a full second to settle (`.reveal--chapter`), so a
   * chapter enters the page rather than switching on at the fold. Ordinary
   * matter inside a chapter uses the base entrance and should not pass this.
   */
  chapter?: boolean;
}

/**
 * How far into the window a chapter-scale entrance waits before it begins:
 * roughly a fifth of the viewport, against ~6% for ordinary matter. The chapter
 * break above an opener already puts its heading low in the window on arrival —
 * this is what holds the settle back until the reader is actually there.
 */
const CHAPTER_ENTRY = "0px 0px -19% 0px";

/**
 * Fades/slides content in as it scrolls into view. The animation itself is
 * defined in CSS (gated behind the `.js` class) so content is always visible
 * without JavaScript; this component only toggles the `is-in` state.
 */
export function Reveal({
  as = "div",
  once = true,
  chapter,
  className,
  children,
  ...props
}: RevealProps) {
  const { ref, inView } = useReveal<HTMLElement>({
    once,
    rootMargin: chapter ? CHAPTER_ENTRY : undefined,
  });
  return createElement(
    as,
    {
      ref,
      className: cn(
        "reveal",
        chapter && "reveal--chapter",
        inView && "is-in",
        className,
      ),
      ...props,
    },
    children,
  );
}

/**
 * A sequenced-inking container: its child leader-rows stagger in via the
 * `.ink-seq` CSS rules once the group enters view.
 */
export function InkSequence({
  as = "div",
  className,
  children,
  ...props
}: RevealProps) {
  const { ref, inView } = useReveal<HTMLElement>();
  return createElement(
    as,
    { ref, className: cn("ink-seq", inView && "is-in", className), ...props },
    children,
  );
}
