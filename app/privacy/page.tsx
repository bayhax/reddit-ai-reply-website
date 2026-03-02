import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function PrivacyPage() {
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
        <h1>Privacy Policy</h1>
        <p className="updated">Last updated: March 2, 2026</p>

        <h2>Overview</h2>
        <p>
          ReplyMint ("the Extension") is a browser extension that generates AI-powered reply suggestions for
          Reddit. We are committed to protecting your privacy and being transparent about our data practices.
        </p>

        <h2>Data We Collect</h2>
        <p>ReplyMint collects and processes the following data:</p>
        <ul>
          <li>
            <strong>Reddit post and comment text</strong>: Temporarily read from the current page to generate AI
            replies. In Cloud Mode, this content is processed by ReplyMint backend and the configured model provider.
          </li>
          <li>
            <strong>Extension settings</strong>: Your selected mode, language, and persona are stored in
            <code> chrome.storage.sync </code>.
          </li>
          <li>
            <strong>Account and subscription data</strong>: If you sign in, we store your account and subscription
            status in Supabase to enforce plan access.
          </li>
        </ul>

        <h2>Data We Do Not Collect</h2>
        <ul>
          <li>We do not sell personal data.</li>
          <li>We do not use Reddit content for model training.</li>
          <li>We do not collect unrelated browsing history.</li>
          <li>We do not sell or share any data with third parties</li>
        </ul>

        <h2>Third-Party Services</h2>
        <p>Reply generation may involve these providers:</p>
        <ul>
          <li>
            <strong>OpenAI</strong> (api.openai.com) —{" "}
            <a href="https://openai.com/policies/privacy-policy">Privacy Policy</a>
          </li>
          <li>
            <strong>Anthropic</strong> (api.anthropic.com) —{" "}
            <a href="https://www.anthropic.com/privacy">Privacy Policy</a>
          </li>
          <li>
            <strong>Supabase</strong> (supabase.com) for authentication and account data
          </li>
          <li>
            <strong>PostHog</strong> (posthog.com) for product analytics
          </li>
        </ul>

        <h2>Payment Processing</h2>
        <p>
          If you choose to upgrade to a paid plan, payment is processed by <strong>Creem</strong> (creem.io), a
          third-party Merchant of Record.
        </p>

        <h2>Data Storage</h2>
        <p>
          Extension preferences are stored in <code>chrome.storage.sync</code>. Account and subscription records are
          stored in Supabase.
        </p>

        <h2>Permissions</h2>
        <ul>
          <li>
            <strong>storage</strong>: To save your extension settings.
          </li>
          <li>
            <strong>activeTab</strong>: To read current Reddit page content for generating replies.
          </li>
          <li>
            <strong>Host permissions</strong>: To make API calls to AI providers.
          </li>
        </ul>

        <h2>Data Deletion</h2>
        <p>You can delete all stored data at any time by removing the extension from Chrome.</p>

        <h2>Children&apos;s Privacy</h2>
        <p>The Extension is not intended for use by children under the age of 13.</p>

        <h2>Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time.</p>

        <h2>Contact</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at:{" "}
          <Link href="mailto:support@example.com">support@example.com</Link>
        </p>
      </main>

      <SiteFooter />
    </>
  );
}
