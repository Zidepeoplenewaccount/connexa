import './tickets.css';

const tickets = [
  {
    type: 'vendor',
    icon: '🏪',
    iconClass: 'ticket-icon-orange',
    label: 'Selling Businesses',
    name: 'Market Vendor Pass',
    subtitle: 'Sell directly to a high-intent audience in one day',
    spotsLeft: 50,
    features: [
      'Physical booth in a live marketplace with real buyers',
      'Direct sales, lead capture, and brand exposure',
      'Access to customers actively looking to buy',
      'Eligibility for Brand Recognition Award',
      'Business advisory support during the event',
      'High foot traffic, visibility, and real revenue opportunity',
    ],
    bestFor: 'Businesses ready to sell, test products, and close deals on the spot.',
    cta: 'Get Vendor Pass',
    ctaClass: 'cta-orange',
    dotColor: 'var(--orange)',
  },
  {
    type: 'showcase',
    icon: '💡',
    iconClass: 'ticket-icon-blue',
    label: 'Non-Selling Businesses & Startups',
    name: 'Brand Showcase Pass',
    subtitle: 'Build visibility, trust, and partnerships — without selling',
    features: [
      'Dedicated space to showcase your app, service, or solution',
      'Brand awareness in front of founders, talents, and decision-makers',
      'Opportunity to attract users, partners, and collaborators',
      'Access to business advisors and speaker sessions',
      'Brand positioning without sales pressure',
      'Eligibility for Brand Recognition Award',
    ],
    bestFor: 'Tech startups, service brands, platforms, and early-stage products.',
    cta: 'Get Showcase Pass',
    ctaClass: 'cta-blue',
    dotColor: 'var(--blue)',
  },
  {
    type: 'growth',
    icon: '📈',
    iconClass: 'ticket-icon-green',
    label: 'Learning-Only Business Owners',
    name: 'Business Growth Pass',
    subtitle: "Learn what works. Fix what's not working. Grow faster.",
    features: [
      'Access to all speaker sessions and panels',
      'Practical insights for scaling, operations, and sales',
      'Peer networking with other business owners',
      'Access to roaming business advisors',
      'No booth required — full focus on learning and strategy',
    ],
    bestFor: 'Founders who want clarity, structure, and growth direction.',
    cta: 'Get Growth Pass',
    ctaClass: 'cta-green',
    dotColor: 'var(--green)',
  },
  {
    type: 'regular',
    icon: '🎟️',
    iconClass: 'ticket-icon-white',
    label: 'General Attendees',
    name: 'Individual Pass — Regular',
    subtitle: 'Learn, connect, and discover opportunities',
    features: [
      'Access to speaker sessions and panels',
      'Exposure to businesses, vendors, and hiring brands',
      'Networking with professionals and creatives',
      'Insight into the future of flexible work',
      'Entry into a high-energy, opportunity-driven environment',
    ],
    bestFor: 'Students, freelancers, professionals, and job seekers.',
    cta: 'Get Regular Pass',
    ctaClass: '',
    dotColor: 'rgba(255,255,255,0.5)',
  },
  {
    type: 'vip',
    icon: '⭐',
    iconClass: 'ticket-icon-gradient',
    label: 'Premium Individuals',
    name: 'Individual Pass — VIP',
    subtitle: 'Premium access, priority networking, and recognition',
    badge: 'VIP',
    badgeClass: '',
    features: [
      'Priority seating and VIP event access',
      'Exclusive networking with speakers and partners',
      'Access to VIP-only areas and sessions',
      'Eligibility for Individual Awards & Recognition',
      'Public acknowledgment and premium event experience',
    ],
    bestFor: 'Professionals who want visibility, status, and recognition.',
    cta: 'Get VIP Pass',
    ctaClass: 'cta-orange',
    dotColor: 'var(--orange)',
  },
  {
    type: 'vip-partner',
    icon: '👑',
    iconClass: 'ticket-icon-rainbow',
    label: 'Sell • Showcase • Partner',
    name: 'VIP Partner Pass',
    subtitle: 'Maximum exposure. Maximum access. Maximum influence.',
    badge: 'PREMIUM',
    badgeClass: 'badge-red',
    featured: true,
    features: [
      'Prime booth placement (sell or showcase)',
      'Partner-level brand recognition at the event',
      'On-stage mentions and media visibility',
      'Priority access to business advisors and partners',
      'VIP seating and premium brand positioning',
      'Opportunity to support via cash or in-kind contributions',
    ],
    bestFor: 'Serious brands looking for visibility, influence, and long-term partnerships.',
    cta: 'Become a VIP Partner',
    ctaClass: 'cta-gradient',
    dotColor: 'var(--red)',
  },
  {
    type: 'connectors',
    icon: '🔗',
    iconClass: 'ticket-icon-blue',
    label: 'Coming Soon',
    name: 'Connectors Pass',
    subtitle: 'More details dropping soon — stay tuned.',
    spotsLeft: 30,
    features: [],
    bestFor: null,
    cta: 'Get Connectors Pass',
    ctaClass: 'cta-blue',
    dotColor: 'var(--blue)',
    comingSoon: true,
  },
];

