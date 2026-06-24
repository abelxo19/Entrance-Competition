import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type StudentStream = "natural" | "social";
export type StudentPlan = "individual" | "squad";
export type PaymentStatus = "pending" | "approved" | "rejected";
export type UserRole = "student" | "admin";

export interface StudentAccess {
  user: User;
  profile: {
    fullName?: string;
    email: string;
    stream?: StudentStream;
    role: UserRole;
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
      .select("email, full_name, stream, role")
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
    console.error("Student access lookup failed", {
      userId: user.id,
      profileError: profileResult.error
        ? {
            code: profileResult.error.code,
            message: profileResult.error.message,
            details: profileResult.error.details,
            hint: profileResult.error.hint,
          }
        : null,
      packageError: packageResult.error
        ? {
            code: packageResult.error.code,
            message: packageResult.error.message,
            details: packageResult.error.details,
            hint: packageResult.error.hint,
          }
        : null,
    });
  }

  const profile =
    profileResult.data ??
    ((profileErrorRecoverable || Boolean(profileResult.error))
      ? {
          email: user.email ?? "",
          full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
          stream: null,
          role: "student" as const,
        }
      : null);
  const pkg =
    packageResult.data ??
    ((packageErrorRecoverable || Boolean(packageResult.error))
      ? {
          plan: null,
          status: "pending" as const,
          approved_at: null,
        }
      : null);

  return {
    user,
    profile: {
      email: profile?.email ?? user.email ?? "",
      fullName: profile?.full_name ?? undefined,
      stream: profile?.stream ?? undefined,
      role: profile?.role === "admin" ? "admin" : "student",
    },
    package: {
      plan: pkg?.plan ?? undefined,
      status: pkg?.status ?? "pending",
      approvedAt: pkg?.approved_at ?? undefined,
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
