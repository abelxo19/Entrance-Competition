"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  getSiteUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function safeNext(formData: FormData) {
  const next = value(formData, "next");
  return next.startsWith("/") && !next.startsWith("//") ? next : "/exams";
}

function authRedirect(params: Record<string, string>) {
  const search = new URLSearchParams(params);
  redirect(`/auth/login?${search.toString()}`);
}

export async function signIn(formData: FormData) {
  if (!isSupabaseConfigured()) {
    authRedirect({ error: "Supabase is not configured yet." });
  }

  const email = value(formData, "email");
  const password = value(formData, "password");
  const next = safeNext(formData);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    authRedirect({ mode: "signin", next, error: error.message });
  }

  redirect(next);
}

export async function signUp(formData: FormData) {
  if (!isSupabaseConfigured()) {
    authRedirect({ mode: "register", error: "Supabase is not configured yet." });
  }

  const fullName = value(formData, "fullName");
  const email = value(formData, "email");
  const password = value(formData, "password");
  const next = safeNext(formData);
  const requestHeaders = await headers();
  const origin =
    getSiteUrl() ?? requestHeaders.get("origin") ?? "http://localhost:3000";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    authRedirect({ mode: "register", next, error: error.message });
  }

  if (data.session) {
    redirect(next);
  }

  authRedirect({
    mode: "signin",
    next,
    message: "Check your email to confirm your Alpha Tutor account.",
  });
}

export async function requestPasswordReset(formData: FormData) {
  if (!isSupabaseConfigured()) {
    authRedirect({ mode: "forgot", error: "Supabase is not configured yet." });
  }

  const email = value(formData, "email");
  const requestHeaders = await headers();
  const origin =
    getSiteUrl() ?? requestHeaders.get("origin") ?? "http://localhost:3000";
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/auth/update-password`,
  });

  if (error) {
    authRedirect({ mode: "forgot", error: error.message });
  }

  authRedirect({
    mode: "signin",
    message: "Password reset instructions were sent to your email.",
  });
}

export async function updatePassword(formData: FormData) {
  const password = value(formData, "password");
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/auth/update-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/exams");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
