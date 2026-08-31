import { useState } from 'react';
import { signupBusinessCandidate, signupIndividualCandidate, findTicketsByEmail, getTicketById } from '../services/api';
import { getUserFriendlyError, logTechnicalError } from '../utils/errorMessages';
import { TALENT_CATEGORIES, BUSINESS_CATEGORIES } from './Awards';
import './CandidateSignup.css';
 
// SVG Icons
const BriefcaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
  </svg>
);
 
const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5">
    <polygon points="12 2 15.09 10.26 24 10.27 17.18 16.29 20.27 24.54 12 18.53 3.73 24.54 6.82 16.29 0 10.27 8.91 10.26 12 2"></polygon>
  </svg>
);
 
const MicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v12a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);
 
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
 
const ELIGIBLE_TICKETS = [
  'Market Vendor Pass',
  'Showcase Vendor Pass',
  'Talent Pass — VIP',
  'VIP Partner Pass'
];
 
export default function CandidateSignup() {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  // Ticket verification states
  const [step, setStep] = useState('ticket'); // 'ticket' or 'form'
  const [ticketId, setTicketId] = useState('');
  const [ticketDetails, setTicketDetails] = useState(null);
  const [isEligible, setIsEligible] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketError, setTicketError] = useState('');
  const [showEmailLookup, setShowEmailLookup] = useState(false);
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [lookupResults, setLookupResults] = useState([]);
  const [lookupLoading, setLookupLoading] = useState(false);
 
  // Form states
  const [candidateType, setCandidateType] = useState('business');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    videoUrl: '',
    instagram: '',
    tiktok: '',
    challenge: '',
    whyDeserve: '',
    category: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 
  // Reset everything back to the initial ticket step (used by the close button
  // and by the "submit another application" flow)
  function resetFlow() {
    setStep('ticket');
    setTicketId('');
    setTicketDetails(null);
    setIsEligible(false);
    setTicketError('');
    setShowEmailLookup(false);
    setLookupEmail('');
    setLookupError('');
    setLookupResults([]);
    setCandidateType('business');
    setFormData({
      name: '',
      description: '',
      email: '',
      phone: '',
      videoUrl: '',
      instagram: '',
      tiktok: '',
      challenge: '',
      whyDeserve: '',
      category: ''
    });
    setSubmitted(false);
    setError('');
  }
 
  function handleOpenModal() {
    setIsModalOpen(true);
  }
 
  function handleCloseModal() {
    setIsModalOpen(false);
    resetFlow();
  }
 
  // Ticket verification handlers
  async function handleVerifyTicket(e) {
    e.preventDefault();
    setTicketError('');
 
    if (!ticketId.trim()) {
      setTicketError('Please enter your ticket ID');
      return;
    }
 
    setTicketLoading(true);
 
    try {
      const details = await getTicketById(ticketId.trim());
 
      setTicketDetails(details);
      const eligible = ELIGIBLE_TICKETS.includes(details.ticket_type);
      setIsEligible(eligible);
 
      if (eligible) {
        setStep('form');
        setFormData((prev) => ({
          ...prev,
          email: details.buyer_email || '',
          phone: details.phone || ''
        }));
      }
    } catch (err) {
      logTechnicalError(err, 'CANDIDATE_TICKET_LOOKUP');
      setTicketError(
        getUserFriendlyError(err) ||
        'Ticket not found. Please check your ticket ID and try again.'
      );
    } finally {
      setTicketLoading(false);
    }
  }
 
  async function handleFindByEmail(e) {
    e.preventDefault();
    setLookupError('');
    setLookupResults([]);
 
    if (!lookupEmail.trim()) {
      setLookupError('Please enter your email');
      return;
    }
 
    setLookupLoading(true);
    try {
      const result = await findTicketsByEmail(lookupEmail.trim());
      if (!result.tickets || result.tickets.length === 0) {
        setLookupError('No tickets found for this email.');
        return;
      }
      setLookupResults(result.tickets);
    } catch (err) {
      logTechnicalError(err, 'CANDIDATE_EMAIL_LOOKUP');
      setLookupError(
        getUserFriendlyError(err) ||
        'Unable to find tickets. Please try entering your ticket ID manually.'
      );
    } finally {
      setLookupLoading(false);
    }
  }
 
  function handleSelectLookupTicket(ticket) {
    setTicketId(ticket.ticket_id);
    setShowEmailLookup(false);
    setLookupResults([]);
    setLookupEmail('');
  }
 
  // Form handlers
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
 
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
 
    try {
      if (candidateType === 'business') {
        await signupBusinessCandidate({
          business_name: formData.name,
          business_description: formData.description,
          email: formData.email,
          phone: formData.phone,
          video_url: formData.videoUrl || null,
          instagram_handle: formData.instagram || null,
          tiktok_handle: formData.tiktok || null,
          challenge: formData.challenge || null,
          why_deserve: formData.whyDeserve || null,
          category: formData.category || null,
          ticket_id: ticketDetails.ticket_id,
          ticket_type: ticketDetails.ticket_type
        });
      } else {
        await signupIndividualCandidate({
          individual_name: formData.name,
          individual_bio: formData.description,
          email: formData.email,
          phone: formData.phone,
          video_url: formData.videoUrl || null,
          instagram_handle: formData.instagram || null,
          tiktok_handle: formData.tiktok || null,
          category: formData.category || null,
          ticket_id: ticketDetails.ticket_id,
          ticket_type: ticketDetails.ticket_type
        });
      }
 
      setSubmitted(true);
    } catch (err) {
      logTechnicalError(err, 'CANDIDATE_SIGNUP');
      setError(getUserFriendlyError(err));
    } finally {
      setLoading(false);
    }
  }
 
  function handleBackToTicket() {
    setStep('ticket');
    setTicketDetails(null);
    setIsEligible(false);
    setTicketId('');
    setTicketError('');
  }
 
  // ═══════════════════════════════════════════════════════════
  // Renders the current step's content (unchanged logic/markup)
  // ═══════════════════════════════════════════════════════════
  function renderContent() {
    // Success Screen
    if (submitted) {
      return (
        <div className="candidate-signup-success">
          <div className="candidate-success-icon">✓</div>
          <h3>Application Submitted!</h3>
          <p>Thank you for entering the Connexa 2026 Awards!</p>
          <p>Your application is under review. We'll notify you once it's approved.</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep('ticket');
              setTicketId('');
              setTicketDetails(null);
              setFormData({
                name: '',
                description: '',
                email: '',
                phone: '',
                videoUrl: '',
                instagram: '',
                tiktok: '',
                challenge: '',
                whyDeserve: '',
                category: ''
              });
            }}
            className="candidate-btn"
          >
            Submit Another Application
          </button>
        </div>
      );
    }
 
    // Application Form
    if (step === 'form' && isEligible && ticketDetails) {
      return (
        <div className="candidate-signup-form">
          <div className="awards-eligibility">
            <strong>Award Open To:</strong> Market & Showcase Vendors, Talent VIPs, and VIP Partners only
          </div>

          <h3>Register for CONNEXA Awards</h3>
          <p className="candidate-signup-subtitle">Submit your application to participate</p>
 
          <form onSubmit={handleSubmit}>
            {/* Category Selection */}
            <div className="candidate-form-group">
              <label>I am applying as: *</label>
              <div className="candidate-radio-group">
                <label className="candidate-radio">
                  <input
                    type="radio"
                    name="candidateType"
                    value="business"
                    checked={candidateType === 'business'}
                    onChange={(e) => {
                      setCandidateType(e.target.value);
                      setFormData(prev => ({ ...prev, category: '' }));
                    }}
                  />
                  <BriefcaseIcon />
                  <span>Business Owner</span>
                </label>
                <label className="candidate-radio">
                  <input
                    type="radio"
                    name="candidateType"
                    value="individual"
                    checked={candidateType === 'individual'}
                    onChange={(e) => {
                      setCandidateType(e.target.value);
                      setFormData(prev => ({ ...prev, category: '' }));
                    }}
                  />
                  <StarIcon />
                  <span>Talent</span>
                </label>
              </div>
            </div>
 
            {/* Award Category */}
            <div className="candidate-form-group">
              <label htmlFor="category">Award Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {(candidateType === 'business' ? BUSINESS_CATEGORIES : TALENT_CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div className="candidate-form-group">
              <label htmlFor="name">
                {candidateType === 'business' ? 'Business Name' : 'Full Name'} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
 
            {/* Description */}
            <div className="candidate-form-group">
              <label htmlFor="description">
                {candidateType === 'business' ? 'Business Description' : 'Your Bio'} *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder={candidateType === 'business'
                  ? 'Tell us about your business and what you do...'
                  : 'Tell us about yourself and your skills...'
                }
                required
              />
            </div>
 
            {/* Email */}
            <div className="candidate-form-group">
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
            <div className="candidate-form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
 
            {/* Video URL */}
            <div className="candidate-form-group">
              <label htmlFor="videoUrl">Instagram Video URL (optional)</label>
              <input
                type="url"
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/reel/..."
              />
              <small>Paste your Instagram reel/video link here</small>
            </div>
 
            {/* Instagram Handle */}
            <div className="candidate-form-group">
              <label htmlFor="instagram">Instagram Handle (optional)</label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="@yourusername"
              />
            </div>
 
            {/* TikTok Handle */}
            <div className="candidate-form-group">
              <label htmlFor="tiktok">TikTok Handle (optional)</label>
              <input
                type="text"
                id="tiktok"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleChange}
                placeholder="@yourusername"
              />
            </div>
 
            {/* Business-only fields */}
            {candidateType === 'business' && (
              <>
                <div className="candidate-form-group">
                  <label htmlFor="challenge">What challenges does your business face? (optional)</label>
                  <textarea
                    id="challenge"
                    name="challenge"
                    value={formData.challenge}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
 
                <div className="candidate-form-group">
                  <label htmlFor="whyDeserve">Why do you deserve this award? (optional)</label>
                  <textarea
                    id="whyDeserve"
                    name="whyDeserve"
                    value={formData.whyDeserve}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
              </>
            )}
 
            {error && <div className="candidate-error">{error}</div>}
 
            <button type="submit" className="candidate-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
 
            <button
              type="button"
              className="candidate-btn"
              onClick={handleBackToTicket}
              disabled={loading}
              style={{
                background: 'transparent',
                border: '2px solid var(--border)',
                color: 'var(--white)',
                marginTop: '8px'
              }}
            >
              Back to Ticket Verification
            </button>
          </form>
        </div>
      );
    }
 
    // ═══════════════════════════════════════════════════════════
    // Ineligible Warning (CHECK BEFORE TICKET FORM)
    // ═══════════════════════════════════════════════════════════
    if (step === 'ticket' && ticketDetails && !isEligible) {
      return (
        <div className="candidate-signup-form">
          <h3>Ticket Not Eligible</h3>
          <p className="candidate-signup-subtitle">
            Your ticket type is not eligible for this challenge
          </p>
 
          <div className="candidate-note" style={{ background: 'rgba(232,49,42,0.15)', borderColor: 'rgba(232,49,42,0.3)' }}>
            <strong style={{ color: 'var(--red)' }}>Not Eligible:</strong>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>
              Your current ticket type <strong>{ticketDetails.ticket_type}</strong> is not eligible for the Connexa 2026 Awards.
            </p>
          </div>
 
          <div className="candidate-note">
            <strong>Eligible Tickets:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>Market Vendor Pass</li>
              <li>Showcase Vendor Pass</li>
              <li>Talent Pass — VIP</li>
              <li>VIP Partner Pass</li>
            </ul>
            <p style={{ margin: '12px 0 0 0' }}>Applications are subject to review and approval.</p>
          </div>
 
          <button
            onClick={() => {
              setStep('ticket');
              setTicketDetails(null);
              setIsEligible(false);
              setTicketId('');
              setTicketError('');
            }}
            className="candidate-btn"
            style={{ marginTop: '24px' }}
          >
            Try Another Ticket
          </button>
        </div>
      );
    }
 
    // ═══════════════════════════════════════════════════════════
    // Ticket Verification Step (SHOW IF NOT VERIFIED OR NOT ELIGIBLE)
    // ═══════════════════════════════════════════════════════════
    if (step === 'ticket') {
      return (
        <div className="candidate-signup-form">
          <div className="awards-eligibility">
            <strong>Award Open To:</strong> Market & Showcase Vendors, Talent VIPs, and VIP Partners only
          </div>

          <h3>Register for CONNEXA Awards</h3>
          <p className="candidate-signup-subtitle">Verify your ticket to participate</p>
 
          <form onSubmit={handleVerifyTicket}>
            <div className="question-form-group">
              <label htmlFor="ticketId">Ticket ID *</label>
              <input
                type="text"
                id="ticketId"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                placeholder="e.g., CNX2026-ABC123"
                required
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: 'monospace'
                }}
              />
              <small style={{ marginTop: '8px' }}>
                Find your ticket ID in your confirmation email or ticket receipt
              </small>
            </div>
 
            {/* Find ticket by email */}
            <div className="candidate-email-lookup">
              <button
                type="button"
                className="candidate-email-lookup-toggle"
                onClick={() => setShowEmailLookup(!showEmailLookup)}
              >
                Don't have your ticket ID? Find it by email
              </button>
 
              {showEmailLookup && (
                <div className="candidate-email-lookup-form">
                  <input
                    type="email"
                    value={lookupEmail}
                    onChange={(e) => setLookupEmail(e.target.value)}
                    placeholder="Enter the email used to purchase your ticket"
                    className="candidate-email-lookup-input"
                  />
                  <button
                    type="button"
                    className="candidate-email-lookup-btn"
                    onClick={handleFindByEmail}
                    disabled={lookupLoading}
                  >
                    {lookupLoading ? 'Finding...' : 'Find My Ticket'}
                  </button>
                  {lookupError && <div className="candidate-error">{lookupError}</div>}
                  {lookupResults.length > 0 && (
                    <div className="candidate-email-lookup-results">
                      {lookupResults.map((ticket) => (
                        <button
                          key={ticket.ticket_id}
                          type="button"
                          className="candidate-email-lookup-result"
                          onClick={() => handleSelectLookupTicket(ticket)}
                        >
                          <strong>{ticket.ticket_id}</strong>
                          <small>{ticket.attendee_name} · {ticket.ticket_type}</small>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
 
            {ticketError && <div className="candidate-error">{ticketError}</div>}
 
            <button
              type="submit"
              className="candidate-btn"
              disabled={ticketLoading}
            >
              {ticketLoading ? 'Verifying...' : 'Verify Ticket'}
            </button>
          </form>
 
          <div className="candidate-note">
            <strong>Note:</strong> Award open to Market & Showcase Vendors, Talent VIPs, and VIP Partners only.
            Applications are subject to review and approval.
          </div>
        </div>
      );
    }
 
    return null;
  }
 
  return (
    <>
      {/* Trigger Button */}
      <button className="candidate-modal-trigger-btn" onClick={handleOpenModal}>
        Register for CONNEXA Awards
      </button>
 
      {/* Modal */}
      {isModalOpen && (
        <div
          className="candidate-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div className="candidate-modal-content">
            <button
              className="candidate-modal-close"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              <CloseIcon />
            </button>
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
}
