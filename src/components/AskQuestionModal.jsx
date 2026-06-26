import { useState } from 'react';
import { FaLightbulb } from 'react-icons/fa';
import { submitSpeakerQuestion, findTicketsByEmail } from '../services/api';
import { getUserFriendlyError, logTechnicalError } from '../utils/errorMessages';
import './AskQuestionModal.css';
 
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaTiktok, FaXTwitter } from "react-icons/fa6";
 
const socialIcons = {
  instagram: FaInstagram,
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
  tiktok: FaTiktok,
};
 
const PRIORITY_TICKETS = [
  'Talent Pass — VIP',
  'Business Owner Pass',
  'Showcase Vendor Pass',
  'Market Vendor Pass',
  'VIP Partner Pass'
];
 
 
export default function AskQuestionModal({ speaker, onClose }) {
  const [step, setStep] = useState('ticket'); // 'ticket' or 'question'
  const [ticketId, setTicketId] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  // Ticket details from lookup
  const [ticketDetails, setTicketDetails] = useState(null);
  const [isPriorityTicket, setIsPriorityTicket] = useState(false);

  // Find ticket by email
  const [showEmailLookup, setShowEmailLookup] = useState(false);
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResults, setLookupResults] = useState([]);
  const [lookupError, setLookupError] = useState('');
 
  async function handleVerifyTicket(e) {
    e.preventDefault();
    setError('');
 
    if (!ticketId.trim()) {
      setError('Please enter your ticket ID');
      return;
    }
 
    setLoading(true);
 
    try {
      // Fetch ticket details from backend
      const response = await fetch(
        `https://connexa-aahsexcjcfakfhbd.southafricanorth-01.azurewebsites.net/tickets/${ticketId.trim()}`
      );
      
      if (!response.ok) {
        throw new Error('Ticket not found');
      }
 
      const details = await response.json();
      
      setTicketDetails(details);
      setIsPriorityTicket(PRIORITY_TICKETS.includes(details.ticket_type));
      setStep('question');
    } catch (err) {
      logTechnicalError(err, 'TICKET_LOOKUP');
      setError(getUserFriendlyError(err) || 'Ticket not found. Please check your ticket ID and try again.');
    } finally {
      setLoading(false);
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
      logTechnicalError(err, 'ASK_QUESTION_EMAIL_LOOKUP');
      setLookupError(getUserFriendlyError(err) || 'Unable to find tickets. Please try entering your ticket ID manually.');
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
 
  async function handleSubmitQuestion(e) {
    e.preventDefault();
    setError('');
 
    if (!question.trim()) {
      setError('Please enter your question');
      return;
    }
 
    setLoading(true);
 
    try {
      await submitSpeakerQuestion({
        speaker_name: speaker.name,
        ticket_id: ticketDetails.ticket_id,
        ticket_type: ticketDetails.ticket_type,
        attendee_name: ticketDetails.attendee_name,
        attendee_email: ticketDetails.buyer_email,
        question_text: question
      });
 
      setSubmitted(true);
    } catch (err) {
      logTechnicalError(err, 'SPEAKER_QUESTION_SUBMIT');
      setError(getUserFriendlyError(err));
    } finally {
      setLoading(false);
    }
  }
 
  function handleUpgradeClick() {
    window.location.href = '/upgrade-ticket';
  }
 
  function handleBackToTicket() {
    setStep('ticket');
    setQuestion('');
    setTicketDetails(null);
  }
 
  // Success Screen
  if (submitted) {
    return (
      <div className="question-modal-overlay" onClick={onClose}>
        <div className="question-modal" onClick={(e) => e.stopPropagation()}>
          <button className="question-modal-close" onClick={onClose}>×</button>
          <div className="question-success">
            <div className="question-success-icon">✓</div>
            <h3>Thank you for submitting your question!</h3>
            
            {!isPriorityTicket ? (
              <div className="question-upgrade-info">
                <p>
                  Your question has been submitted successfully. Questions are reviewed and selected for the live session based on relevance and prioritization.
                </p>
                
                <div className="question-upgrade-cta">
                  <h4>Want your question to stand out?</h4>
                  <p>Upgrade to a VIP, Business Owner, or Partner pass for priority selection in Q&A sessions.</p>
                  <button onClick={handleUpgradeClick} className="question-upgrade-btn">
                    Upgrade Ticket →
                  </button>
                </div>
              </div>
            ) : (
              <p>Your question will be prioritized for selection at Connexa 2026!</p>
            )}
            
            <button onClick={onClose} className="question-close-btn">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="question-modal-overlay" onClick={onClose}>
      <div className="question-modal" onClick={(e) => e.stopPropagation()}>
        <button className="question-modal-close" onClick={onClose}>×</button>
        
        {/* Header */}
        <h2 className="question-modal-title2">
          {speaker.connexerType ? `${speaker.connexerType}` : 'Connexer'}
        </h2>
        <h2 className="question-modal-title">
          Ask {speaker.name}
        </h2>
        <p className="question-modal-subtitle">
          Have a question you want answered at Connexa 2026? Submit it below.
        </p>
 
        {/* Step 1: Ticket Verification */}
        {step === 'ticket' && (
          <form className="question-form" onSubmit={handleVerifyTicket}>
            <div className="question-form-group">
              <label htmlFor="ticketId">Ticket ID *</label>
              <input
                type="text"
                id="ticketId"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                placeholder="e.g., CNX2026-ABC123"
                required
                autoFocus
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: 'monospace'
                }}
              />
              <small style={{ marginTop: '8px', color: 'var(--color-text-secondary)' }}>
                Find your ticket ID in your confirmation email or ticket receipt
              </small>
            </div>

            {/* Find ticket by email */}
            <div className="question-email-lookup">
              <button
                type="button"
                className="question-email-lookup-toggle"
                onClick={() => setShowEmailLookup(!showEmailLookup)}
              >
                Don't have your ticket ID? Find it by email
              </button>

              {showEmailLookup && (
                <div className="question-email-lookup-form">
                  <input
                    type="email"
                    value={lookupEmail}
                    onChange={(e) => setLookupEmail(e.target.value)}
                    placeholder="Enter the email used to purchase your ticket"
                    className="question-email-lookup-input"
                  />
                  <button
                    type="button"
                    className="question-email-lookup-btn"
                    onClick={handleFindByEmail}
                    disabled={lookupLoading}
                  >
                    {lookupLoading ? 'Finding...' : 'Find My Ticket'}
                  </button>
                  {lookupError && <div className="question-error">{lookupError}</div>}
                  {lookupResults.length > 0 && (
                    <div className="question-email-lookup-results">
                      {lookupResults.map((ticket) => (
                        <button
                          key={ticket.ticket_id}
                          type="button"
                          className="question-email-lookup-result"
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
 
            {error && <div className="question-error">{error}</div>}
 
            <button 
              type="submit" 
              className="question-submit-btn"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Ticket'}
            </button>
          </form>
        )}
 
        {/* Step 2: Question Submission */}
        {step === 'question' && ticketDetails && (
          <>
            {/* Verified Ticket Info */}
            <div className="question-ticket-info">
              <div className="ticket-info-row">
                <span className="ticket-info-label">Name:</span>
                <span className="ticket-info-value">{ticketDetails.attendee_name}</span>
              </div>
              <div className="ticket-info-row">
                <span className="ticket-info-label">Ticket Type:</span>
                <span className="ticket-info-value">{ticketDetails.ticket_type}</span>
              </div>
              {!isPriorityTicket && (
                <div className="ticket-info-priority-warning">
                  <strong><FaLightbulb size={14} /> Not a priority ticket?</strong>
                  <p>Upgrade to VIP, Business Owner, or Partner pass to get priority selection in Q&A sessions.</p>
                  <a href="/upgrade-ticket" className="ticket-upgrade-link">
                    Upgrade Your Ticket →
                  </a>
                </div>
              )}
            </div>
 
            <form className="question-form" onSubmit={handleSubmitQuestion}>
              {/* Question */}
              <div className="question-form-group">
                <label htmlFor="question">Your Question *</label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows="5"
                  placeholder="What would you like to ask?"
                  required
                  autoFocus
                />
              </div>
 
              {error && <div className="question-error">{error}</div>}
 
              <div className="question-form-actions">
                <button 
                  type="submit" 
                  className="question-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Question'}
                </button>
                <button 
                  type="button" 
                  className="question-back-btn"
                  onClick={handleBackToTicket}
                  disabled={loading}
                >
                  Back
                </button>
              </div>
            </form>
          </>
        )}
 
        {/* Speaker Info Section */}
        <div className="question-learn-more">
          <strong>Learn more about {speaker.connexerType ? speaker.connexerType : 'the Connexer'}</strong>
          
          {speaker.socials && Object.keys(speaker.socials).length > 0 && (
            <div className="speaker-socials">
              {Object.entries(speaker.socials).map(([platform, url]) => {
                const Icon = socialIcons[platform];
 
                return (
                  <a
                    key={platform}
                    href={url}
                    className="speaker-social"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={platform}
                  >
                    {Icon ? <Icon size={18} /> : '🔗'}
                  </a>
                );
              })}
            </div>
          )}
 
          {speaker.topic && <p><strong>Speaking on:</strong> {speaker.topic}</p>}
          {speaker.company && <p><strong>{speaker.title}</strong> at {speaker.company}</p>}
        </div>
      </div>
    </div>
  );
}
