import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { Heading as HeadingParts } from "@/types";

/** Kicker — the small uppercase label above a heading. */
export function Kicker({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("kicker", className)}>{children}</p>;
}

const headingClass = { h1: "h1", h2: "h2", h3: "h3" } as const;

/**
 * Display heading. Renders the semantic tag (`as`) with the matching visual
 * class, splitting an optional emphasized clause into an `<em>`.
 */
export function Heading({
  as = "h2",
  parts,
  className,
  id,
}: {
  as?: "h1" | "h2" | "h3";
  parts: HeadingParts;
  className?: string;
  id?: string;
}) {
  const Tag = as;
  return (
    <Tag id={id} className={cn(headingClass[as], className)}>
      {parts.lead}
      {parts.em ? (
        <>
          {" "}
          <em>{parts.em}</em>
        </>
      ) : null}
    </Tag>
  );
}

/** Standfirst — the lead paragraph beneath a heading. */
export function Standfirst({
  children,
  dropcap,
  colRead,
  className,
  ...props
}: ComponentPropsWithoutRef<"p"> & { dropcap?: boolean; colRead?: boolean }) {
  return (
    <p
      className={cn(
        "standfirst",
        dropcap && "dropcap",
        colRead && "col-read",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

/** Body copy — constrained to the ideal reading measure. */
export function BodyCopy({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p className={cn("body-copy", className)} {...props}>
      {children}
    </p>
  );
}
