import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AdminNoteUpload } from "@/components/subjects/admin-note-upload";
import { Button } from "@/components/ui/button";
import { subjects } from "@/lib/data";
import { requireAdmin } from "@/lib/student-access";
import type { Subject } from "@/types/exam";

interface AdminSubjectPageProps {
  params: Promise<{
    subjectId: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function AdminSubjectUploadPage({ params }: AdminSubjectPageProps) {
  await requireAdmin();
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
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-1 size-4" />
            Back to admin
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-normal">Upload Notes</h1>
          <p className="mt-2 text-muted-foreground">
            Upload study materials for <span className="font-semibold">{subject.name}</span>
          </p>
        </div>

        <AdminNoteUpload
          subjectId={subjectId}
          onUploadSuccess={() => {
            // Optional: redirect or show success
          }}
        />
      </main>
      <Footer />
    </>
  );
}
