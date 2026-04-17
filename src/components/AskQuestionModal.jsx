import { useState } from 'react';
import { submitSpeakerQuestion } from '../services/api';
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


export default function AskQuestionModal({ speaker, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ticketType: '',
    question: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const ticketTypes = [
    'General Access Ticket',
    'Individual Pass — Regular',
    'Connectors Pass',
    'Individual Pass — VIP',
    'Business Owner Pass',
    'Showcase Vendor Pass',
    'Market Vendor Pass',
    'VIP Partner Pass'
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.ticketType || !formData.question.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await submitSpeakerQuestion({
        speaker_name: speaker.name,
        ticket_type: formData.ticketType,
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

      if (lowerTierTickets.includes(formData.ticketType)) {
        setShowUpgradePrompt(true);
      }
    } catch (err) {
      logTechnicalError(err, 'SPEAKER_QUESTION_SUBMIT');
      setError(getUserFriendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  function handleUpgradeClick() {
    // Redirect to upgrade page
    window.location.href = '/upgrade-ticket';
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
          {/* Name */}
          <div className="question-form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>

          {/* Email */}
          <div className="question-form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
          </div>

          {/* Ticket Type */}
          <div className="question-form-group">
            <label htmlFor="ticketType">Ticket Type *</label>
            <select
              id="ticketType"
              name="ticketType"
              value={formData.ticketType}
              onChange={handleChange}
              required
            >
              <option value="">Select your ticket type</option>
              {ticketTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
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
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Question'}
          </button>
        </form>

        <div className="question-learn-more">
          <strong>Learn more about the Connexer before asking your question.</strong>
          
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

          {speaker.topic && <p>Speaking on: {speaker.topic}</p>}
          {speaker.company && <p>{speaker.title} at {speaker.company}</p>}
        </div>
      </div>
    </div>
  );
}