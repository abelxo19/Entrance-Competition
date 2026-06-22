import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Alpha Tutor, the Matric survival hub for Ethiopian students.</p>
        <div className="flex gap-4">
          <Link className="hover:text-foreground" href="/exams">
            Exams
          </Link>
          <Link className="hover:text-foreground" href="/exam/demo-2015">
            Workspace
          </Link>
          <Link className="hover:text-foreground" href="/results">
            Results
          </Link>
        </div>
      </div>
    </footer>
  );
}
