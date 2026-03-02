import { NextRequest, NextResponse } from "next/server";
import { Checkout } from "@creem_io/nextjs";

const apiKey = process.env.CREEM_API_KEY;

const handler = apiKey
  ? Checkout({
      apiKey,
      testMode: process.env.CREEM_TEST_MODE === "true",
      defaultSuccessUrl: "/dashboard",
    })
  : null;

export async function GET(request: NextRequest) {
  if (!handler) {
    return NextResponse.json(
      { error: "CREEM_API_KEY is not configured on server" },
      { status: 500 },
    );
  }
  return handler(request);
}
