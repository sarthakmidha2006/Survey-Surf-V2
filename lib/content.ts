/**
 * Editorial content for the Survey Surf front page ("Issue 01").
 *
 * Copy is modelled as typed data so it can be edited — or later sourced from a
 * CMS — without touching component markup. Presentation-only geometry (SVG
 * coordinates for the wedge and scatter figures, and the four Johari file
 * layouts, which are each structurally unique) lives with its figure component.
 */
import type {
  ChapterSeam,
  ConversationStreamContent,
  Correction,
  Deliverable,
  EngineFlowNode,
  EngineMeta,
  EngineOutcome,
  EngineStage,
  EvidenceBoardContent,
  GapContent,
  HeroContent,
  HeroExhibit,
  HeroPhoto,
  HeroSceneContent,
  IntakeSample,
  IntakeSource,
  JohariBlind,
  JohariQuad,
  LeaderItem,
  MethodStage,
  PerceptionBar,
  ProofCell,
  RelativeGroup,
  SectionOpener,
  SynthCluster,
} from "@/types";

/* ============ HERO — THE COVER ============ */
export const hero: HeroContent = {
  caseFile: "Case File 001",
  heading: {
    lead: "The market already has an opinion of you. You just haven’t",
    em: "seen it yet.",
  },
  standfirst:
    "We reveal the perception gap between how you see your brand and how the market actually feels.",
  primaryCta: { label: "See your blind spot", href: "/contact" },
  secondaryCta: { label: "How it works", href: "#method" },
  metrics: [
    { value: "10+", caption: "Signal Sources" },
    { value: "2M+", caption: "Conversations Indexed" },
    { value: "Enterprise", caption: "Ready" },
    { value: "Global", caption: "Research" },
  ],
};

/* ============ FIG. A · THE PERCEPTION APPARATUS ============
   The cover exhibit, rebuilt as a single executive research visualization:
   millions of scattered opinions (the intake stream, left) are drawn through a
   precision optical lens and resolved into one clear market perception (a single
   red verdict point, right). Copy and the source list are real; the apparatus
   geometry is generated in `components/figures/hero-scene.tsx`. */
export const heroScene: HeroSceneContent = {
  sources: [
    { label: "Reviews", icon: "reviews" },
    { label: "Reddit threads", icon: "reddit" },
    { label: "Support tickets", icon: "ticket" },
    { label: "G2 reviews", icon: "g2" },
    { label: "Sales mentions", icon: "sales" },
    { label: "Interview notes", icon: "interview" },
    { label: "Forum posts", icon: "forum" },
    { label: "Social media", icon: "social" },
    { label: "App store reviews", icon: "appstore" },
    { label: "Customer calls", icon: "calls" },
    { label: "And more…", icon: "more" },
  ],
  chaos: {
    title: "Millions of opinions",
    detail: "Scattered. Noisy. Unstructured.",
  },
  clarity: {
    title: "One perception",
    detail: "Clear. Defensible. Actionable.",
  },
  stats: [
    { label: "Signals Analyzed", value: "2,341" },
    { label: "Confidence", value: "94%" },
    { label: "Updated Daily" },
  ],
};

/* ============ FIG. A · THE CONVERSATION STREAM ============
   The redesigned cover exhibit. Fifty scattered customer opinions drift on the
   left like dust in sunlight; each emits a thin, curved stream of light that
   converges — organically, like rivers joining — into one fixed perception
   card on the far right. The phrases and the card copy are real; the flow
   geometry and particle field are generated in
   `components/figures/conversation-stream.tsx`. */
export const conversationStream: ConversationStreamContent = {
  phrases: [
    "Support is slow",
    "Too expensive",
    "Great onboarding",
    "Excellent product",
    "Love the UI",
    "Buggy updates",
    "Not for enterprise",
    "Hard to justify",
    "Premium pricing",
    "Fast support",
    "Confusing plans",
    "Works great",
    "Needs integrations",
    "Switching next month",
    "Very reliable",
    "Better than competitors",
    "Steep learning curve",
    "Worth every penny",
    "Feels overpriced",
    "Beautiful design",
    "Clunky mobile app",
    "Best in class",
    "Slow to load",
    "Missing key features",
    "Incredible value",
    "Support ghosted me",
    "Intuitive to use",
    "Too many bugs",
    "Rock solid",
    "Pricing is unclear",
    "Saves us hours",
    "Hard to cancel",
    "Polished experience",
    "Overkill for us",
    "Docs are excellent",
    "Constant downtime",
    "Genuinely delightful",
    "Not worth the cost",
    "Onboarding was smooth",
    "Feels enterprise-grade",
    "Wish it were cheaper",
    "Setup took minutes",
    "Lacks reporting",
    "Highly recommend",
    "Renewal shock",
    "Support is world-class",
    "Too complicated",
    "Exactly what we needed",
    "Buggy on launch",
    "Can’t live without it",
  ],
  perception: {
    eyebrow: "The Market’s Perception",
    quote: "Excellent product. Too difficult to justify the price.",
    stats: [
      { value: "94%", label: "Confidence" },
      { value: "2.3M", label: "Conversations" },
    ],
  },
};

/* ============ EVIDENCE BOARD — FIG. A · THE COVER EXHIBIT ============
   The war-room wall. Real signals — reviews, threads, tickets, interviews,
   charts — pinned to a warm-charcoal wall and gathered by the editor's red
   thread into the one perception the market holds but never said out loud.

   Card copy is real and legible (never lorem, never a screenshot). Each
   card's placement (`x`,`y` percent) and tilt (`rotate` deg) is tuned by eye
   against the composition; `thread: true` cards are the signals the red
   thread converges through, measured live from the DOM. */
