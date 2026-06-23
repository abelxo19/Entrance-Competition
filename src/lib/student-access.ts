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
      .single(),
    supabase
      .from("package_status")
      .select("plan, status, approved_at")
      .eq("user_id", user.id)
      .single(),
  ]);

  if (profileResult.error || packageResult.error) {
    throw new Error(
      "Student access records are unavailable. Install the latest Supabase migration.",
    );
  }

  return {
    user,
    profile: {
      email: profileResult.data.email,
      fullName: profileResult.data.full_name ?? undefined,
      stream: profileResult.data.stream ?? undefined,
    },
    package: {
      plan: packageResult.data.plan ?? undefined,
      status: packageResult.data.status,
      approvedAt: packageResult.data.approved_at ?? undefined,
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
