"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { GoogleMark } from "@/components/auth/google-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

type AuthMode = "sign-in" | "sign-up";

interface AuthFormProps {
  mode: AuthMode;
}

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const initialValues: FormValues = {
  name: "",
  email: "",
  password: "",
};

export function AuthForm({ mode }: AuthFormProps): React.JSX.Element {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignUp = mode === "sign-up";

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = isSignUp
      ? await authClient.signUp.email({
          name: values.name,
          email: values.email,
          password: values.password,
          callbackURL: "/",
        })
      : await authClient.signIn.email({
          email: values.email,
          password: values.password,
          callbackURL: "/",
        });

    setIsSubmitting(false);

    if (result.error) {
      setErrorMessage(result.error.message ?? "Authentication failed.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleGoogleSignIn(): Promise<void> {
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (result?.error) {
      setErrorMessage(result.error.message ?? "Google sign-in failed.");
      setIsSubmitting(false);
    }
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    const field = event.target.name;
    const value = event.target.value;
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
  }

  return (
    <div className="w-full">
      <AuthHeading isSignUp={isSignUp} />
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="mt-8 w-full bg-white text-black hover:bg-white/90 hover:text-black"
        disabled={isSubmitting}
        onClick={handleGoogleSignIn}
      >
        <GoogleMark />
        Continue with Google
      </Button>

      <div className="my-7 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          or continue with email
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp ? (
          <FormField
            id="name"
            label="Full name"
            type="text"
            value={values.name}
            placeholder="Asghar Ali"
            autoComplete="name"
            handleChange={handleInputChange}
          />
        ) : null}
        <FormField
          id="email"
          label="Email"
          type="email"
          value={values.email}
          placeholder="you@company.com"
          autoComplete="email"
          handleChange={handleInputChange}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          value={values.password}
          placeholder={isSignUp ? "At least 8 characters" : "Enter your password"}
          autoComplete={isSignUp ? "new-password" : "current-password"}
          minLength={8}
          handleChange={handleInputChange}
        />

        {errorMessage ? (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive"
          >
            {errorMessage}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <>
              {isSignUp ? "Create workspace" : "Enter Unbound"}
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <AuthSwitch isSignUp={isSignUp} />
      <p className="mt-8 text-center text-[11px] leading-5 text-muted-foreground">
        By continuing, you agree to Unbound&apos;s Terms and Privacy Policy.
      </p>
    </div>
  );
}

function AuthHeading({ isSignUp }: { isSignUp: boolean }): React.JSX.Element {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {isSignUp ? "Create your workspace" : "Welcome back"}
      </p>
      <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em]">
        {isSignUp ? "Start moving faster." : "Pick up where you left off."}
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {isSignUp
          ? "One command surface for the work hiding across email and calendar."
          : "Your action cards, inbox, and schedule are waiting."}
      </p>
    </div>
  );
}

interface FormFieldProps {
  id: keyof FormValues;
  label: string;
  type: "text" | "email" | "password";
  value: string;
  placeholder: string;
  autoComplete: string;
  minLength?: number;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function FormField({
  id,
  label,
  type,
  value,
  placeholder,
  autoComplete,
  minLength,
  handleChange,
}: FormFieldProps): React.JSX.Element {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        required
        onChange={handleChange}
      />
    </div>
  );
}

function AuthSwitch({ isSignUp }: { isSignUp: boolean }): React.JSX.Element {
  return (
    <p className="mt-6 text-center text-sm text-muted-foreground">
      {isSignUp ? "Already have a workspace?" : "New to Unbound?"}{" "}
      <Link
        href={isSignUp ? "/sign-in" : "/sign-up"}
        className="font-medium text-foreground underline-offset-4 hover:underline"
      >
        {isSignUp ? "Sign in" : "Create one"}
      </Link>
    </p>
  );
}
