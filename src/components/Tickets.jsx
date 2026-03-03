import { useState } from 'react';
import './Tickets.css';
import { initializePayment } from '../services/api';

const tickets = [
  {
    type: 'general',
    passType: 'individual',
    icon: '🎫',
    iconClass: 'ticket-icon-white',
    label: 'Open Access',
    name: 'General Access Ticket',
    subtitle: 'Experience the future of flexible work',
    price: 3000,
    features: [
      'Access to main event space',
      'Exposure to businesses and vendors',
      'General networking opportunities',
      'Entry into a high-energy environment',
    ],
    bestFor: 'Anyone curious about flexible work and community building.',
    cta: 'Get General Pass',
    ctaClass: '',
    dotColor: 'rgba(255,255,255,0.5)',
  },
  {
    type: 'regular',
    passType: 'individual',
    icon: '🎟️',
    iconClass: 'ticket-icon-white',
    label: 'General Attendees',
    name: 'Individual Pass — Regular',
    subtitle: 'Learn, connect, and discover opportunities',
    price: 5000,
    features: [
      'Access to Connexer sessions and panels',
      'Exposure to businesses, vendors, and hiring brands',
      'Networking with professionals and creatives',
      'Insight into the future of flexible work',
      'Entry into a high-energy, opportunity-driven environment',
    ],
    bestFor: 'Students, freelancers, professionals, and job seekers.',
    cta: 'Get Regular Pass',
    ctaClass: '',
    dotColor: 'rgba(255,255,255,0.7)',
  },
  {
    type: 'connectors',
    passType: 'individual',
    icon: '🔗',
    iconClass: 'ticket-icon-blue',
    label: 'Strategic Networking',
    name: 'Connectors Pass',
    subtitle: 'Turn networking into real opportunities',
    price: 5000,
    features: [
      'Gain entry to curated networking sessions',
      'Structured introductions to business owners and Connexers',
      'Priority participation in connection circles',
      'Access to all regular pass benefits',
      'Focused relationship-building opportunities',
    ],
    bestFor: 'Professionals focused on strategic connections and partnerships.',
    cta: 'Get Connectors Pass',
    ctaClass: 'cta-blue',
    dotColor: 'var(--blue)',
  },
  {
    type: 'vip',
    passType: 'individual',
    icon: '⭐',
    iconClass: 'ticket-icon-gradient',
    label: 'Premium Individuals',
    name: 'Individual Pass — VIP',
    subtitle: 'Premium access, priority networking, and recognition',
    price: 10000,
    badge: 'VIP',
    badgeClass: '',
    features: [
      'Priority seating and VIP event access',
      'Exclusive networking with Connexers and partners',
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
    type: 'growth',
    passType: 'business',
    icon: '📈',
    iconClass: 'ticket-icon-green',
    label: 'Business Owners',
    name: 'Business Owner Pass',
    subtitle: "Learn what works. Fix what's not working. Grow faster.",
    price: 30000,
    features: [
      'Access to all Connexers sessions and panels',
      'Practical insights for scaling, operations, and sales',
      'Peer networking with other business owners',
      'Access to roaming business advisors',
      'Priority seating and business owner recognition',
      'Full focus on learning and growth strategy',
    ],
    bestFor: 'Founders who want clarity, structure, and growth direction.',
    cta: 'Get Business Pass',
    ctaClass: 'cta-green',
    dotColor: 'var(--green)',
  },
  {
    type: 'showcase',
    passType: 'vendor',
    icon: '💡',
    iconClass: 'ticket-icon-blue',
    label: 'Brand Visibility',
    name: 'Showcase Vendor Pass',
    subtitle: 'Build visibility, trust, and partnerships — bring your own booth',
    price: 100000,
    features: [
      'Bring your own booth setup',
      'Dedicated space to showcase your brand, app, or service',
      'Brand awareness in front of founders, talents, and decision-makers',
      'Opportunity to attract users, partners, and collaborators',
      'Access to business advisors and Connexer sessions',
      'Eligibility for Brand Recognition Award',
      'Brand positioning without sales pressure',
    ],
    bestFor: 'Tech startups, service brands, platforms, and businesses focused on visibility.',
    cta: 'Get Showcase Pass',
    ctaClass: 'cta-blue',
    dotColor: 'var(--blue)',
  },
  {
    type: 'vendor',
    passType: 'vendor',
    icon: '🏪',
    iconClass: 'ticket-icon-orange',
    label: 'Direct Sales',
    name: 'Market Vendor Pass',
    subtitle: 'Sell directly to a high-intent audience — tent provided',
    price: 120000,
    features: [
      'Tent and booth setup provided by us',
      'Physical marketplace presence with real buyers',
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
    type: 'vip-partner',
    passType: 'business',
    icon: '👑',
    iconClass: 'ticket-icon-rainbow',
    label: 'Sell • Showcase • Partner',
    name: 'VIP Partner Pass',
    subtitle: 'Maximum exposure. Maximum access. Maximum influence.',
    price: 500000,
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
      'Maximum visibility and strategic partnerships',
    ],
    bestFor: 'Serious brands looking for visibility, influence, and long-term partnerships.',
    cta: 'Become a VIP Partner',
    ctaClass: 'cta-gradient',
    dotColor: 'var(--red)',
  },
];

// Calculate group discount for individual passes
function calculateDiscount(quantity) {
  if (quantity >= 5) return 5000;
  if (quantity >= 2) return 2000;
  return 0;
}

export default function Tickets() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Individual pass state
  const [quantity, setQuantity] = useState(1);
  const [attendees, setAttendees] = useState([{ name: '', email: '' }]);
  
  // Business pass state
  const [businessName, setBusinessName] = useState('');
  const [repName, setRepName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');

  // Add these to your existing state declarations
  const [vendorData, setVendorData] = useState({
    fullName: '',
    businessName: '',
    whatsapp: '',
    email: '',
    instagramWebsite: '',
    category: '',
    needElectricity: 'no',
    electricityAppliances: '',
    supportAssistant: 'no',
  supportQuantity: 1
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function openModal(ticket) {
    setSelectedTicket(ticket);
    setModalOpen(true);
    setError('');
    
    // Reset state based on pass type
    if (ticket.passType === 'individual') {
      setQuantity(1);
      setAttendees([{ name: '', email: '' }]);
    } else {
      setBusinessName('');
      setRepName('');
      setBusinessEmail('');
      setBusinessPhone('');
    }
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedTicket(null);
  }

  function handleQuantityChange(newQuantity) {
    setQuantity(newQuantity);
    const newAttendees = Array(newQuantity).fill(null).map((_, i) => 
      attendees[i] || { name: '', email: '' }
    );
    setAttendees(newAttendees);
  }

  function handleAttendeeChange(index, field, value) {
    const newAttendees = [...attendees];
    newAttendees[index][field] = value;
    setAttendees(newAttendees);
  }

  async function handleProceedToPayment(e) {
    e.preventDefault();
    setError('');

    const isIndividual = selectedTicket.passType === 'individual';
    const isVendor = selectedTicket.passType === 'vendor';

    // Validation
    if (isIndividual) {
      const allFilled = attendees.every(a => a.name.trim() && a.email.trim());
      if (!allFilled) {
        setError('Please fill in all attendee names and emails');
        return;
      }
    } else if (isVendor) {
      if (!vendorData.fullName.trim() || !vendorData.businessName.trim() || 
          !vendorData.whatsapp.trim() || !vendorData.email.trim() || 
          !vendorData.category.trim()) {
        setError('Please fill in all vendor details');
        return;
      }
      if (vendorData.needElectricity === 'yes' && !vendorData.electricityAppliances.trim()) {
        setError('Please list appliances that need electricity');
        return;
      }
    } else {
      if (!businessName.trim() || !repName.trim() || !businessEmail.trim() || !businessPhone.trim()) {
        setError('Please fill in all business details');
        return;
      }
    }

    setLoading(true);

    try {
      let totalAmount, metadata;

      if (isIndividual) {
        const baseAmount = selectedTicket.price * quantity;
        const discount = calculateDiscount(quantity);
        totalAmount = baseAmount - discount;

        metadata = {
          ticket_type: selectedTicket.name,
          pass_type: 'individual',
          quantity,
          discount,
          attendees: attendees.map(a => ({
            name: a.name,
            email: a.email
          }))
        };
      } else if (isVendor) {
        let baseAmount = selectedTicket.price;
        
        // Add electricity cost
        if (vendorData.needElectricity === 'yes') {
          baseAmount += 20000;
        }
        
        // Add support assistant cost
        if (vendorData.supportAssistant === 'zidepeople') {
          baseAmount += (vendorData.supportQuantity * 10000);
        }
        
        totalAmount = baseAmount;

        metadata = {
          ticket_type: selectedTicket.name,
          pass_type: 'vendor',
          full_name: vendorData.fullName,
          business_name: vendorData.businessName,
          whatsapp: vendorData.whatsapp,
          email: vendorData.email,
          instagram_website: vendorData.instagramWebsite || null,
          category: vendorData.category,
          need_electricity: vendorData.needElectricity,
          electricity_appliances: vendorData.electricityAppliances || null,
          support_assistant: vendorData.supportAssistant,
          support_quantity: vendorData.supportQuantity
        };
      } else {
        totalAmount = selectedTicket.price;

        metadata = {
          ticket_type: selectedTicket.name,
          pass_type: 'business',
          business_name: businessName,
          representative_name: repName,
          email: businessEmail,
          phone: businessPhone
        };
      }

      const paymentData = {
        buyerEmail: isIndividual ? attendees[0].email : isVendor ? vendorData.email : businessEmail,
        amount: totalAmount,
        ticketType: selectedTicket.name,
        ticketNames: isIndividual ? attendees.map(a => a.name) : [isVendor ? vendorData.fullName : repName],
        quantity: isIndividual ? quantity : 1,
        metadata
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

      {/* Payment Modal */}
      {modalOpen && selectedTicket && (
        <div className="ticket-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="ticket-modal">
            <button className="ticket-modal-close" onClick={closeModal}>×</button>

            <h3 className="ticket-modal-title">{selectedTicket.name}</h3>
            <p className="ticket-modal-price">
              ₦{selectedTicket.price.toLocaleString()} {selectedTicket.passType === 'individual' && 'per ticket'}
            </p>

            <form className="ticket-modal-form" onSubmit={handleProceedToPayment}>
              
              {/* INDIVIDUAL PASS FORM */}
              {selectedTicket.passType === 'individual' && (
                <>
                  <div className="ticket-group-promo">
                    💰 Purchase tickets for 2–5 people and save on your group admission to Connexa 2026.
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
                    <label>Attendee Details</label>
                    {attendees.map((attendee, index) => (
                      <div key={index} className="ticket-attendee-group">
                        <div className="ticket-attendee-label">Attendee {index + 1}</div>
                        <input
                          type="text"
                          className="ticket-input"
                          placeholder="Full Name"
                          value={attendee.name}
                          onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)}
                          required
                        />
                        <input
                          type="email"
                          className="ticket-input"
                          placeholder="Email Address"
                          value={attendee.email}
                          onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  {quantity >= 2 && (
                    <div className="ticket-discount-badge">
                      🎉 Group Discount: -₦{calculateDiscount(quantity).toLocaleString()}
                    </div>
                  )}

                  <div className="ticket-modal-total">
                    <span>Total Amount</span>
                    <div className="ticket-modal-total-breakdown">
                      {quantity >= 2 && (
                        <>
                          <div className="ticket-modal-subtotal">
                            ₦{(selectedTicket.price * quantity).toLocaleString()}
                          </div>
                          <div className="ticket-modal-discount">
                            -₦{calculateDiscount(quantity).toLocaleString()}
                          </div>
                        </>
                      )}
                      <strong>₦{((selectedTicket.price * quantity) - calculateDiscount(quantity)).toLocaleString()}</strong>
                    </div>
                  </div>
                </>
              )}

              {/* BUSINESS PASS FORM */}
              {selectedTicket.passType === 'business' && (
                <>
                  <div className="ticket-input-group">
                    <label>Business Name</label>
                    <input
                      type="text"
                      className="ticket-input"
                      placeholder="Official company name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="ticket-input-group">
                    <label>Owner/Representative Full Name</label>
                    <input
                      type="text"
                      className="ticket-input"
                      placeholder="Who will attend"
                      value={repName}
                      onChange={(e) => setRepName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="ticket-input-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="ticket-input"
                      placeholder="your@email.com"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      required
                    />
                    <span className="ticket-input-hint">
                      For ticket delivery and follow-up
                    </span>
                  </div>

                  <div className="ticket-input-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      className="ticket-input"
                      placeholder="+234 XXX XXX XXXX"
                      value={businessPhone}
                      onChange={(e) => setBusinessPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="ticket-modal-total">
                    <span>Total Amount</span>
                    <strong>₦{selectedTicket.price.toLocaleString()}</strong>
                  </div>
                </>
              )}

              {/* VENDOR PASS FORM */}
              {selectedTicket.passType === 'vendor' && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="ticket-input"
                    value={vendorData.fullName}
                    onChange={(e) => setVendorData({...vendorData, fullName: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Business Name"
                    className="ticket-input"
                    value={vendorData.businessName}
                    onChange={(e) => setVendorData({...vendorData, businessName: e.target.value})}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp Number"
                    className="ticket-input"
                    value={vendorData.whatsapp}
                    onChange={(e) => setVendorData({...vendorData, whatsapp: e.target.value})}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="ticket-input"
                    value={vendorData.email}
                    onChange={(e) => setVendorData({...vendorData, email: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Instagram Page/Website (Optional)"
                    className="ticket-input"
                    value={vendorData.instagramWebsite}
                    onChange={(e) => setVendorData({...vendorData, instagramWebsite: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Category (What do you sell/showcase?)"
                    className="ticket-input"
                    value={vendorData.category}
                    onChange={(e) => setVendorData({...vendorData, category: e.target.value})}
                    required
                  />

                  {/* Electricity */}
                  <div className="ticket-radio-group">
                    <label>Do you need electricity?</label>
                    <div className="ticket-radio-options">
                      <label>
                        <input
                          type="radio"
                          name="electricity"
                          value="no"
                          checked={vendorData.needElectricity === 'no'}
                          onChange={(e) => setVendorData({...vendorData, needElectricity: e.target.value})}
                        />
                        No
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="electricity"
                          value="yes"
                          checked={vendorData.needElectricity === 'yes'}
                          onChange={(e) => setVendorData({...vendorData, needElectricity: e.target.value})}
                        />
                        Yes (+₦20,000)
                      </label>
                    </div>
                  </div>

                  {vendorData.needElectricity === 'yes' && (
                    <textarea
                      placeholder="List appliances you need electricity for"
                      value={vendorData.electricityAppliances}
                      onChange={(e) => setVendorData({...vendorData, electricityAppliances: e.target.value})}
                      rows="3"
                      required
                    />
                  )}

                  {/* Support Assistant */}
                  <div className="ticket-radio-group">
                    <label>Will you require a support assistant?</label>
                    <div className="ticket-radio-options">
                      <label>
                        <input
                          type="radio"
                          name="support"
                          value="no"
                          checked={vendorData.supportAssistant === 'no'}
                          onChange={(e) => setVendorData({...vendorData, supportAssistant: e.target.value})}
                        />
                        No, I do not require support
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="support"
                          value="zidepeople"
                          checked={vendorData.supportAssistant === 'zidepeople'}
                          onChange={(e) => setVendorData({...vendorData, supportAssistant: e.target.value})}
                        />
                        Yes – Zidepeople assistant (₦10,000 each)
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="support"
                          value="own"
                          checked={vendorData.supportAssistant === 'own'}
                          onChange={(e) => setVendorData({...vendorData, supportAssistant: e.target.value})}
                        />
                        Yes – Bringing my own assistant
                      </label>
                    </div>
                  </div>

                  {/* ADD QUANTITY SELECTOR */}
                  {vendorData.supportAssistant === 'zidepeople' && (
                    <div className="ticket-quantity-group">
                      <label>How many support assistants do you need?</label>
                      <div className="ticket-quantity-controls">
                        <button 
                          type="button"
                          onClick={() => setVendorData({
                            ...vendorData, 
                            supportQuantity: Math.max(1, vendorData.supportQuantity - 1)
                          })}
                          className="ticket-quantity-btn"
                        >
                          −
                        </button>
                        <input 
                          type="number" 
                          min="1" 
                          max="10"
                          value={vendorData.supportQuantity}
                          onChange={(e) => setVendorData({
                            ...vendorData, 
                            supportQuantity: Math.max(1, parseInt(e.target.value) || 1)
                          })}
                          className="ticket-quantity-input"
                        />
                        <button 
                          type="button"
                          onClick={() => setVendorData({
                            ...vendorData, 
                            supportQuantity: Math.min(10, vendorData.supportQuantity + 1)
                          })}
                          className="ticket-quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      <div className="ticket-quantity-total">
                        Support cost: ₦{(vendorData.supportQuantity * 10000).toLocaleString()}
                      </div>
                    </div>
                  )}

                  {vendorData.supportAssistant === 'own' && (
                    <div className="ticket-info-box">
                      ℹ️ Your assistant must register and purchase an individual ticket separately.
                    </div>
                  )}
                </>
              )}

              {selectedTicket.passType === 'vendor' && (
              <div className="ticket-price-breakdown">
                <h4>Price Breakdown</h4>
                <div className="ticket-price-item">
                  <span>Base Pass:</span>
                  <span>₦{selectedTicket.price.toLocaleString()}</span>
                </div>
                
                {vendorData.needElectricity === 'yes' && (
                  <div className="ticket-price-item">
                    <span>Electricity:</span>
                    <span>+₦20,000</span>
                  </div>
                )}
                
                {vendorData.supportAssistant === 'zidepeople' && (
                  <div className="ticket-price-item">
                    <span>Support ({vendorData.supportQuantity} assistant{vendorData.supportQuantity > 1 ? 's' : ''}):</span>
                    <span>+₦{(vendorData.supportQuantity * 10000).toLocaleString()}</span>
                  </div>
                )}
                
                <div className="ticket-price-total">
                  <span>Total:</span>
                  <span>₦{(
                    selectedTicket.price + 
                    (vendorData.needElectricity === 'yes' ? 20000 : 0) + 
                    (vendorData.supportAssistant === 'zidepeople' ? vendorData.supportQuantity * 10000 : 0)
                  ).toLocaleString()}</span>
                </div>
              </div>
            )}

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
