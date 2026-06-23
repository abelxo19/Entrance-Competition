import { Award, RotateCcw, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PerformanceCard } from "@/features/results/performance-card";
import { ResultsChart } from "@/features/results/results-chart";
import { results } from "@/lib/data";
import { requireApprovedStudent } from "@/lib/student-access";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  await requireApprovedStudent();
  const totalScore = results.reduce((sum, item) => sum + item.score, 0);
  const totalPossible = results.reduce((sum, item) => sum + item.total, 0);
  const percent = Math.round((totalScore / totalPossible) * 100);

  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-lg border bg-card p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-primary">Results</p>
              <h1 className="mt-2 text-4xl font-bold tracking-normal">
                Strong attempt. Now sharpen the next one.
              </h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Your score overview highlights subject strengths, weaker topics,
                and the fastest path for the next study session.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-5 text-center">
              <Award className="mx-auto size-8 text-accent" aria-hidden="true" />
              <p className="mt-3 text-5xl font-bold">{percent}%</p>
              <p className="text-sm text-muted-foreground">
                {totalScore} of {totalPossible} correct
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {results.map((result) => (
            <PerformanceCard key={result.subject} result={result} />
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <ResultsChart results={results} />
          <div className="space-y-5">
            <Card>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp className="size-5 text-secondary" aria-hidden="true" />
                  <h2 className="font-semibold">Strengths</h2>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Biology fundamentals are consistently strong.</li>
                  <li>Chemistry problem-solving accuracy improved.</li>
                  <li>Mathematics pace is within target range.</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Target className="size-5 text-accent" aria-hidden="true" />
                  <h2 className="font-semibold">Weaknesses</h2>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>English grammar questions need review.</li>
                  <li>Physics motion problems should be drilled again.</li>
                  <li>Flagged questions show uncertainty under time pressure.</li>
                </ul>
              </CardContent>
            </Card>
            <Button asChild className="w-full" size="lg">
              <Link href="/exam/demo-2015">
                <RotateCcw aria-hidden="true" />
                Retake Exam
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
