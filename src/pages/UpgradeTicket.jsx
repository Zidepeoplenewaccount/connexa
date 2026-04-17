import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getUpgradeOptions, initializeUpgrade } from '../services/api';
import { getUserFriendlyError, logTechnicalError } from '../utils/errorMessages';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './UpgradeTicket.css';

export default function UpgradeTicket() {
  const [searchParams] = useSearchParams();
  const [ticketId, setTicketId] = useState(searchParams.get('ticket') || '');
  const [upgradeOptions, setUpgradeOptions] = useState(null);
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Auto-fetch if ticket ID is in URL
    const ticketParam = searchParams.get('ticket');
    if (ticketParam) {
      fetchUpgradeOptions(ticketParam);
    }
  }, [searchParams]);

  async function fetchUpgradeOptions(id) {
    if (!id || id.length < 8) {
      setError('Please enter a valid ticket ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await getUpgradeOptions(id);
      setUpgradeOptions(data);
      setSelectedUpgrade(data.available_upgrades?.[0] || null);
      
      if (data.available_upgrades.length === 0) {
        setError('No upgrades available for this ticket type. You may already have the highest tier!');
      }
    } catch (err) {
      logTechnicalError(err, 'UPGRADE_OPTIONS_PAGE');
      setError(getUserFriendlyError(err));
      setUpgradeOptions(null);
    } finally {
      setLoading(false);
    }
  }

  function handleTicketIdSubmit(e) {
    e.preventDefault();
    fetchUpgradeOptions(ticketId);
  }

  async function handleUpgradeSubmit() {
    if (!selectedUpgrade) {
      setError('Please select an upgrade option');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await initializeUpgrade({
        ticket_id: upgradeOptions.ticket_id,
        upgrade_to_ticket_type: selectedUpgrade.ticket_type
      });

      if (response.authorization_url) {
        window.location.href = response.authorization_url;
      }
    } catch (err) {
      logTechnicalError(err, 'UPGRADE_INIT_PAGE');
      setError(getUserFriendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="upgrade-page">
        <div className="container">
          <div className="upgrade-page-header">
            <span className="section-tag">ENHANCE YOUR EXPERIENCE</span>
            <h1 className="section-title">
              Upgrade Your <span className="highlight-orange">Ticket</span>
            </h1>
            <p>Unlock VIP access, priority seating, networking opportunities, and exclusive benefits.</p>
          </div>

          {!upgradeOptions ? (
            <div className="upgrade-page-card">
              <h2>Enter Your Ticket ID</h2>
              <p className="upgrade-page-subtitle">
                You can find your ticket ID in your confirmation email
              </p>

              <form className="upgrade-page-form" onSubmit={handleTicketIdSubmit}>
                <div className="upgrade-page-input-group">
                  <label htmlFor="ticketId">Ticket ID</label>
                  <input
                    type="text"
                    id="ticketId"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    placeholder="e.g., CONNEXA2026-ABC123"
                    required
                  />
                </div>

                {error && <div className="upgrade-page-error">{error}</div>}

                <button 
                  type="submit" 
                  className="upgrade-page-btn"
                  disabled={loading}
                >
                  {loading ? 'Checking...' : 'Check Upgrade Options'}
                </button>
              </form>

              <div className="upgrade-page-benefits">
                <h3>Why Upgrade?</h3>
                <div className="upgrade-benefits-grid">
                  <div className="upgrade-benefit-item">
                    <span className="upgrade-benefit-icon">⭐</span>
                    <h4>VIP Access</h4>
                    <p>Priority seating and exclusive areas</p>
                  </div>
                  <div className="upgrade-benefit-item">
                    <span className="upgrade-benefit-icon">🎯</span>
                    <h4>Priority Q&A</h4>
                    <p>Your questions answered first</p>
                  </div>
                  <div className="upgrade-benefit-item">
                    <span className="upgrade-benefit-icon">🤝</span>
                    <h4>Premium Networking</h4>
                    <p>Connect with speakers and partners</p>
                  </div>
                  <div className="upgrade-benefit-item">
                    <span className="upgrade-benefit-icon">🏆</span>
                    <h4>Award Eligibility</h4>
                    <p>Qualify for recognition awards</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="upgrade-page-card">
              <div className="upgrade-current-ticket">
                <h3>Current Ticket</h3>
                <div className="upgrade-current-info">
                  <div className="upgrade-current-type">{upgradeOptions.current_ticket_type}</div>
                  <div className="upgrade-current-name">{upgradeOptions.attendee_name}</div>
                  <div className="upgrade-current-id">Ticket ID: {upgradeOptions.ticket_id}</div>
                </div>
              </div>

              {upgradeOptions.available_upgrades.length > 0 ? (
                <>
                  <h3 className="upgrade-options-heading">Available Upgrades</h3>
                  <p className="upgrade-options-subtext">Choose any available non-Connexa pass ticket type to upgrade to</p>

                  <div className="upgrade-page-input-group">
                    <label htmlFor="upgradeType">Select Ticket Type</label>
                    <select
                      id="upgradeType"
                      value={selectedUpgrade?.ticket_type || ''}
                      onChange={(e) => {
                        const selected = upgradeOptions.available_upgrades.find(
                          (upgrade) => upgrade.ticket_type === e.target.value
                        );
                        setSelectedUpgrade(selected || null);
                      }}
                    >
                      {upgradeOptions.available_upgrades.map((upgrade) => (
                        <option key={upgrade.ticket_type} value={upgrade.ticket_type}>
                          {upgrade.ticket_type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedUpgrade && (
                    <div className="upgrade-option selected">
                      <div className="upgrade-option-content">
                        <div className="upgrade-option-header">
                          <h4>{selectedUpgrade.ticket_type}</h4>
                          <span className="upgrade-selected-badge">✓ Selected</span>
                        </div>

                        <div className="upgrade-option-pricing">
                          <div className="upgrade-option-original">
                            Full price: <span className="strikethrough">₦{selectedUpgrade.price.toLocaleString()}</span>
                          </div>
                          <div className="upgrade-option-pay">
                            You pay: <span className="upgrade-price">₦{selectedUpgrade.upgrade_amount.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="upgrade-option-benefits">
                          {selectedUpgrade.ticket_type.includes('VIP') && (
                            <>
                              <span>✓ VIP seating & areas</span>
                              <span>✓ Priority Q&A selection</span>
                              <span>✓ Exclusive networking</span>
                            </>
                          )}
                          {selectedUpgrade.ticket_type.includes('Business Owner') && (
                            <>
                              <span>✓ Business owner sessions</span>
                              <span>✓ Advisory access</span>
                              <span>✓ Peer networking</span>
                            </>
                          )}
                          {selectedUpgrade.ticket_type.includes('VIP Partner') && (
                            <>
                              <span>✓ Prime positioning</span>
                              <span>✓ On-stage recognition</span>
                              <span>✓ Maximum visibility</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {error && <div className="upgrade-page-error">{error}</div>}

                  <div className="upgrade-page-actions">
                    <button
                      className="upgrade-page-btn"
                      onClick={handleUpgradeSubmit}
                      disabled={loading || !selectedUpgrade}
                    >
                      {loading ? 'Processing...' : selectedUpgrade ? `Upgrade for ₦${selectedUpgrade.upgrade_amount.toLocaleString()}` : 'Select an Upgrade'}
                    </button>

                    <button
                      className="upgrade-page-back-btn"
                      onClick={() => {
                        setUpgradeOptions(null);
                        setSelectedUpgrade(null);
                        setTicketId('');
                      }}
                    >
                      Use Different Ticket
                    </button>
                  </div>
                </>
              ) : (
                <div className="upgrade-no-options">
                  <div className="upgrade-no-options-icon">🎉</div>
                  <h3>You're All Set!</h3>
                  <p>You already have the best ticket tier available. See you at Connexa 2026!</p>
                  <button 
                    className="upgrade-page-btn"
                    onClick={() => window.location.href = '/'}
                  >
                    Back to Home
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}