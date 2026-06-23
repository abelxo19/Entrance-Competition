import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { GradeSelector } from "@/components/subjects/grade-selector";
import { subjects } from "@/lib/data";
import { requireApprovedStudent } from "@/lib/student-access";
import type { Subject } from "@/types/exam";

interface GradeSelectionPageProps {
  params: Promise<{
    subjectId: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function GradeSelectionPage({ params }: GradeSelectionPageProps) {
  await requireApprovedStudent();
  const { subjectId } = await params;

  const subject = subjects.find((s) => s.id === subjectId) as Subject | undefined;

  if (!subject) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">Subject not found</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/exams">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-1 size-4" />
            Back to subjects
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-normal">{subject.name}</h1>
          <p className="mt-2 text-muted-foreground">
            Choose a grade level to view study notes
          </p>
        </div>

        <GradeSelector subjectId={subjectId} />
      </main>
      <Footer />
    </>
  );
}
