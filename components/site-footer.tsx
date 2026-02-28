import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-wide footer-inner">
        <Link href="/" className="brand-link">
          <span className="brand-dot" aria-hidden="true" />
          <span>Reddit AI Reply</span>
        </Link>
        <div className="footer-links">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/login">Login</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <p className="footer-copy">© 2026 Reddit AI Reply. All rights reserved.</p>
      </div>
    </footer>
  );
}
