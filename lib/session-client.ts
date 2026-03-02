"use client";

import type { Session, SupabaseClient } from "@supabase/supabase-js";

export async function resolveSession(
  supabase: SupabaseClient,
  timeoutMs = 4000
): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;

  return await new Promise<Session | null>((resolve) => {
    const timer = window.setTimeout(() => {
      subscription.unsubscribe();
      resolve(null);
    }, timeoutMs);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) return;
      window.clearTimeout(timer);
      subscription.unsubscribe();
      resolve(session);
    });
  });
}
