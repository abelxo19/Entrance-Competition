import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Crown,
  FlaskConical,
  Languages,
  Medal,
  Network,
  Sigma,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { HeroSection } from "@/components/sections/hero-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const vaultItems = [
  {
    icon: BookOpenCheck,
    title: "High-Yield Summary Vault",
    amharic: "የማትሪክ ማጠቃለያ ኖቶች",
    description:
      "The chapters and concepts that repeatedly appear in entrance exams, distilled from Grades 9-12.",
  },
  {
    icon: Sigma,
    title: "50-Trap Formula List",
    amharic: "የፊዚክስ፣ ኬሚስትሪ እና ሒሳብ ቀመሮች",
    description:
      "Critical shortcuts and high-risk formulas structured for fast recall before the exam.",
  },
  {
    icon: Languages,
    title: "Phrasal Verb Checklist",
    amharic: "የእንግሊዘኛ ፈሊጣዊ ግሶች",
    description:
      "A focused checklist of phrasal verbs, grammar patterns, and common exam traps.",
  },
  {
    icon: Medal,
    title: "National Mock Championship",
    amharic: "የ5,000 ብር የሽልማት ፈተና",
    description:
      "A realistic digital Matric simulation with an active timer, question navigator, and auto-save.",
  },
];

const tracks = [
  {
    icon: FlaskConical,
    title: "Natural Science",
    subjects: ["English", "Mathematics", "Biology", "Chemistry", "Physics"],
  },
  {
    icon: Network,
    title: "Social Science",
    subjects: ["English", "Mathematics", "History", "Economics", "Geography"],
  },
];

export default function Home() {
  return (
    <SiteShell>
      <HeroSection />
      <main>
        <section id="vault" className="border-b bg-background scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <Badge variant="secondary">Inside the Study Vault</Badge>
                <h2 className="mt-4 text-3xl font-bold tracking-normal text-primary sm:text-4xl">
                  Everything useful. Nothing that wastes your time.
                </h2>
                <p className="mt-4 max-w-lg leading-7 text-muted-foreground">
                  ምን ያገኛሉ? A focused preparation library designed around the
                  questions, formulas, and language patterns that matter most.
                </p>

                <div id="subjects" className="mt-8 space-y-3 scroll-mt-24">
                  {tracks.map((track) => (
                    <div key={track.title} className="rounded-lg border bg-card p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <track.icon className="size-5" aria-hidden="true" />
                        </span>
                        <div>
                          <h3 className="font-semibold">{track.title}</h3>
                          <p className="text-xs text-muted-foreground">Grade 12 track</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {track.subjects.map((subject) => (
                          <span
                            key={subject}
                            className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {vaultItems.map((item, index) => (
                  <Card
                    key={item.title}
                    className={
                      index === 3
                        ? "border-accent/60 bg-accent/5"
                        : "transition-colors hover:border-primary/30"
                    }
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <item.icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">
                          0{index + 1}
                        </span>
                      </div>
                      <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm font-medium text-secondary">
                        {item.amharic}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 bg-[#f3f6fa] py-16 dark:bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <Badge variant="accent">Simple entry, bigger rewards</Badge>
                <h2 className="mt-4 text-3xl font-bold tracking-normal text-primary sm:text-4xl">
                  Join alone or bring your study squad.
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  Full access to the Study Vault plus a guaranteed National Mock
                  Championship slot.
                </p>
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                የመግቢያ ዋጋ እና የግሩፕ ቅናሽ
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[0.9fr_0.9fr_1.2fr]">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-bold text-muted-foreground">
                    Standard Entry
                  </p>
                  <p className="mt-3 text-4xl font-bold text-primary">
                    500 <span className="text-lg">ETB</span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">One student</p>
                  <div className="mt-6 space-y-3 text-sm">
                    <Benefit text="Full Study Vault access" />
                    <Benefit text="Formula and English checklists" />
                    <Benefit text="Championship exam slot" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-secondary/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-secondary">Squad Discount</p>
                    <Badge variant="secondary">Save 25%</Badge>
                  </div>
                  <p className="mt-3 text-4xl font-bold text-primary">
                    375 <span className="text-lg">ETB</span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Per student in a group of 4
                  </p>
                  <div className="mt-6 space-y-3 text-sm">
                    <Benefit text="Everything in Standard Entry" />
                    <Benefit text="Study together, pay less" />
                    <Benefit text="Each member saves 125 ETB" />
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-lg bg-primary p-6 text-primary-foreground">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-11 items-center justify-center rounded-md bg-white/10">
                    <Crown className="size-5 text-accent" aria-hidden="true" />
                  </span>
                  <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
                    Invite & Earn
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-bold">The 5-Student Free Pass</h3>
                <p className="mt-2 text-sm font-semibold text-white/75">
                  ጋብዝ እና ተሸለም
                </p>
                <p className="mt-4 leading-7 text-white/80">
                  Invite five friends who successfully register and your 500 ETB
                  entry fee is fully refunded.
                </p>
                <div className="mt-5 rounded-md border border-white/15 bg-white/5 p-4">
                  <div className="flex gap-3">
                    <Sparkles className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                    <p className="text-sm leading-6 text-white/80">
                      Top referrers compete for the Digital Side-Hustle Blueprint:
                      video editing, Canva design, and freelancing training.
                    </p>
                  </div>
                </div>
                <Button asChild variant="accent" className="mt-5 w-full">
                  <Link href="/exams">
                    Secure Your Place
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-5 items-center justify-center rounded-full bg-secondary/15">
        <Check className="size-3 text-secondary" aria-hidden="true" />
      </span>
      <span>{text}</span>
    </div>
  );
}
