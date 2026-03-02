"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { resolveSession } from "@/lib/session-client";

type MeResponse = {
  user: { id: string; email: string | null };
  profile: {
    plan: "free" | "starter" | "pro" | "team";
    subscription_status: string;
    creem_product_id: string | null;
    current_period_end: string | null;
  };
};

type HistoryItem = {
  id: number;
  mode: string;
  provider: string;
  language: string;
  post_excerpt: string;
  created_at: string;
};

type OpsMetricsResponse = {
  generatedAt: string;
  totals: {
    users: number;
    paidUsers: number;
    repliesToday: number;
    freeUsageToday: number;
    extensionEventsToday: number;
  };
  funnelToday: {
    popupOpened: number;
    accountConnected: number;
    cloudModeSelected: number;
    cloudTestSuccess: number;
    generationRequested: number;
    generationSuccess: number;
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [email, setEmail] = useState<string>("");
  const [plan, setPlan] = useState<string>("free");
  const [token, setToken] = useState<string | null>(null);
  const [extensionKey, setExtensionKey] = useState<string>("");
  const [keyStatus, setKeyStatus] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [ops, setOps] = useState<OpsMetricsResponse | null>(null);

  useEffect(() => {
    let supabaseBrowser: ReturnType<typeof getSupabaseBrowser> | null = null;
    try {
      supabaseBrowser = getSupabaseBrowser();
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Missing Supabase environment configuration.");
      setLoading(false);
      return;
    }
    if (!supabaseBrowser) return;
    let active = true;

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (!session) {
        router.replace("/login");
        return;
      }
      setToken(session.access_token);
    });

    async function boot() {
      try {
        setLoadError("");
        const session = await resolveSession(supabaseBrowser!, 4500);
        if (!active) return;
        if (!session?.access_token) {
          router.replace("/login");
          return;
        }
        const accessToken = session.access_token;
        setToken(accessToken);

        const headers = { Authorization: `Bearer ${accessToken}` };
        const [meRes, histRes, opsRes] = await Promise.all([
          fetch("/api/me", { headers }),
          fetch("/api/history", { headers }),
          fetch("/api/metrics/ops", { headers }),
        ]);

        if (meRes.status === 401) {
          router.replace("/login");
          return;
        }
        if (!meRes.ok) {
          throw new Error("Failed to load account profile.");
        }

        const me = (await meRes.json()) as MeResponse;
        if (!active) return;
        setEmail(me.user.email ?? "");
        setPlan(me.profile.plan ?? "free");

        if (histRes.ok) {
          const histJson = (await histRes.json()) as { items: HistoryItem[] };
          if (active) setHistory(histJson.items ?? []);
        }

        if (opsRes.ok) {
          const opsJson = (await opsRes.json()) as OpsMetricsResponse;
          if (active) setOps(opsJson);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load dashboard.";
        if (active) setLoadError(message);
      } finally {
        if (active) setLoading(false);
      }
    }

    void boot();
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function onLogout() {
    try {
      const supabaseBrowser = getSupabaseBrowser();
      await supabaseBrowser.auth.signOut();
    } catch {
      // Ignore local auth client issues and force route transition.
    }
    router.replace("/login");
  }

  async function generateExtensionKey(rotate = false) {
    if (!token) return;
    setKeyStatus("Generating extension key...");
    const res = await fetch(`/api/extension-key${rotate ? "?rotate=1" : ""}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setKeyStatus(err.error ?? "Failed to generate key");
      return;
    }
    const data = (await res.json()) as { extensionKey: string };
    setExtensionKey(data.extensionKey);
    setKeyStatus("Extension key ready. Copy it into extension Cloud Mode.");
  }

  async function copyExtensionKey() {
    if (!extensionKey) return;
    await navigator.clipboard.writeText(extensionKey);
    setKeyStatus("Copied extension key.");
  }

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <Link href="/" className="brand-link brand-link-light">
              <span className="brand-dot" aria-hidden="true" />
              <span>ReplyMint</span>
            </Link>
          </aside>
          <section className="dashboard-main">
            <div className="dashboard-loading-panel">
              <p className="dashboard-loading-kicker">Syncing account state</p>
              <h2>Loading dashboard</h2>
              <p>Fetching profile, history, and usage metrics.</p>
              <div className="dashboard-skeleton-grid">
                <div className="skeleton skeleton-card" />
                <div className="skeleton skeleton-card" />
                <div className="skeleton skeleton-card" />
                <div className="skeleton skeleton-card" />
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <Link href="/" className="brand-link brand-link-light">
              <span className="brand-dot" aria-hidden="true" />
              <span>ReplyMint</span>
            </Link>
          </aside>
          <section className="dashboard-main">
            <div className="dashboard-error-panel">
              <h2>Could not load dashboard</h2>
              <p>{loadError}</p>
              <div className="topbar-actions">
                <button className="btn btn-sm btn-primary" type="button" onClick={() => window.location.reload()}>
                  Retry
                </button>
                <button className="btn btn-sm btn-outline" type="button" onClick={onLogout}>
                  Log out
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const cloudCount = history.filter((item) => item.mode === "cloud").length;
  const byokCount = history.filter((item) => item.mode === "byok").length;

  return (
    <main className="dashboard-page">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <Link href="/" className="brand-link brand-link-light">
            <span className="brand-dot" aria-hidden="true" />
            <span>ReplyMint</span>
          </Link>

          <div className="workspace-pill">Plan: {plan.toUpperCase()}</div>

          <p className="sidebar-label">MAIN</p>
          <nav className="sidebar-nav">
            <Link href="/dashboard" className="sidebar-item active">
              Overview
            </Link>
            <span className="sidebar-item sidebar-item-muted">Thread Queue (soon)</span>
            <span className="sidebar-item sidebar-item-muted">Prompt Playbooks (soon)</span>
            <span className="sidebar-item sidebar-item-muted">Team Review (soon)</span>
          </nav>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-topbar">
            <div>
              <h1>Dashboard</h1>
              <p>{email ? `Signed in as ${email}` : "Track thread opportunities and reply outcomes in one place"}</p>
            </div>
            <div className="topbar-actions">
              <button className="btn btn-sm btn-primary" type="button" onClick={() => window.location.reload()}>
                Refresh Data
              </button>
              <button className="btn btn-sm btn-outline" type="button" onClick={onLogout}>
                Log out
              </button>
            </div>
          </header>

          <section className="stats-grid" aria-label="Metrics">
            <article className="metric-card">
              <p>My Replies</p>
              <strong>{history.length}</strong>
            </article>
            <article className="metric-card">
              <p>Cloud Replies</p>
              <strong>{cloudCount}</strong>
            </article>
            <article className="metric-card">
              <p>BYOK Replies</p>
              <strong>{byokCount}</strong>
            </article>
            <article className="metric-card">
              <p>Account Plan</p>
              <strong>{plan.toUpperCase()}</strong>
            </article>
          </section>

          <section className="work-grid">
            <article className="panel">
              <h2>Activation Funnel (Today)</h2>
              <ul className="queue-list">
                <li>Popup opened: {ops?.funnelToday.popupOpened ?? 0}</li>
                <li>Account connected: {ops?.funnelToday.accountConnected ?? 0}</li>
                <li>Cloud mode selected: {ops?.funnelToday.cloudModeSelected ?? 0}</li>
                <li>Cloud test success: {ops?.funnelToday.cloudTestSuccess ?? 0}</li>
                <li>Generation requested: {ops?.funnelToday.generationRequested ?? 0}</li>
                <li>Generation success: {ops?.funnelToday.generationSuccess ?? 0}</li>
              </ul>
            </article>

            <article className="panel panel-compact">
              <h2>Ops Snapshot</h2>
              <div className="performance-row">
                <span>Total users</span>
                <strong>{ops?.totals.users ?? 0}</strong>
              </div>
              <div className="performance-row">
                <span>Paid users</span>
                <strong>{ops?.totals.paidUsers ?? 0}</strong>
              </div>
              <div className="performance-row">
                <span>Replies today</span>
                <strong>{ops?.totals.repliesToday ?? 0}</strong>
              </div>
              <div className="performance-row">
                <span>Events today</span>
                <strong>{ops?.totals.extensionEventsToday ?? 0}</strong>
              </div>
            </article>
          </section>

          <section className="panel">
            <h2>Extension Cloud Mode</h2>
            <p style={{ color: "#64748b", marginBottom: 12 }}>
              Paid plans can use ReplyMint Cloud Mode and skip personal API keys in extension.
            </p>
            <div className="topbar-actions">
              <button className="btn btn-sm btn-primary" type="button" onClick={() => generateExtensionKey(false)}>
                Get Extension Key
              </button>
              <button className="btn btn-sm btn-outline" type="button" onClick={() => generateExtensionKey(true)}>
                Rotate Key
              </button>
              <button className="btn btn-sm btn-outline" type="button" onClick={copyExtensionKey} disabled={!extensionKey}>
                Copy Key
              </button>
            </div>
            <input
              className="topbar-search"
              type="text"
              value={extensionKey}
              readOnly
              placeholder="Click Get Extension Key"
              style={{ marginTop: 12, width: "100%" }}
            />
            <p style={{ color: "#64748b", marginTop: 8, fontSize: 13 }}>{keyStatus}</p>
          </section>

          <section className="panel">
            <h2>Recent Replies</h2>
            <div className="reply-table" role="table" aria-label="Recent replies table">
              <div className="reply-row reply-head" role="row">
                <span>Excerpt</span>
                <span>Mode</span>
                <span>Provider</span>
                <span>Created</span>
              </div>
              {history.length === 0 ? (
                <div className="reply-row" role="row">
                  <span>No history yet</span>
                  <span>-</span>
                  <span>-</span>
                  <span>-</span>
                </div>
              ) : (
                history.slice(0, 8).map((item) => (
                  <div className="reply-row" role="row" key={item.id}>
                    <span>{item.post_excerpt || "-"}</span>
                    <span>{item.mode}</span>
                    <span>{item.provider}</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
