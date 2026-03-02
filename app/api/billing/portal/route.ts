import { NextRequest, NextResponse } from "next/server";
import { getUserFromBearer } from "@/lib/auth-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const creemApiKey = process.env.CREEM_API_KEY;

export async function POST(request: NextRequest) {
  if (!creemApiKey) {
    return NextResponse.json({ error: "CREEM_API_KEY not configured" }, { status: 500 });
  }

  const auth = await getUserFromBearer(request.headers.get("authorization"));
  if (auth.error || !auth.user) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdmin() as any;
  const { data: profileRaw } = await supabaseAdmin
    .from("user_profiles")
    .select("creem_customer_id")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  const profile = profileRaw as { creem_customer_id: string | null } | null;

  if (!profile?.creem_customer_id) {
    return NextResponse.json({ error: "No billing customer linked yet" }, { status: 404 });
  }

  const response = await fetch("https://api.creem.io/v1/customers/billing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": creemApiKey,
    },
    body: JSON.stringify({
      customer_id: profile.creem_customer_id,
      return_url: "https://reddit-ai-reply-website.vercel.app/dashboard",
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    return NextResponse.json({ error: payload.error || "Failed to create billing portal link" }, { status: 502 });
  }

  return NextResponse.json({ url: payload.url || payload.billing_url || payload.portal_url || null });
}
