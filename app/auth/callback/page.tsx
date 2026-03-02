"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

function getHashParams(hash: string) {
  const clean = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(clean);
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Finalizing sign-in...");

  useEffect(() => {
    let mounted = true;
    const searchParams = new URLSearchParams(window.location.search);
    const nextPath = searchParams.get("next") || "/dashboard";

    async function finishAuth() {
      let supabase;
      try {
        supabase = getSupabaseBrowser();
      } catch (error) {
        if (mounted) {
          setMessage(error instanceof Error ? error.message : "Missing Supabase configuration.");
        }
        return;
      }

      try {
        const hashParams = getHashParams(window.location.hash);
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const code = searchParams.get("code");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            throw new Error("Could not establish a session from callback.");
          }
        }

        if (!mounted) return;
        router.replace(nextPath);
      } catch (error) {
        if (!mounted) return;
        setMessage(error instanceof Error ? error.message : "Authentication callback failed.");
      }
    }

    void finishAuth();
    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <main className="login-page">
      <div className="login-layout">
        <section className="login-brand-panel">
          <h1>ReplyMint</h1>
          <p>Completing secure sign-in and syncing your workspace.</p>
        </section>
        <section className="login-form-panel">
          <div className="login-card login-card-loading">
            <h2>Signing you in</h2>
            <p>{message}</p>
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
            <button className="btn btn-outline" type="button" onClick={() => router.replace("/login")}>
              Back to login
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
