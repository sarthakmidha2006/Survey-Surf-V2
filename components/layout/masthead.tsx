"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Slip } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import {
  navigation,
  primaryCta,
  sectionIds,
  siteConfig,
} from "@/lib/constants";

/**
 * The masthead — a publication's nameplate, not a product's navigation.
 *
 * Three posts, symmetrical about the page: the name on the left gutter, the
 * contents centred in the bar, the one call on the right gutter. Everything in
 * the middle is somewhere to read; the only thing here that is pressed is
 * outlined, and it is the only outlined thing in the bar.
 *
 * The bar names destinations, it does not perform them. "Explore the Dossier"
 * carries the reader down to the invitation — the band where the second half is
 * offered — and leaves the turn itself to be taken there, in front of the file.
 * (The bar used to carry that toggle, which meant the file could be opened, and
 * closed again, from the top of a window by a reader who had not yet met it.)
 *
 * When the page carries a dark cover (`[data-dark-hero]`), the bar is printed on
 * the cover's own near-black and reads as the top of the cover rather than a
 * band laid over it; it resolves to the ivory bar once the cover has scrolled
 * away. The effect is gated to pages that actually have a dark hero, so every
 * other surface keeps the unchanged, solid masthead.
 */
export function Masthead() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  // Default to the dark treatment on the home cover to avoid a load flash.
  const [onDark, setOnDark] = useState(pathname === "/");
  // Frost the bar once the page leaves the very top of the cover.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-dark-hero]");
    const header = headerRef.current;
    if (!hero || !header) {
      setOnDark(false);
      return;
    }

    /* WHAT THE BAR IS ASKING IS "IS THERE PAPER UNDER ME YET?", so it measures
       the edge where the paper begins rather than the cover's own box. On an
       ordinary page those are the same edge. They are not during the cover lift:
       there the cover is pinned and carried up out from under the report, so its
       bottom keeps reporting a position the reader can no longer see, and a bar
       keyed to it would still be printing on black over a white page. */
    const paper = document.querySelector<HTMLElement>("[data-paper-edge]");
    const paperTop = () =>
      paper
        ? paper.getBoundingClientRect().top
        : hero.getBoundingClientRect().bottom;

    let frame = 0;
    const update = () => {
      frame = 0;
      setOnDark(paperTop() > header.offsetHeight);
      setScrolled(window.scrollY > 4);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "masthead",
        onDark && "masthead--on-dark",
        scrolled && "masthead--scrolled",
      )}
    >
      <Container className="masthead-in">
        <Link className="wordmark" href={`#${sectionIds.top}`}>
          {siteConfig.wordmark}
        </Link>
        {/* In-page anchors, so the scroll is the browser's own — which means it
            is smooth by the stylesheet's instruction and instant under
            prefers-reduced-motion, without this component knowing either. */}
        <nav className="masthead-links" aria-label="Contents">
          {navigation.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Slip
          size="small"
          tone={onDark ? "ink" : "default"}
          href={primaryCta.href}
        >
          {primaryCta.label}
        </Slip>
      </Container>
    </header>
  );
}
