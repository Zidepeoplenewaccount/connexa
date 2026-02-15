import './About.css';

const highlights = [
  { icon: '🛒', title: 'Live Marketplace', desc: 'Real buyers, real sellers, real transactions on the day' },
  { icon: '🎤', title: 'Speaker Sessions', desc: 'Insights from top founders and industry leaders' },
  { icon: '🤝', title: 'Networking', desc: 'Connect with founders, talents, and decision-makers' },
  { icon: '🏆', title: 'Awards & Recognition', desc: 'Win visibility, prizes, and public acknowledgment' },
];

export default function About() {
  return (
    <section className="about section" id="about">
      <div className="container">
        <div className="about-inner">
          <div className="about-text reveal">
            <div className="section-tag">About Connexa</div>
            <h2 className="section-title">
              Where Business <br />
              <span className="highlight-orange">Meets Opportunity</span>
            </h2>
            <p>
              Connexa 2026 is Lagos' most energetic one-day business event —
              designed for vendors, startups, brands, and professionals who
              are serious about growth.
            </p>
            <p>
              Whether you're selling products, showcasing your platform,
              looking to learn, or hunting for your next opportunity — Connexa
              puts you in the room where things happen.
            </p>

            <div className="about-highlights">
              {highlights.map((h, i) => (
                <div className="about-highlight reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                  <span className="about-highlight-icon">{h.icon}</span>
                  <div className="about-highlight-title">{h.title}</div>
                  <div className="about-highlight-desc">{h.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-visual reveal reveal-delay-2">
            <div className="about-card-stack">
              <div className="about-floating-card about-floating-card-1">
                <div className="about-card-label">Market Vendors</div>
                <div className="about-card-title">Sell to 500+ buyers in one day</div>
                <div className="about-card-text">
                  High foot traffic, ready-to-buy audience, and real revenue opportunity.
                </div>
              </div>
              <div className="about-floating-card about-floating-card-2">
                <div className="about-card-label">Business Growth</div>
                <div className="about-card-title">Learn. Fix. Scale faster.</div>
                <div className="about-card-text">
                  Expert advisors, sessions, and peer networks all in one place.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
