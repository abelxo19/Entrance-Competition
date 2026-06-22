import { NavbarClient } from "@/components/layout/navbar-client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  let isAuthenticated = false;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getClaims();
      isAuthenticated = Boolean(data?.claims);
    } catch {
      isAuthenticated = false;
    }
  }

  return <NavbarClient isAuthenticated={isAuthenticated} />;
}
