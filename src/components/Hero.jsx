import './Hero.css';
import arcLogo from '../assets/ARC_LOGO.webp';
import carryHerLogo from '../assets/carryher_logo.webp';
import profileProLogo from '../assets/profilepro_logo.webp';
import unmaskAdhdLogo from '../assets/png-logo.webp';

const heroPartners = [
  { name: 'ARC', logo: arcLogo },
  { name: 'CarryHer', logo: carryHerLogo },
  { name: 'ProfilePro', logo: profileProLogo },
  { name: 'Unmask ADHD', logo: unmaskAdhdLogo },
  { name: 'Rights Events', wordmark: 'RIGHTS EVENTS' },
  { name: 'Go Learn', wordmark: 'GO LEARN' },
  { name: 'DWR', wordmark: 'DWR' },

];

function PartnerRail({ side }) {
  const logos = [...heroPartners, ...heroPartners];
  return (
    <aside className={`hero-partner-rail hero-partner-rail-${side}`} aria-label="Connexa sponsors and partners">
      <div className="hero-partner-rail-track">
        {logos.map((partner, index) => (
          <div className="hero-partner-logo" key={`${partner.name}-${index}`} title={partner.name}>
            {partner.logo
              ? <img src={partner.logo} alt={partner.name} loading="lazy" />
              : <span className={`hero-partner-wordmark hero-partner-wordmark-${partner.name.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{partner.wordmark}</span>}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function Hero() {
  return (
    <section className="hero conversion-hero" id="home">
      <div className="conversion-hero-glow" aria-hidden="true" />
      <PartnerRail side="left" />
      <PartnerRail side="right" />
      <div className="hero-content conversion-hero-content">
        <div className="hero-badge"><span className="hero-badge-dot" /> Lagos, Nigeria · 28 November 2026</div>
        <p className="conversion-eyebrow">AFRICA'S FIRST OPPORTUNITY PLAYGROUND</p>
        <h1 className="hero-title conversion-hero-title">Your next opportunity could be <span>in this room.</span></h1>
        <p className="hero-description conversion-hero-description">
          CONNEXA brings talent and businesses together face to face for one powerful day of discovering opportunities, meeting the people who can move you forward, shopping, selling and making things happen.
        </p>
        <div className="conversion-hero-proof" aria-label="Event highlights">
          <span><strong>2,000+</strong> people expected</span>
          <span><strong>₦1 million</strong> in prizes</span>
          <span><strong>20+</strong> Connexers &amp; Playgrounders</span>
        </div>
        <a href="#tickets" className="btn-primary conversion-primary-cta">Get Your Ticket <span aria-hidden="true">→</span></a>
        <p className="conversion-hero-note">Saturday, 28 November 2026 · UNILAG Indoor Sports Hall, Akoka · Doors open 8 AM</p>
      </div>
    </section>
  );
}
