import { NavbarClient } from "@/components/layout/navbar-client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  let isAuthenticated = false;
  let isAdmin = false;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      isAuthenticated = Boolean(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();
        isAdmin = profile?.role === "admin";
      }
    } catch {
      isAuthenticated = false;
      isAdmin = false;
    }
  }

  return <NavbarClient isAuthenticated={isAuthenticated} isAdmin={isAdmin} />;
}
