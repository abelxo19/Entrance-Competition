import { Search } from "lucide-react";
import { PortalUserMenu } from "@/components/auth/portal-user-menu";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExamCard } from "@/features/catalog/exam-card";
import { SubjectCard } from "@/features/catalog/subject-card";
import { exams, subjects } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ExamsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const fullName =
    typeof user?.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : undefined;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">Student Portal</p>
            <h1 className="mt-2 text-4xl font-bold tracking-normal">
              Welcome back{fullName ? `, ${fullName.split(" ")[0]}` : ""}.
            </h1>
            <p className="mt-3 text-muted-foreground">
              Choose an exam, continue your preparation, and keep building your score.
            </p>
          </div>
          <PortalUserMenu
            email={user?.email}
            fullName={fullName}
          />
        </div>

        <section className="mb-8 rounded-lg border bg-card p-4" aria-label="Exam filters">
          <div className="grid gap-3 md:grid-cols-[1fr_160px_180px_180px]">
            <label className="relative block">
              <span className="sr-only">Search exams</span>
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input className="pl-9" placeholder="Search subject, exam, or year" />
            </label>
            <Select defaultValue="12">
              <SelectTrigger aria-label="Grade selector">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">Grade 12</SelectItem>
                <SelectItem value="11">Grade 11</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger aria-label="Difficulty filter">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All difficulty</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-years">
              <SelectTrigger aria-label="Exam year selector">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-years">All years</SelectItem>
                <SelectItem value="2017">2017</SelectItem>
                <SelectItem value="2016">2016</SelectItem>
                <SelectItem value="2015">2015</SelectItem>
                <SelectItem value="2014">2014</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-normal">Available Exams</h2>
            <p className="text-sm text-muted-foreground">{exams.length} exams</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold tracking-normal">Subject Bank</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
