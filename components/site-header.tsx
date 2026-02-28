"use client";

import Link from "next/link";
import { useState } from "react";

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
        <Link href="/" className="brand-link">
          <span className="brand-dot" aria-hidden="true" />
          <span>Reddit AI Reply</span>
        </Link>

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
            <Link key={item.href + item.label} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>

        {showActions ? (
          <div className="site-nav-actions">
            <Link className="btn btn-sm btn-ghost" href="/login">
              Log in
            </Link>
            <Link className="btn btn-sm btn-primary" href="/login">
              Start Free
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
