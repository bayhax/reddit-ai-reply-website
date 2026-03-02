import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getUserFromBearer } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  const auth = await getUserFromBearer(request.headers.get("authorization"));
  if (auth.error || !auth.user) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdmin() as any;
  const now = new Date();
  const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
  const dayKey = now.toISOString().slice(0, 10);

  const usersRes = await supabaseAdmin.from("user_profiles").select("*", { count: "exact", head: true });
  const paidRes = await supabaseAdmin
    .from("user_profiles")
    .select("*", { count: "exact", head: true })
    .neq("plan", "free")
    .eq("subscription_status", "active");
  const historyRes = await supabaseAdmin
    .from("reply_history")
    .select("*", { count: "exact", head: true })
    .gte("created_at", dayStart);
  const usageRes = await supabaseAdmin.from("reply_usage_daily").select("count").eq("usage_date", dayKey);
  const eventsRes = await supabaseAdmin.from("extension_events").select("event").gte("created_at", dayStart);

  const freeUsageToday = (usageRes.data ?? []).reduce((sum: number, row: { count?: number }) => sum + (row.count ?? 0), 0);
  const events = eventsRes.data ?? [];
  const eventCounts: Record<string, number> = {};
  for (const row of events) {
    eventCounts[row.event] = (eventCounts[row.event] || 0) + 1;
  }

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    totals: {
      users: usersRes.count ?? 0,
      paidUsers: paidRes.count ?? 0,
      repliesToday: historyRes.count ?? 0,
      freeUsageToday,
      extensionEventsToday: events.length,
    },
    funnelToday: {
      popupOpened: eventCounts.ext_popup_opened ?? 0,
      accountConnected: eventCounts.ext_account_connected ?? 0,
      cloudModeSelected: eventCounts.ext_mode_cloud_selected ?? 0,
      cloudTestSuccess: eventCounts.ext_cloud_test_success ?? 0,
      generationRequested: eventCounts.ext_generation_requested ?? 0,
      generationSuccess: eventCounts.ext_generation_success ?? 0,
    },
  });
}
