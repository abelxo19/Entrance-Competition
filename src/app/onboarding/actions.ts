"use server";

import { redirect } from "next/navigation";
import {
  getStudentAccess,
  type StudentPlan,
  type StudentStream,
} from "@/lib/student-access";
import { createClient } from "@/lib/supabase/server";

function formValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function selectStream(formData: FormData) {
  const stream = formValue(formData, "stream") as StudentStream;

  if (stream !== "natural" && stream !== "social") {
    redirect("/onboarding?error=Choose a valid study stream.");
  }

  const access = await getStudentAccess();

  if (access.package.status === "approved") {
    redirect("/exams");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("select_student_stream", {
    selected_stream: stream,
  });

  if (error) {
    redirect(`/onboarding?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/onboarding?step=plan");
}

export async function selectPlan(formData: FormData) {
  const plan = formValue(formData, "plan") as StudentPlan;

  if (plan !== "individual" && plan !== "squad") {
    redirect("/onboarding?step=plan&error=Choose a valid access plan.");
  }

  const access = await getStudentAccess();

  if (!access.profile.stream) {
    redirect("/onboarding");
  }

  if (access.package.status === "approved") {
    redirect("/exams");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("select_package_plan", {
    selected_plan: plan,
  });

  if (error) {
    redirect(
      `/onboarding?step=plan&error=${encodeURIComponent(error.message)}`,
    );
  }

  redirect("/payment");
}

export async function changeSelection() {
  const access = await getStudentAccess();

  if (access.package.status === "approved") {
    redirect("/exams");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("reset_package_selection");

  if (error) {
    redirect(`/payment?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/onboarding");
}
