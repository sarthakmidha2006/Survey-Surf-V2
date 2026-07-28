import { Slip } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { methodInvite } from "@/lib/content";

/**
 * The bridge to the methodology page. Closes the front page once the value
 * proposition is made: a single premium invitation — a lead-in question, one
 * plain statement, a short lede and one CTA — that carries the interested
 * reader into the full method rather than lengthening the homepage.
 */
export function MethodInvite() {
  return (
    <section className="method-invite" aria-label="Explore the Sibero method">
      <Container>
        <Reveal className="mi-in">
          <p className="mi-eyebrow">{methodInvite.eyebrow}</p>
          <p className="mi-statement">{methodInvite.statement}</p>
          <p className="mi-lede">{methodInvite.lede}</p>
          <Slip href={methodInvite.cta.href} className="mi-cta">
            {methodInvite.cta.label} <span aria-hidden="true">→</span>
          </Slip>
        </Reveal>
      </Container>
    </section>
  );
}
