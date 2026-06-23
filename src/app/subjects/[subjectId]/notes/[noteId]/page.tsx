import { ArrowLeft, Loader } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { PdfViewer } from "@/components/subjects/pdf-viewer";
import { getNotePdfUrl, getSubjectNote } from "@/app/subjects/actions";
import { requireApprovedStudent } from "@/lib/student-access";

interface NoteViewerPageProps {
  params: Promise<{
    subjectId: string;
    noteId: string;
  }>;
}

export const dynamic = "force-dynamic";

async function NoteViewerContent({ subjectId, noteId }: { subjectId: string; noteId: string }) {
  const note = await getSubjectNote(noteId);

  if (!note || note.subject_id !== subjectId) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">Note not found</p>
      </div>
    );
  }

  const pdfUrl = await getNotePdfUrl(note.file_path);

  if (!pdfUrl) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-destructive">Failed to load PDF</p>
      </div>
    );
  }

  return (
    <>
      <Link href={`/subjects/${subjectId}/notes?grade=${note.grade}`}>
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="mr-1 size-4" />
          Back to notes
        </Button>
      </Link>

      <PdfViewer pdfUrl={pdfUrl} title={note.title} />
    </>
  );
}

export default async function NoteViewerPage({ params }: NoteViewerPageProps) {
  await requireApprovedStudent();
  const { subjectId, noteId } = await params;

  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader className="animate-spin" />
                <p className="text-muted-foreground">Loading note...</p>
              </div>
            </div>
          }
        >
          <NoteViewerContent subjectId={subjectId} noteId={noteId} />
        </Suspense>
      </main>
    </SiteShell>
  );
}
