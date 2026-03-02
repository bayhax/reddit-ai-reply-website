import { createClient } from "@supabase/supabase-js";

let authClient: ReturnType<typeof createClient> | null = null;

function getAuthClient() {
  if (authClient) return authClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  authClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return authClient;
}

export async function getUserFromBearer(authHeader: string | null) {
  const supabaseAuth = getAuthClient();
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return { token: null, user: null, error: "Missing bearer token" as const };

  const { data, error } = await supabaseAuth.auth.getUser(token);
  if (error || !data.user) {
    return { token, user: null, error: "Invalid session token" as const };
  }
  return { token, user: data.user, error: null };
}
