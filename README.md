# Sibero

**The perception company.** The production codebase behind Sibero's
marketing site and the full‑stack foundation the product will grow from.

This is not an HTML‑to‑React conversion. The static reference
(`theme-02.html` / `theme-02.css`, kept in the repo root as the canonical
visual spec) was reverse‑engineered into a design‑token system and a reusable
component library, then rebuilt as a scalable Next.js application. The visual
output is intentionally near‑identical; the implementation is production‑grade.

> New here? Read **[MIGRATION.md](./MIGRATION.md)** for exactly how the HTML
> reference became this codebase.

---

## Tech stack

| Concern             | Choice                                                       |
| ------------------- | ------------------------------------------------------------ |
| Framework           | Next.js 15 (App Router, React 19, RSC)                       |
| Language            | TypeScript (strict, `noUncheckedIndexedAccess`)              |
| Styling             | Tailwind CSS v4 (CSS‑first `@theme` tokens)                  |
| Motion              | Framer Motion (minimal, scroll‑driven, reduced‑motion aware) |
| Forms               | React Hook Form + Zod                                        |
| Data layer          | Prisma ORM + PostgreSQL                                      |
| Auth                | Auth.js / NextAuth v5 (Prisma adapter, basic setup)          |
| Client data         | TanStack Query                                               |
| Design‑system infra | shadcn/ui configured (`components.json`)                     |
| Quality             | ESLint (flat config) + Prettier                              |

---

## Quick start

**Prerequisites:** Node ≥ 20.9, Docker (for the database), and npm.

```bash
# 1. Install dependencies (also runs `prisma generate`)
npm install

# 2. Create your local env file and add a secret
cp .env.example .env
# then set AUTH_SECRET, e.g.  openssl rand -base64 32

# 3. Start PostgreSQL (Docker Compose, mapped to host port 5433)
npm run db:up

# 4. Apply the schema
npm run db:migrate

# 5. Run the app
npm run dev            # http://localhost:3000
```

> **Note on this machine:** Docker Hub was unreachable during setup, so the
> initial migration ran against a local Homebrew PostgreSQL on port **5432**
> and `.env`'s `DATABASE_URL` points there. `docker-compose.yml` and
> `.env.example` remain the team default (Postgres 16 on **5433**) — switch
> back by running `npm run db:up` and restoring the 5433 URL.

### Scripts

| Script               | Purpose                              |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Dev server                           |
| `npm run build`      | `prisma generate` + production build |
| `npm run start`      | Serve the production build           |
| `npm run typecheck`  | `tsc --noEmit`                       |
| `npm run lint`       | ESLint                               |
| `npm run format`     | Prettier write                       |
| `npm run db:up/down` | Start / stop the Postgres container  |
| `npm run db:migrate` | Create & apply a dev migration       |
| `npm run db:studio`  | Prisma Studio                        |

---

## Environment

Every variable is validated at startup by [`lib/env.ts`](./lib/env.ts) (Zod).
Server‑only variables throw if accessed from client code, so secrets cannot
leak into the bundle.

| Variable                | Scope  | Notes                                     |
| ----------------------- | ------ | ----------------------------------------- |
| `NEXT_PUBLIC_APP_URL`   | client | Absolute origin (canonicals, OG, sitemap) |
| `DATABASE_URL`          | server | PostgreSQL connection string              |
| `AUTH_SECRET`           | server | `openssl rand -base64 32`                 |
| `AUTH_GITHUB_ID/SECRET` | server | Optional — enables the GitHub provider    |

---

## Project structure

```
app/
  layout.tsx            Root layout: fonts, metadata, providers, chrome
  page.tsx              The landing page (composes the sections)
  contact/page.tsx      Enquiry page (destination of the CTAs)
  globals.css           Design tokens (@theme) + base + primitive components
  sections.css          Section‑level layouts (imported by globals.css)
  robots.ts, sitemap.ts Metadata routes
  opengraph-image.tsx   Generated OG/Twitter card
  icon.tsx              Generated favicon
  api/                  auth, contact, newsletter, health route handlers

components/
  ui/                   Design‑system primitives (Slip, Folio, Rule, Plate,
                        Tabs, LeaderRow, Reveal, PenMark, Heading, …)
  layout/               Masthead, Footer (imprint), SkipLink
  sections/             One component per editorial chapter
  figures/              Interactive figures (Johari matrix, gap demo, wedge,
                        scatter, classified plate, perception bars)
  forms/                ContactForm (RHF + server action), NewsletterForm (TanStack Query)
  providers.tsx         TanStack Query provider

hooks/                  use-reveal, use-element-size, use-reduced-motion
lib/
  utils.ts, constants.ts, content.ts   Utilities, brand config, editorial copy
  env.ts                Validated environment
  fonts.ts, seo.ts      next/font wiring, metadata builder
  prisma.ts             PrismaClient singleton
  auth.ts, auth.config.ts   Auth.js (Node full config + edge‑safe half)
  rate-limit.ts         In‑memory fixed‑window limiter
  validations/          Zod schemas (contact, newsletter)
  actions/              Server Actions (contact)
  api/response.ts       JSON envelope helper for routes

types/                  Shared domain & content types, next-auth augmentation
prisma/                 schema.prisma + migrations
```

