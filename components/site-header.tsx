"use client";

import { useState } from "react";
import TrackedLink from "@/components/tracked-link";

type NavItem = {
  href: string;
  label: string;
};

type SiteHeaderProps = {
  navItems: NavItem[];
  showActions?: boolean;
};

export default function SiteHeader({ navItems, showActions = true }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-nav">
      <div className="site-nav-inner container-wide">
        <TrackedLink
          href="/"
          className="brand-link"
          eventName="web_click_brand_home"
          eventProps={{ source: "header" }}
        >
          <span className="brand-dot" aria-hidden="true" />
          <span>ReplyMint</span>
        </TrackedLink>

        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          ☰
        </button>

        <nav className={`site-nav-links ${open ? "open" : ""}`}>
          {navItems.map((item) => (
            <TrackedLink
              key={item.href + item.label}
              href={item.href}
              eventName="web_click_nav_item"
              eventProps={{ source: "header", label: item.label, href: item.href }}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </TrackedLink>
          ))}
        </nav>

        {showActions ? (
          <div className="site-nav-actions">
            <TrackedLink
              className="btn btn-sm btn-ghost"
              href="/login"
              eventName="web_click_login"
              eventProps={{ source: "header" }}
            >
              Log in
            </TrackedLink>
            <TrackedLink
              className="btn btn-sm btn-primary"
              href="/login"
              eventName="web_click_cta_try_free"
              eventProps={{ source: "header" }}
            >
              Start Free
            </TrackedLink>
          </div>
        ) : null}
      </div>
    </header>
  );
}
