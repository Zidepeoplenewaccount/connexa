import './Hero.css';
import arcLogo from '../assets/ARC_LOGO.webp';
import carryHerLogo from '/IMG_3892.PNG';
import profileProLogo from '/IMG_3891.PNG';
import unmaskAdhdLogo from '../assets/png-logo.webp';

const heroPartners = [
  { name: 'ARC', key: 'arc', logo: arcLogo },
  { name: 'CarryHer', key: 'carryher', logo: carryHerLogo },
  { name: 'ProfilePro', key: 'profilepro', logo: profileProLogo },
  { name: 'Unmask ADHD', key: 'unmask-adhd', logo: unmaskAdhdLogo },
  { name: 'Rights Events', key: 'rights-events', logo: '/RE%20Full%20Logo%20-%20Colored.PNG' },
  { name: 'Plitverse', key: 'plitverse', logo: '/Plitverse%20-%202.PNG' },
  { name: 'My Student Marketplace', key: 'my-student-marketplace', logo: '/IMG_3763-transparent.svg' },
  { name: 'Partner logo', key: 'img-3773', logo: '/IMG_3773.jpg' },
  { name: 'Partner logo', key: 'img-3823', logo: '/IMG_3823.jpg' },
  { name: 'Partner logo', key: 'img-4349', logo: '/IMG_4349.png' },
  { name: 'Partner logo', key: 'img-5433', logo: '/IMG_5433.PNG' },
  { name: 'Partner logo', key: 'img-6775', logo: '/IMG_6775.jpg' },
  { name: 'Connexa Flyer Design', key: 'connexa-flyer-1', logo: '/CONNEXA%20FLYER%20DESIGNS.PNG' },
  { name: 'Connexa Flyer Design 2', key: 'connexa-flyer-2', logo: '/CONNEXA%20FLYER%20DESIGNS%202.PNG' },
  { name: 'Partner logo', key: 'f20bc0bf', logo: '/F20BC0BF-B460-41A8-82F1-65B2AF558F66.PNG' },
];

function PartnerRail({ side }) {
  const logos = [...heroPartners, ...heroPartners];
  return (
    <aside className={`hero-partner-rail hero-partner-rail-${side}`} aria-label="Connexa sponsors and partners">
      <div className="hero-partner-rail-track">
        {logos.map((partner, index) => (
          <div className={`hero-partner-logo hero-partner-logo-${partner.key}`} key={`${partner.key}-${index}`} title={partner.name}>
            <img src={partner.logo} alt={partner.name} loading="lazy" />
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
