import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-layout">
        <section className="login-brand-panel">
          <Link href="/" className="brand-link brand-link-light">
            <span className="brand-dot" aria-hidden="true" />
            <span>Reddit AI Reply</span>
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
          <form className="login-card" action="#" method="post">
            <h2>Welcome back</h2>
            <p>Sign in to continue managing your Reddit pipeline</p>

            <label htmlFor="email">Work email</label>
            <input id="email" name="email" type="email" placeholder="you@company.com" required />

            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••••" required />

            <div className="login-row">
              <label className="checkbox-row" htmlFor="remember">
                <input id="remember" name="remember" type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <a href="#">Forgot password?</a>
            </div>

            <button className="btn btn-primary" type="submit">
              Sign in
            </button>
            <button className="btn btn-outline" type="button">
              Continue with Google
            </button>
            <a className="login-signup" href="#">
              New here? Create an account
            </a>
          </form>
        </section>
      </div>
    </main>
  );
}
