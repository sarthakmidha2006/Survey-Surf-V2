import { z } from "zod";

/**
 * Typed, validated environment configuration.
 *
 * Server variables are validated only on the server; client variables
 * (NEXT_PUBLIC_*) are validated everywhere. Accessing a server-only variable
 * from client code throws immediately, preventing accidental secret leakage.
 */

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL must be a valid PostgreSQL connection string"),
  AUTH_SECRET: z
    .string()
    .min(
      1,
      "AUTH_SECRET is required (generate with `openssl rand -base64 32`)",
    ),
  AUTH_GITHUB_ID: z.string().optional().default(""),
  AUTH_GITHUB_SECRET: z.string().optional().default(""),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be an absolute URL"),
});

const isServer = typeof window === "undefined";

/**
 * Reference every variable explicitly so Next.js can statically inline the
 * NEXT_PUBLIC_* values into the client bundle.
 */
const runtimeEnv = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
};

const mergedSchema = serverSchema.merge(clientSchema);

/**
 * Skip validation when explicitly requested (e.g. `next build`, where route
 * modules are imported to collect page data before any runtime secrets exist).
 * The running serverless functions still validate on cold start, so real
 * misconfiguration is caught at request time rather than masked.
 */
const skipValidation = !!process.env.SKIP_ENV_VALIDATION;

type Env = z.infer<typeof mergedSchema>;

const parsed = skipValidation
  ? { success: true as const, data: runtimeEnv as unknown as Env }
  : isServer
    ? mergedSchema.safeParse(runtimeEnv)
    : clientSchema.safeParse(runtimeEnv);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsed.error.flatten().fieldErrors, null, 2),
  );
  throw new Error("Invalid environment variables. See errors above.");
}

export const env = new Proxy(parsed.data as Env, {
  get(target, prop) {
    if (typeof prop !== "string") return undefined;
    if (!isServer && !prop.startsWith("NEXT_PUBLIC_")) {
      throw new Error(
        `❌ Attempted to access server-only environment variable "${prop}" on the client.`,
      );
    }
    return target[prop as keyof Env];
  },
});
