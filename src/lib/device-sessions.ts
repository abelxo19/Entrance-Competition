import { headers } from "next/headers";
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

export const MAX_DEVICES = 2;

export const DEVICE_LIMIT_MESSAGE =
  "This account is already signed in on 2 devices. Sign out on another device first.";

type SessionResult = { ok: true } | { ok: false; error: string };

function isMissingRpcError(error: PostgrestError | null | undefined) {
  if (!error) {
    return false;
  }

  return (
    error.code === "PGRST202" ||
    error.message.toLowerCase().includes("could not find the function")
  );
}

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

function decodeSessionIdFromAccessToken(accessToken: string | undefined) {
  if (!accessToken) {
    return null;
  }

  try {
    const payload = accessToken.split(".")[1];
    if (!payload) {
      return null;
    }

    const decoded = JSON.parse(
      Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(
        "utf8",
      ),
    ) as { session_id?: string };

    return typeof decoded.session_id === "string" && decoded.session_id.length > 0
      ? decoded.session_id
      : null;
  } catch {
    return null;
  }
}

export function getSessionIdFromClaims(
  claims: Record<string, unknown> | null | undefined,
) {
  const sessionId = claims?.session_id;
  return typeof sessionId === "string" && sessionId.length > 0 ? sessionId : null;
}

export async function getCurrentSessionId(supabase: SupabaseClient) {
  const { data: claimsData } = await supabase.auth.getClaims();
  const fromClaims = getSessionIdFromClaims(
    claimsData?.claims as Record<string, unknown> | undefined,
  );

  if (fromClaims) {
    return fromClaims;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return decodeSessionIdFromAccessToken(session?.access_token);
}

export async function registerCurrentDeviceSession(
  supabase: SupabaseClient,
  userAgent?: string | null,
): Promise<SessionResult> {
  const sessionId = await getCurrentSessionId(supabase);

  if (!sessionId) {
    return { ok: false, error: "Invalid session" };
  }

  const resolvedUserAgent = userAgent ?? (await getRequestUserAgent());
  const deviceLabel = getDeviceLabel(resolvedUserAgent);

  const { data, error } = await supabase.rpc("register_device_session", {
    p_device_label: deviceLabel,
    p_session_id: sessionId,
    p_user_agent: resolvedUserAgent,
  });

  if (error) {
    if (isMissingRpcError(error)) {
      return { ok: true };
    }

    return { ok: false, error: error.message };
  }

  const result = data as { ok?: boolean; error?: string } | null;
  if (!result?.ok) {
    return { ok: false, error: result?.error ?? DEVICE_LIMIT_MESSAGE };
  }

  return { ok: true };
}

export async function revokeCurrentDeviceSession(supabase: SupabaseClient) {
  const sessionId = await getCurrentSessionId(supabase);

  if (!sessionId) {
    await supabase.rpc("clear_user_device_sessions");
    return;
  }

  const { error } = await supabase.rpc("revoke_device_session", {
    p_session_id: sessionId,
  });

  if (error && !isMissingRpcError(error)) {
    console.error("Failed to revoke device session:", error.message);
  }
}

export async function ensureCurrentDeviceSession(
  supabase: SupabaseClient,
  userAgent?: string | null,
): Promise<SessionResult> {
  const sessionId = await getCurrentSessionId(supabase);

  if (!sessionId) {
    return { ok: true };
  }

  const { data: isActive, error } = await supabase.rpc("is_device_session_active", {
    p_session_id: sessionId,
  });

  if (error) {
    if (isMissingRpcError(error)) {
      return { ok: true };
    }

    return { ok: true };
  }

  if (isActive) {
    return { ok: true };
  }

  return registerCurrentDeviceSession(supabase, userAgent);
}
