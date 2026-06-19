import "server-only";

import { headers } from "next/headers";

import { auth, type AuthSession } from "@/server/auth";

export async function getCurrentSession(): Promise<AuthSession | null> {
  return auth.api.getSession({
    headers: await headers(),
  });
}
