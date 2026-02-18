import { useState } from 'react';
import './tickets.css';
import { initializePayment } from '../services/api';

const tickets = [
  {
    type: 'vendor',
    icon: '🏪',
    iconClass: 'ticket-icon-orange',
    label: 'Selling Businesses',
    name: 'Market Vendor Pass',
    subtitle: 'Sell directly to a high-intent audience in one day',
    price: 50000,
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
    price: 40000,
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
    price: 30000,
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
    price: 15000,
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
    price: 25000,
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
    price: 100000,
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
    price: 20000,
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [attendeeNames, setAttendeeNames] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function openModal(ticket) {
    setSelectedTicket(ticket);
    setModalOpen(true);
    setQuantity(1);
    setBuyerEmail('');
    setAttendeeNames(['']);
    setError('');
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedTicket(null);
  }

  function handleQuantityChange(newQuantity) {
    setQuantity(newQuantity);
    const newNames = Array(newQuantity).fill('');
    for (let i = 0; i < Math.min(attendeeNames.length, newQuantity); i++) {
      newNames[i] = attendeeNames[i];
    }
    setAttendeeNames(newNames);
  }

  function handleNameChange(index, value) {
    const newNames = [...attendeeNames];
    newNames[index] = value;
    setAttendeeNames(newNames);
  }

  async function handleProceedToPayment(e) {
    e.preventDefault();
    setError('');

    if (!buyerEmail) {
      setError('Please enter your email address');
      return;
    }

    const allNamesFilled = attendeeNames.every(name => name.trim() !== '');
    if (!allNamesFilled) {
      setError('Please fill in all attendee names');
      return;
    }

    setLoading(true);

    try {
      const totalAmount = selectedTicket.price * quantity;

      const paymentData = {
        buyerEmail,
        amount: totalAmount,
        ticketType: selectedTicket.name,
        ticketNames: attendeeNames,
        quantity,
      };

      const response = await initializePayment(paymentData);

      if (response.status && response.data.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        setError('Payment initialization failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

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
              {ticket.spotsLeft && (
                <div className="ticket-card-badge badge-red">LIMITED</div>
              )}

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
                      className={`ticket-spots-fill-${ticket.type}`}
                      style={{ width: `${Math.min((ticket.spotsLeft / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="ticket-divider" />

              {ticket.comingSoon ? (
                <div className="ticket-coming-soon">
                  <span>✨</span>
                  <p>Full details for this pass will be revealed soon. Grab your spot before it's gone.</p>
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

              <button
                onClick={() => openModal(ticket)}
                className={`ticket-cta ${ticket.ctaClass}`}
              >
                {ticket.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="tickets-note reveal">
          Connexa tickets are not about attendance.<br />
          They are about <span>access, opportunity, and results.</span>
        </p>
      </div>

      {modalOpen && selectedTicket && (
        <div className="ticket-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="ticket-modal">
            <button className="ticket-modal-close" onClick={closeModal}>×</button>

            <h3 className="ticket-modal-title">{selectedTicket.name}</h3>
            <p className="ticket-modal-price">
              ₦{selectedTicket.price.toLocaleString()} per ticket
            </p>

            <form className="ticket-modal-form" onSubmit={handleProceedToPayment}>
              <div className="ticket-input-group">
                <label>Your Email</label>
                <input
                  type="email"
                  className="ticket-input"
                  placeholder="your@email.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  required
                />
                <span className="ticket-input-hint">
                  Payment confirmation will be sent here
                </span>
              </div>

              <div className="ticket-input-group">
                <label>Number of Tickets</label>
                <select
                  className="ticket-input"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="ticket-attendees">
                <label>Attendee Names</label>
                {attendeeNames.map((name, index) => (
                  <input
                    key={index}
                    type="text"
                    className="ticket-input"
                    placeholder={`Attendee ${index + 1} Full Name`}
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    required
                  />
                ))}
              </div>

              <div className="ticket-modal-total">
                <span>Total Amount</span>
                <strong>₦{(selectedTicket.price * quantity).toLocaleString()}</strong>
              </div>

              {error && <div className="ticket-modal-error">{error}</div>}

              <button
                type="submit"
                className="ticket-modal-submit"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Payment →'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}








