import { ArrowLeft, BookOpen, FileText } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSubjectNotes } from "@/app/subjects/actions";
import { subjects } from "@/lib/data";
import { requireApprovedStudent } from "@/lib/student-access";
import type { Subject } from "@/types/exam";

interface SubjectNotesPageProps {
  params: Promise<{
    subjectId: string;
  }>;
  searchParams: Promise<{
    grade?: string;
  }>;
}

export const dynamic = "force-dynamic";

async function SubjectNotesContent({
  subjectId,
  grade,
}: {
  subjectId: string;
  grade: number;
}) {
  const subject = subjects.find((s) => s.id === subjectId) as Subject | undefined;

  if (!subject) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">Subject not found</p>
      </div>
    );
  }

  const notes = await getSubjectNotes(subjectId, grade);

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <Link href={`/subjects/${subjectId}/grade`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-1 size-4" />
              Back to grade selection
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-md bg-primary/10 text-primary">
              <BookOpen className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">{subject.name}</p>
              <h1 className="mt-1 text-3xl font-bold tracking-normal">Grade {grade}</h1>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground">
            {notes.length === 0
              ? "No study notes available yet for this subject and grade."
              : `${notes.length} study ${notes.length === 1 ? "note" : "notes"} available`}
          </p>
        </div>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center">
          <FileText className="mx-auto mb-3 size-8 text-muted-foreground" />
          <p className="text-muted-foreground">
            No study notes available for {subject.name} Grade {grade} yet.
          </p>
          <p className="text-xs text-muted-foreground">
            Check back soon for curated study materials.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/subjects/${subjectId}/notes/${note.id}`}
            >
              <Card className="h-full transition-all hover:border-primary/40 hover:shadow-md">
                <CardContent className="p-5">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-secondary/10 text-secondary">
                    <FileText className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold">{note.title}</h3>
                  {note.summary && (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {note.summary}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{(note.file_size! / 1024 / 1024).toFixed(2)} MB</span>
                    <span className="text-primary">View →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default async function SubjectNotesPage({
  params,
  searchParams,
}: SubjectNotesPageProps) {
  await requireApprovedStudent();
  const { subjectId } = await params;
  const { grade } = await searchParams;

  const gradeNum = grade ? parseInt(grade) : null;

  if (!gradeNum || gradeNum < 9 || gradeNum > 12) {
    return (
      <SiteShell>
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link href={`/subjects/${subjectId}/grade`}>
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="mr-1 size-4" />
              Select a valid grade
            </Button>
          </Link>
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-destructive">Invalid grade. Please select 9-12.</p>
          </div>
        </main>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex h-96 items-center justify-center">
              <p className="text-muted-foreground">Loading notes...</p>
            </div>
          }
        >
          <SubjectNotesContent subjectId={subjectId} grade={gradeNum} />
        </Suspense>
      </main>
    </SiteShell>
  );
}
