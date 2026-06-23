import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type StudentStream = "natural" | "social";
export type StudentPlan = "individual" | "squad";
export type PaymentStatus = "pending" | "approved" | "rejected";

export interface StudentAccess {
  user: User;
  profile: {
    fullName?: string;
    email: string;
    stream?: StudentStream;
  };
  package: {
    plan?: StudentPlan;
    status: PaymentStatus;
    approvedAt?: string;
  };
}

function isRecoverableStudentAccessError(code?: string, message?: string) {
  if (code === "PGRST116") {
    return true;
  }

  if (!message) {
    return false;
  }

  const normalized = message.toLowerCase();
  return normalized.includes("relation") && normalized.includes("does not exist");
}

export async function getStudentAccess(): Promise<StudentAccess> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/exams");
  }

  const [profileResult, packageResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("email, full_name, stream")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("package_status")
      .select("plan, status, approved_at")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const profileErrorRecoverable = isRecoverableStudentAccessError(
    profileResult.error?.code,
    profileResult.error?.message,
  );
  const packageErrorRecoverable = isRecoverableStudentAccessError(
    packageResult.error?.code,
    packageResult.error?.message,
  );

  if (
    (profileResult.error && !profileErrorRecoverable) ||
    (packageResult.error && !packageErrorRecoverable)
  ) {
    throw new Error(
      "Student access records are unavailable. Install the latest Supabase migration.",
    );
  }

  const profile =
    profileResult.data ??
    (profileErrorRecoverable
      ? {
          email: user.email ?? "",
          full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
          stream: null,
        }
      : null);
  const pkg =
    packageResult.data ??
    (packageErrorRecoverable
      ? {
          plan: null,
          status: "pending" as const,
          approved_at: null,
        }
      : null);

  if (!profile || !pkg) {
    throw new Error(
      "Student access records are unavailable. Install the latest Supabase migration.",
    );
  }

  return {
    user,
    profile: {
      email: profile.email,
      fullName: profile.full_name ?? undefined,
      stream: profile.stream ?? undefined,
    },
    package: {
      plan: pkg.plan ?? undefined,
      status: pkg.status,
      approvedAt: pkg.approved_at ?? undefined,
    },
  };
}

export async function requireApprovedStudent() {
  const access = await getStudentAccess();

  if (!access.profile.stream || !access.package.plan) {
    redirect("/onboarding");
  }

  if (access.package.status !== "approved") {
    redirect("/payment");
  }

  return access as StudentAccess & {
    profile: StudentAccess["profile"] & { stream: StudentStream };
    package: StudentAccess["package"] & {
      plan: StudentPlan;
      status: "approved";
    };
  };
}

/**
 * Requires the user to be an admin
 * Redirects to home if not authenticated or not admin
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/admin");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (error || profile?.role !== "admin") {
    redirect("/");
  }

  return user;
}