export default function Tickets() {
  return (
    <section className="tickets section" id="tickets">
      <div className="container">
        <div className="tickets-header reveal">
          <div className="section-tag">Tickets</div>
          <h2 className="section-title">
            Access. Opportunity. <span className="highlight-orange">Results.</span>
          </h2>
          <p>Connexa tickets are not about attendance — they're about what you get out of the room.</p>
        </div>

        <div className="tickets-grid">
          {tickets.map((ticket, i) => (
            <div
              key={ticket.type}
              className={`ticket-card reveal${ticket.featured ? ' featured' : ''}`}
              data-type={ticket.type}
              style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
            >
              {/* Limited badge — auto shows if spotsLeft exists */}
              {ticket.spotsLeft && (
                <div className="ticket-card-badge badge-red">LIMITED</div>
              )}

              {/* Regular badge — only shows if no spotsLeft */}
              {ticket.badge && !ticket.spotsLeft && (
                <div className={`ticket-card-badge ${ticket.badgeClass || ''}`}>
                  {ticket.badge}
                </div>
              )}

              <div className={`ticket-icon ${ticket.iconClass}`}>
                {ticket.icon}
              </div>

              <div className="ticket-type-label">{ticket.label}</div>
              <h3 className="ticket-name">{ticket.name}</h3>
              <p className="ticket-subtitle">{ticket.subtitle}</p>

              {/* Spots remaining indicator */}
              {ticket.spotsLeft && (
                <div className="ticket-spots">
                  <div className="ticket-spots-text">
                    <span>🔥 Only <strong>{ticket.spotsLeft} spots</strong> left</span>
                  </div>
                  <div className="ticket-spots-track">
                    <div
                      className="ticket-spots-fill"
                      style={{ width: `${Math.min((ticket.spotsLeft / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="ticket-divider" />

              {/* Coming soon state */}
              {ticket.comingSoon ? (
                <div className="ticket-coming-soon">
                  {/*<span>✨</span>
                  <p>Full details for this pass will be revealed soon. Grab your spot before it's gone.</p>*/}
                </div>
              ) : (
                <>
                  <ul className="ticket-features">
                    {ticket.features.map((f, j) => (
                      <li key={j} className="ticket-feature">
                        <span className="ticket-feature-dot" style={{ background: ticket.dotColor }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {ticket.bestFor && (
                    <div className="ticket-best-for">
                      <strong>Best for:</strong> {ticket.bestFor}
                    </div>
                  )}
                </>
              )}

              <a href="#" className={`ticket-cta ${ticket.ctaClass}`}>
                {ticket.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="tickets-note reveal">
          Connexa tickets are not about attendance.<br />
          They are about <span>access, opportunity, and results.</span>
        </p>
      </div>
    </section>
  );
}






