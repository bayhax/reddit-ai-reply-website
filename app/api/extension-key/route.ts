import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromBearer } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function generateKey() {
  return `rmk_${crypto.randomBytes(24).toString("hex")}`;
}

export async function POST(request: NextRequest) {
  const auth = await getUserFromBearer(request.headers.get("authorization"));
  if (auth.error || !auth.user) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdmin() as any;
  const rotate = request.nextUrl.searchParams.get("rotate") === "1";
  const { data: existing } = await supabaseAdmin
    .from("user_profiles")
    .select("extension_api_key")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  const key = !rotate && existing?.extension_api_key ? existing.extension_api_key : generateKey();

  const { error } = await supabaseAdmin.from("user_profiles").upsert(
    {
      user_id: auth.user.id,
      email: auth.user.email ?? null,
      extension_api_key: key,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ extensionKey: key });
}
