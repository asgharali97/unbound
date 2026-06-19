import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db";
import {
  accounts,
  sessions,
  users,
  verifications,
} from "@/db/schema";
import { serverEnv } from "@/server/env";

export const auth = betterAuth({
  appName: "Unbound",
  baseURL: serverEnv.BETTER_AUTH_URL,
  secret: serverEnv.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users,
      sessions,
      accounts,
      verifications,
    },
    usePlural: true,
    transaction: true,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      timezone: {
        type: "string",
        required: false,
        defaultValue: "UTC",
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
});

export type AuthSession = typeof auth.$Infer.Session;
