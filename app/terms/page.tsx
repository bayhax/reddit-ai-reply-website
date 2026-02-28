import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function TermsPage() {
  return (
    <>
      <SiteHeader
        navItems={[
          { href: "/", label: "Home" },
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
        ]}
      />

      <main className="legal">
        <h1>Terms of Service</h1>
        <p className="updated">Last updated: February 25, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By installing or using Reddit AI Reply ("the Extension"), you agree to be bound by these Terms of Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Reddit AI Reply is a browser extension that generates AI-powered reply suggestions for Reddit posts and
          comments.
        </p>

        <h2>3. User Responsibilities</h2>
        <ul>
          <li>You are responsible for all content posted using the Extension&apos;s suggestions.</li>
          <li>You must comply with Reddit&apos;s Terms of Service and Content Policy.</li>
          <li>You are responsible for maintaining the security of your API keys.</li>
          <li>You must not use the Extension for spam, harassment, or policy-violating activity.</li>
          <li>You acknowledge that AI-generated content may contain errors or inaccuracies.</li>
        </ul>

        <h2>4. API Keys and Third-Party Services</h2>
        <p>
          The free tier requires your own API key from OpenAI or Anthropic. Your use of those APIs is governed by
          their own terms.
        </p>

        <h2>5. Paid Plans</h2>
        <ul>
          <li>Paid subscriptions are processed by Creem (creem.io), our Merchant of Record.</li>
          <li>Subscription fees are billed monthly or yearly in advance.</li>
          <li>Cancellation takes effect at the end of the current billing period.</li>
          <li>We reserve the right to change pricing with 30 days&apos; notice.</li>
        </ul>

        <h2>6. Intellectual Property</h2>
        <p>The Extension and its original features are owned by Reddit AI Reply.</p>

        <h2>7. Disclaimer of Warranties</h2>
        <p>
          The Extension is provided "as is" without warranty of any kind. AI-generated replies may be inaccurate or
          inappropriate.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          In no event shall Reddit AI Reply be liable for indirect, incidental, special, consequential, or punitive
          damages from use of the Extension.
        </p>

        <h2>9. Usage Limits</h2>
        <ul>
          <li>Free users are limited to 5 AI reply generations per day.</li>
          <li>We reserve the right to modify usage limits with reasonable notice.</li>
          <li>Abuse may result in suspension.</li>
        </ul>

        <h2>10. Modifications to Service</h2>
        <p>We reserve the right to modify or discontinue the Extension at any time.</p>

        <h2>11. Changes to Terms</h2>
        <p>We may revise these Terms at any time and publish updates on this page.</p>

        <h2>12. Contact</h2>
        <p>
          If you have questions about these Terms, contact us at <Link href="mailto:support@example.com">support@example.com</Link>.
        </p>
      </main>

      <SiteFooter />
    </>
  );
}