export const evidenceBoard: EvidenceBoardContent = {
  caption: "FIG. A · Perception evidence board",
  keyFinding: {
    label: "Key Finding",
    lead: "Customers don’t see you as the leader in the category.",
    em: "They see you as an alternative.",
    confidence: 94,
    updated: "Updated daily",
  },
  stats: [
    { label: "Signals analyzed", value: "2,341" },
    { label: "Sources", value: "10" },
    { label: "Last updated", value: "Today" },
  ],
  /* Legible pen-notes the analyst left in the margins. */
  annotations: [
    { text: "recurring", x: 27, y: 30, rotate: -8 },
    { text: "3rd mention", x: 64, y: 40, rotate: 6 },
    { text: "priority", x: 46, y: 66, rotate: -5 },
    { text: "cf. G2", x: 19, y: 63, rotate: 7 },
    { text: "↑ trend", x: 88, y: 39, rotate: 9 },
  ],
  /* Illegible pen-marks — the density of a wall that has been worked. */
  scrawls: [
    { variant: 0, x: 40, y: 30, rotate: -8, scale: 1.1 },
    { variant: 1, x: 63, y: 41, rotate: 6, scale: 0.9 },
    { variant: 2, x: 48, y: 66, rotate: -5 },
    { variant: 3, x: 21, y: 61, rotate: 7, scale: 0.85 },
    { variant: 0, x: 85, y: 33, rotate: -10, scale: 0.9 },
    { variant: 1, x: 12, y: 71, rotate: 8 },
    { variant: 2, x: 66, y: 88, rotate: -6, scale: 0.9 },
    { variant: 3, x: 50, y: 22, rotate: 5, scale: 0.8 },
    { variant: 0, x: 33, y: 89, rotate: -7, scale: 0.85 },
    { variant: 1, x: 90, y: 52, rotate: 10, scale: 0.9 },
  ],
  cards: [
    /* ── LAYER 0 · the mass of raw opinion, softened into the wall ── */
    {
      id: "scrap-tl",
      kind: "scrap",
      x: 0,
      y: 2,
      w: 12,
      rotate: -6,
      z: 2,
      tone: "manila",
      pin: "dark",
      faded: true,
      scrawl: 0,
    },
    {
      id: "scrap-tc",
      kind: "scrap",
      x: 25,
      y: 1,
      w: 8,
      rotate: 7,
      z: 3,
      tone: "manila",
      pin: "dark",
      faded: true,
      scrawl: 3,
    },
    {
      id: "scrap-tgap",
      kind: "scrap",
      x: 52,
      y: 1,
      w: 8,
      rotate: -7,
      z: 3,
      tone: "cream",
      pin: "silver",
      faded: true,
      scrawl: 1,
    },
    {
      id: "scrap-fl",
      kind: "scrap",
      x: 6,
      y: 15,
      w: 10,
      rotate: 6,
      z: 2,
      tone: "cream",
      pin: "dark",
      faded: true,
      scrawl: 2,
    },
    {
      id: "scrap-sales-under",
      kind: "scrap",
      x: 4,
      y: 37,
      w: 13,
      rotate: -3,
      z: 2,
      tone: "gray",
      pin: "dark",
      faded: true,
      scrawl: 1,
    },
    {
      id: "scrap-behind-kf",
      kind: "scrap",
      x: 22,
      y: 33,
      w: 9,
      rotate: -5,
      z: 3,
      tone: "manila",
      pin: "silver",
      faded: true,
      scrawl: 3,
    },
    {
      id: "scrap-re",
      kind: "scrap",
      x: 92,
      y: 23,
      w: 9,
      rotate: 6,
      z: 2,
      tone: "cream",
      pin: "dark",
      faded: true,
      scrawl: 0,
    },
    {
      id: "scrap-rm",
      kind: "scrap",
      x: 91,
      y: 60,
      w: 9,
      rotate: -6,
      z: 2,
      tone: "manila",
      pin: "dark",
      faded: true,
      scrawl: 2,
    },
    {
      id: "scrap-bl",
      kind: "scrap",
      x: 2,
      y: 77,
      w: 14,
      rotate: 3,
      z: 2,
      tone: "gray",
      pin: "dark",
      faded: true,
      scrawl: 3,
    },
    {
      id: "scrap-bcl",
      kind: "scrap",
      x: 19,
      y: 85,
      w: 12,
      rotate: -4,
      z: 3,
      tone: "cream",
      pin: "dark",
      faded: true,
      scrawl: 1,
    },
    {
      id: "scrap-bc",
      kind: "scrap",
      x: 38,
      y: 90,
      w: 10,
      rotate: 4,
      z: 3,
      tone: "manila",
      pin: "silver",
      faded: true,
      scrawl: 0,
    },
    {
      id: "scrap-stats",
      kind: "scrap",
      x: 73,
      y: 71,
      w: 10,
      rotate: -4,
      z: 3,
      tone: "cream",
      pin: "dark",
      faded: true,
      scrawl: 2,
    },

    /* ── dark warm sticky-notes — the punctuation between papers ── */
    {
      id: "sticky-top",
      kind: "sticky",
      quote: "chase down",
      x: 55,
      y: 1,
      w: 8,
      rotate: 5,
      z: 4,
      pin: "dark",
    },
    {
      id: "sticky-kf-left",
      kind: "sticky",
      quote: "same theme",
      x: 23,
      y: 46,
      w: 7.5,
      rotate: -8,
      z: 4,
      pin: "red",
    },
    {
      id: "sticky-right",
      kind: "sticky",
      quote: "verify",
      x: 71,
      y: 60,
      w: 7.5,
      rotate: 7,
      z: 4,
      pin: "dark",
    },
    {
      id: "sticky-kf-below",
      kind: "sticky",
      quote: "flag",
      x: 31,
      y: 60,
      w: 6.5,
      rotate: 9,
      z: 3,
      pin: "dark",
    },

    /* ── LAYER 1 · the foreground signals the thread gathers ── */
    {
      id: "pricing",
      kind: "chart-bar",
      source: "Pricing Feedback",
      meta: "198 responses",
      quote: "“Not worth it at this price.”",
      value: 60,
      x: 12,
      y: 2,
      w: 16,
      rotate: -3,
      z: 5,
      tone: "manila",
      pin: "dark",
      pinAt: "left",
    },
    {
      id: "reddit",
      kind: "reddit",
      source: "Reddit Thread",
      meta: "r/product · 3.2k upvotes",
      quote: "Feature X launched, but users are still asking for Y.",
      highlight: "still asking for Y",
      x: 31,
      y: 4,
      w: 20,
      rotate: -1.5,
      z: 7,
      tone: "white",
      pin: "red",
      pinAt: "center",
      thread: true,
    },
    {
      id: "pricing-2",
      kind: "note",
      source: "Pricing",
      meta: "188 responses",
      quote: "“Not a priority right now.”",
      x: 45,
      y: 13,
      w: 14,
      rotate: 3,
      z: 5,
      tone: "cream",
      pin: "dark",
      pinAt: "right",
    },
    {
      id: "interview",
      kind: "interview",
      source: "Customer Interview #42",
      meta: "Theme coded",
      quote: "“True — but not for me.”",
      highlight: "not for me",
      x: 56,
      y: 6,
      w: 19,
      rotate: 1.6,
      z: 7,
      tone: "cream",
      pin: "red",
      pinAt: "center",
      thread: true,
    },
    {
      id: "sentiment",
      kind: "chart-line",
      source: "Sentiment Analysis",
      meta: "237 mentions",
      quote: "“Too expensive” for features.",
      value: 72,
      x: 74,
      y: 5,
      w: 22,
      rotate: -1.4,
      z: 7,
      tone: "white",
      pin: "red",
      pinAt: "left",
      thread: true,
    },
    {
      id: "sales",
      kind: "interview",
      source: "Sales Call Note",
      meta: "Q4 analysis",
      quote: "Competitors are winning on perceived value, not features.",
      x: 3,
      y: 20,
      w: 19,
      rotate: 2,
      z: 5,
      tone: "manila",
      pin: "dark",
      pinAt: "left",
    },
    {
      id: "support",
      kind: "ticket",
      source: "Support Ticket",
      meta: "#18492",
      quote: "“It works, but it’s not built for people like us.”",
      x: 2,
      y: 45,
      w: 18,
      rotate: -2,
      z: 5,
      tone: "cream",
      pin: "dark",
      pinAt: "left",
      curl: true,
    },
    {
      id: "competitive",
      kind: "chart-donut",
      source: "Competitive Mention",
      meta: "Q4 analysis",
      quote: "58% choose a competitor for ease of use.",
      value: 58,
      x: 5,
      y: 60,
      w: 18,
      rotate: -1.8,
      z: 6,
      tone: "white",
      pin: "red",
      pinAt: "right",
      thread: true,
    },
    {
      id: "trend",
      kind: "chart-bar",
      source: "Market Trend",
      meta: "2023 → 2024",
      quote: "“UI feels outdated compared to others.”",
      value: 64,
      x: 77,
      y: 44,
      w: 21,
      rotate: 1.2,
      z: 6,
      tone: "manila",
      pin: "dark",
      pinAt: "right",
      curl: true,
    },
    {
      id: "appstore",
      kind: "review",
      source: "Competitive Review",
      meta: "App Store · 3.9★",
      quote: "“It works, but alternatives feel more modern.”",
      highlight: "alternatives feel more modern",
      rating: 4,
      x: 21,
      y: 68,
      w: 18,
      rotate: -1.6,
      z: 6,
      tone: "cream",
      pin: "dark",
      pinAt: "left",
      thread: true,
    },
    {
      id: "g2",
      kind: "review",
      source: "G2 Review",
      meta: "Verified user",
      quote: "“Good product. Not a category leader, though.”",
      highlight: "Not a category leader",
      rating: 3,
      x: 40,
      y: 75,
      w: 17,
      rotate: -1,
      z: 7,
      tone: "white",
      pin: "red",
      pinAt: "center",
      thread: true,
    },
    {
      id: "review3",
      kind: "review",
      source: "Market Trend",
      meta: "2023 → 2024",
      quote: "“Good — but not a category leader.”",
      rating: 3,
      x: 57,
      y: 70,
      w: 16,
      rotate: 1.5,
      z: 6,
      tone: "manila",
      pin: "dark",
      pinAt: "right",
    },
  ],
};

