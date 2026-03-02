"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TrackedLink from "@/components/tracked-link";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { track } from "@/lib/analytics";

type NavItem = {
  href: string;
  label: string;
};

type SiteHeaderProps = {
  navItems: NavItem[];
  showActions?: boolean;
};

export default function SiteHeader({ navItems, showActions = true }: SiteHeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let client;
    try {
      client = getSupabaseBrowser();
    } catch {
      setAuthReady(true);
      return;
    }

    let mounted = true;
    client.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setIsAuthed(Boolean(data.session));
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setIsAuthed(Boolean(session));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function onLogout() {
    try {
      const client = getSupabaseBrowser();
      await client.auth.signOut();
      setIsAuthed(false);
      track("web_click_logout", { source: "header" });
      router.push("/");
    } catch {
      // noop
    }
  }

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

        {showActions && authReady ? (
          <div className="site-nav-actions">
            {isAuthed ? (
              <>
                <TrackedLink
                  className="btn btn-sm btn-ghost"
                  href="/dashboard"
                  eventName="web_click_dashboard"
                  eventProps={{ source: "header" }}
                >
                  Dashboard
                </TrackedLink>
                <button className="btn btn-sm btn-outline" type="button" onClick={onLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}
