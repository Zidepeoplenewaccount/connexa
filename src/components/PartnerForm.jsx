import { useState } from 'react';
import { submitPartnership } from '../services/api';
import './PartnerForm.css';

export default function PartnerForm() {
  const [formData, setFormData] = useState({
    applicationType: 'sponsor',
    applicantType: 'business',
    fullName: '',
    email: '',
    phone: '',
    organizationName: '',
    websiteSocial: '',
    sponsorshipType: '',
    involvement: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const sponsorshipTypes = [
    'Title Sponsor',
    'Platinum Sponsor',
    'Gold Sponsor',
    'Silver Sponsor',
    'Bronze Sponsor',
    'Event Partner',
    'Media Partner',
    'Community Partner',
    'Technology Partner',
    'Venue Sponsor',
    'Food & Beverage Sponsor',
    'Merch Sponsor',
    'Award Sponsor',
    'Financial Sponsor',
    'In-Kind Sponsor (Product or Service Sponsor)',
    'Industry Sponsor',
    'Knowledge Sponsor',
    'Stage Sponsor',
    'Experience Sponsor',
    'Talent Access Sponsor',
    'Strategic Growth Partner',
    'Other'
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await submitPartnership(formData);  // Use imported function
      
      if (result.status === 'success') {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section className="partner-form-section">
        <div className="container">
          <div className="partner-success">
            <div className="partner-success-icon">✓</div>
            <h2>Thank You!</h2>
            <p>
              Thank you for sharing how you'd like to be involved in <strong>Connexa: The Future of Flexible Work 2026</strong>. 
              We're excited to connect with you and explore your sponsorship or partnership.
            </p>
            <p>
              Our team will get back to you shortly, or you can reach us directly at:
            </p>
            <div className="partner-contact">
              <div>📞 <a href="tel:+2348185577843">+234 818 557 7843</a></div>
              <div>✉️ <a href="mailto:partnerships@zidepeople.com">partnerships@zidepeople.com</a></div>
            </div>
            <p className="partner-success-footer">
              Together, we'll create an inspiring and impactful experience for everyone attending!<br/>
              <strong>Connexa is shaping the future of flexible work - we're thrilled to have you on this journey!</strong>
            </p>
            <a href="/" className="partner-btn">Back to Home</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="partner-form-section" id="partner-form">
      <div className="container">
        <div className="partner-form-header">
          <span className="section-tag">JOIN US</span>
          <h2 className="section-title">
            Sponsor or Partner <span className="highlight-orange">Connexa</span>
          </h2>
          <p>Be part of shaping the future of flexible work in Africa.</p>
        </div>

        <form className="partner-form" onSubmit={handleSubmit}>
          {/* Application Type */}
          <div className="partner-form-group">
            <label>Type *</label>
            <div className="partner-radio-group">
              <label className="partner-radio">
                <input
                  type="radio"
                  name="applicationType"
                  value="sponsor"
                  checked={formData.applicationType === 'sponsor'}
                  onChange={handleChange}
                />
                <span>Sponsor</span>
              </label>
              <label className="partner-radio">
                <input
                  type="radio"
                  name="applicationType"
                  value="partner"
                  checked={formData.applicationType === 'partner'}
                  onChange={handleChange}
                />
                <span>Partner</span>
              </label>
            </div>
          </div>

          {/* Applicant Type */}
          <div className="partner-form-group">
            <label>Applicant Type *</label>
            <div className="partner-radio-group">
              <label className="partner-radio">
                <input
                  type="radio"
                  name="applicantType"
                  value="business"
                  checked={formData.applicantType === 'business'}
                  onChange={handleChange}
                />
                <span>Business / Organization</span>
              </label>
              <label className="partner-radio">
                <input
                  type="radio"
                  name="applicantType"
                  value="individual"
                  checked={formData.applicantType === 'individual'}
                  onChange={handleChange}
                />
                <span>Individual</span>
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div className="partner-form-group">
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
          <div className="partner-form-group">
            <label htmlFor="email">Email *</label>
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
          <div className="partner-form-group">
            <label htmlFor="phone">Phone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Organization Name */}
          <div className="partner-form-group">
            <label htmlFor="organizationName">
              Organization Name {formData.applicantType === 'individual' && '(optional)'}
            </label>
            <input
              type="text"
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              required={formData.applicantType === 'business'}
            />
          </div>

          {/* Website / Social Media */}
          <div className="partner-form-group">
            <label htmlFor="websiteSocial">Website / Social Media (optional)</label>
            <input
              type="text"
              id="websiteSocial"
              name="websiteSocial"
              value={formData.websiteSocial}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          {/* Sponsorship Type */}
          <div className="partner-form-group">
            <label htmlFor="sponsorshipType">Type of Sponsorship *</label>
            <select
              id="sponsorshipType"
              name="sponsorshipType"
              value={formData.sponsorshipType}
              onChange={handleChange}
              required
            >
              <option value="">Select sponsorship type</option>
              {sponsorshipTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Involvement */}
          <div className="partner-form-group">
            <label htmlFor="involvement">How would you like to be involved in Connexa? *</label>
            <textarea
              id="involvement"
              name="involvement"
              value={formData.involvement}
              onChange={handleChange}
              rows="5"
              placeholder="Tell us about your vision for partnership..."
              required
            />
          </div>
        
          <div className='partnership-email-text'>
            <p>For more info email us at partnerships@zidepeople.com.</p>
          </div>

          <button type="submit" className="partner-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Be Part of Connexa'}
          </button>
        </form>
      </div>
    </section>
  );
}
