import { ArrowRight, CalendarDays, Check, Mail, Sparkles } from "lucide-react";
import Link from "next/link";

interface AuthShellProps {
  children: React.ReactNode;
}

const workflowSteps = [
  { icon: CalendarDays, label: "Create calendar event", detail: "Thu, 9:00 AM" },
  { icon: Mail, label: "Draft follow-up email", detail: "Ready to review" },
];

export function AuthShell({ children }: AuthShellProps): React.JSX.Element {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden overflow-hidden border-r border-border px-12 py-10 lg:flex lg:flex-col xl:px-16">
          <ProductBackdrop />
          <Brand />
          <ProductStatement />
          <WorkflowPreview />
          <p className="relative mt-auto text-xs text-muted-foreground">
            Gmail + Google Calendar, orchestrated through Corsair.
          </p>
        </section>

        <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="flex items-center justify-between lg:justify-end">
            <div className="lg:hidden">
              <Brand />
            </div>
            <Link
              href="/"
              className="group flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
            >
              Product preview
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mx-auto flex w-full max-w-[420px] flex-1 items-center py-12">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

function Brand(): React.JSX.Element {
  return (
    <Link href="/" className="relative inline-flex items-center gap-2.5">
      <span className="grid size-7 place-items-center rounded-md bg-foreground text-background">
        <Sparkles className="size-3.5" strokeWidth={2.2} />
      </span>
      <span className="text-sm font-semibold tracking-[-0.02em]">Unbound</span>
    </Link>
  );
}

function ProductBackdrop(): React.JSX.Element {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 auth-grid opacity-30" />
      <div className="pointer-events-none absolute left-[12%] top-[35%] size-80 rounded-full bg-white/[0.035] blur-3xl" />
    </>
  );
}

function ProductStatement(): React.JSX.Element {
  return (
    <div className="relative mt-[13vh] max-w-xl">
      <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        Action-first workspace
      </p>
      <h1 className="max-w-lg text-4xl font-medium leading-[1.08] tracking-[-0.045em] xl:text-5xl">
        Command your inbox and calendar without switching tabs.
      </h1>
      <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">
        Turn plain-language intent into reviewable actions, then execute the
        whole workflow from one focused workspace.
      </p>
    </div>
  );
}

function WorkflowPreview(): React.JSX.Element {
  return (
    <div className="relative mt-12 max-w-xl rounded-xl border border-white/10 bg-white/[0.025] p-1 shadow-2xl shadow-black/30">
      <div className="rounded-lg border border-white/[0.06] bg-[#101010] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Command
        </p>
        <p className="mt-2 text-sm leading-6 text-white/90">
          Schedule a meeting with Ali next Thursday at 9 AM and send a note
          saying I&apos;m looking forward to it.
        </p>
        <div className="my-5 h-px bg-border" />
        <div className="space-y-2">
          {workflowSteps.map((step, index) => (
            <div
              key={step.label}
              className="flex items-center gap-3 rounded-md border border-white/[0.06] bg-white/[0.025] px-3.5 py-3"
            >
              <span className="grid size-6 place-items-center rounded bg-white/[0.07] text-white/70">
                <step.icon className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white/90">
                  {index + 1}. {step.label}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {step.detail}
                </p>
              </div>
              <Check className="size-3.5 text-emerald-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
