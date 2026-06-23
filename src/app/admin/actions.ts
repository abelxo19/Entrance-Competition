"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { AdminStats, AdminStudent, StudentFormInput } from "@/types/admin";

type ActionResult = { success: boolean; error?: string };

async function requireAdminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (error || profile?.role !== "admin") {
    throw new Error("Forbidden");
  }

  return { supabase, user };
}

function mapStudent(
  profile: {
    user_id: string;
    email: string;
    full_name: string | null;
    stream: AdminStudent["stream"];
    role: AdminStudent["role"];
    created_at: string;
  },
  pkg?: {
    plan: AdminStudent["plan"];
    status: AdminStudent["paymentStatus"];
    approved_at: string | null;
  } | null,
): AdminStudent {
  return {
    userId: profile.user_id,
    email: profile.email,
    fullName: profile.full_name,
    stream: profile.stream,
    role: profile.role ?? "student",
    plan: pkg?.plan ?? null,
    paymentStatus: pkg?.status ?? "pending",
    approvedAt: pkg?.approved_at ?? null,
    createdAt: profile.created_at,
  };
}

export async function getAdminStudents(): Promise<AdminStudent[]> {
  const { supabase } = await requireAdminClient();

  const [profilesResult, packagesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("user_id, email, full_name, stream, role, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("package_status").select("user_id, plan, status, approved_at"),
  ]);

  if (profilesResult.error) {
    console.error("Failed to load profiles:", profilesResult.error);
    throw new Error("Failed to load students");
  }

  if (packagesResult.error) {
    console.error("Failed to load package status:", packagesResult.error);
    throw new Error("Failed to load payment records");
  }

  const packageByUser = new Map(
    (packagesResult.data ?? []).map((pkg) => [pkg.user_id, pkg]),
  );

  return (profilesResult.data ?? []).map((profile) =>
    mapStudent(profile, packageByUser.get(profile.user_id)),
  );
}

export async function getAdminStats(): Promise<AdminStats> {
  const students = await getAdminStudents();

  return {
    total: students.length,
    pending: students.filter((s) => s.paymentStatus === "pending").length,
    approved: students.filter((s) => s.paymentStatus === "approved").length,
    rejected: students.filter((s) => s.paymentStatus === "rejected").length,
  };
}

export async function approveStudentPayment(userId: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdminClient();
    const { error } = await supabase.rpc("admin_approve_student", {
      target_user_id: userId,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to approve student",
    };
  }
}

export async function rejectStudentPayment(userId: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdminClient();
    const { error } = await supabase.rpc("admin_reject_student", {
      target_user_id: userId,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reject student",
    };
  }
}

export async function createStudent(input: StudentFormInput): Promise<ActionResult> {
  try {
    await requireAdminClient();

    if (!input.email || !input.fullName) {
      return { success: false, error: "Email and full name are required" };
    }

    if (!input.password || input.password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    const serviceClient = createServiceRoleClient();
    if (!serviceClient) {
      return {
        success: false,
        error: "SUPABASE_SERVICE_ROLE_KEY is not configured on the server",
      };
    }

    const { data, error } = await serviceClient.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: { full_name: input.fullName },
    });

    if (error || !data.user) {
      return { success: false, error: error?.message ?? "Failed to create user" };
    }

    const userId = data.user.id;
    const supabase = await createClient();

    const profileUpdate: Record<string, unknown> = {
      full_name: input.fullName,
      email: input.email,
      role: input.role,
    };
    if (input.stream) {
      profileUpdate.stream = input.stream;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update(profileUpdate)
      .eq("user_id", userId);

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    const packageUpdate: Record<string, unknown> = {
      status: input.paymentStatus,
      approved_at: input.paymentStatus === "approved" ? new Date().toISOString() : null,
    };
    if (input.plan) {
      packageUpdate.plan = input.plan;
    }

    const { error: packageError } = await supabase
      .from("package_status")
      .update(packageUpdate)
      .eq("user_id", userId);

    if (packageError) {
      return { success: false, error: packageError.message };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create student",
    };
  }
}

export async function updateStudent(
  userId: string,
  input: StudentFormInput,
): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdminClient();

    if (!input.email || !input.fullName) {
      return { success: false, error: "Email and full name are required" };
    }

    const profileUpdate: Record<string, unknown> = {
      email: input.email,
      full_name: input.fullName,
      role: input.role,
      stream: input.stream || null,
    };

    const { error: profileError } = await supabase
      .from("profiles")
      .update(profileUpdate)
      .eq("user_id", userId);

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    const packageUpdate: Record<string, unknown> = {
      plan: input.plan || null,
      status: input.paymentStatus,
      approved_at: input.paymentStatus === "approved" ? new Date().toISOString() : null,
    };

    const { error: packageError } = await supabase
      .from("package_status")
      .update(packageUpdate)
      .eq("user_id", userId);

    if (packageError) {
      return { success: false, error: packageError.message };
    }

    if (input.password && input.password.length >= 6) {
      const serviceClient = createServiceRoleClient();
      if (!serviceClient) {
        return {
          success: false,
          error: "SUPABASE_SERVICE_ROLE_KEY is required to reset passwords",
        };
      }

      const { error: passwordError } = await serviceClient.auth.admin.updateUserById(
        userId,
        { password: input.password },
      );

      if (passwordError) {
        return { success: false, error: passwordError.message };
      }
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update student",
    };
  }
}

export async function deleteStudent(userId: string): Promise<ActionResult> {
  try {
    await requireAdminClient();

    const serviceClient = createServiceRoleClient();
    if (!serviceClient) {
      return {
        success: false,
        error: "SUPABASE_SERVICE_ROLE_KEY is required to delete users",
      };
    }

    const { error } = await serviceClient.auth.admin.deleteUser(userId);
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete student",
    };
  }
}
