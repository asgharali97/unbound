import "server-only";

import { z } from "zod";

const serverEnvironmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.url().startsWith("postgres"),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
});

const parsedEnvironment = serverEnvironmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  throw new Error(
    `Invalid server environment: ${z.prettifyError(parsedEnvironment.error)}`,
  );
}

export const serverEnv = parsedEnvironment.data;
