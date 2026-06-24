import {
  ArrowRight,
  BookOpenCheck,
  Check,
  FlaskConical,
  Languages,
  Network,
  Users,
} from "lucide-react";
import { redirect } from "next/navigation";
import { selectPlan, selectStream } from "@/app/onboarding/actions";
import { PortalUserMenu } from "@/components/auth/portal-user-menu";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStudentAccess } from "@/lib/student-access";

export const dynamic = "force-dynamic";

interface OnboardingPageProps {
  searchParams: Promise<{ step?: string; error?: string }>;
}

const streams = [
  {
    value: "natural",
    icon: FlaskConical,
    title: "Natural Science",
    description: "For students preparing through the Natural Science stream.",
    subjects: ["English", "Mathematics", "Biology", "Chemistry", "Physics"],
  },
  {
    value: "social",
    icon: Network,
    title: "Social Science",
    description: "For students preparing through the Social Science stream.",
    subjects: ["English", "Mathematics", "History", "Economics", "Geography"],
  },
] as const;

const plans = [
  {
    value: "individual",
    title: "Individual Access",
    price: "500 ETB",
    description: "Complete Alpha Tutor access for one student.",
    icon: BookOpenCheck,
    benefits: [
      "Full stream subject collection",
      "Summary vault and formula sheets",
      "National Mock Championship slot",
    ],
  },
  {
    value: "squad",
    title: "Squad Access",
    price: "375 ETB",
    description: "Discounted price per student in a group of four.",
    icon: Users,
    benefits: [
      "Everything in Individual Access",
      "25% discount for every member",
      "Each student receives a personal account",
    ],
  },
] as const;

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const params = await searchParams;
  const access = await getStudentAccess();

  if (access.package.status === "approved") {
    redirect("/exams");
  }

  if (access.profile.stream && access.package.plan) {
    redirect("/payment");
  }

  const showPlanStep =
    params.step === "plan" && Boolean(access.profile.stream);
  const fullName = access.profile.fullName;

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] bg-[#f3f6fa] px-4 py-10 dark:bg-background sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-start justify-between gap-5">
            <div className="max-w-2xl">
              <Badge variant="secondary">
                Step {showPlanStep ? "2" : "1"} of 2
              </Badge>
              <h1 className="mt-4 text-3xl font-bold tracking-normal text-primary sm:text-4xl">
                {showPlanStep
                  ? "Choose your Alpha Tutor access plan."
                  : "Which Grade 12 stream are you studying?"}
              </h1>
              <p className="mt-3 leading-7 text-muted-foreground">
                {showPlanStep
                  ? "Select the plan that matches how you are joining. You will receive payment instructions next."
                  : "Your answer personalizes the subjects, resources, and exams shown in your portal."}
              </p>
            </div>
                <PortalUserMenu
                  email={access.profile.email}
                  fullName={fullName}
                  isAdmin={access.profile.role === "admin"}
                />
          </div>

          {params.error ? (
            <div
              role="alert"
              className="mb-5 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {params.error}
            </div>
          ) : null}

          {showPlanStep ? (
            <>
              <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
                <span>Selected stream:</span>
                <Badge variant="outline">
                  {access.profile.stream === "natural"
                    ? "Natural Science"
                    : "Social Science"}
                </Badge>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {plans.map((plan) => (
                  <form action={selectPlan} key={plan.value}>
                    <input type="hidden" name="plan" value={plan.value} />
                    <Card className="h-full transition-colors hover:border-primary/40">
                      <CardContent className="flex h-full flex-col p-6">
                        <span className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <plan.icon className="size-5" aria-hidden="true" />
                        </span>
                        <div className="mt-5 flex items-start justify-between gap-4">
                          <div>
                            <h2 className="text-xl font-semibold">{plan.title}</h2>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              {plan.description}
                            </p>
                          </div>
                          <p className="min-w-fit text-xl font-bold text-primary">
                            {plan.price}
                          </p>
                        </div>
                        <div className="my-6 space-y-3 text-sm">
                          {plan.benefits.map((benefit) => (
                            <div key={benefit} className="flex items-center gap-2">
                              <Check
                                className="size-4 text-secondary"
                                aria-hidden="true"
                              />
                              {benefit}
                            </div>
                          ))}
                        </div>
                        <Button type="submit" size="lg" className="mt-auto w-full">
                          Select {plan.title}
                          <ArrowRight aria-hidden="true" />
                        </Button>
                      </CardContent>
                    </Card>
                  </form>
                ))}
              </div>
            </>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {streams.map((stream) => (
                <form action={selectStream} key={stream.value}>
                  <input type="hidden" name="stream" value={stream.value} />
                  <Card className="h-full transition-colors hover:border-primary/40">
                    <CardContent className="flex h-full flex-col p-6">
                      <span className="flex size-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <stream.icon className="size-6" aria-hidden="true" />
                      </span>
                      <h2 className="mt-5 text-2xl font-semibold">{stream.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {stream.description}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {stream.subjects.map((subject) => (
                          <span
                            key={subject}
                            className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-xs font-semibold"
                          >
                            {subject === "English" ? (
                              <Languages className="size-3" aria-hidden="true" />
                            ) : null}
                            {subject}
                          </span>
                        ))}
                      </div>
                      <Button type="submit" size="lg" className="mt-7 w-full">
                        Choose {stream.title}
                        <ArrowRight aria-hidden="true" />
                      </Button>
                    </CardContent>
                  </Card>
                </form>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
