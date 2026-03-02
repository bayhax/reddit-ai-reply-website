import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getUserFromBearer } from "@/lib/auth-server";

type EventPayload = {
  event?: string;
  properties?: Record<string, string | number | boolean | null>;
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin() as any;
  const payload = (await request.json().catch(() => ({}))) as EventPayload;
  const event = (payload.event || "").trim();
  if (!event) {
    return NextResponse.json({ error: "Missing event" }, { status: 400, headers: corsHeaders() });
  }

  let userId: string | null = null;
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const auth = await getUserFromBearer(authHeader).catch(() => ({ user: null }));
    userId = auth.user?.id ?? null;
  }

  await supabaseAdmin.from("extension_events").insert({
    user_id: userId,
    event,
    properties: payload.properties ?? {},
    source: "extension",
  });

  return NextResponse.json({ ok: true }, { headers: corsHeaders() });
}