/* ============ HERO EXHIBIT — FIG. A · THE EVIDENCE ============
   The raw material of a study: scattered verbatim opinions pulled from
   ten sources. The editor's pen marks the signals; a red thread gathers
   them into the one thing the market believes but never said out loud. */
export const heroExhibit: HeroExhibit = {
  overline: "the market already knows — you don’t",
  headLeft: "FIG. A · THE EVIDENCE",
  headRight: "10 SOURCES",
  chips: [
    { quote: "probably not for me", source: "Reddit" },
    {
      quote: "not for someone like me",
      source: "Reddit",
      signal: true,
      mark: "circle",
    },
    { quote: "premium, sure — but is it for us?", source: "Review" },
    {
      quote: "I couldn’t tell what it was for",
      source: "Ticket",
      signal: true,
      mark: "underline",
    },
    { quote: "everyone says it’s the safe choice", source: "Call" },
    { quote: "a little overwhelming, honestly", source: "Forum" },
    {
      quote: "felt built for bigger teams",
      source: "Churn",
      signal: true,
      mark: "underline",
    },
    { quote: "wait — you do that too?", source: "Review" },
    { quote: "trusted, but not exciting", source: "Social" },
    { quote: "we went with the one we understood", source: "Interview" },
  ],
  verdict: {
    label: "The market perception",
    confidence: "CONF 94%",
    lead: "“It’s not that they distrust you.",
    em: "They can’t picture themselves using you.”",
    sub: "The blind spot — surfaced from 1,240 conversations",
  },
  caption: "1,240 conversations, uncorrected. The pattern is already there.",
  captionStrong: "FIG. A",
  captionRight: "UNCORRECTED PROOF",
};

/* ============ HERO PHOTOGRAPH — FIG. A · THE EVIDENCE WALL ============
   Design Sprint 01B — the redesigned hero visual. Not a dashboard and not a
   card: a duotoned photograph of the market's own words at scale — a wall of
   thousands of verbatim notes — with the editor's pen laid over it. Two
   verbatims are pulled from the wall and pinned; a single red thread gathers
   them into the one perception the market holds but never said out loud.

   The photograph carries the *texture* of mass opinion; the annotations carry
   the *meaning*. Coordinates are percentages of the plate, tuned by eye against
   the composition (see HeroPhoto in types/index.ts). Swap `image.src` for any
   premium research photograph and the duotone + overlay treatment carries it. */
