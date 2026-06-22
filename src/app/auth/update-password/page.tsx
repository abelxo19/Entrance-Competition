import { LockKeyhole } from "lucide-react";
import { updatePassword } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface UpdatePasswordPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function UpdatePasswordPage({
  searchParams,
}: UpdatePasswordPageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <span className="mb-3 flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </span>
          <CardTitle>Choose a new password</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Use at least eight characters and avoid reusing an old password.
          </p>
        </CardHeader>
        <CardContent>
          {error ? (
            <div
              role="alert"
              className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </div>
          ) : null}
          <form action={updatePassword} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold">New password</span>
              <Input
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>
            <Button type="submit" className="w-full">
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
