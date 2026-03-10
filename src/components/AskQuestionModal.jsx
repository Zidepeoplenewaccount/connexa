import { useState, useEffect } from 'react';
import { submitSpeakerQuestion, validateTicketId } from '../services/api';
import './AskQuestionModal.css';

export default function AskQuestionModal({ speaker, onClose }) {
  const [formData, setFormData] = useState({
    ticketId: '',
    name: '',
    email: '',
    question: ''
  });
  const [ticketValidated, setTicketValidated] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [validating, setValidating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // Validate ticket when user enters ticket ID
  useEffect(() => {
    const validateTicket = async () => {
      if (formData.ticketId.length >= 8) { // Assuming ticket IDs are at least 8 chars
        setValidating(true);
        setError('');
        
        try {
          const data = await validateTicketId(formData.ticketId);
          setTicketValidated(true);
          setTicketData(data);
          // Prefill name and email
          setFormData(prev => ({
            ...prev,
            name: data.attendee_name,
            email: data.email
          }));
        } catch (err) {
          setTicketValidated(false);
          setTicketData(null);
          setError('Invalid ticket ID. Please check and try again.');
        } finally {
          setValidating(false);
        }
      } else {
        setTicketValidated(false);
        setTicketData(null);
      }
    };

    const debounce = setTimeout(validateTicket, 500);
    return () => clearTimeout(debounce);
  }, [formData.ticketId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!ticketValidated) {
      setError('Please enter a valid ticket ID');
      return;
    }

    if (!formData.question.trim()) {
      setError('Please enter your question');
      return;
    }

    setLoading(true);

    try {
      await submitSpeakerQuestion({
        speaker_name: speaker.name,
        ticket_id: formData.ticketId,
        attendee_name: formData.name,
        attendee_email: formData.email,
        question_text: formData.question
      });

      setSubmitted(true);

      // Check if should show upgrade prompt
      const lowerTierTickets = [
        'General Access Ticket',
        'Individual Pass — Regular',
        'Connectors Pass'
      ];

      if (ticketData && lowerTierTickets.includes(ticketData.ticket_type)) {
        setShowUpgradePrompt(true);
      }
    } catch (err) {
      console.error('Question submission failed:', err);
      setError(err.response?.data?.detail || 'Failed to submit question. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleUpgradeClick() {
    // Close this modal and open upgrade modal
    window.location.href = `#upgrade?ticket=${formData.ticketId}`;
    onClose();
  }

  if (submitted) {
    return (
      <div className="question-modal-overlay" onClick={onClose}>
        <div className="question-modal" onClick={(e) => e.stopPropagation()}>
          {/*<button className="question-modal-close" onClick={onClose}>×</button>*/}
          
          {showUpgradePrompt ? (
            <div className="question-success">
              <div className="question-success-icon">✓</div>
              <h3>Thank you for submitting your question!</h3>
              
              <div className="question-upgrade-info">
                <p>
                  Questions selected for the live session will be answered from <strong>VIP and Business Owner</strong> ticket holders during Connexa.
                </p>
                <p>
                  General Access attendees will still enjoy the full conversation live at the event.
                </p>
                
                <div className="question-upgrade-cta">
                  <h4>Want your question to stand out?</h4>
                  <p>Upgrade to VIP or Business Owner access for priority selection.</p>
                  <button onClick={handleUpgradeClick} className="question-upgrade-btn">
                    Upgrade Ticket →
                  </button>
                </div>
              </div>
              
              <button onClick={onClose} className="question-close-btn">
                Close
              </button>
            </div>
          ) : (
            <div className="question-success">
              <div className="question-success-icon">✓</div>
              <h3>Thank you for submitting your question!</h3>
              <p>Your question has been submitted successfully. We'll review all questions and select the best ones for the live Q&A session.</p>
              <button onClick={onClose} className="question-close-btn">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="question-modal-overlay" onClick={onClose}>
      <div className="question-modal" onClick={(e) => e.stopPropagation()}>
        {/*<button className="question-modal-close" onClick={onClose}>×</button>*/}
        
        <h2 className="question-modal-title">Ask Connexer {speaker.name}</h2>
        <p className="question-modal-subtitle">
          Have a question you want answered at Connexa 2026? Submit it below.
        </p>

        <form className="question-form" onSubmit={handleSubmit}>
          {/* Ticket ID */}
          <div className="question-form-group">
            <label htmlFor="ticketId">Ticket ID *</label>
            <input
              type="text"
              id="ticketId"
              name="ticketId"
              value={formData.ticketId}
              onChange={handleChange}
              placeholder="e.g., CONNEXA2026-ABC123"
              required
            />
            {validating && (
              <small className="question-validating">Validating ticket...</small>
            )}
            {ticketValidated && ticketData && (
              <div className="question-ticket-valid">
                ✓ Ticket verified: {ticketData.ticket_type} - {ticketData.attendee_name}
              </div>
            )}
          </div>

          {/* Name (prefilled) */}
          <div className="question-form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={ticketValidated}
              required
            />
          </div>

          {/* Email (prefilled) */}
          <div className="question-form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={ticketValidated}
              required
            />
          </div>

          {/* Question */}
          <div className="question-form-group">
            <label htmlFor="question">Your Question *</label>
            <textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              rows="4"
              placeholder="What would you like to ask?"
              required
            />
          </div>

          {error && <div className="question-error">{error}</div>}

          <button 
            type="submit" 
            className="question-submit-btn"
            disabled={loading || !ticketValidated}
          >
            {loading ? 'Submitting...' : 'Submit Question'}
          </button>
        </form>

        <div className="question-learn-more">
          <strong>Learn more about the Connexer before asking your question.</strong>
          {speaker.topic && <p>Speaking on: {speaker.topic}</p>}
          {speaker.company && <p>{speaker.title} at {speaker.company}</p>}
        </div>
      </div>
    </div>
  );
}