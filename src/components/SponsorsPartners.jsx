import './SponsorsPartners.css';
import arcLogo from '../assets/ARC_LOGO.webp';
import carryHerLogo from '/IMG_3892.PNG';
import profileProLogo from '/IMG_3891.PNG';
import unmaskAdhdLogo from '../assets/png-logo.webp';

const partners = [
  { name: 'ARC', logo: arcLogo },
  { name: 'CarryHer', logo: carryHerLogo },
  { name: 'ProfilePro', logo: profileProLogo },
  { name: 'Unmask ADHD', logo: unmaskAdhdLogo },
  { name: 'Rights Events', logo: '/RE%20Full%20Logo%20-%20Colored.PNG' },
  { name: 'Plitverse', logo: '/Plitverse%20-%202.PNG' },
  { name: 'Additional partner logo 1', logo: '/IMG_3763.png' },
  { name: 'Additional partner logo 2', logo: '/IMG_3773.jpg' },
  { name: 'Additional partner logo 3', logo: '/IMG_3823.jpg' },
  { name: 'Additional partner logo 4', logo: '/IMG_4349.png' },
  { name: 'Additional partner logo 5', logo: '/IMG_5433.PNG' },
  { name: 'Additional partner logo 6', logo: '/IMG_6775.jpg' },
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
