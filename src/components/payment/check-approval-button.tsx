"use client";

import { RefreshCw } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CheckApprovalButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      className="mt-5 w-full"
      disabled={isPending}
      onClick={() => startTransition(() => router.refresh())}
    >
      <RefreshCw
        className={isPending ? "animate-spin" : ""}
        aria-hidden="true"
      />
      {isPending ? "Checking status..." : "Check approval status"}
    </Button>
  );
}
