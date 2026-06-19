import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";
import { getCurrentSession } from "@/server/auth-session";

export const metadata: Metadata = {
  title: "Sign in | Unbound",
  description: "Sign in to your Unbound workspace.",
};

export default async function SignInPage(): Promise<React.JSX.Element> {
  const session = await getCurrentSession();

  if (session) {
    redirect("/");
  }

  return <AuthForm mode="sign-in" />;
}
