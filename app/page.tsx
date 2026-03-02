import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import PricingCta from "@/components/pricing-cta";
import TrackedLink from "@/components/tracked-link";

export default function HomePage() {
  const pricingExperiment = process.env.NEXT_PUBLIC_PRICING_EXPERIMENT || "control";
  const isConversionPush = pricingExperiment === "conversion_push";

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
            <h1>Write better Reddit replies with ReplyMint.</h1>
            <p className="subtitle">
              {isConversionPush
                ? "Connect your account, generate high-signal replies, and measure outcomes in one workflow."
                : "Find threads, draft better answers, and publish with review controls."}
            </p>
            <div className="hero-actions">
              <PricingCta
                className="btn btn-primary"
                label={isConversionPush ? "Start 14-Day Pro Trial" : "Try Free 14 Days"}
                source="hero_primary"
                tier="pro"
              />
              <TrackedLink
                className="btn btn-outline"
                href="/dashboard"
                eventName="web_click_cta_view_dashboard"
                eventProps={{ source: "hero_secondary" }}
              >
                See Dashboard
              </TrackedLink>
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
          <div className="pricing-grid">
            <article className="pricing-card">
              <h3>Starter</h3>
              <p className="pricing-price">$9<span>/month</span></p>
              <p className="pricing-desc">For solo builders validating one product narrative.</p>
              <PricingCta
                className="btn btn-primary"
                label={isConversionPush ? "Start Starter" : "Choose Starter"}
                source="pricing_starter"
                tier="starter"
              />
            </article>
            <article className="pricing-card pricing-card-featured">
              <h3>Pro</h3>
              <p className="pricing-price">$19<span>/month</span></p>
              <p className="pricing-desc">
                {isConversionPush
                  ? "Best value for creators and operators running weekly Reddit outreach."
                  : "For creators and operators running continuous Reddit outreach."}
              </p>
              <PricingCta
                className="btn btn-primary"
                label={isConversionPush ? "Start Pro Trial" : "Choose Pro"}
                source="pricing_pro"
                tier="pro"
              />
            </article>
            <article className="pricing-card">
              <h3>Team</h3>
              <p className="pricing-price">$49<span>/month</span></p>
              <p className="pricing-desc">For teams needing shared workflows and higher monthly volume.</p>
              <PricingCta
                className="btn btn-primary"
                label={isConversionPush ? "Start Team Plan" : "Choose Team"}
                source="pricing_team"
                tier="team"
              />
            </article>
          </div>
          <div className="hero-actions">
            <TrackedLink
              className="btn btn-outline"
              href="mailto:support@example.com"
              eventName="web_click_cta_book_demo"
              eventProps={{ source: "pricing_secondary" }}
            >
              Book Demo
            </TrackedLink>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
