"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { track } from "@/lib/analytics";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

export default function AnalyticsProvider() {
  useEffect(() => {
    if (!POSTHOG_KEY) return;

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false,
      persistence: "localStorage+cookie",
    });

    track("web_view_landing", {
      source: "website",
      page: window.location.pathname,
    });
  }, []);

  return null;
}