export const heroPhoto: HeroPhoto = {
  overline: "the market already knows — you don’t",
  image: {
    src: "/hero/evidence-wall.jpg",
    alt: "A wall covered edge to edge with thousands of handwritten notes — the market’s verbatim opinions, gathered from ten sources and read as one body of evidence.",
  },
  figLabel: "FIG. A",
  figTitle: "THE EVIDENCE",
  figRight: "1,240 CONVERSATIONS · 10 SOURCES",
  measure: "n = 1,240",
  // Control points (%, tuned by eye): pin 1 → pin 2 → down into the verdict.
  thread: [
    { x: 18, y: 25 },
    { x: 40, y: 42 },
    { x: 64, y: 53 },
    { x: 40, y: 76 },
  ],
  pins: [
    {
      code: "EX.02",
      source: "REDDIT",
      quote: "not for someone like me",
      mark: "circle",
      at: { x: 3, y: 7 },
      to: { x: 34, y: 26 },
      rotate: -1.8,
    },
    {
      code: "EX.07",
      source: "CHURN",
      quote: "felt built for bigger teams",
      mark: "underline",
      at: { x: 45, y: 39 },
      to: { x: 62, y: 34 },
      rotate: 1.4,
    },
  ],
  verdict: {
    label: "The market perception",
    confidence: "CONF 94%",
    lead: "“It’s not that they distrust you.",
    em: "They can’t picture themselves using you.”",
    sub: "The blind spot — surfaced from 1,240 conversations",
  },
  caption: "1,240 conversations, uncorrected. The pattern is already there.",
  captionStrong: "FIG. A",
  captionRight: "UNCORRECTED PROOF",
};

/* ============ PROOF BAND ============ */
export const proofFolio = {
  left: "SS · ISSUE 01 · ON THE RECORD",
  right: "P. 02",
};

export const proofCells: ProofCell[] = [
  { kind: "number", value: "10", caption: "Signal sources" },
  { kind: "number", value: "1", caption: "Blind spot / study" },
  {
    kind: "phrase",
    value: "Perception, not prediction.",
    caption: "We reveal the present",
  },
  {
    kind: "phrase",
    value: "The gap is the product.",
    caption: "Self-image vs market-image",
  },
];

/* ============ CHAPTER SEAMS — the bridges between chapters ============
   The connective tissue read in the whitespace between chapters. Each closes
   the chapter just read (leadOut — often citing a real figure from it) and
   pulls forward into the next (teaser — a hook, never the next headline, so
   the running head below never reads twice). Keyed by the boundary they span;
   wired into the page between the two sections in app/page.tsx. */
export const chapterSeams: Record<string, ChapterSeam> = {
  gapToBlind: {
    issue: "SS · Issue 01",
    leadOut: "A thirty-four point gap — measured, and filed.",
    teaser: "But a gap that wide has to be hiding somewhere.",
    next: "Chapter 02 · The Blind Spot",
    nextHref: "#blindspot",
  },
  blindToMethod: {
    issue: "SS · Issue 01",
    leadOut: "Four rooms. Only the one you can’t see decides.",
    teaser: "So how do you get inside a room with no door?",
    next: "Chapter 03 · How It Works",
    nextHref: "#method",
  },
  multiplierToSources: {
    issue: "SS · Issue 01",
    leadOut: "Perception, at last read against the field.",
    teaser: "None of it holds without the signal underneath.",
    next: "Chapter 05 · Always Listening",
    nextHref: "#sources",
  },
  dossierToPhilosophy: {
    issue: "SS · Issue 01",
    leadOut: "A finished file — read in the room where you decide.",
    teaser: "Which leaves one thing left to say plainly.",
    next: "Chapter 07 · Our Stance",
    nextHref: "#philosophy",
  },
};

/* ============ THE GAP ============ */
export const gap: GapContent = {
  opener: {
    folio: { left: "SS · ISSUE 01 · CHAPTER 01", right: "P. 03" },
    kicker: "The Costly Gap",
    kickerNo: "· 01",
    heading: { lead: "You cannot see yourself the way the market does." },
    standfirst:
      "Founders are flying blind — not because they lack data, but because they can’t stand outside their own story. Over time, how you believe you’re seen quietly drifts from how the market actually feels. That drift is invisible. It is also expensive.",
    dropcap: true,
    marginNote: "the space between is the gap",
  },
  instrument: {
    figLabel: "Fig. 01 — Perception Deviation",
    methodLabel: "Survey Surf · Levelling Run",
    leftLabel: "How you see yourself",
    rightLabel: "How the market actually sees you",
    axisLabel: "Deviation",
    rows: [
      { belief: "Premium", reality: "Expensive", dev: 41 },
      { belief: "Trusted", reality: "Corporate", dev: 22 },
      { belief: "Innovative", reality: "Complicated", dev: 48 },
      { belief: "Leader", reality: "Alternative", dev: 39 },
      { belief: "Modern", reality: "Generic", dev: 20 },
    ],
    indicatorLead: "Gap detected",
    indicatorValue: "34",
    indicatorUnit: "pts",
    indicatorSub: "Mean deviation · 5 attributes",
  },
  bridge: "Survey Surf bridges it",
  footnote: {
    id: "fn1",
    text: "In this study, a 34-point gap separated how the brand saw itself from how the market actually felt.",
  },
};

/* ============ THE BLIND SPOT — the Blind Spot Matrix™ ============ */
export const blindSpotOpener: SectionOpener = {
  folio: { left: "SS · ISSUE 01 · CHAPTER 02", right: "P. 04" },
  kicker: "The Blind Spot",
  kickerNo: "· 02",
  heading: { lead: "There is a room you can’t see into." },
  standfirst:
    "Every market has already sorted what it knows about you into four rooms. You spend all day in three of them. The fourth — what the market can see and you can’t — is the only one that moves the business.",
  marginNote: "everyone stares at the wrong three",
};

export const blindSpotFootnote = {
  id: "fn2",
  text: "Hover or focus any room to bring it into the light; the others fall back. Three read as apparatus — the blind spot stays lit, declassified into what the market actually said.",
};

/**
 * The exhibit primer — a small 3-vs-1 diagram that frames FIG. 01 in the space
 * the old indices used to hold. Not a list: a visual thesis. Three faint rooms
 * you already live in, a red hand-off, and the one dark room that decides.
 */
export const blindSpotPrimer = {
  eyebrow: "Reading the exhibit",
  meta: "Four rooms · three seen · one blind",
  known: {
    glyphs: ["01", "02", "03"],
    label: "Rooms 01–03",
    sub: "you live here",
    note: "Confirm · reassure · refine. Necessary — never decisive.",
  },
  blind: {
    mark: "Room 04",
    name: "The Blind Spot",
    note: "What the market sees and you can’t —",
    noteEm: "the one room that moves the business.",
  },
  handoff: "Fig. 01 — the matrix, declassified",
};

