import './Hero.css';
import zideLogo from '../assets/IMG_5735.PNG';
import ArcLogo from '../assets/ARC_LOGO.png';

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

// Sponsors data - add your real sponsors here
const sponsors = [
  { name: 'Zidepeople', logo: zideLogo },
  { name: 'Arc Studio', logo: ArcLogo },
  { name: 'Zidepeople', logo: zideLogo },
  { name: 'Arc Studio', logo: ArcLogo },
  { name: 'Zidepeople', logo: zideLogo },
  { name: 'Arc Studio', logo: ArcLogo },
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

          <p className="hero-title-sub">BUSINESS · TALENT · CONNECTIONS</p>

          <p className="hero-description">
            Lagos’ most energetic business and 
            talent event, where entrepreneurs, 
            brands, and individuals connect, 
            showcase, and discover opportunities. 
            One day. Endless possibilities.
          </p>

          <div className="hero-actions">
            <a href="#tickets" className="btn-primary">
              <span>Get Your Ticket →</span>
            </a>
            <a href="#partner-form" className="btn-secondary">
              Become A Partner
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number highlight-orange">2000+</div>
              <div className="hero-stat-label">Attendees</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number highlight-green">150+</div>
              <div className="hero-stat-label">Businesses</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number highlight-blue">10+</div>
              <div className="hero-stat-label">Speakers</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number highlight-red">50+</div>
              <div className="hero-stat-label">Exhibitors</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number highlight-orange">10+</div>
              <div className="hero-stat-label">Industry Panels</div>
            </div>
          </div>

          {/* Sponsors Marquee */}
          <div className="hero-sponsors">
            <div className="hero-sponsors-label">Sponsored By</div>
            <div className="hero-sponsors-track">
              {/* Duplicate sponsors array for infinite scroll effect */}
              {[...sponsors, ...sponsors].map((sponsor, i) => (
                <div key={i} className="hero-sponsor-item">
                  {sponsor.logo ? (
                    <img 
                      src={sponsor.logo} 
                      alt={sponsor.name} 
                      className="hero-sponsor-logo" 
                    />
                  ) : (
                    <div className="hero-sponsor-placeholder">Logo</div>
                  )}
                  <span className="hero-sponsor-text">{sponsor.name}</span>
                </div>
              ))}
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
