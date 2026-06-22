import { LogOut, UserRound } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export function PortalUserMenu({
  email,
  fullName,
}: {
  email?: string;
  fullName?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-semibold">{fullName || "Student"}</p>
        <p className="max-w-48 truncate text-xs text-muted-foreground">{email}</p>
      </div>
      <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
        <UserRound className="size-4" aria-hidden="true" />
      </span>
      <form action={signOut}>
        <Button type="submit" variant="ghost" size="icon" aria-label="Sign out">
          <LogOut aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}
