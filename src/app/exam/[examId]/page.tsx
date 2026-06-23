import { ExamWorkspace } from "@/features/exam/exam-workspace";
import { requireApprovedStudent } from "@/lib/student-access";

export const dynamic = "force-dynamic";

export default async function ExamPage() {
  await requireApprovedStudent();
  return <ExamWorkspace />;
}
