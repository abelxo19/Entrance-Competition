export function getSupabaseConfig() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const url = rawUrl
    ?.replace(/\/(?:rest|auth|storage)\/v1\/?$/i, "")
    .replace(/\/+$/, "");
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  return { url, key };
}

export function isSupabaseConfigured() {
  const { url, key } = getSupabaseConfig();

  if (!url || !key) return false;

  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname.endsWith(".supabase.co")
    );
  } catch {
    return false;
  }
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
}
