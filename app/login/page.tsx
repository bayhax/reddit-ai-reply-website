"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { resolveSession } from "@/lib/session-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let supabaseBrowser: ReturnType<typeof getSupabaseBrowser> | null = null;
    try {
      supabaseBrowser = getSupabaseBrowser();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Missing Supabase environment configuration.");
      setCheckingSession(false);
      return;
    }
    if (!supabaseBrowser) return;
    let active = true;

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session) router.replace("/dashboard");
    });

    resolveSession(supabaseBrowser, 4500)
      .then((session) => {
        if (!active) return;
        if (session) router.replace("/dashboard");
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function onEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    let supabaseBrowser: ReturnType<typeof getSupabaseBrowser> | null = null;
    try {
      supabaseBrowser = getSupabaseBrowser();
    } catch (error) {
      setLoading(false);
      setStatus(error instanceof Error ? error.message : "Missing Supabase environment configuration.");
      return;
    }
    if (!supabaseBrowser) return;
    const redirectTo = `${window.location.origin}/dashboard`;
    const { error } = await supabaseBrowser.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setLoading(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    setStatus("Magic link sent. Check your inbox.");
  }

  async function onGoogleLogin() {
    setLoading(true);
    setStatus("");
    let supabaseBrowser: ReturnType<typeof getSupabaseBrowser> | null = null;
    try {
      supabaseBrowser = getSupabaseBrowser();
    } catch (error) {
      setLoading(false);
      setStatus(error instanceof Error ? error.message : "Missing Supabase environment configuration.");
      return;
    }
    if (!supabaseBrowser) return;
    const redirectTo = `${window.location.origin}/dashboard`;
    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      setLoading(false);
      setStatus(error.message);
    }
  }

  return (
    <main className="login-page">
      <div className="login-layout">
        <section className="login-brand-panel">
          <Link href="/" className="brand-link brand-link-light">
            <span className="brand-dot" aria-hidden="true" />
            <span>ReplyMint</span>
          </Link>
          <h1>Write smarter Reddit replies with team-level quality control.</h1>
          <p>
            Used by solo operators, brands, and marketing teams to turn conversations into measurable growth.
          </p>
          <ul>
            <li>Detect intent-rich threads automatically</li>
            <li>Generate contextual drafts in your voice</li>
            <li>Review, approve, and measure conversion</li>
          </ul>
        </section>

        <section className="login-form-panel">
          {checkingSession ? (
            <div className="login-card login-card-loading">
              <h2>Checking session...</h2>
              <p>Syncing your account state.</p>
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line short" />
            </div>
          ) : (
          <form className="login-card" onSubmit={onEmailSubmit}>
            <h2>Welcome back</h2>
            <p>Sign in with your work email. No password required.</p>

            <label htmlFor="email">Work email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
            <button className="btn btn-outline" type="button" onClick={onGoogleLogin} disabled={loading}>
              Continue with Google
            </button>
            <span className="login-signup">{status || "New here? Use your email and we create the account."}</span>
          </form>
          )}
        </section>
      </div>
    </main>
  );
}
