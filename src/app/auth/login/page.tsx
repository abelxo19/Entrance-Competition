import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Trophy,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import {
  requestPasswordReset,
  signIn,
  signUp,
} from "@/app/auth/actions";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type AuthMode = "signin" | "register" | "forgot";

interface AuthPageProps {
  searchParams: Promise<{
    mode?: string;
    next?: string;
    error?: string;
    message?: string;
  }>;
}

export default async function LoginPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const mode: AuthMode =
    params.mode === "register"
      ? "register"
      : params.mode === "forgot"
        ? "forgot"
        : "signin";
  const next =
    params.next?.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : "/exams";
  const configured = isSupabaseConfigured();

  return (
    <main className="min-h-screen bg-[#f3f6fa] dark:bg-background">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg text-primary">
            Alpha<span className="font-medium text-foreground">Tutor</span>
          </span>
        </Link>
        <ThemeToggle />
      </header>

      <div className="mx-auto grid max-w-7xl items-stretch gap-8 px-4 py-8 sm:px-6 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-12">
        <section className="hidden rounded-lg bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold">
              <Trophy className="size-4 text-accent" aria-hidden="true" />
              National Mock Championship
            </span>
            <h1 className="mt-8 max-w-xl text-5xl font-bold leading-[1.08]">
              Your focused Matric preparation starts here.
            </h1>
            <p className="mt-5 max-w-lg leading-7 text-white/75">
              Sign in to access the Study Vault, subject practice, timed exams,
              and your saved progress.
            </p>
          </div>
          <div className="grid gap-3">
            <PortalBenefit
              icon={BookOpenCheck}
              title="High-yield study resources"
              description="Grade 9-12 concepts distilled for entrance exams."
            />
            <PortalBenefit
              icon={ShieldCheck}
              title="Progress saved securely"
              description="Continue your questions and review flags on any device."
            />
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm sm:p-8">
            <Link
              href="/"
              className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to home
            </Link>

            <div>
              <p className="text-sm font-bold text-secondary">
                {mode === "register"
                  ? "Create your student account"
                  : mode === "forgot"
                    ? "Recover your account"
                    : "Welcome back"}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-normal text-primary">
                {mode === "register"
                  ? "Join Alpha Tutor"
                  : mode === "forgot"
                    ? "Reset your password"
                    : "Enter the student portal"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {mode === "register"
                  ? "Create an account to unlock exams and save your preparation progress."
                  : mode === "forgot"
                    ? "We will email you a secure password reset link."
                    : "Use your registered email and password to continue."}
              </p>
            </div>

            {!configured ? (
              <div className="mt-5 rounded-md border border-accent/50 bg-accent/10 p-3 text-sm leading-6">
                Supabase credentials are not configured. Add the project URL and
                publishable key to <code>.env.local</code> before signing in.
              </div>
            ) : null}

            {params.error ? (
              <div
                role="alert"
                className="mt-5 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
              >
                {params.error}
              </div>
            ) : null}

            {params.message ? (
              <div className="mt-5 flex gap-2 rounded-md border border-secondary/40 bg-secondary/10 p-3 text-sm">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-secondary"
                  aria-hidden="true"
                />
                {params.message}
              </div>
            ) : null}

            <form
              action={
                mode === "register"
                  ? signUp
                  : mode === "forgot"
                    ? requestPasswordReset
                    : signIn
              }
              className="mt-6 space-y-4"
            >
              <input type="hidden" name="next" value={next} />

              {mode === "register" ? (
                <Field
                  icon={UserRound}
                  label="Full name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                />
              ) : null}

              <Field
                icon={Mail}
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="student@example.com"
              />

              {mode !== "forgot" ? (
                <Field
                  icon={LockKeyhole}
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete={
                    mode === "register" ? "new-password" : "current-password"
                  }
                  placeholder="At least 8 characters"
                  minLength={8}
                />
              ) : null}

              {mode === "signin" ? (
                <div className="flex justify-end">
                  <Link
                    href={`/auth/login?mode=forgot&next=${encodeURIComponent(next)}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              ) : null}

              <Button type="submit" size="lg" className="w-full" disabled={!configured}>
                {mode === "register"
                  ? "Create account"
                  : mode === "forgot"
                    ? "Send reset link"
                    : "Sign in"}
                <ArrowRight aria-hidden="true" />
              </Button>
            </form>

            <div className="mt-6 border-t pt-5 text-center text-sm text-muted-foreground">
              {mode === "signin" ? (
                <>
                  New to Alpha Tutor?{" "}
                  <Link
                    href={`/auth/login?mode=register&next=${encodeURIComponent(next)}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    Create an account
                  </Link>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <Link
                    href={`/auth/login?mode=signin&next=${encodeURIComponent(next)}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  icon: Icon,
  label,
  ...props
}: React.ComponentProps<typeof Input> & {
  icon: typeof Mail;
  label: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold">{label}</span>
      <span className="relative block">
        <Icon
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input className="pl-9" required {...props} />
      </span>
    </label>
  );
}

function PortalBenefit({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof BookOpenCheck;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-md border border-white/10 bg-white/5 p-4">
      <Icon className="mt-0.5 size-5 shrink-0 text-secondary" aria-hidden="true" />
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-white/65">{description}</p>
      </div>
    </div>
  );
}