/** The ~38% argument column (the "brief") that sits beside the instrument. */
export const johariFramework = {
  kicker: "The Framework",
  title: { lead: "The Survey Surf", em: "Blind Spot Matrix™" },
  thesis:
    "Two questions sort every opinion a market forms of you — what you can see, and what it can see. Four rooms. You live in three: they confirm, reassure, refine. None moves the decision.",
  turn: "Only the fourth does.",
  turnBody:
    "The market has reached a verdict you can’t see from the inside — quietly setting your price, your pipeline, your position. That room is the blind spot. Finding it is the whole job.",
  keyLabel: "Instrument key",
  legend: [
    { mark: "IGNORE", swatch: "ignore", text: "Confirmed by both — table stakes." },
    { mark: "STUDY", swatch: "study", text: "Yours to say — unheard by the market." },
    { mark: "UNKNOWN", swatch: "unknown", text: "Emerging — too early to bet." },
    { mark: "CRITICAL", swatch: "critical", text: "The market’s verdict, unseen by you." },
  ],
  deliverableLabel: "What comes back",
  deliverable: [
    "The blind spot, named",
    "A confidence score & the evidence",
    "The messaging move",
  ],
  signalsLabel: "Signals coded",
  signals: [
    "emotional mismatch",
    "perception drift",
    "recurring objections",
    "positioning gaps",
    "trust asymmetry",
    "language patterns",
  ],
  sourcesLabel: "Sources coded",
  sourcesCount: "10",
  sourcesSub: "1,240 conversations",
  sources: [
    "Reddit",
    "G2 · Capterra",
    "Sales calls",
    "Churn exits",
    "Support",
    "Community",
    "Social",
    "App reviews",
    "Web",
    "Win / loss",
  ],
  meta: {
    method: "SS/PMF-04",
    rev: "REV 4",
    sources: "10 SOURCES",
    sample: "n = 1,240",
    conf: "CONF 91%",
    filed: "FILED 07 JUL",
    reviewer: "SK",
  },
};

export const johariAxes = {
  xCaption: "What you can see",
  xLeft: "Known to you",
  xRight: "Unknown to you",
  yCaption: "What the market sees",
  yTop: "Known to market",
  yBottom: "Unknown to market",
};

export const johariFigHead = {
  title: "The Survey Surf Blind Spot Matrix™",
  ref: "FIG. 01",
  right: "SS/PMF-04 · REV 4",
};

/** The three "apparatus" rooms. The fourth — the blind spot — is `johariBlind`. */
export const johariQuads: JohariQuad[] = [
  {
    id: "quad-consensus",
    pos: "tl",
    ref: "SS-01",
    priority: "IGNORE",
    swatch: "ignore",
    coord: "YOU KNOW · THEY KNOW",
    name: "Consensus",
    tag: "the obvious",
    body: "What you both already agree on. Necessary — never decisive.",
    evidence: ["G2", "Web", "Deck"],
    confidence: 96,
    confidenceLabel: "HIGH",
    signalCount: "EV 427",
    sentiment: [{ label: "AGREE", value: "92%", dir: "up" }],
    quote: { text: "It does what it says.", source: "G2 · R-0412" },
    note: "everyone claims this",
  },
  {
    id: "quad-latent",
    pos: "bl",
    ref: "SS-02",
    priority: "STUDY",
    swatch: "study",
    coord: "YOU KNOW · THEY DON’T",
    name: "Latent Message",
    tag: "the untold",
    body: "Real value you hold — the market simply hasn’t heard it yet.",
    evidence: ["Sales", "Demo"],
    confidence: 58,
    confidenceLabel: "MED",
    signalCount: "OPP 74",
    sentiment: [{ label: "AWARE", value: "11%", dir: "down" }],
    quote: { text: "Wait — you do that?", source: "Sales call · L-208" },
    note: "say it louder",
  },
  {
    id: "quad-research",
    pos: "br",
    ref: "SS-03",
    priority: "UNKNOWN",
    swatch: "unknown",
    coord: "NEITHER KNOWS · YET",
    name: "Research Req.",
    tag: "the emerging",
    body: "A signal nobody has named yet — the question after this one.",
    evidence: ["Unprompted"],
    confidence: 34,
    confidenceLabel: "LOW",
    signalCount: "EV 12",
    sentiment: [{ label: "SIGNAL", value: "↗", dir: "up" }],
    quote: { text: "I wonder if it could also…", source: "Unprompted · C-337" },
    note: "watch next qtr",
  },
];

/** The fourth room — the dominant dark case file (top-right of the grid). */
export const johariBlind: JohariBlind = {
  tape: "CONFIDENTIAL",
  ref: "DOSSIER SS-04",
  priority: "◉ PRIORITY 01",
  coord: "YOU DON’T · THEY DO",
  name: "The Blind Spot",
  tag: "the verdict",
  redactLead: "SUBJECT",
  redactMid: "PERCEPTION GAP",
  dialogue: [
    { dt: "You assume", dd: "“We’re the scrappy underdog’s tool.”" },
    { dt: "They’ve decided", dd: "“Built for teams bigger than mine — not for me.”" },
    {
      dt: "Consequence",
      dd: "Priced, pitched and filtered as the incumbent you set out to unseat.",
    },
  ],
  quote: { text: "Not for someone like me.", source: "Reddit · unprompted · ×37" },
  confidence: 91,
  confidenceLabel: "Signal confidence",
  pattern: [
    { label: "TRUST", value: "+12", dir: "up" },
    { label: "BELONGING", value: "−38", dir: "down" },
    { label: "RISK", value: "88", dir: "flat" },
  ],
  evidenceStack: ["Reddit", "G2", "Sales", "Churn"],
  verdict: {
    lead: "You built",
    em1: "the underdog’s tool.",
    mid: "They feel",
    em2: "the incumbent’s.",
  },
  source: "Reddit · G2 · Sales · Churn — n = 1,240 · CONF HIGH · UPD 2D",
  note: "trusted, not wanted",
};

export const johariCaption = {
  strong: "FIG. 01 · CLASSIFICATION CONFIDENTIAL",
  rest: " — Method SS/PMF-04 · 10 sources · 1,240 conversations · confidence 91% — filed 07 JUL · reviewed ✓ SK",
};

/* ============ METHOD — THE PERCEPTION ENGINE ============ */
export const methodOpener: SectionOpener = {
  folio: { left: "SS · ISSUE 01 · CHAPTER 03", right: "P. 05" },
  kicker: "How It Works",
  kickerNo: "· 03",
  heading: { lead: "From ten thousand opinions,", em: "one perception." },
  standfirst:
    "One continuous engine. Scattered opinion enters at one end; a single, defensible read on how the market actually feels comes out the other. Scroll, and watch the machine run.",
  marginNote: "opinion → perception",
};

