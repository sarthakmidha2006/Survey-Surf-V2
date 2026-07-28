import { z } from "zod";

/**
 * Contact ("See your blind spot") form.
 * `website` is a honeypot: real users never see or fill it, so any value
 * signals a bot. Shared by the server action and the REST route.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please tell us your name.")
    .max(120, "That name is a little too long."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  company: z
    .string()
    .trim()
    .max(160, "Keep the company name under 160 characters.")
    .optional()
    .or(z.literal("")),
  // "Additional context" — optional free text.
  competitor: z
    .string()
    .trim()
    .max(4000, "That’s a little too long.")
    .optional()
    .or(z.literal("")),
  // "What are you trying to understand about your market?" — optional.
  message: z
    .string()
    .trim()
    .max(4000, "That message is too long.")
    .optional()
    .or(z.literal("")),
  // Honeypot — hidden from people. Accepted by the schema (so it never
  // surfaces as a validation error), then handled explicitly by the
  // action/route: any value means a bot, and the submission is dropped.
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
