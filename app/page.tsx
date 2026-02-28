import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader
        navItems={[
          { href: "/#features", label: "Features" },
          { href: "/dashboard", label: "Dashboard" },
          { href: "/#pricing", label: "Pricing" },
        ]}
      />

      <main>
        <section className="home-hero container-wide">
          <div className="hero-copy">
            <p className="eyebrow">Built for solo creators, brands, and marketing teams</p>
            <h1>Reply faster on Reddit with AI.</h1>
            <p className="subtitle">Find threads, draft better answers, and publish with review controls.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/login">
                Try Free 14 Days
              </Link>
              <Link className="btn btn-outline" href="/dashboard">
                See Dashboard
              </Link>
            </div>
          </div>
          <aside className="hero-card">
            <h2>Live Thread Assistant</h2>
            <p className="hero-thread">r/SaaS: How to validate product ideas quickly?</p>
            <p>AI Draft: Start with 15 user interviews, then run one lightweight landing page test.</p>
          </aside>
        </section>

        <section className="home-section container-wide" id="features">
          <h2>One workflow for creators, brands, and marketing teams</h2>
          <div className="card-grid three-up">
            <article className="info-card">
              <h3>For Solo Creators</h3>
              <p>Find intent-rich threads and answer fast in your own voice.</p>
            </article>
            <article className="info-card">
              <h3>For Brand Teams</h3>
              <p>Keep replies on-brand with templates and approval rules.</p>
            </article>
            <article className="info-card">
              <h3>For Marketing Teams</h3>
              <p>Collaborate on drafts and track reply-to-signup impact.</p>
            </article>
          </div>
        </section>

        <section className="home-section home-section-alt" id="how-it-works">
          <div className="container-wide">
            <p className="eyebrow">How it works</p>
            <h2>A focused pipeline from thread discovery to measurable results</h2>
            <div className="card-grid three-up">
              <article className="step-card">
                <h3>1. Detect</h3>
                <p>Track relevant subreddits and buying intent in real time.</p>
              </article>
              <article className="step-card">
                <h3>2. Draft</h3>
                <p>Generate contextual responses with persona and CTA controls.</p>
              </article>
              <article className="step-card">
                <h3>3. Optimize</h3>
                <p>Measure output by subreddit, prompt, and teammate.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="home-section container-wide" id="pricing">
          <p className="eyebrow">Launch in minutes</p>
          <h2>Turn Reddit conversations into qualified pipeline</h2>
          <p className="subtitle">
            Create workspace, connect prompts, invite teammates, and ship your first campaign this afternoon.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/login">
              Start Free
            </Link>
            <Link className="btn btn-outline" href="mailto:support@example.com">
              Book Demo
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
