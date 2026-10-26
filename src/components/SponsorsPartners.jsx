import './SponsorsPartners.css';
import arcLogo from '../assets/ARC_LOGO.webp';
import carryHerLogo from '../assets/carryher_logo.webp';
import profileProLogo from '../assets/profilepro_logo.webp';

const partners = [
  { name: 'ARC', logo: arcLogo },
  { name: 'CarryHer', logo: carryHerLogo },
  { name: 'ProfilePro', logo: profileProLogo },
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
            <div className="sponsors-partners-logo-card" key={partner.name}>
              <img src={partner.logo} alt={partner.name} loading="lazy" />
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