/**
 * The five stages of the engine, told as scrollytelling. As each block reaches
 * the viewport centre it drives the sticky field to a matching state:
 * scattered opinion → an ordered field → themes → a few forces → one point.
 */
export const methodStages: MethodStage[] = [
  {
    no: "01",
    label: "The raw voice",
    heading: "Ten thousand opinions, no shape.",
    body: "Reviews, Reddit, tickets, sales calls, churn notes — your market is already talking, everywhere at once. On its own it is noise: scattered, contradictory, impossible to read.",
  },
  {
    no: "02",
    label: "Intake",
    heading: "Every source, lined up on one page.",
    body: "No new survey to run. We pull each opinion in and normalise it into a single comparable field — every voice measured the same way, ready to be read.",
  },
  {
    no: "03",
    label: "Patterns",
    heading: "The same feeling, said a hundred ways.",
    body: "Read closely and structure appears. Repeated emotion pulls together into themes — the frustrations, desires and doubts your customers keep circling back to.",
  },
  {
    no: "04",
    label: "Synthesis",
    heading: "Themes collapse into the few that matter.",
    body: "Overlapping patterns merge. Dozens of small signals consolidate into a handful of defensible forces — the ones actually shaping how the market feels.",
  },
  {
    no: "05",
    label: "The blind spot",
    heading: "One perception you couldn't see.",
    body: "Everything resolves to a single point: the one read on your market that was hidden in the noise. Not another report — the lever you move positioning and messaging around.",
  },
];

/** The full pipeline, drawn as a legend beneath the opener. */
export const engineFlow: EngineFlowNode[] = [
  { label: "Customer opinions", stage: 1 },
  { label: "Evidence", stage: 1 },
  { label: "Signal", stage: 2 },
  { label: "Pattern", stage: 2 },
  { label: "Blind spot", stage: 2 },
  { label: "Recommendation", stage: 3 },
  { label: "Campaign", stage: 3 },
];

export const engineLegend = {
  label: "The perception engine",
  ref: "SS-ENGINE · v3.1",
  status: "Live · reading now",
};

/* ---- STAGE 01 · COLLECT ---- */
export const collectStage: EngineStage = {
  no: "01",
  name: "Collect",
  verb: "Intake",
  heading: "The opinions are already out there — in their words.",
  body: "No survey to launch, no panel to recruit. We meet the market where it is most honest and pull every channel into one intake. Evidence arrives continuously, timestamped and sourced.",
  marginNote: "we don’t ask — we listen",
  readouts: [
    { label: "Live sources", value: "12" },
    { label: "Evidence logged", value: "12,904" },
    { label: "Verbatim, unedited", value: "100%" },
  ],
  caption: {
    strong: "FIG. 3.1 · INTAKE",
    rest: " — every channel where your customer already speaks, read verbatim.",
  },
};

/** The listening channels shown as the intake header. */
export const intakeSources: IntakeSource[] = [
  { name: "Reviews", code: "RVW" },
  { name: "Support tickets", code: "TKT" },
  { name: "Reddit", code: "RDT" },
  { name: "Discord", code: "DSC" },
  { name: "Sales calls", code: "CAL" },
  { name: "Communities", code: "CMU" },
  { name: "App Store", code: "APP" },
  { name: "LinkedIn", code: "LNK" },
  { name: "Twitter", code: "TWT" },
  { name: "Forums", code: "FRM" },
  { name: "Interview notes", code: "INT" },
  { name: "Survey responses", code: "SVY" },
];

/** Verbatim opinions streaming through the intake ledger. */
export const intakeSamples: IntakeSample[] = [
  { code: "RVW", quote: "does what it says — never sure it’s for me", id: "EV-4471" },
  { code: "RDT", quote: "everyone recommends it, nobody explains why", id: "EV-4472" },
  { code: "TKT", quote: "took three tries to find the setting", id: "EV-4473" },
  { code: "CAL", quote: "we went with the one we understood", id: "EV-4474" },
  { code: "DSC", quote: "feels like it’s built for bigger teams", id: "EV-4475" },
  { code: "APP", quote: "premium, trusted — just not exciting", id: "EV-4476" },
  { code: "TWT", quote: "had no idea it did that", id: "EV-4477" },
  { code: "LNK", quote: "the safe choice, honestly", id: "EV-4478" },
  { code: "FRM", quote: "couldn’t tell what it was for at first", id: "EV-4479" },
  { code: "INT", quote: "I trust it — I’m just not excited by it", id: "EV-4480" },
  { code: "SVY", quote: "not for someone like me", id: "EV-4481" },
  { code: "CMU", quote: "wish they’d just say what they’re best at", id: "EV-4482" },
];

/* ---- STAGE 02 · SYNTHESIZE ---- */
export const synthesizeStage: EngineStage = {
  no: "02",
  name: "Synthesize",
  verb: "The engine",
  heading: "Millions of words collapse into one thing you didn’t know.",
  body: "Anyone can summarise. The wedge is reading the emotion underneath — clustering the noise of every source, dissolving what doesn’t hold, and converging on the one perception that keeps recurring. Everything before this stage feeds it; everything after depends on it.",
  marginNote: "noise → signal → one read",
  readouts: [
    { label: "Signals in", value: "12,904" },
    { label: "Clusters held", value: "4" },
    { label: "Confidence", value: "91%" },
  ],
  caption: {
    strong: "FIG. 3.2 · SYNTHESIS",
    rest: " — 12,904 signals, resolving to four patterns and one blind spot.",
  },
};

/** The clusters the engine resolves the noise into (positions are 0–1). */
export const synthClusters: SynthCluster[] = [
  { label: "Trusted", count: "4,120", x: 0.24, y: 0.32 },
  { label: "Worth it", count: "2,880", x: 0.72, y: 0.28 },
  { label: "For people like me", count: "3,010", x: 0.3, y: 0.72 },
  { label: "Not exciting", count: "2,894", x: 0.7, y: 0.7, signal: true },
];

export const synthReadout = {
  phases: ["Noise", "Clustering", "Convergence"],
  noiseLabel: "12,904 signals · unsorted",
  convergeLabel: "1 perception · the blind spot",
  blindSpot: "Trusted, not wanted",
  method: "METHOD · SS-SYNTH · emotion-weighted clustering",
};

