import { headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

export const MAX_DEVICES = 2;

export const DEVICE_LIMIT_MESSAGE =
  "This account is already signed in on 2 devices. Sign out on another device first.";

type SessionResult = { ok: true } | { ok: false; error: string };

export function getDeviceLabel(userAgent: string | null) {
  if (!userAgent) {
    return "Unknown device";
  }

  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return "Apple mobile";
  }

  if (/Android/i.test(userAgent)) {
    return "Android device";
  }

  if (/Windows/i.test(userAgent)) {
    return "Windows PC";
  }

  if (/Macintosh|Mac OS/i.test(userAgent)) {
    return "Mac";
  }

  if (/Linux/i.test(userAgent)) {
    return "Linux PC";
  }

  return "Web browser";
}

export async function getRequestUserAgent() {
  const requestHeaders = await headers();
  return requestHeaders.get("user-agent");
}

export function getSessionIdFromClaims(
  claims: Record<string, unknown> | null | undefined,
) {
  const sessionId = claims?.session_id;
  return typeof sessionId === "string" && sessionId.length > 0 ? sessionId : null;
}

export async function registerCurrentDeviceSession(
  supabase: SupabaseClient,
  userAgent?: string | null,
): Promise<SessionResult> {
  const { data: claimsData } = await supabase.auth.getClaims();
  const sessionId = getSessionIdFromClaims(
    claimsData?.claims as Record<string, unknown> | undefined,
  );

  if (!sessionId) {
    return { ok: false, error: "Invalid session" };
  }

  const resolvedUserAgent = userAgent ?? (await getRequestUserAgent());
  const deviceLabel = getDeviceLabel(resolvedUserAgent);

  const { data, error } = await supabase.rpc("register_device_session", {
    p_session_id: sessionId,
    p_device_label: deviceLabel,
    p_user_agent: resolvedUserAgent,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  const result = data as { ok?: boolean; error?: string } | null;
  if (!result?.ok) {
    return { ok: false, error: result?.error ?? DEVICE_LIMIT_MESSAGE };
  }

  return { ok: true };
}

export async function revokeCurrentDeviceSession(supabase: SupabaseClient) {
  const { data: claimsData } = await supabase.auth.getClaims();
  const sessionId = getSessionIdFromClaims(
    claimsData?.claims as Record<string, unknown> | undefined,
  );

  if (!sessionId) {
    return;
  }

  await supabase.rpc("revoke_device_session", {
    p_session_id: sessionId,
  });
}

export async function ensureCurrentDeviceSession(
  supabase: SupabaseClient,
  userAgent?: string | null,
): Promise<SessionResult> {
  const { data: claimsData } = await supabase.auth.getClaims();
  const sessionId = getSessionIdFromClaims(
    claimsData?.claims as Record<string, unknown> | undefined,
  );

  if (!sessionId) {
    return { ok: false, error: "Invalid session" };
  }

  const { data: isActive, error } = await supabase.rpc("is_device_session_active", {
    p_session_id: sessionId,
  });

  if (error) {
    return { ok: true };
  }

  if (isActive) {
    return { ok: true };
  }

  return registerCurrentDeviceSession(supabase, userAgent);
}
