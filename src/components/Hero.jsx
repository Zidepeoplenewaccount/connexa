import './hero.css';

const marqueeItems = [
  { text: 'Network', color: 'var(--orange)' },
  { text: 'Grow', color: 'var(--green)' },
  { text: 'Sell', color: 'var(--red)' },
  { text: 'Connect', color: 'var(--blue)' },
  { text: 'Build', color: 'var(--orange)' },
  { text: 'Win', color: 'var(--green)' },
  { text: 'Showcase', color: 'var(--red)' },
  { text: 'Partner', color: 'var(--blue)' },
];

export default function Hero() {
  return (
    <>
      <section className="hero" id="home">
        {/* Background blobs */}
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />

        {/* Floating tags */}
        <div className="hero-floating-tags">
          <div className="hero-tag hero-tag-1">🏪 Market Vendors</div>
          <div className="hero-tag hero-tag-2">💡 Startups & Brands</div>
          <div className="hero-tag hero-tag-3">🤝 Networking</div>
          <div className="hero-tag hero-tag-4">🏆 Awards & Recognition</div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Lagos Island · 2026
          </div>

          <h1 className="hero-title">
            <span className="highlight-red">C</span>
            <span className="highlight-orange">O</span>
            <span>NN</span>
            <span className="highlight-green">E</span>
            <span className="highlight-blue">X</span>
            <span>A</span>
          </h1>

          <p className="hero-title-sub">Business · Innovation · Opportunity</p>

          <p className="hero-description">
            Lagos' most energetic business event — where vendors sell,
            brands grow, and opportunities happen in real time.
            One day. Endless possibilities.
          </p>

          <div className="hero-actions">
            <a href="#tickets" className="btn-primary">
              <span>Get Your Ticket →</span>
            </a>
            <a href="#about" className="btn-secondary">
              Learn More
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number highlight-orange">6</div>
              <div className="hero-stat-label">Ticket Types</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number highlight-green">1</div>
              <div className="hero-stat-label">Powerful Day</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number highlight-red">∞</div>
              <div className="hero-stat-label">Opportunities</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number highlight-blue">2</div>
              <div className="hero-stat-label">Award Categories</div>
            </div>
          </div>
        </div>

        <div className="hero-scroll-hint">Scroll</div>
      </section>

      {/* Marquee */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="marquee-item">
              <span className="marquee-dot" style={{ background: item.color }} />
              <span style={{ color: item.color }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
