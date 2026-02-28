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
        <p className="updated">Last updated: February 25, 2026</p>

        <h2>Overview</h2>
        <p>
          Reddit AI Reply ("the Extension") is a browser extension that generates AI-powered reply suggestions for
          Reddit. We are committed to protecting your privacy and being transparent about our data practices.
        </p>

        <h2>Data We Collect</h2>
        <p>The Extension collects and processes the following data locally on your device:</p>
        <ul>
          <li>
            <strong>Reddit post and comment text</strong>: Temporarily read from the current page to generate AI
            replies. This text is sent to the AI provider (OpenAI or Anthropic) you have configured and is not stored
            by us.
          </li>
          <li>
            <strong>Extension settings</strong>: Your chosen AI provider, model, language preference, and persona/bio
            are stored locally using Chrome&apos;s <code>chrome.storage.sync</code> API.
          </li>
          <li>
            <strong>API key</strong>: Your AI provider API key is stored locally in <code>chrome.storage.sync</code>
            and is only sent directly to the AI provider&apos;s API endpoint.
          </li>
        </ul>

        <h2>Data We Do NOT Collect</h2>
        <ul>
          <li>We do not collect personal information (name, email, etc.)</li>
          <li>We do not track your browsing history</li>
          <li>We do not use analytics or tracking scripts</li>
          <li>We do not sell or share any data with third parties</li>
          <li>We do not store any data on our servers — the Extension has no backend server</li>
        </ul>

        <h2>Third-Party Services</h2>
        <p>The Extension sends Reddit post/comment content to the AI provider you configure:</p>
        <ul>
          <li>
            <strong>OpenAI</strong> (api.openai.com) — <a href="https://openai.com/policies/privacy-policy">Privacy Policy</a>
          </li>
          <li>
            <strong>Anthropic</strong> (api.anthropic.com) — <a href="https://www.anthropic.com/privacy">Privacy Policy</a>
          </li>
        </ul>

        <h2>Payment Processing</h2>
        <p>
          If you choose to upgrade to a paid plan, payment is processed by <strong>Creem</strong> (creem.io), a
          third-party Merchant of Record.
        </p>

        <h2>Data Storage</h2>
        <p>
          All data is stored locally on your device using Chrome&apos;s built-in storage API (<code>chrome.storage.sync</code>
          ).
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
