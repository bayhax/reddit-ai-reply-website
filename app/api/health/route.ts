import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "replymint-website",
    timestamp: new Date().toISOString(),
    env: {
      hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasSupabaseAnon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      hasSupabaseServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hasCreemApiKey: Boolean(process.env.CREEM_API_KEY),
      hasCreemWebhookSecret: Boolean(process.env.CREEM_WEBHOOK_SECRET),
      hasOpenAiApiKey: Boolean(process.env.OPENAI_API_KEY),
      hasCreemStarterId: Boolean(process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_STARTER),
      hasCreemProId: Boolean(process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO),
      hasCreemTeamId: Boolean(process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_TEAM),
    },
  });
}
