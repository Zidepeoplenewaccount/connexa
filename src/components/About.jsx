import './About.css';
import { FaShoppingCart, FaMicrophone, FaHandshake, FaTrophy } from '../utils/icons';
import zideLogo from '../assets/IMG_6707.webp';

const highlights = [
  { icon: <FaShoppingCart size={24} />, title: 'Live Marketplace', desc: 'Real buyers, real sellers, real transactions on the day' },
  { icon: <FaMicrophone size={24} />, title: 'Connexer Sessions', desc: 'No regular speakers here. Connexers deliver a completely different experience.' },
  { icon: <FaHandshake size={24} />, title: 'Opportunities', desc: 'Meet founders, talents, and decision-makers in Lagos' },
  { icon: <FaTrophy size={24} />, title: 'Awards & Recognition', desc: 'Win visibility, prizes, and public acknowledgment' },
];

export default function About() {
  return (
    <section className="about section" id="about">
      <div className="container">
        <div className="about-inner">
          <div className="about-text reveal">
            <div className="section-tag">About Connexa</div>
            <h2 className="section-title about-main-title">
              Connexa Lagos | The Opportunity Playground You Shouldn't Miss
            </h2>
            <p>
              Connexa is an opportunity playground in Lagos where people connect to real opportunities. Whether you're a founder, job seeker, or creative, Connexa helps you meet the right people and move forward faster.
            </p>
            <p>
              Connexa is one of the most anticipated events in Lagos, Nigeria for talents, founders, vendors, startups, and professionals serious about growth.
            </p>
            <p>
              If you are searching for events in Lagos, things to do in Lagos, business events in Nigeria, career events in Lagos, and growth events in Lagos, Connexa gives you one place to access real opportunities.
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
                <div className="about-card-title">Sell to 2000+ buyers in one day</div>
                <div className="about-card-text">
                  High foot traffic, ready-to-buy audience, and real revenue opportunity.
                </div>
              </div>
              <div className="about-floating-card about-floating-card-2">
                <div className="about-card-label">Business Growth</div>
                <div className="about-card-title">Learn. Fix. Scale faster.</div>
                <div className="about-card-text">
                  Expert advisors, sessions, and growth-focused peers all in one place.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
