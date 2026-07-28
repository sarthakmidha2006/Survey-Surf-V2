import type { NextRequest } from "next/server";

import { fail, ok } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validations/contact";

/**
 * POST /api/contact
 * Programmatic interface for contact submissions, sharing the same validation
 * as the server action. Useful for integrations, tests and webhooks.
 */
export async function POST(request: NextRequest) {
  const limit = rateLimit(`contact:${clientIp(request.headers)}`, 8, 60_000);
  if (!limit.ok) {
    return fail("Too many requests. Please try again shortly.", 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Request body must be valid JSON.", 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed.", 422, parsed.error.flatten().fieldErrors);
  }

  const { website, name, email, company, competitor, message } = parsed.data;
  if (website) {
    // Honeypot — accept silently.
    return ok({ received: true }, 202);
  }

  try {
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        company: company || null,
        competitor: competitor || null,
        message: message ?? "",
        source: request.headers.get("referer"),
        userAgent: request.headers.get("user-agent"),
      },
      select: { id: true, createdAt: true },
    });
    return ok(submission, 201);
  } catch (error) {
    console.error("[api/contact] failed:", error);
    return fail("Unable to record submission.", 500);
  }
}
