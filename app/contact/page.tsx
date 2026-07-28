import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { Container, Row } from "@/components/ui/container";
import { Folio } from "@/components/ui/folio";
import { LinkPen } from "@/components/ui/link-pen";
import { Marginalia } from "@/components/ui/marginalia";
import { Rule } from "@/components/ui/rule";
import { Heading, Kicker, Standfirst } from "@/components/ui/typography";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "See your blind spot",
  description:
    "Share your website or product, and Sibero will analyze thousands of conversations to uncover how your market truly perceives you.",
  path: "/contact",
});

/** The enquiry page — the destination of every "See your blind spot" CTA. */
export default function ContactPage() {
  return (
    <section className="chapter">
      <Container>
        <Row
          margin={
            <Marginalia>we read every one — by a person, not a bot.</Marginalia>
          }
        >
          <Folio left="SB · ISSUE 01 · ENQUIRY" right="RSVP" />
          <Rule />
          <Kicker>See Your Blind Spot</Kicker>
          <Heading
            as="h1"
            parts={{
              lead: "Tell us about",
              em: "your business.",
            }}
          />
          <Standfirst colRead>
            Share your website or product, and Sibero will analyze thousands of
            conversations to uncover how your market truly perceives you.
          </Standfirst>

          <ContactForm />

          <p className="mt-10">
            <LinkPen href="/">← Back to the issue</LinkPen>
          </p>
        </Row>
      </Container>
    </section>
  );
}