### Why the structure looks like this

- **No empty/placeholder folders.** Future product areas (dashboard, billing,
  reports…) are deliberately absent — they can be added without reshaping what
  exists.
- **`styles/` is intentionally omitted.** In Tailwind v4 the token layer lives
  in the CSS entry (`app/globals.css` `@theme`), which is the single source of
  truth. A separate `styles/` folder would duplicate that responsibility.
- **shadcn/ui is configured but not forced.** `components.json` is wired so the
  team can `npx shadcn add …` later, but the bespoke editorial components own
  the visible UI — shadcn's default look does not fit this brand, and adding
  unused components would be dead code.

---

## Design system

The visual language is defined once, as tokens, in
[`app/globals.css`](./app/globals.css):

- **Colour** — `paper`, `plate`, `ink`, `ink-soft`, `ink-faint`, `red`, plus
  hairline and derived alpha tokens (`--ink-a45`, `--red-a18`, …) computed with
  `color-mix` so brand colour lives in exactly one place.
- **Three voices** — `--font-display` (Newsreader, headlines), `--font-text`
  (Source Serif 4, reading copy), `--font-app` (Libre Franklin, all apparatus).
  Loaded and self‑hosted via `next/font`.
- **Rhythm** — an 8px base unit (`--u`), a 1200px container, a reserved
  marginalia column, a 66ch reading measure, and the reference's three
  responsive breakpoints.

Tokens surface both as Tailwind utilities (`bg-paper`, `text-ink`,
`font-display`) and as CSS variables consumed by the semantic component classes.
Data‑driven values (bar widths, etc.) bind to the `--w` token rather than being
hardcoded.

---

## Backend foundation

Only what today needs — built so tomorrow slots in.

- **Database** ([`prisma/schema.prisma`](./prisma/schema.prisma)) — the Auth.js
  core models (`User`, `Account`, `Session`, `VerificationToken`) plus
  `ContactSubmission` and `NewsletterSubscriber`. No speculative product models.
- **Auth.js v5** — split into an edge‑safe `auth.config.ts` (providers, pages)
  and the Node `auth.ts` (Prisma adapter, database sessions, a session callback
  exposing `id`/`role`). GitHub is registered only when its env vars are set, so
  the app boots with zero OAuth setup.
- **Two interfaces, one validation** — the contact flow runs through a **Server
  Action** ([`lib/actions/contact.ts`](./lib/actions/contact.ts)); newsletter
  runs through a **REST route** consumed by TanStack Query. Both share their Zod
  schema; the server always re‑validates.
- **Hardening** — every public write path is rate‑limited and protected by a
  honeypot; server errors never leak internals; security headers are applied
  globally.

### Data model

```
User ──< Account
User ──< Session
VerificationToken
ContactSubmission     (name, email, company?, competitor?, message, status, source, userAgent)
NewsletterSubscriber  (email unique, status, source, unsubscribedAt)
```

---

## SEO & performance

- Per‑page `Metadata` via [`lib/seo.ts`](./lib/seo.ts): canonical URLs,
  OpenGraph, Twitter cards, a title template, `robots.txt` and `sitemap.xml`.
- A branded, self‑contained OG image and favicon generated with `next/og`.
- Fonts optimised and self‑hosted (`next/font`); the landing page ships ~161 kB
  first‑load JS and is statically prerendered.
- Progressive enhancement: content is fully visible without JavaScript; scroll
  animations are opt‑in behind a `.js` class and every animation respects
  `prefers-reduced-motion`.
- Accessibility: semantic landmarks, a focusable skip target, labelled and
  error‑associated form fields, ARIA tabs with roving focus, and
  `aria-hidden` on decorative SVG.

---

## Security notes (production follow‑ups)

- **Rate limiting** ([`lib/rate-limit.ts`](./lib/rate-limit.ts)) is in‑memory —
  correct for a single instance and a clean integration seam. For
  multi‑instance / serverless, swap the `Map` for `@upstash/ratelimit` + Redis
  behind the same interface.
- **Content‑Security‑Policy** is intentionally _not_ shipped. A Next.js app
  relies on inline hydration scripts, so an untuned CSP breaks it; add a
  nonce‑based policy (via middleware) as a dedicated step. HSTS and the other
  standard headers are already set in `next.config.ts`.

---

## Verification

This codebase passes `tsc --noEmit`, ESLint, and `next build`; the pages, API
routes, database writes, honeypot, and rate limiter were exercised end‑to‑end
against a live database. It was also put through an adversarial multi‑dimension
review (fidelity, accessibility, React/Next correctness, security, performance),
and every confirmed finding was fixed — see the git history and MIGRATION.md.

## Extending it later

Add a product area by creating its route group under `app/`, its models in
`schema.prisma`, its Server Actions/routes in `lib/`, and its UI from the
existing primitives. The token layer, auth, validation, and data foundations
already exist — you extend, you don't rebuild.
