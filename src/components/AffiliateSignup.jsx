import { useState } from 'react';
import { FaCheck, FaChartBar, FaCoins, FaChartLine, FaBullseye, FaComments, FaCopy, FaCheckCircle, FaLink } from '../utils/icons';
import { signupAffiliate } from '../services/api';
import { getUserFriendlyError, logTechnicalError } from '../utils/errorMessages';
import './affiliate-signup.css';

export default function AffiliateSignup() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cityState: '',
    socialMedia: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    agreeCommission: false,
    agreeNoMisrepresent: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() ||
        !formData.bankName || !formData.accountName.trim() || !formData.accountNumber.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  }

  async function handleConfirmSubmit() {
    // Validate checkboxes
    if (!formData.agreeCommission || !formData.agreeNoMisrepresent) {
      setError('Please agree to both terms to continue');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signupAffiliate({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city_state: formData.cityState || null,
        social_media: formData.socialMedia || null,
        bank_name: formData.bankName,
        account_name: formData.accountName,
        account_number: formData.accountNumber,
        agree_commission: formData.agreeCommission,
        agree_no_misrepresent: formData.agreeNoMisrepresent
      });

      setAffiliateCode(result.code);
      setSubmitted(true);
      setShowConfirmModal(false);
    } catch (err) {
      logTechnicalError(err, 'AFFILIATE_SIGNUP');
      setError(getUserFriendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  function closeAll() {
    setShowModal(false);
    setSubmitted(false);
    setShowConfirmModal(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      cityState: '',
      socialMedia: '',
      bankName: '',
      accountName: '',
      accountNumber: '',
      agreeCommission: false,
      agreeNoMisrepresent: false
    });
  }

  if (submitted) {
    const affiliateLink = `${window.location.origin}?ref=${affiliateCode}`;

    return (
      <div className="affiliate-modal-overlay" onClick={closeAll}>
        <div className="affiliate-modal affiliate-success-modal" onClick={(e) => e.stopPropagation()}>
          <button className="affiliate-modal-close" onClick={closeAll}>×</button>
          
          <div className="affiliate-success">
            <div className="affiliate-success-icon"><FaCheckCircle size={40} color="#2db84b" /></div>
            <h2>Welcome to the Connexa Affiliate Program!</h2>
            <p>Your unique affiliate link has been generated.</p>

            <div className="affiliate-link-box">
              <label>Your Affiliate Link:</label>
              <div className="affiliate-link-display">
                <input
                  type="text"
                  value={affiliateLink}
                  readOnly
                  onClick={(e) => e.target.select()}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(affiliateLink);
                    alert('Link copied to clipboard!');
                  }}
                  className="affiliate-copy-btn"
                >
                  <FaCopy size={14} /> Copy
                </button>
              </div>
              <small>Share this link to earn up to 20% commission on every ticket sale!</small>
            </div>

            <div className="affiliate-commission-info">
              <h3><FaChartBar size={16} /> Commission Details</h3>
              <ul>
                <li><FaCheck size={12} /> Earn 20% on tickets under ₦30,000</li>
                <li><FaCheck size={12} /> Earn 10% on tickets ₦30,000 and above</li>
                <li><FaCoins size={12} /> Commissions paid monthly via bank transfer</li>
                <li><FaChartLine size={12} /> Track your earnings in real-time</li>
                <li><FaBullseye size={12} /> No limit on how much you can earn</li>
              </ul>
            </div>

            <div className="affiliate-whatsapp-box">
              <h3>Join Our Affiliate Community</h3>
              <p>Get tips, updates, and support from the Connexa team and other affiliates.</p>
              <a
                href="https://chat.whatsapp.com/KsV1XMbICQ22oRInC6eCKU"
                target="_blank"
                rel="noopener noreferrer"
                className="affiliate-whatsapp-btn"
              >
                <FaComments size={14} /> Join WhatsApp Group
              </a>
            </div>

            <button onClick={closeAll} className="affiliate-btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="affiliate-signup-section" id="affiliate">
      <div className="container">
        <div className="affiliate-header">
          <span className="section-tag">EARN WITH US</span>
          <h2 className="section-title">
            Become a <span className="highlight-orange">Connexa Affiliate</span>
          </h2>
          <p>Earn up to 20% commission on every ticket you sell. No limits. Paid monthly.</p>
        </div>

        <div className="affiliate-benefits">
          <div className="affiliate-benefit-card">
            <div className="affiliate-benefit-icon"><FaCoins size={24} /></div>
            <h3>Up to 20% Commission</h3>
            <p>Tiered rates based on ticket price</p>
          </div>
          <div className="affiliate-benefit-card">
            <div className="affiliate-benefit-icon"><FaLink size={24} /></div>
            <h3>Unique Link</h3>
            <p>Track all your referrals</p>
          </div>
          <div className="affiliate-benefit-card">
            <span className="hero-detail-icon">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </span>
            <h3>Monthly Payouts</h3>
            <p>Direct bank transfers</p>
          </div>
          <div className="affiliate-benefit-card">
            <div className="affiliate-benefit-icon"><FaInfinity size={24} /></div>
            <h3>No Limits</h3>
            <p>Unlimited earning potential</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="affiliate-cta">
          <button onClick={() => setShowModal(true)} className="affiliate-cta-btn">
            <FaCoins size={16} /> Join the Affiliate Program
          </button>
          <p className="affiliate-cta-subtext">Start earning commission on every ticket sale</p>
        </div>

        {/* Form Modal */}
        {showModal && (
          <div className="affiliate-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="affiliate-modal" onClick={(e) => e.stopPropagation()}>
              {/*<button className="affiliate-modal-close" onClick={() => setShowModal(false)}>×</button>*/}

              <h2 className="affiliate-modal-title">Become an Affiliate</h2>
              <p className="affiliate-modal-subtitle">Fill in your details to get your unique affiliate link</p>

              <form className="affiliate-form" onSubmit={handleFormSubmit}>
                <div className="affiliate-form-grid">
                  {/* Full Name */}
                  <div className="affiliate-form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="affiliate-form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="affiliate-form-group">
                    <label htmlFor="phone">Phone Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234..."
                      required
                    />
                  </div>

                  {/* City/State */}
                  <div className="affiliate-form-group">
                    <label htmlFor="cityState">City / State (optional)</label>
                    <input
                      type="text"
                      id="cityState"
                      name="cityState"
                      value={formData.cityState}
                      onChange={handleChange}
                      placeholder="Lagos, Nigeria"
                    />
                  </div>

                  {/* Social Media */}
                  <div className="affiliate-form-group affiliate-form-full">
                    <label htmlFor="socialMedia">Social Media Handle(s) (optional)</label>
                    <input
                      type="text"
                      id="socialMedia"
                      name="socialMedia"
                      value={formData.socialMedia}
                      onChange={handleChange}
                      placeholder="@yourusername or link"
                    />
                  </div>

                  {/* Bank Name */}
                  <div className="affiliate-form-group">
                    <label htmlFor="bankName">Bank Name *</label>
                    <input
                      type="text"
                      id="bankName"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="e.g., Access Bank, GTBank, OPay"
                      required
                    />
                  </div>

                  {/* Account Name */}
                  <div className="affiliate-form-group">
                    <label htmlFor="accountName">Account Name *</label>
                    <input
                      type="text"
                      id="accountName"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Account Number */}
                  <div className="affiliate-form-group">
                    <label htmlFor="accountNumber">Account Number *</label>
                    <input
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      maxLength="10"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                </div>

                {/* Commission Info Box */}
                <div className="affiliate-commission-notice">
                  <strong><FaCoins size={14} /> Commission Structure:</strong> Earn up to 20% commission on ticket sales. Commissions are calculated on the total payment amount and paid monthly via bank transfer.
                </div>

                {error && <div className="affiliate-error">{error}</div>}

                <button type="submit" className="affiliate-btn">
                  Generate My Affiliate Link
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div 
            className="affiliate-modal-overlay"
            onClick={(e) => e.target === e.currentTarget && setShowConfirmModal(false)}
          >
            <div className="affiliate-modal">
              <button 
                className="affiliate-modal-close"
                onClick={() => setShowConfirmModal(false)}
              >
                ×
              </button>

              <h3 className="affiliate-modal-title">Commission Structure</h3>
              
              <div className="affiliate-modal-breakdown">
                <div className="affiliate-commission-tier">
                  <div className="affiliate-tier-icon"><FaBullseye size={24} /></div>
                  <div className="affiliate-tier-content">
                    <h4>20% Commission</h4>
                    <p>For tickets <strong>under ₦30,000</strong></p>
                    <div className="affiliate-tier-example">
                      Example: ₦10,000 ticket = ₦2,000 commission
                    </div>
                  </div>
                </div>

                <div className="affiliate-commission-tier">
                  <div className="affiliate-tier-icon"><FaGem size={24} /></div>
                  <div className="affiliate-tier-content">
                    <h4>10% Commission</h4>
                    <p>For tickets <strong>₦30,000 and above</strong></p>
                    <div className="affiliate-tier-example">
                      Example: ₦100,000 ticket = ₦10,000 commission
                    </div>
                  </div>
                </div>
              </div>

              <div className="affiliate-modal-info">
                <p><FaCoins size={14} /> <strong>Monthly Payouts:</strong> Commissions are paid monthly via direct bank transfer</p>
                <p><FaChartLine size={14} /> <strong>No Limits:</strong> The more you sell, the more you earn!</p>
              </div>

              {/* Terms Checkboxes */}
              <div className="affiliate-modal-terms">
                <label className="affiliate-checkbox">
                  <input
                    type="checkbox"
                    name="agreeCommission"
                    checked={formData.agreeCommission}
                    onChange={handleChange}
                  />
                  <span>I understand I earn 20% commission on tickets under ₦30,000 and 10% on tickets ₦30,000 and above sold through my unique link.</span>
                </label>

                <label className="affiliate-checkbox">
                  <input
                    type="checkbox"
                    name="agreeNoMisrepresent"
                    checked={formData.agreeNoMisrepresent}
                    onChange={handleChange}
                  />
                  <span>I agree not to misrepresent Connexa or give false pricing information.</span>
                </label>
              </div>

              {error && <div className="affiliate-error">{error}</div>}

              <div className="affiliate-modal-actions">
                <button
                  onClick={handleConfirmSubmit}
                  className="affiliate-btn"
                  disabled={loading || !formData.agreeCommission || !formData.agreeNoMisrepresent}
                >
                  {loading ? 'Creating Account...' : 'I Agree - Create My Account'}
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="affiliate-btn-secondary"
                  disabled={loading}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}