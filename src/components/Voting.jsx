import { useState, useEffect } from 'react';
import './Voting.css';
import { getCandidates, initializeVote } from '../services/api';


// Add this at the top of the Voting component, right after the state declarations

// TEST DATA - Remove this when backend is ready


export default function Voting() {
  const [activeTab, setActiveTab] = useState('businesses');
  const [businesses, setBusinesses] = useState([]);
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voterName, setVoterName] = useState('');
  const [voterEmail, setVoterEmail] = useState('');
  const [voteLoading, setVoteLoading] = useState(false);
  const [error, setError] = useState('');

  const [voteQuantity, setVoteQuantity] = useState(1);

  // Update openVoteModal function to reset quantity
  function openVoteModal(candidate) {
    setSelectedCandidate(candidate);
    setModalOpen(true);
    setVoterName('');
    setVoterEmail('');
    setVoteQuantity(1);  // ADD THIS LINE
    setError('');
  }


  // Fetch candidates on mount
  useEffect(() => {
    fetchCandidates();
  }, []);

  async function fetchCandidates() {
    try {
      setLoading(true);
      
      // TEMPORARY: Use test data
      // TODO: Remove this and uncomment API calls when backend is ready
      
      //const businessData = testCandidates.filter(c => c.candidate_type === 'business');
      //const talentData = testCandidates.filter(c => c.candidate_type === 'individual');
      
      //setBusinesses(businessData);
      //setTalents(talentData);
      
      // UNCOMMENT WHEN BACKEND IS READY:
      const businessData = await getCandidates('business');
      setBusinesses(businessData);
      const talentData = await getCandidates('individual');
      setTalents(talentData);
      
    } catch (err) {
      console.error('Failed to load candidates:', err);
    } finally {
      setLoading(false);
    }
  }

  function openVoteModal(candidate) {
    setSelectedCandidate(candidate);
    setModalOpen(true);
    setVoterName('');
    setVoterEmail('');
    setError('');
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedCandidate(null);
  }

  
  // Update handleVoteSubmit to include quantity
  async function handleVoteSubmit(e) {
    e.preventDefault();
    setError('');

    if (!voterName.trim() || !voterEmail.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setVoteLoading(true);

    try {
      const voteData = {
        candidate_id: selectedCandidate.id,
        voter_name: voterName,
        voter_email: voterEmail,
        quantity: voteQuantity,  // ADD THIS LINE
      };

      const response = await initializeVote(voteData);

      if (response.status && response.data.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        setError('Vote initialization failed. Please try again.');
      }
    } catch (err) {
      console.error('Vote error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setVoteLoading(false);
    }
  }


  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting && e.target.classList.add(''));
    }, { threshold: 0.1 });

    document.querySelectorAll('.voting-card').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [activeTab]);

  const currentCandidates = activeTab === 'businesses' ? businesses : talents;

  return (
    <section className="voting section" id="voting">
      <div className="container">
        <div className="voting-header reveal">
          <div className="section-tag">Vote</div>
          <h2 className="section-title">
            Support Your <span className="highlight-orange">Favorites</span>
          </h2>
          <p>
            Cast your vote and help your favorite businesses and talents win at Connexa 2026.
          </p>
        </div>

        {/* Tabs */}
        <div className="voting-tabs reveal">
          <button
            className={`voting-tab ${activeTab === 'businesses' ? 'active' : ''}`}
            onClick={() => setActiveTab('businesses')}
          >
            Business Award
          </button>
          <button
            className={`voting-tab ${activeTab === 'talents' ? 'active' : ''}`}
            onClick={() => setActiveTab('talents')}
          >
            Talent Award
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="voting-loading">
            <p>Loading candidates...</p>
          </div>
        )}

        {/* Candidates Grid */}
        {!loading && (
          <div className="voting-grid">
            {currentCandidates.length === 0 ? (
              <div className="voting-empty">
                {/*<p>No candidates yet. Check back soon!</p>*/}
              </div>
            ) : (
              currentCandidates.map((candidate, i) => (
              <div
                key={candidate.id}
                className="voting-card"
                style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
              >
                <div className="voting-card-header">
                  <h3>{candidate.business_name || candidate.individual_name}</h3>
                  {/* Only show video link if it exists */}
                  {candidate.video_url && (
                    <a
                      href={candidate.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="voting-video-link"
                    >
                      📹 Watch Video
                    </a>
                  )}
                </div>

                <p className="voting-card-description">
                  {candidate.business_description || candidate.individual_bio}
                </p>

                {/* Only show challenge if it exists */}
                {candidate.challenge && (
                  <div className="voting-card-challenge">
                    <strong>Challenge:</strong> {candidate.challenge}
                  </div>
                )}

                {/* Social handles - only show if they exist */}
                {(candidate.instagram_handle || candidate.tiktok_handle) && (
                  <div className="voting-card-socials">
                    {candidate.instagram_handle && (
                      <a
                        href={`https://instagram.com/${candidate.instagram_handle.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="voting-social-link"
                      >
                        📸 Instagram
                      </a>
                    )}
                    {candidate.tiktok_handle && (
                      <a
                        href={`https://tiktok.com/@${candidate.tiktok_handle.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="voting-social-link"
                      >
                        🎵 TikTok
                      </a>
                    )}
                  </div>
                )}

                <div className="voting-card-stats">
                  <div className="voting-stat">
                    <div className="voting-stat-number">{candidate.vote_count || 0}</div>
                    <div className="voting-stat-label">Votes</div>
                  </div>
                  <div className="voting-stat">
                    <div className="voting-stat-number">₦{((candidate.vote_count || 0) * 100).toLocaleString()}</div>
                    <div className="voting-stat-label">Raised</div>
                  </div>
                </div>

                <button
                  onClick={() => openVoteModal(candidate)}
                  className="voting-card-btn"
                >
                  Vote Now
                </button>
              </div>
            ))
          )}
          </div>
        )}
      </div>

      {/* Vote Modal */}
      {modalOpen && selectedCandidate && (
        <div className="voting-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="voting-modal">
            <button className="voting-modal-close" onClick={closeModal}>×</button>

            <h3 className="voting-modal-title">
              Vote for {selectedCandidate.business_name || selectedCandidate.individual_name}
            </h3>

            <p className="voting-modal-price">₦100 per vote</p>

            {/* ADD QUANTITY SELECTOR HERE */}
            <div className="voting-quantity-selector">
              <label>Number of Votes</label>
              <div className="voting-quantity-controls">
                <button 
                  type="button"
                  onClick={() => setVoteQuantity(Math.max(1, voteQuantity - 1))}
                  className="voting-quantity-btn"
                >
                  −
                </button>
                <input 
                  type="number" 
                  min="1" 
                  max="100"
                  value={voteQuantity}
                  onChange={(e) => setVoteQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="voting-quantity-input"
                />
                <button 
                  type="button"
                  onClick={() => setVoteQuantity(Math.min(100, voteQuantity + 1))}
                  className="voting-quantity-btn"
                >
                  +
                </button>
              </div>
              <div className="voting-total-price">
                Total: ₦{(voteQuantity * 100).toLocaleString()}
              </div>
            </div>

            <form className="voting-modal-form" onSubmit={handleVoteSubmit}>
              <div className="voting-input-group">
                <label>Your Name</label>
                <input
                  type="text"
                  className="voting-input"
                  placeholder="Full Name"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  required
                />
              </div>

              <div className="voting-input-group">
                <label>Your Email</label>
                <input
                  type="email"
                  className="voting-input"
                  placeholder="your@email.com"
                  value={voterEmail}
                  onChange={(e) => setVoterEmail(e.target.value)}
                  required
                />
              </div>

              {error && <div className="voting-modal-error">{error}</div>}

              <button
                type="submit"
                className="voting-modal-submit"
                disabled={voteLoading}
              >
                {voteLoading ? 'Processing...' : `Pay ₦${(voteQuantity * 100).toLocaleString()} →`}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}




