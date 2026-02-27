import { useState } from 'react';
import { signupBusinessCandidate, signupIndividualCandidate } from '../services/api';
import './CandidateSignup.css';

export default function CandidateSignup() {
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
    whyDeserve: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          why_deserve: formData.whyDeserve || null
        });
      } else {
        await signupIndividualCandidate({
          individual_name: formData.name,
          individual_bio: formData.description,
          email: formData.email,
          phone: formData.phone,
          video_url: formData.videoUrl || null,
          instagram_handle: formData.instagram || null,
          tiktok_handle: formData.tiktok || null
        });
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="candidate-signup-success">
        <div className="candidate-success-icon">✓</div>
        <h3>Application Submitted!</h3>
        <p>Thank you for entering the "What Connexa Means To Me" Challenge!</p>
        <p>Your application is under review. We'll notify you once it's approved and you're live for voting.</p>
        <button onClick={() => {
          setSubmitted(false);
          setFormData({
            name: '',
            description: '',
            email: '',
            phone: '',
            videoUrl: '',
            instagram: '',
            tiktok: '',
            challenge: '',
            whyDeserve: ''
          });
        }} className="candidate-btn">
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="candidate-signup-form">
      <h3>Enter the Challenge</h3>
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
                onChange={(e) => setCandidateType(e.target.value)}
              />
              <span>🏢 Business Owner</span>
            </label>
            <label className="candidate-radio">
              <input
                type="radio"
                name="candidateType"
                value="individual"
                checked={candidateType === 'individual'}
                onChange={(e) => setCandidateType(e.target.value)}
              />
              <span>⭐ Talent</span>
            </label>
          </div>
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
      </form>

      <div className="candidate-note">
        <strong>Note:</strong> Award open to Vendors, Brand Showcases, and Individual VIPs only. 
        Applications are subject to review and approval.
      </div>
    </div>
  );
}