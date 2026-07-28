import type { NavLink } from "@/types";

/**
 * Global, brand-level constants. Anything that identifies the product or is
 * referenced across many surfaces lives here.
 */
export const siteConfig = {
  name: "Sibero",
  /** The logo, set as one word — no separator, no trailing period. */
  wordmark: "SIBERO",
  tagline: "The perception company.",
  issue: "SB · ISSUE 01",
  description:
    "We gather the signals your customers already leave behind — in reviews, communities, tickets and calls — and reveal the gap between how you think the market sees you and how it actually feels.",
  domain: "www.sibero.in",
  /** Absolute origin, resolved from validated env. */
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "en_US",
  email: "hello@sibero.in",
  twitter: "@sibero",
  copyright: "© 2026 · WWW.SIBERO.IN",
} as const;

/**
 * The masthead's contents — destinations, not a chapter index.
 *
 * The bar used to reprint the front page's own running order (the gap, the
 * blind spot, the engine), which is the one thing a reader scrolling the front
 * page does not need: the chapters announce themselves, in order, as they
 * arrive. What a masthead owes is the three places the page cannot take you to
 * by simply reading on — the file, the method behind it, and a person.
 *
 * "Explore the Dossier" lands on the invitation, the band where the second half
 * is offered, rather than inside the fold — which is very often still closed.
 *
 * The two in-page marks are addressed from the root, not as bare fragments: the
 * bar is in the layout, so it is also the nav on /contact, and a bare `#method`
 * there only rewrites the address of a page that has no method chapter on it.
 * From the front page the router still reads these as a hash change and scrolls
 * rather than navigating.
 */
export const navigation: NavLink[] = [
  { label: "Explore the Dossier", href: "/#invitation" },
  { label: "Method", href: "/#method" },
  { label: "Contact", href: "/contact" },
];

/**
 * The one conversion. Set in the masthead, in the cover and at the foot of the
 * blind-spot chapter — the same seven words in all three places, so the reader
 * meets one call repeated rather than three calls competing.
 */
export const primaryCta: NavLink = {
  label: "See your blind spot",
  href: "/contact",
};

/** The colophon's contents index — the closing page's quiet sitemap. */
export const footerNav: NavLink[] = [
  { label: "The Gap", href: "#gap" },
  { label: "Blind Spot", href: "#blindspot" },
  { label: "The Engine", href: "#method" },
  { label: "Case Studies", href: "#dossier" },
  { label: "Pricing", href: "/contact" },
  { label: "Resources", href: "#sources" },
  { label: "Contact", href: "/contact" },
];

/** The colophon's direct lines — email and one social, no icons. */
export const footerContact: NavLink[] = [
  { label: "hello@sibero.in", href: "mailto:hello@sibero.in" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/sibero" },
];

/** Section anchors — single source of truth for in-page navigation. */
export const sectionIds = {
  top: "top",
  gap: "gap",
  blindspot: "blindspot",
  method: "method",
  /** The transition band that carries the fold's toggle — and its way back. */
  invitation: "invitation",
  /** The fold: everything from the multiplier on, opened on request. */
  continued: "continued",
  multiplier: "multiplier",
  sources: "sources",
  dossier: "dossier",
  philosophy: "philosophy",
} as const;

/**
 * The turn of the page — the one switch that opens and closes the issue's
 * second half. It lives on the invitation band, and nowhere else: the masthead
 * points a reader *to* the turn but never takes it for them, because opening
 * the file is the reader's decision and it should be made in front of the
 * file, not from the top of the window.
 *
 * It is a toggle, so it carries both halves of its own label: the control says
 * what it will do next, never what the page is currently doing. Both bands that
 * print it — the invitation at the head of the file and the closing line at its
 * foot — read from these two strings, so they can never drift apart.
 */
export const dossierCta = {
  /* The same words the masthead points down with, so the bar and the band the
     reader lands on read as one invitation rather than two offers. */
  open: "Explore the Dossier",
  close: "Close the Dossier",
} as const;