/* ---- STAGE 03 · ACTIVATE ---- */
export const activateStage: EngineStage = {
  no: "03",
  name: "Activate",
  verb: "Output",
  heading: "Perception isn’t a report to file — it’s a lever.",
  body: "One read on how the market feels, translated into the artefacts that move it. Every deliverable traces back to the same perception, so positioning, messaging and campaign all say one coherent thing.",
  marginNote: "insight → the way you speak",
  readouts: [
    { label: "Traced to", value: "1 perception" },
    { label: "Artefacts", value: "8" },
    { label: "Turnaround", value: "10 days" },
  ],
  caption: {
    strong: "FIG. 3.3 · ACTIVATION",
    rest: " — one perception, generated into eight decision-ready artefacts.",
  },
};

/** The deliverables generated from the single perception. */
export const deliverables: Deliverable[] = [
  {
    title: "Positioning document",
    ref: "SS-POS",
    version: "v1.2",
    note: "Own “trusted”, take back “wanted”.",
    primary: true,
  },
  {
    title: "Messaging framework",
    ref: "SS-MSG",
    version: "v1.0",
    note: "Lead with desire, not features.",
  },
  {
    title: "Research report",
    ref: "SS-RPT",
    version: "v2.1",
    note: "12,904 signals, fully sourced.",
  },
  {
    title: "Competitive comparison",
    ref: "SS-CMP",
    version: "v1.1",
    note: "Where rivals out-feel you.",
  },
  {
    title: "Executive summary",
    ref: "SS-EXE",
    version: "v1.0",
    note: "The blind spot, in one page.",
  },
  {
    title: "Campaign strategy",
    ref: "SS-CAM",
    version: "v1.0",
    note: "Move the feeling, not the facts.",
  },
  {
    title: "Presentation deck",
    ref: "SS-DCK",
    version: "v1.3",
    note: "The story, board-ready.",
  },
  {
    title: "Brand recommendation",
    ref: "SS-BRD",
    version: "v1.0",
    note: "How to sound like the choice.",
  },
];

/** Stage 03 — the business surfaces one perception moves. Each radiates from
 *  the perception core in the engine figure. One insight; many outcomes. */
export const engineOutcomes: EngineOutcome[] = [
  { label: "Positioning", ref: "SS-POS", primary: true },
  { label: "Messaging", ref: "SS-MSG" },
  { label: "Campaign", ref: "SS-CAM" },
  { label: "Landing page", ref: "SS-LND" },
  { label: "Website", ref: "SS-WEB" },
  { label: "Sales", ref: "SS-SAL" },
  { label: "Pricing", ref: "SS-PRC" },
  { label: "Product", ref: "SS-PRD" },
  { label: "Experience", ref: "SS-CX" },
];

/** The engine's identity apparatus — printed on the figure header and footer,
 *  and on the reduced-motion still. */
export const engineMeta: EngineMeta = {
  figLeft: "FIG. 03 · THE PERCEPTION ENGINE",
  figRight: "SS-ENGINE · v3.1",
  status: "Reading",
  scrollHint: "Scroll to run the engine",
  method: "METHOD · SS/PMF-04 · emotion-weighted synthesis",
  staticCaption: {
    strong: "FIG. 03 · THE PERCEPTION ENGINE",
    rest: " — scattered opinion in, one defensible perception out, branched into the decisions it moves. Enable motion to run the engine.",
  },
};

/* ============ TRANSCRIPT ============ */
export const transcript = {
  folio: {
    left: "From the Transcript · SS-0442-17",
    right: "Verbatim · Logged 06 Jul 2026",
  },
  quoteLead:
    "“They kept telling me it was the premium one. Honestly? I just thought it was the one I could never figure out — so I went with ",
  penText: "the boring option I understood",
  quoteTail: ".”",
  attribution: "Verified respondent · 31 · evaluated, did not buy",
};

/* ============ MULTIPLIER ============ */
export const multiplierOpener: SectionOpener = {
  folio: { left: "SS · ISSUE 01 · CHAPTER 04", right: "P. 07" },
  kicker: "The Multiplier",
  kickerNo: "· 04",
  heading: {
    lead: "Perception only means something next to someone else.",
  },
  standfirst:
    "How the market feels about you in isolation is interesting. How it feels about you relative to the alternatives is what you can actually act on.",
};

export const perceptionPanelLabel = "Emotional perception · Not features";

export const absoluteBars: PerceptionBar[] = [
  { label: "Feels trustworthy", value: 72 },
  { label: "Feels exciting", value: 40 },
  { label: "Feels worth the price", value: 55 },
  { label: "Feels “for people like me”", value: 48 },
];

export const absoluteRead = {
  label: "Absolute read",
  text: "Solid on trust, soft on excitement. Interesting — but you still don’t know if that’s good.",
  marginNote: "good compared to… what?",
};

export const relativeGroups: RelativeGroup[] = [
  {
    label: "Feels trustworthy",
    delta: "You lead +17",
    you: 72,
    rival: 55,
    category: 58,
  },
  {
    label: "Feels exciting to want",
    delta: "You trail −34",
    trailing: true,
    you: 40,
    rival: 74,
    category: 52,
  },
  {
    label: "Feels worth the price",
    delta: "Even −5",
    you: 55,
    rival: 60,
    category: 57,
  },
  {
    label: "Feels “for people like me”",
    delta: "You trail −18",
    trailing: true,
    you: 48,
    rival: 66,
    category: 55,
  },
];

export const relativeRead = {
  label: "Relative read",
  text: "You out-trust the field but lose on desire — Rival A feels more exciting for less. That’s the move: convert trust into want.",
  marginNote: "now it’s actionable",
};

export const multiplierCaption = {
  strong: "FIG. 02",
  rest: " — Emotional perception, read two ways.",
};

/* ============ SOURCES ============ */
export const sourcesOpener: SectionOpener = {
  folio: { left: "SS · ISSUE 01 · CHAPTER 05", right: "P. 09" },
  kicker: "Always Listening",
  kickerNo: "· 05",
  heading: {
    lead: "Wherever your customers already speak, we’re already there.",
  },
  standfirst:
    "We don’t ask the market to fill in a form. We meet it where it’s most honest — then pull every channel toward one reading.",
  dropcap: true,
};

