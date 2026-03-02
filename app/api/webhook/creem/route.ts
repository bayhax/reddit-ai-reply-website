import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "@creem_io/nextjs";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;
const starterId = process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_STARTER;
const proId = process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO;
const teamId = process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_TEAM;

function getPlanByProductId(productId: string | null | undefined) {
  if (!productId) return "free";
  if (productId === starterId) return "starter";
  if (productId === proId) return "pro";
  if (productId === teamId) return "team";
  return "free";
}

async function updateProfileByEmail(input: {
  email?: string | null;
  plan?: string;
  subscriptionStatus?: string;
  productId?: string | null;
  customerId?: string | null;
  subscriptionId?: string | null;
}) {
  const email = input.email?.toLowerCase().trim();
  if (!email) return;
  const supabaseAdmin = getSupabaseAdmin() as any;

  const { data: profileRaw } = await supabaseAdmin
    .from("user_profiles")
    .select("user_id")
    .eq("email", email)
    .maybeSingle();
  const profile = profileRaw as { user_id: string } | null;

  if (!profile?.user_id) return;

  await supabaseAdmin
    .from("user_profiles")
    .update({
      plan: input.plan,
      subscription_status: input.subscriptionStatus,
      creem_product_id: input.productId ?? null,
      creem_customer_id: input.customerId ?? null,
      creem_subscription_id: input.subscriptionId ?? null,
    })
    .eq("user_id", profile.user_id);
}

const handler = webhookSecret
  ? Webhook({
      webhookSecret,

      onCheckoutCompleted: async ({ customer, product, order, subscription }) => {
        const plan = getPlanByProductId(product?.id);
        await updateProfileByEmail({
          email: customer?.email,
          plan,
          subscriptionStatus: "active",
          productId: product?.id ?? null,
          customerId: customer?.id ?? null,
          subscriptionId: subscription?.id ?? null,
        });

        console.log("creem_checkout_success", {
          email: customer?.email,
          productId: product?.id,
          orderId: order?.id,
        });
      },

      onGrantAccess: async ({ customer, metadata, reason, product }) => {
        const plan = getPlanByProductId(product?.id);
        await updateProfileByEmail({
          email: customer?.email,
          plan,
          subscriptionStatus: "active",
          productId: product?.id ?? null,
          customerId: customer?.id ?? null,
        });

        console.log("creem_subscription_active", {
          email: customer?.email,
          reason,
          metadata,
        });
      },

      onRevokeAccess: async ({ customer, metadata, reason }) => {
        await updateProfileByEmail({
          email: customer?.email,
          plan: "free",
          subscriptionStatus: "canceled",
          productId: null,
          customerId: customer?.id ?? null,
        });

        console.log("creem_subscription_canceled", {
          email: customer?.email,
          reason,
          metadata,
        });
      },
    })
  : null;

export async function POST(request: NextRequest) {
  if (!handler) {
    return NextResponse.json(
      { error: "CREEM_WEBHOOK_SECRET is not configured on server" },
      { status: 500 },
    );
  }
  return handler(request);
}
