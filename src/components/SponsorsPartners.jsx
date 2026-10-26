import './SponsorsPartners.css';

const partners = [
  { name: 'CarryHer', key: 'carryher', logo: '/carry%20her.PNG' },
  { name: 'DesignWR', key: 'designwr', logo: '/designwr.jpg' },
  { name: 'Enchanted', key: 'enchanted', logo: '/enchanted.jpg' },
  { name: 'GoLearn', key: 'golearn', logo: '/golearn.jpg' },
  { name: 'My Student Marketplace', key: 'marketplace', logo: '/marketplace.jpg' },
  { name: 'ProfilePro', key: 'profilepro', logo: '/profilepro.jpg' },
  { name: 'Taron', key: 'taron', logo: '/taron.jpg' },
  { name: 'Turnit', key: 'turnit', logo: '/turnit.jpg' },
  { name: 'Zidepeople', key: 'zidepeople', logo: '/zidepeople.jpg' },
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
            <div className={`sponsors-partners-logo-card sponsors-partners-logo-${partner.key}`} key={partner.key} aria-label={partner.name}>
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
