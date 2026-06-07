import type { SubjectResult } from "@/types/exam";

export function ResultsChart({ results }: { results: SubjectResult[] }) {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-5">
      <div>
        <h2 className="text-lg font-semibold">Subject Performance</h2>
        <p className="text-sm text-muted-foreground">Score distribution by subject.</p>
      </div>
      <div className="space-y-4">
        {results.map((result) => {
          const value = Math.round((result.score / result.total) * 100);

          return (
            <div key={result.subject}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium">{result.subject}</span>
                <span className="text-muted-foreground">{value}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
