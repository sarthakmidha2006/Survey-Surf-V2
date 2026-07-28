# Migration notes — from static HTML to a production React system

How `theme-02.html` / `theme-02.css` (the canonical "Editorial Ivory" reference,
kept in the repo root) became this codebase. The goal was **reverse‑engineering
a design system**, not translating markup. The visual result is near‑identical;
the implementation is a scalable foundation.

---

## 1. Approach

The reference is a single 994‑line HTML file, a 1,200‑line stylesheet, and a
300‑line vanilla‑JS IIFE. It was decomposed along three axes:

1. **Design tokens** — every colour, type face, size, space, rule and
   breakpoint extracted into a single token layer.
2. **Components** — repeated structures identified and rebuilt as typed,
   reusable React components; content separated from markup.
3. **Behaviour** — the imperative JS (reveals, pen marks, connector thread,
   scroll separation, tabs, Johari files) re‑expressed declaratively in React,
   with graceful degradation and reduced‑motion support.

---

## 2. Design tokens extracted

| Category       | Reference source                          | Token(s)                                                                    |
| -------------- | ----------------------------------------- | --------------------------------------------------------------------------- |
| Surface/ink    | `--paper … --red`                         | `--color-paper/plate/ink/ink-soft/ink-faint/red`                            |
| Hairlines      | `--hair`, `--rule14`                      | `--color-hair`, `--color-rule`                                              |
| Alpha washes   | scattered `rgba()` literals               | derived `--ink-a05…a45`, `--red-a18/a35`, `--paper-a62/a88` via `color-mix` |
| Type — display | Newsreader                                | `--font-display`                                                            |
| Type — text    | Source Serif 4                            | `--font-text`                                                               |
| Type — app     | Libre Franklin                            | `--font-app`                                                                |
| Rhythm         | `--u: 8px`                                | `--spacing-unit` / `--u`                                                    |
| Container      | `--max: 1200px`, margin col, 66ch measure | `--container-editorial`, `--margin-col`, `--measure`                        |
| Breakpoints    | 1120 / 900 / 680                          | `--breakpoint-ss-lg/md/sm`                                                  |

Scattered `rgba()` literals in the reference were replaced with alpha tokens
computed from the base inks, so **no brand colour is hardcoded** — it exists in
exactly one place.

### The three voices

The reference's core idea — "one paper, three voices, the editor's red pen" — is
preserved as three font tokens mapped to `next/font` variables:

- **Newsreader** → headlines & pull quotes (`.h1/.h2/.h3`, `.pullq`)
- **Source Serif 4** → reading copy (`.standfirst`, `.body-copy`)
- **Libre Franklin** → all "apparatus" (kickers, folios, captions, tabs, stats)

---

## 3. Behaviour re‑architected

