"use server";

import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import type { ActionState } from "@/types";

/**
 * Server Action: record a "See your blind spot" enquiry.
 *
 * Called directly (typed) from the React Hook Form client, and re-validated
 * on the server — client validation is UX, the server is the source of truth.
 */
export async function submitContact(input: ContactInput): Promise<ActionState> {
  const headerList = await headers();

  const limit = rateLimit(`contact-action:${clientIp(headerList)}`, 8, 60_000);
  if (!limit.ok) {
    return {
      status: "error",
      message: "Too many attempts. Please wait a moment and try again.",
    };
  }

  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { website, name, email, company, competitor, message } = parsed.data;

  // Honeypot tripped — acknowledge without persisting.
  if (website) {
    return { status: "success", message: "Thank you — we’ll be in touch." };
  }

  try {
    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        company: company || null,
        competitor: competitor || null,
        message: message ?? "",
        source: headerList.get("referer"),
        userAgent: headerList.get("user-agent"),
      },
    });
  } catch (error) {
    console.error("[contact] submission failed:", error);
    return {
      status: "error",
      message: "Something went wrong on our end. Please try again shortly.",
    };
  }

  return {
    status: "success",
    message:
      "Thank you — your request is in. We’ll be in touch within two working days.",
  };
}
