"use client";

import { CreemCheckout } from "@creem_io/nextjs";
import { track } from "@/lib/analytics";

type PricingCtaProps = {
  className?: string;
  label: string;
  source: string;
  tier?: "starter" | "pro" | "team";
};

function resolveProductId(tier: NonNullable<PricingCtaProps["tier"]>) {
  if (tier === "starter") {
    return process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_STARTER ?? process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID;
  }
  if (tier === "pro") {
    return process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO ?? process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID;
  }
  return process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_TEAM ?? process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID;
}

export default function PricingCta({ className, label, source, tier = "starter" }: PricingCtaProps) {
  const productId = resolveProductId(tier);

  if (!productId) {
    return (
      <a
        href="/login"
        className={className}
        onClick={() => {
          track("creem_checkout_missing_product_id", { source, tier });
        }}
      >
        {label}
      </a>
    );
  }

  return (
    <CreemCheckout
      productId={productId}
      successUrl="/dashboard"
      metadata={{ source }}
      checkoutPath="/checkout"
    >
      <button
        className={className}
        type="button"
        onClick={() => {
          track("creem_checkout_started", { source, tier, productId });
        }}
      >
        {label}
      </button>
    </CreemCheckout>
  );
}