| Reference (vanilla JS)                                 | React implementation                                                                                                                                  |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IntersectionObserver` toggling `.is-in`               | [`useReveal`](./hooks/use-reveal.ts) + [`<Reveal>`](./components/ui/reveal.tsx) (renders on the real node — no wrapper)                               |
| `.no-js` fallback so content shows without JS          | Inverted to a `.js` gate: content is visible by default; the `.js` class (added pre‑paint) opts into animation                                        |
| `penify()` measuring text and drawing SVG strokes      | [`<PenMark>`](./components/ui/pen-mark.tsx): measures via `ResizeObserver`, draws with Framer Motion `pathLength`                                     |
| `drawConnector()` red thread across FIG. A             | [`ClassifiedPlate`](./components/figures/classified-plate.tsx): measures target centres, builds the path, animates it                                 |
| scroll‑driven `gapUpdate()` translate                  | [`GapDemo`](./components/figures/gap-demo.tsx): Framer Motion `useScroll`/`useTransform`                                                              |
| `buildWedge()` / scatter `youCircle` stroke‑dashoffset | [`WedgeFigure`](./components/figures/wedge-figure.tsx) & [`CompetitiveScatter`](./components/figures/competitive-scatter.tsx): staggered `pathLength` |
| `tabset()` roving‑tabindex tab controller              | [`<Tabs>`](./components/ui/tabs.tsx): accessible, arrow‑key nav, "page‑turn" panels                                                                   |
| Johari `openFile()` hover/focus/click                  | [`JohariMatrix`](./components/figures/johari-matrix.tsx): React state, `aria-expanded`/`aria-controls`                                                |
| CSS `@keyframes drift` ticker                          | [`Ticker`](./components/sections/ticker.tsx): unchanged CSS animation, RSC component                                                                  |

Every draw/reveal honours `prefers-reduced-motion` (transitions collapse to
zero duration), and the SSR‑safe reveal gate means a failed JS runtime never
hides content — an improvement on the reference's brittleness.

---

## 4. Component mapping

The brief's suggested component vocabulary maps onto the editorial primitives
that actually exist in this design:

| Suggested              | This codebase                                        |
| ---------------------- | ---------------------------------------------------- |
| Navigation             | `components/layout/masthead.tsx`                     |
| Footer                 | `components/layout/footer.tsx` (the imprint)         |
| Hero                   | `components/sections/hero.tsx`                       |
| Section Wrapper        | `Chapter` (`components/ui/section.tsx`)              |
| Container              | `Container`, `Row` (`components/ui/container.tsx`)   |
| Button                 | `Slip` (`components/ui/button.tsx`) — cva variants   |
| Badge / Research Chip  | the apparatus label / `leader-tag` on `LeaderRow`    |
| Proof Card / Statistic | `ProofStat` (`components/ui/stat.tsx`)               |
| Evidence Card          | the Johari `file` panels + `Plate`                   |
| Quote                  | `.gap-quote`, `.pullq`, `StatementSpread`            |
| CTA                    | `Slip` + `BackCoverCta`                              |
| Section Header         | `SectionHeader` (`components/ui/section-header.tsx`) |
| Divider                | `Rule` (`components/ui/rule.tsx`)                    |
| Callout                | `Marginalia`, `.step-pull`                           |
| Source Row             | `LeaderRow` (`components/ui/leader-row.tsx`)         |

### Chapters (one component each)

Hero · Proof band · The Gap (§01) · The Blind Spot / Johari (§02) · Method (§03)
· Transcript spread · The Multiplier (§04) · Sources (§05) · Ticker · Dossier
(§06) · Philosophy / Corrections (§07) · Back cover · Imprint. The landing page
([`app/page.tsx`](./app/page.tsx)) composes them in the reference's exact order.

---

## 5. Content decoupled from markup

All editorial copy — headings, standfirsts, folios, stats, verbatims, source
lists — was transcribed verbatim (curly quotes, en/em dashes, numbers intact)
into typed data in [`lib/content.ts`](./lib/content.ts), driven by the types in
[`types/index.ts`](./types/index.ts). Components read from this data, so copy can
be edited — or moved to a CMS — without touching markup. The four Johari file
panels and the SVG figure geometry (scatter/wedge coordinates) stay with their
components, because each is structurally unique rather than list‑like.

---

## 6. What was preserved vs. what changed

**Preserved:** copy, layout, spacing, typography, editorial rhythm, hover
states, the pen‑mark language, section order, and responsive behaviour — the
page reads the same.

**Changed (implementation only):** the reveal system is SSR/no‑JS safe; SVG
animations are declarative and reduced‑motion aware; state replaces imperative
DOM mutation; the CSS is fully tokenised; accessibility was strengthened
(programmatic error association, a focusable skip target, ARIA on tabs and the
matrix); and the CTAs now have a real destination.

**In‑keeping additions.** The reference is a single page; the CTAs pointed at
non‑existent files. Two small, on‑brand additions give the backend foundation a
real surface without redesigning anything:

- **`/contact`** — the destination for every "See your blind spot" CTA. It
  exercises the full stack (RHF → Zod → Server Action → Prisma).
- **A "field notes" subscription slip in the imprint** — a magazine colophon
  authentically carries a subscription line (the `Slip` component is literally
  named after one). It backs the `NewsletterSubscriber` model and demonstrates
  the TanStack Query → REST path, so the model is never dead code.

---

## 7. Fidelity & quality process

After the build compiled cleanly (`tsc`, ESLint, `next build`) and the flows
were smoke‑tested against a live database, the codebase went through an
adversarial multi‑dimension review — fidelity, accessibility, React/Next
correctness, security, and performance — where each finding was independently
re‑verified against the real files before being accepted. Sixteen confirmed
findings were fixed, including two genuine fidelity regressions (the proof‑band
caption and the matrix axis caption had drifted to uppercase sans‑serif; both
were restored to the reference's serif/sentence‑case).
