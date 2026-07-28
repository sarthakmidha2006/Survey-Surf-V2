import { Reveal } from "@/components/ui/reveal";
import { statement } from "@/lib/content";

/**
 * The turn — the issue's emotional midpoint.
 *
 * One typographic block of two balanced lines, set on a compact dark band. The
 * block is offset off the publication's left margin and runs to the far side of
 * the measure, so it reads as an editorial headline rather than a centred
 * quotation. The single ultra-thin rule left standing on that margin is the
 * only other mark in the section, and it is what balances a long horizontal
 * mass with a vertical. The last word takes the one accent.
 *
 * Two spans and a rule — everything else is geometry in `.st-*`.
 */
export function StatementSpread() {
  return (
    <section className="statement" aria-label="What the market chose">
      <span className="st-rule" aria-hidden="true" />
      <Reveal as="p" className="st-quote" chapter>
        <span className="st-line">{statement.lineOne}</span>
        <span className="st-line">
          {statement.lineTwo.lead}{" "}
          <span className="st-word">{statement.lineTwo.accent}</span>
        </span>
      </Reveal>
    </section>
  );
}
