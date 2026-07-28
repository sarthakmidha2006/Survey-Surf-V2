/**
 * Shared domain & content types.
 * Content is modelled as data so copy can be edited (or later moved to a CMS)
 * without touching component markup.
 */

/** The chapter line: issue reference (left) and page number (right). */
export interface Folio {
  left: string;
  right: string;
}

/** A heading split into a lead clause and an optional emphasized clause. */
export interface Heading {
  lead: string;
  em?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface CtaLink {
  label: string;
  href: string;
}

/* ---------- Section: header / opener ---------- */
export interface SectionOpener {
  /** The chapter line. Omitted by openers that carry no page furniture. */
  folio?: Folio;
  /** The running label above the headline. Omitted by openers that open on the
   *  headline alone, with nothing standing above it. */
  kicker?: string;
  heading: Heading;
  standfirst?: string;
  dropcap?: boolean;
  marginNote?: string;
}

/* ---------- Chapter seam — the editorial bridge between chapters ----------
   The connective tissue in the whitespace where one chapter ends and the next
   begins: a centered issue marker on a hairline, a line that concludes the
   chapter just read, and a forward teaser that is a real jump-link into the
   next chapter. It carries no chapter number or running head, and never
   restates the next headline — it sets it up, so the reading stays continuous. */
export interface ChapterSeam {
  /** Centered marker sitting on the hairline, e.g. "SB · ISSUE 01". */
  issue: string;
  /** A closing line that concludes the chapter just read. */
  leadOut: string;
  /** The forward pull into the next chapter — a hook, not the next headline. */
  teaser: string;
  /** Anchor href of the next chapter, for the jump link (e.g. "#blindspot"). */
  nextHref: string;
}

/* ---------- Hero (the cover) ---------- */

/** A single standing figure in the hero's trust row. */
export interface HeroMetric {
  value: string;
  caption: string;
}

/** The cover headline, set as three clauses so each holds its own line and the
 *  editorial emphasis is carried by the content, not by markup in the section.
 *  Line 1 reads `open` + `strong` + `warm`; line 2 is `claim`; line 3 is
 *  `signOff` + `brand`. */
export interface HeroHeading {
  /** Line 1, plain — e.g. "Listen". */
  open: string;
  /** Line 1, the one word that takes the extra weight — e.g. "Beyond". */
  strong: string;
  /** Line 1, the rest of the warmed phrase — e.g. "the Noise.". */
  warm: string;
  /** Line 2 — the claim. Sized to hold one line; never wraps on desktop. */
  claim: string;
  /** Line 3, plain — e.g. "with". */
  signOff: string;
  /** Line 3, the signature: carries the pen mark and the copper accent. */
  brand: string;
}

export interface HeroContent {
  /** The eyebrow — e.g. "CASE FILE 001". */
  caseFile: string;
  /** Three-clause headline; `brand` carries the pen underline. */
  heading: HeroHeading;
  standfirst: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  /** The trust row beneath the calls to action. */
  metrics: HeroMetric[];
}

/* ---------- Hero scene (FIG. A — the perception apparatus) ----------
   The cover visualization: millions of scattered signals stream through a
   precision optical lens and resolve into one clear perception. All copy and
   the source list live here; the apparatus geometry (particle field, converging
   beam, red verdict point) is generated in the figure itself. */

/** Which glyph rides on a source chip in the intake stream. */
export type HeroSourceIcon =
  | "reviews"
  | "reddit"
  | "ticket"
  | "g2"
  | "sales"
  | "interview"
  | "forum"
  | "social"
  | "appstore"
  | "calls"
  | "more";

/** One raw signal source, listed as a chip on the chaotic (left) side. */
export interface HeroSource {
  label: string;
  icon: HeroSourceIcon;
}

/** A titled caption card floating over the apparatus. */
export interface HeroSceneLabel {
  title: string;
  detail: string;
}

/** A running-ledger stat in the bottom-right panel. `value` optional — the
 *  final row ("Updated Daily") is a standalone label. */
export interface HeroSceneStat {
  label: string;
  value?: string;
}

export interface HeroSceneContent {
  /** The intake stream — every place the market speaks. */
  sources: HeroSource[];
  /** Top-left caption: the chaos entering the lens. */
  chaos: HeroSceneLabel;
  /** Top-right caption: the clarity leaving it. */
  clarity: HeroSceneLabel;
  /** Bottom-right ledger panel. */
  stats: HeroSceneStat[];
}

/* ---------- Conversation stream (FIG. A — the cover exhibit) ----------
   The cover visualization: thousands of scattered customer opinions drift on
   the left — a readable foreground of headline opinions over a far deeper,
   blurred murmur — each emitting thin converging streams of light that resolve,
   on the far right, into one fixed market verdict. All copy lives here; the flow
   geometry and particle field are generated in the figure itself. */

/** One measured reading: a small label over a large figure. */
export interface PerceptionReading {
  label: string;
  value: string;
  /** Unit trailing the figure in a smaller face — "2.3M" + "signals". */
  unit?: string;
  /** Qualitative readings ("Very High") are set in the app face, not as figures. */
  qualitative?: boolean;
}

/** A titled prose section of the report — a small-caps label over one statement. */
export interface PerceptionSection {
  label: string;
  body: string;
}

/** The report's conclusion: a label, and the call itself. */
export interface PerceptionVerdict {
  label: string;
  value: string;
}

/**
 * The deliverable, modelled as what it is: the first page of a confidential
 * market-intelligence report. A masthead, a one-sentence executive summary, four
 * measured readings, the primary insight, the recommended action, and the call —
 * listed in the order they are generated when the output beam reaches the report.
 *
 * Nothing here implies software: no panels, no tiles, no chrome. The figure sets
 * it with horizontal rules and whitespace only.
 */
export interface PerceptionCard {
  /** The masthead, e.g. "Market Verdict". Set in caps, one word to a line. */
  title: string;
  /** The one-sentence executive summary, set as a standfirst under the masthead. */
  standfirst: string;
  /** The four readings: confidence, volume analysed, sources, signal strength. */
  readings: PerceptionReading[];
  /** The single most consequential thing the analysis found. */
  insight: PerceptionSection;
  /** What to do about it. */
  action: PerceptionSection;
  /** The call. */
  verdict: PerceptionVerdict;
}

export interface ConversationStreamContent {
  /** The 10–15 headline opinions that carry the readable foreground. */
  phrases: string[];
  /** The distant murmur — background conversation, never meant to be read. */
  murmur: string[];
  /** The single verdict the stream converges into. */
  perception: PerceptionCard;
}

/* ---------- Evidence board (FIG. A — the cover exhibit) ----------
   The hero's centerpiece: a war-room wall of real signals — reviews,
   threads, tickets, interviews, charts — pinned to a warm-charcoal wall,
   gathered by the editor's red thread into one perception (the KEY FINDING).
   Card copy is real; each card's position/tilt is tuned by eye (percentages
   of the stage), so the whole composition tracks the responsive layout. */

export type ExhibitKind =
  | "review" // star-rated review card
  | "reddit" // community thread with upvotes
  | "ticket" // support ticket
  | "interview" // interview / call note
  | "note" // handwritten sticky
  | "chart-line" // sentiment trend
  | "chart-bar" // simple comparison bars
  | "chart-donut" // competitive share
  | "scrap" // small aged paper scrap — density filler, mostly scribble
  | "sticky"; // dark warm sticky note — density filler

/** Aged-paper tone of a card, so no two neighbours read identical. */
export type PaperTone = "cream" | "tan" | "manila" | "white" | "gray";

/** How a card is fixed to the wall — and where the fixing sits. */
export type PinStyle = "red" | "dark" | "silver" | "none";
export type PinAt = "left" | "center" | "right";

export interface ExhibitCard {
  id: string;
  kind: ExhibitKind;
  /** Source label printed on the card header, e.g. "G2 Review". */
  source?: string;
  /** Small header meta — rating text, upvotes, ticket ref, mentions. */
  meta?: string;
  /** The verbatim / note / caption. */
  quote?: string;
  /** A substring of `quote` to highlight (the phrase that becomes a signal). */
  highlight?: string;
  /** Rating 0–5, for review cards. */
  rating?: number;
  /** Chart datum: a percentage the figure resolves to (0–100). */
  value?: number;
  /** Placement on the stage (percent) and slight physical tilt (degrees). */
  x: number;
  y: number;
  w: number;
  rotate: number;
  /** Stacking order on the wall (higher sits on top). */
  z?: number;
  /** A red thread runs from this card down into the finding. */
  thread?: boolean;
  /** Deep-background cards read softer, out of focus. */
  faded?: boolean;
  /** Aged-paper tone. Defaults to a warm cream. */
  tone?: PaperTone;
  /** Pin / tack style. Defaults to a dark tack; signals wear a red one. */
  pin?: PinStyle;
  /** Where the pin sits along the top edge. Defaults to left. */
  pinAt?: PinAt;
  /** Fixed with a strip of tape across the top instead of a pin. */
  tape?: boolean;
  /** Lifts a curled bottom-right corner off the wall. */
  curl?: boolean;
  /** Overlays a handwritten ink scrawl (variant index 0–3). */
  scrawl?: number;
}

/** A handwritten margin annotation scrawled between the cards. */
export interface BoardAnnotation {
  text: string;
  x: number;
  y: number;
  rotate: number;
}

/** An illegible handwritten pen-mark scrawled on the wall (SVG, decorative). */
export interface BoardScrawl {
  /** Preset squiggle path index (0–3). */
  variant: number;
  x: number;
  y: number;
  rotate: number;
  /** Relative scale of the mark. Defaults to 1. */
  scale?: number;
}

export interface EvidenceBoardContent {
  /** Small label printed above the board. */
  caption: string;
  keyFinding: {
    label: string;
    lead: string;
    em: string;
    /** Confidence percentage that counts up on reveal. */
    confidence: number;
    updated: string;
  };
  stats: { label: string; value: string }[];
  annotations: BoardAnnotation[];
  /** Decorative illegible pen-marks scattered across the wall. */
  scrawls?: BoardScrawl[];
  cards: ExhibitCard[];
}

/* ---------- Hero exhibit (FIG. A — the evidence board) ---------- */
export interface ExhibitChip {
  /** A verbatim customer opinion — the raw material. */
  quote: string;
  /** Where the opinion was found (REVIEW, REDDIT, TICKET…). */
  source: string;
  /** Marked chips are "signals" the red thread converges through. */
  signal?: boolean;
  /** The editor's pen treatment applied to a signal. */
  mark?: "underline" | "circle";
}

export interface HeroExhibit {
  overline: string;
  headLeft: string;
  headRight: string;
  chips: ExhibitChip[];
  verdict: {
    label: string;
    confidence: string;
    lead: string;
    em?: string;
    sub: string;
  };
  caption: string;
  captionStrong: string;
  captionRight: string;
}

/* ---------- Hero photograph (FIG. A — the evidence wall) ----------
   The redesigned hero visual: a duotoned photograph of the market's own
   words — thousands of verbatim signals — with the editor's pen laid over
   it. Two verbatims are pulled from the wall and pinned; a single red thread
   gathers them into the one perception the market holds but never said. */

/** A verbatim slip pinned onto the photograph. `at` is the slip's own
 *  position; `to` is the point on the wall its leader line reaches back to.
 *  Both are percentages of the plate (x → width, y → height). */
export interface HeroPin {
  code: string; // exhibit reference, e.g. "EX.02"
  source: string; // where the opinion was found (REDDIT, CHURN…)
  quote: string; // the verbatim itself
  mark: "underline" | "circle"; // the pen treatment
  at: { x: number; y: number };
  to: { x: number; y: number };
  rotate: number; // slight physical tilt, in degrees
}

export interface HeroPhoto {
  overline: string;
  /** The image and its alt text. */
  image: { src: string; alt: string };
  figLabel: string; // "FIG. A"
  figTitle: string; // "THE EVIDENCE"
  figRight: string; // "1,240 CONVERSATIONS"
  measure: string; // margin measurement note, e.g. "n = 1,240 · 10 SOURCES"
  /** The red thread's control points (percentages), gathering the pins into
   *  the verdict. Measured by eye against the composition, not the DOM. */
  thread: { x: number; y: number }[];
  pins: HeroPin[];
  verdict: {
    label: string;
    confidence: string;
    lead: string;
    em?: string;
    sub: string;
  };
  caption: string;
  captionStrong: string;
  captionRight: string;
}

/* ---------- Proof band ---------- */
export interface ProofCell {
  kind: "number" | "phrase";
  value: string;
  caption: string;
}

/* ---------- The Gap · FIG. 01 — Perception Deviation (a levelling run) ---------- */

/** One attribute measured on the levelling run. `belief` is the word the
 *  company uses for itself; `reality` is the word the market lands on; `dev`
 *  is the 0–100 perception deviation between them — the size of the gap. */
export interface GapDeviationRow {
  belief: string;
  reality: string;
  dev: number;
}

/** The perception-deviation exhibit. A calibrated levelling run: belief on the
 *  left, market reality on the right, the measured gap marked in red down the
 *  centre. It carries no figure number — the exhibit IS the section's argument,
 *  not an illustration filed beside it. */
export interface GapInstrumentContent {
  /** The three column headings — self perception, the gap, market reality. */
  leftLabel: string;
  axisLabel: string;
  rightLabel: string;
  rows: GapDeviationRow[];
  /** The closing finding: label, value, unit, and its plain-language reading. */
  indicatorLead: string;
  indicatorValue: string;
  indicatorUnit: string;
  indicatorSub: string;
}

/* ---------- The Gap ---------- */
export interface GapContent {
  opener: SectionOpener;
  /** The perception-deviation exhibit — the chapter's whole argument. */
  instrument: GapInstrumentContent;
}

/* ---------- Blind Spot Matrix ----------
   Each room now holds only what the reader needs to place it and believe it.
   The file references, source chips, sentiment read-outs and summary tiles that
   used to sit inside these shapes were dashboard furniture; they have been
   removed rather than hidden, so the type is the whole room. */

/** One of the three "apparatus" rooms in the perception instrument. */
export interface JohariQuad {
  id: string;
  /** Grid slot — top-left, top-right, bottom-left, bottom-right. */
  pos: "tl" | "tr" | "bl" | "br";
  /** The one-word triage verdict — IGNORE / STUDY / UNKNOWN. */
  priority: string;
  /** Swatch key — drives the room's chip treatment. */
  swatch: "ignore" | "study" | "unknown" | "critical";
  /** Axis read-out, e.g. "YOU KNOW · THEY KNOW". */
  coord: string;
  name: string;
  tag: string;
  body: string;
  quote: { text: string; source: string };
  /** Handwritten red margin note, revealed on focus. */
  note: string;
}

/** The dark, dominant case-file room — authored as its own richer shape. */
export interface JohariBlind {
  priority: string;
  coord: string;
  name: string;
  tag: string;
  dialogue: { dt: string; dd: string }[];
  quote: { text: string; source: string };
  /** Signal confidence, 0–100 — the room's one and only meter. */
  confidence: number;
  confidenceLabel: string;
}

export interface DialogueLine {
  speaker: string;
  line: string;
}

export interface JohariFile {
  id: string;
  head: {
    label: string;
    right: string;
    priority?: string;
    confidential?: boolean;
  };
  terms?: string[];
  verbatims: { label: string; quote: string }[];
  dialogue?: DialogueLine[];
  verdict?: { built: string; feel: string };
  statsRows: { text: string; strong?: boolean }[][];
}

/* ---------- Method ---------- */

/**
 * One stage of the perception engine, told as scrollytelling. Each stage
 * drives the sticky visualization to a matching state as it reaches the
 * viewport centre (scattered → grid → clusters → merge → one red point).
 */
export interface MethodStage {
  /** Stage number, e.g. "01" — printed by the live marker. */
  no: string;
  /**
   * The editorial name for the stage, e.g. "The raw voice". Currently not
   * rendered: the marker states the stage once, in the left column, and
   * printing it again over the explanation duplicated it on screen. Kept
   * because it is the chapter's own language for each stage.
   */
  label: string;
  /**
   * The engine's own name for the stage — one terse word for the live marker,
   * in the register of a system readout rather than editorial copy (e.g.
   * "Intake"). It must describe what the instrument is doing in that state.
   */
  rail: string;
  /** Display heading. */
  heading: string;
  /** One short reading paragraph. */
  body: string;
}

/* ---------- Method — the perception engine ---------- */

/** One labelled node on the pipeline legend (opinions → … → campaign). */
export interface EngineFlowNode {
  label: string;
  /** The stage this node belongs to: 1 collect, 2 synthesize, 3 activate. */
  stage: 1 | 2 | 3;
}

/** A shared stage descriptor — folio, name, heading, body, annotations. */
export interface EngineStage {
  no: string;
  name: string;
  verb: string;
  heading: string;
  body: string;
  /** Small research annotations printed alongside the stage figure. */
  readouts: { label: string; value: string }[];
  marginNote?: string;
  caption: { strong: string; rest: string };
}

/** A listening channel shown in the intake header (Reddit, Reviews, …). */
export interface IntakeSource {
  name: string;
  /** Short uppercase code shown on streamed rows (RVW, RDT, TKT…). */
  code: string;
}

/** A single opinion arriving on the intake stream. */
export interface IntakeSample {
  code: string;
  quote: string;
  id: string;
}

/** A cluster the synthesis engine resolves the noise into. */
export interface SynthCluster {
  label: string;
  count: string;
  /** 0–1 position of the cluster centre within the engine field. */
  x: number;
  y: number;
  /** Marks whether this cluster is the emergent blind spot (red). */
  signal?: boolean;
}

/** A deliverable generated from the single perception. */
export interface Deliverable {
  title: string;
  ref: string;
  version: string;
  /** A short line describing the artefact. */
  note: string;
  /** The headline output — carries the pen. */
  primary?: boolean;
}

/** A business surface the single perception branches into (Stage 03). Each
 *  becomes a node radiating from the perception core in the engine figure. */
export interface EngineOutcome {
  label: string;
  ref: string;
  /** The headline outcome — carries the pen (red). */
  primary?: boolean;
}

/** The engine's identity + running apparatus, shared by header and footer. */
export interface EngineMeta {
  figLeft: string;
  figRight: string;
  status: string;
  scrollHint: string;
  method: string;
  /** Reduced-motion / no-JS caption printed under the static figure. */
  staticCaption: { strong: string; rest: string };
}

/* ---------- The turn (the emotional midpoint of the issue) ----------------
   ONE typographic block of two balanced lines: the premise, then the line
   that overturns it. The lines are modelled as lines — not as two objects —
   because the eye has to run out of the first straight into the second. The
   second is split only so that its last word can take the single accent. */
export interface Statement {
  /** Line one. Same voice, same size as line two: this is one block. */
  lineOne: string;
  /** Line two, split only to colour its final word. */
  lineTwo: {
    lead: string;
    /** The one accented word in the section. */
    accent: string;
  };
}

/* ---------- Multiplier (perception bars) ---------- */
export interface PerceptionBar {
  label: string;
  value: number;
}

export interface RelativeGroup {
  label: string;
  delta: string;
  trailing?: boolean;
  you: number;
  rival: number;
  category: number;
}

/* ---------- Leader-row lists (sources, indexes, campaigns) ---------- */
export interface LeaderItem {
  num: string;
  name: string;
  tag?: string;
  arrow?: boolean;
}

/* ---------- Signal sources (Always Listening — the intake) ---------- */

/**
 * One channel the market speaks through. `note` is the reason it earns its
 * place (kept to a few words); `kind` splits the intake into the two halves the
 * listening map brackets — solicited feedback vs. what is said unprompted.
 */
export interface SignalSource {
  name: string;
  note: string;
  kind: "structured" | "unprompted";
}

/* ---------- Listening floor (Always Listening — the sources monitor) ---------- */

/** One monitored source cell on the listening floor. */
export interface MonitorSource {
  name: string; // "Reddit"
  code: string; // "RDT"
  category: string; // "Community"
  /** Baseline signals collected (display integer). Ticks up while live. */
  signals: number;
  /** Collection confidence, 0–100. */
  confidence: number;
  /** Seven recent-activity levels (0–1), drawn as a static sparkline. */
  activity: number[];
}

/** A verbatim fragment arriving on the live collection feed. */
export interface StreamFragment {
  code: string; // source code shown on the row, e.g. "G2"
  source: string; // human label, e.g. "G2 Review"
  quote: string; // the verbatim, in the customer's words
  id: string; // collection id, e.g. "EV-4471"
  lang: string; // detected language, e.g. "EN"
  confidence: number; // 0–100
  /** English gloss shown under non-English verbatims. */
  gloss?: string;
}

/** A visualized scale / trust claim — a display value with an optional unit. */
export interface ScaleStat {
  value: string;
  em?: string;
  caption: string;
}

/** The whole "Always Listening" monitoring wall, modelled as data. */
export interface ListeningContent {
  monitor: {
    statusLabel: string; // "Live collection"
    statusNote: string; // "listening now"
    coverage: string; // "24 sources · always active"
    ref: string; // "SB-LSN · v4.2"
    freshLabel: string; // "Updated"
  };
  gridLabel: string; // "Monitored sources"
  moreLabel: string; // "+8 more"
  streamLabel: string; // "Collected"
  streamNote: string; // "live feed"
  sources: MonitorSource[];
  stream: StreamFragment[];
  converge: {
    lead: string; // "The internet is already speaking."
    em: string; // "Sibero is already listening."
    totalLabel: string; // "signals collected today"
    total: number; // running baseline
  };
  caption: { strong: string; rest: string };
  scale: ScaleStat[];
  scaleFoot: string; // "Global coverage · 27 regions · …"
}

/* ---------- Dossier ---------- */
export interface DossierDocCell {
  label: string;
  strong?: boolean;
}

/* ---------- Philosophy ---------- */
export interface Correction {
  refusal: string;
  assertion: string;
}

/* ---------- Server action result envelope ---------- */
export type ActionState<T = undefined> =
  | { status: "idle" }
  | { status: "success"; message: string; data?: T }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string[]>;
    };
