import {
  ArrowRight,
  BookOpenCheck,
  FileText,
  FlaskConical,
  Network,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { PortalUserMenu } from "@/components/auth/portal-user-menu";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExamCard } from "@/features/catalog/exam-card";
import { exams, subjects } from "@/lib/data";
import { requireApprovedStudent } from "@/lib/student-access";
import type { Subject } from "@/types/exam";

export const dynamic = "force-dynamic";

const streamSubjects = {
  natural: ["english", "math", "biology", "chemistry", "physics"],
  social: ["english", "math", "history", "economics", "geography"],
} as const;

export default async function ExamsPage() {
  const access = await requireApprovedStudent();
  const fullName = access.profile.fullName;
  const firstName = fullName?.split(" ")[0];
  const selectedSubjects = streamSubjects[access.profile.stream]
    .map((id) => subjects.find((subject) => subject.id === id))
    .filter((subject): subject is Subject => Boolean(subject));
  const streamName =
    access.profile.stream === "natural" ? "Natural Science" : "Social Science";
  const StreamIcon =
    access.profile.stream === "natural" ? FlaskConical : Network;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-primary">Student Portal</p>
              <Badge variant="secondary">
                <StreamIcon className="mr-1 size-3" aria-hidden="true" />
                {streamName}
              </Badge>
            </div>
            <h1 className="mt-2 text-4xl font-bold tracking-normal">
              Welcome back{firstName ? `, ${firstName}` : ""}.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Your study collection is organized around the {streamName} entrance
              stream.
            </p>
          </div>
          <PortalUserMenu email={access.profile.email} fullName={fullName} />
        </div>

        <section className="mb-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-secondary">
                Your subject collection
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-normal">
                Grade 12 {streamName}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedSubjects.length} subjects
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {selectedSubjects.map((subject) => (
              <SubjectCollectionCard key={subject.id} subject={subject} />
            ))}
          </div>
        </section>

        <section className="border-t pt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-accent-foreground">
                <Trophy className="size-4 text-accent" aria-hidden="true" />
                National Mock Championship
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-normal">
                Full-stream exam simulations
              </h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {exams.slice(0, 2).map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function SubjectCollectionCard({ subject }: { subject: Subject }) {
  return (
    <Card className="transition-colors hover:border-primary/40">
      <CardContent className="p-5">
        <span className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
          <BookOpenCheck className="size-5" aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-xl font-semibold">{subject.name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
          {subject.description}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-semibold">
          <span className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
            <FileText className="size-3.5 text-primary" aria-hidden="true" />
            Summary notes
          </span>
          <span className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
            <BookOpenCheck className="size-3.5 text-secondary" aria-hidden="true" />
            {subject.questionCount} questions
          </span>
        </div>
        <Button asChild variant="outline" className="mt-5 w-full">
          <Link href="/exam/demo-2015">
            Open {subject.name}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
