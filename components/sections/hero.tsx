import { ConversationStream } from "@/components/figures/conversation-stream";
import { Slip } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PenMark } from "@/components/ui/pen-mark";
import { Reveal } from "@/components/ui/reveal";
import { hero } from "@/lib/content";

/**
 * The cover. A true split on a black field: an editorial lede on the left,
 * beside FIG. A — the conversation stream that proves it. The headline makes
 * the claim; on the right, millions of scattered customer opinions drift, emit
 * thin streams of light, and converge — like rivers joining — into the one
 * perception the market already holds. Sibero does not generate the
 * insight; it reveals the one that already exists.
 */
export function Hero() {
  return (
    <section
      className="hero-cover"
      data-dark-hero
      aria-label="Sibero — the perception company"
    >
      <Container className="hero-cover-in">
        <div className="hero-lede">
          <Reveal as="p" className="hero-eyebrow">
            {hero.caseFile}
          </Reveal>

          <Reveal
            as="h1"
            className="h1 hero-title"
            style={{ transitionDelay: "0.06s" }}
          >
            {/* Three explicit clauses, one line each — the claim never wraps.
                The emphasis is almost invisible by design: one word of extra
                weight, a phrase warmed off the ivory, and a signature lifted a
                notch into copper. No gradients, no second colour. */}
            <span className="htl">
              {hero.heading.open}{" "}
              <span className="htl-warm">
                <span className="htl-strong">{hero.heading.strong}</span>{" "}
                {hero.heading.warm}
              </span>
            </span>
            <span className="htl htl-claim">{hero.heading.claim}</span>
            <PenMark variant="underline">
              {hero.heading.signOff}{" "}
              <span className="htl-brand">{hero.heading.brand}</span>
            </PenMark>
          </Reveal>

          <Reveal
            as="p"
            className="hero-standfirst"
            style={{ transitionDelay: "0.14s" }}
          >
            {hero.standfirst}
          </Reveal>

          <Reveal className="hero-actions" style={{ transitionDelay: "0.22s" }}>
            <Slip href={hero.primaryCta.href} className="slip--paper">
              {hero.primaryCta.label}
              {"  →"}
            </Slip>
            <Slip href={hero.secondaryCta.href} tone="ink">
              {hero.secondaryCta.label}
            </Slip>
          </Reveal>

          <Reveal
            as="dl"
            className="hero-metrics"
            style={{ transitionDelay: "0.3s" }}
          >
            {hero.metrics.map((metric) => (
              <div className="hero-metric" key={metric.caption}>
                <dt className="hero-metric-val">{metric.value}</dt>
                <dd className="hero-metric-cap">{metric.caption}</dd>
              </div>
            ))}
          </Reveal>
        </div>

        {/* FIG. A — the conversation stream: drifting opinion chips (HTML) +
            converging streams of light (canvas) resolving into one fixed
            perception card. Entirely live-coded, never a screenshot. */}
        <div className="hero-exhibit-col">
          <ConversationStream />
        </div>
      </Container>
    </section>
  );
}
