import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <Link href="/" className="brand-link brand-link-light">
            <span className="brand-dot" aria-hidden="true" />
            <span>Reddit AI Reply</span>
          </Link>

          <div className="workspace-pill">Workspace: Growth Team</div>

          <p className="sidebar-label">MAIN</p>
          <nav className="sidebar-nav">
            <Link href="/dashboard" className="sidebar-item active">
              Overview
            </Link>
            <a href="#" className="sidebar-item">
              Thread Queue
            </a>
            <a href="#" className="sidebar-item">
              Prompt Playbooks
            </a>
            <a href="#" className="sidebar-item">
              Team Review
            </a>
          </nav>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-topbar">
            <div>
              <h1>Dashboard</h1>
              <p>Track thread opportunities and reply outcomes in one place</p>
            </div>
            <div className="topbar-actions">
              <input className="topbar-search" type="text" placeholder="Search subreddit, keyword..." aria-label="Search" />
              <button className="btn btn-sm btn-primary" type="button">
                New Reply Batch
              </button>
            </div>
          </header>

          <section className="stats-grid" aria-label="Metrics">
            <article className="metric-card">
              <p>Threads Matched</p>
              <strong>126</strong>
            </article>
            <article className="metric-card">
              <p>Replies Published</p>
              <strong>89</strong>
            </article>
            <article className="metric-card">
              <p>Avg Upvotes</p>
              <strong>23.4</strong>
            </article>
            <article className="metric-card">
              <p>Conversion Rate</p>
              <strong>6.8%</strong>
            </article>
          </section>

          <section className="work-grid">
            <article className="panel">
              <h2>Reply Queue</h2>
              <ul className="queue-list">
                <li>r/Entrepreneur | Draft ready | Needs review</li>
                <li>r/Marketing | High intent | Publish today</li>
                <li>r/SaaS | New opportunity | AI score 92</li>
              </ul>
            </article>

            <article className="panel panel-compact">
              <h2>Weekly Performance</h2>
              <div className="performance-row">
                <span>Published</span>
                <strong>+18%</strong>
              </div>
            </article>
          </section>

          <section className="panel">
            <h2>Recent Replies</h2>
            <div className="reply-table" role="table" aria-label="Recent replies table">
              <div className="reply-row reply-head" role="row">
                <span>Subreddit</span>
                <span>Status</span>
                <span>Owner</span>
                <span>Result</span>
              </div>
              <div className="reply-row" role="row">
                <span>r/Startups</span>
                <span className="status-live">Published</span>
                <span>Sarah</span>
                <span>31 upvotes</span>
              </div>
              <div className="reply-row" role="row">
                <span>r/Marketing</span>
                <span className="status-review">In review</span>
                <span>Alex</span>
                <span>Pending</span>
              </div>
              <div className="reply-row" role="row">
                <span>r/SaaS</span>
                <span className="status-scheduled">Scheduled</span>
                <span>Mina</span>
                <span>ETA 2h</span>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
