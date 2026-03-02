"use client";

import Link from "next/link";
import type { LinkProps } from "next/link";
import type { ReactNode } from "react";
import { track, type AnalyticsProps } from "@/lib/analytics";

type TrackedLinkProps = LinkProps & {
  className?: string;
  children: ReactNode;
  eventName: string;
  eventProps?: AnalyticsProps;
  onClick?: () => void;
};

export default function TrackedLink({
  eventName,
  eventProps,
  onClick,
  children,
  ...linkProps
}: TrackedLinkProps) {
  return (
    <Link
      {...linkProps}
      onClick={() => {
        track(eventName, eventProps);
        onClick?.();
      }}
    >
      {children}
    </Link>
  );
}

