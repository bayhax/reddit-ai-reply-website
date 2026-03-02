import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getUserFromBearer } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  const auth = await getUserFromBearer(request.headers.get("authorization"));
  if (auth.error || !auth.user) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const user = auth.user;
  const supabaseAdmin = getSupabaseAdmin();
  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("plan,subscription_status,creem_product_id,current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
    },
    profile: profile ?? {
      plan: "free",
      subscription_status: "inactive",
      creem_product_id: null,
      current_period_end: null,
    },
  });
}
