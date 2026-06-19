import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { serverEnv } from "@/server/env";

import * as schema from "./schema";

const globalForDatabase = globalThis as typeof globalThis & {
  databasePool?: Pool;
};

export const databasePool =
  globalForDatabase.databasePool ??
  new Pool({
    connectionString: serverEnv.DATABASE_URL,
    max: 10,
  });

if (serverEnv.NODE_ENV !== "production") {
  globalForDatabase.databasePool = databasePool;
}

export const db = drizzle(databasePool, { schema });

export type Database = typeof db;
