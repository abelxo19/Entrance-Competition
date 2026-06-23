import {
  BadgeCheck,
  Building2,
  Clock3,
  ExternalLink,
  MessageCircle,
  Smartphone,
} from "lucide-react";
import { redirect } from "next/navigation";
import { changeSelection } from "@/app/onboarding/actions";
import { PortalUserMenu } from "@/components/auth/portal-user-menu";
import { Navbar } from "@/components/layout/navbar";
import { CheckApprovalButton } from "@/components/payment/check-approval-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStudentAccess } from "@/lib/student-access";

export const dynamic = "force-dynamic";

export default async function PaymentPage() {
  const access = await getStudentAccess();

  if (!access.profile.stream || !access.package.plan) {
    redirect("/onboarding");
  }

  if (access.package.status === "approved") {
    redirect("/exams");
  }

  const fullName = access.profile.fullName;
  const amount = access.package.plan === "squad" ? "375 ETB" : "500 ETB";
  const streamName =
    access.profile.stream === "natural" ? "Natural Science" : "Social Science";

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] bg-[#f3f6fa] px-4 py-10 dark:bg-background sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-start justify-between gap-5">
            <div className="max-w-2xl">
              <Badge variant="accent">Payment verification</Badge>
              <h1 className="mt-4 text-3xl font-bold tracking-normal text-primary sm:text-4xl">
                Complete your payment to unlock the portal.
              </h1>
              <p className="mt-3 leading-7 text-muted-foreground">
                Pay the required amount, then send a clear screenshot or receipt
                to our Telegram account for manual approval.
              </p>
            </div>
            <PortalUserMenu email={access.profile.email} fullName={fullName} />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-5">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount due</p>
                      <p className="mt-1 text-4xl font-bold text-primary">{amount}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{streamName}</Badge>
                      <Badge variant="secondary">
                        {access.package.plan === "squad"
                          ? "Squad Plan"
                          : "Individual Plan"}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <PaymentMethod
                      icon={Building2}
                      name="Commercial Bank of Ethiopia"
                      shortName="CBE"
                      account="1000300461313"
                    />
                    <PaymentMethod
                      icon={Smartphone}
                      name="Telebirr"
                      shortName="Telebirr"
                      account="0993671417"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-lg bg-primary p-6 text-primary-foreground">
                <div className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-white/10">
                    <MessageCircle className="size-5 text-accent" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white/70">
                      Send your payment proof
                    </p>
                    <h2 className="mt-1 text-2xl font-bold">@ALPHA_TUTOR_21</h2>
                    <p className="mt-3 leading-7 text-white/75">
                      Include your registered email and selected plan in the
                      message so we can match the payment to your account.
                    </p>
                    <Button asChild variant="accent" className="mt-5">
                      <a
                        href="https://t.me/ALPHA_TUTOR_21"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open Telegram
                        <ExternalLink aria-hidden="true" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-5">
              <Card>
                <CardContent className="p-6">
                  <span className="flex size-11 items-center justify-center rounded-md bg-accent/15 text-accent-foreground">
                    <Clock3 className="size-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 text-xl font-semibold">
                    Waiting for approval
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Your portal will unlock after Alpha Tutor verifies your
                    payment proof.
                  </p>
                  <div className="mt-5 flex items-center gap-2 rounded-md border bg-muted/40 p-3 text-sm">
                    <BadgeCheck className="size-4 text-secondary" aria-hidden="true" />
                    Current status: Pending
                  </div>
                  <CheckApprovalButton />
                </CardContent>
              </Card>

              <form action={changeSelection}>
                <Button type="submit" variant="outline" className="w-full">
                  Change stream or plan
                </Button>
              </form>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

function PaymentMethod({
  icon: Icon,
  name,
  shortName,
  account,
}: {
  icon: typeof Building2;
  name: string;
  shortName: string;
  account: string;
}) {
  return (
    <div className="rounded-lg border bg-background p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold">{shortName}</p>
          <p className="text-xs text-muted-foreground">{name}</p>
        </div>
      </div>
      <p className="mt-5 font-mono text-xl font-bold tracking-normal text-primary">
        {account}
      </p>
    </div>
  );
}