export const sources: LeaderItem[] = [
  { num: "01", name: "Product reviews", tag: "Rated · Verbatim", arrow: true },
  { num: "02", name: "Reddit", tag: "Candid · Threaded", arrow: true },
  { num: "03", name: "Discord", tag: "Real-time · Community", arrow: true },
  { num: "04", name: "Community forums", tag: "Niche · Deep", arrow: true },
  {
    num: "05",
    name: "Support tickets",
    tag: "Friction · First-hand",
    arrow: true,
  },
  { num: "06", name: "Sales calls", tag: "Objections · Intent", arrow: true },
  { num: "07", name: "Churn feedback", tag: "Why they left", arrow: true },
  {
    num: "08",
    name: "Public social",
    tag: "Unprompted · At scale",
    arrow: true,
  },
  {
    num: "09",
    name: "App store reviews",
    tag: "Sentiment · Coded",
    arrow: true,
  },
  {
    num: "10",
    name: "Customer interviews",
    tag: "Qualitative · 1:1",
    arrow: true,
  },
];

export const tickerLead = "→ Flowing to Survey Surf";
export const tickerItems: string[] = [
  "Product reviews",
  "Reddit",
  "Discord",
  "Community forums",
  "Support tickets",
  "Sales calls",
  "Churn feedback",
  "Public social",
  "App reviews",
  "Customer interviews",
];

/* ============ DOSSIER ============ */
export const dossierOpener: SectionOpener = {
  folio: {
    left: "SS · ISSUE 01 · CHAPTER 06 · BOUND SUPPLEMENT",
    right: "P. 11",
  },
  kicker: "What You Receive",
  kickerNo: "· 06",
  heading: { lead: "You don’t get a dashboard. You get a dossier." },
  standfirst:
    "Not a login and a pile of charts to interpret. A finished research file — read like a document, built to be read in the room where you decide.",
};

export const dossierDocCells = [
  { label: "Confidential", strong: true },
  { label: "Perception File SS-0442", strong: true },
  { label: "D2C Brand" },
  { label: "10 Sources" },
  { label: "CI 95% — Fieldwork 9 days" },
  { label: "n=1,240" },
];

export const dossierTabs = [
  { id: "dp1", label: "The Blind Spot" },
  { id: "dp2", label: "Emotional Map" },
  { id: "dp3", label: "Competitive Perception" },
  { id: "dp4", label: "Messaging" },
] as const;

export const dossierBlindSpot = {
  heading: {
    lead: "The market doesn’t distrust you.",
    em: "It can’t picture itself using you.",
  },
  body: "You’ve been closing the trust gap that doesn’t exist. Across all ten sources, the real drag is belonging — “not for someone like me.” Speak to identity, not credibility, and the number moves.",
  table: {
    head: ["Sample", "Confidence", "Emotion gap"],
    row: ["1,240", "94%", "Belonging"],
  },
  marginNote: "← the one thing they never told you",
};

export const dossierEmotionalMap = {
  figHead: { title: "Dominant Emotions", right: "Coded from 10 sources" },
  bars: [
    { label: "Reassurance", sub: "“safe choice”", value: 68 },
    { label: "Exclusion", sub: "“not for me”", value: 42 },
    { label: "Confusion", sub: "“couldn’t tell what it’s for”", value: 37 },
  ],
  indexTermsLabel: "Index terms",
  indexTerms: "“overwhelming” · “for experts” · “not for me” · “safe”",
  caption: {
    strong: "FIG. 03",
    rest: " — Dominant emotions, coded from 10 sources.",
  },
};

export const dossierCompetitive = {
  figHead: {
    title: "Competitive Perception",
    right: "Axes: Wanted ↑ / Trusted →",
  },
  read: {
    label: "How to read it",
    text: "You’re the most trusted, least wanted name in the set. Rival A is less trusted but far more desired — and winning. Trust is your asset; desire is your unlock.",
  },
  caption: {
    strong: "FIG. 04",
    rest: " — Competitive perception. Axes: Wanted ↑ / Trusted →.",
  },
};

export const dossierMessaging = {
  today: {
    kicker: "Today you say",
    quote: "“The most trusted platform in the category.”",
    verdict: "Speaks to a gap that isn’t there",
  },
  opportunity: {
    kicker: "The opportunity",
    quote: "“Made for people who thought this wasn’t for them.”",
    verdict: "Closes the belonging gap",
  },
  caption: { strong: "FIG. 05", rest: " — The correction, drafted." },
  campaignsLabel: "Recommended campaigns",
  campaigns: [
    { num: "i", name: "“First-timers,”", arrow: true },
    { num: "ii", name: "“Not the expert’s tool,”", arrow: true },
    { num: "iii", name: "“Your first week.”", arrow: true },
  ] as LeaderItem[],
};

/* ============ PHILOSOPHY ============ */
export const philosophyOpener: SectionOpener = {
  folio: { left: "SS · ISSUE 01 · CHAPTER 07 · CORRECTIONS", right: "P. 13" },
  kicker: "Our Stance",
  kickerNo: "· 07",
  heading: { lead: "What we are — and what we refuse to be." },
};

export const corrections: Correction[] = [
  {
    refusal: "We don’t predict the future.",
    assertion: "We reveal the present.",
  },
  {
    refusal: "We don’t replace your strategy.",
    assertion: "We reveal your perception.",
  },
  {
    refusal: "We don’t tell you what to build.",
    assertion: "We tell you what the market already believes.",
  },
];

/* ============ BACK COVER ============ */
/* ============ COLOPHON — the closing page of the dossier ============ */
export const colophon = {
  folio: { left: "SS · ISSUE 01 · BACK COVER", right: "COLOPHON" },
  statement: ["The market has already decided.", "Now it’s your turn."],
  lede: "Survey Surf is the perception company. We read the signals your customers already leave behind — across reviews, communities, tickets and calls — and return the one belief the market holds but has never said to your face.",
  primaryCta: { label: "See your blind spot", href: "/contact" },
  secondaryCta: { label: "Book a discovery call", href: "/contact" },
  brand: {
    wordmark: "SURVEY · SURF",
    tagline: "The Perception Company.",
    line: "Helping companies discover what customers already believe.",
  },
  navLabel: "Navigation",
  contactLabel: "Contact",
  strip: {
    left: "© 2026 Survey Surf",
    center: "Delhi, India",
    right: "Built for companies that want to understand perception before scaling.",
  },
};
