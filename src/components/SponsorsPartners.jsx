import './SponsorsPartners.css';
import arcLogo from '../assets/ARC_LOGO.webp';
import carryHerLogo from '/IMG_3892.PNG';
import profileProLogo from '/IMG_3891.PNG';
import unmaskAdhdLogo from '../assets/png-logo.webp';

const partners = [
  { name: 'ARC', logo: arcLogo, kind: 'image' },
  { name: 'CarryHer', logo: carryHerLogo, kind: 'image' },
  { name: 'ProfilePro', logo: profileProLogo, kind: 'image' },
  { name: 'Unmask ADHD', logo: unmaskAdhdLogo, kind: 'image' },
  { name: 'Rights Events', kind: 'wordmark', className: 'rights-events' },
  { name: 'Go Learn', kind: 'wordmark', className: 'go-learn' },
  { name: 'DWR', kind: 'wordmark', className: 'dwr' },
];

export default function SponsorsPartners() {
  return (
    <section className="sponsors-partners-section section" id="sponsors-partners">
      <div className="container">
        <div className="sponsors-partners-heading">
          <span className="section-tag">THE PEOPLE BEHIND THE EXPERIENCE</span>
          <h2 className="section-title">Sponsors &amp; <span>Partners</span></h2>
          <p>We appreciate the organisations helping bring the Connexa Opportunity Playground to life.</p>
        </div>
        <div className="sponsors-partners-logos">
          {partners.map((partner) => (
            <div className="sponsors-partners-logo-card" key={partner.name} aria-label={partner.name}>
              {partner.kind === 'image'
                ? <img src={partner.logo} alt={partner.name} loading="lazy" />
                : <span className={`sponsors-partners-wordmark ${partner.className}`}>{partner.name}</span>}
            </div>
          ))}
        </div>
        <div className="sponsors-partners-cta">
          <p>Want your brand to be part of Connexa?</p>
          <a href="#partner-form">Explore sponsorship and partnership <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  );
}
