import { useState, useEffect } from 'react';
import { getUpgradeOptions, initializeUpgrade } from '../services/api';
import './upgrade-ticket-modal.css';

export default function UpgradeTicketModal({ initialTicketId = '', onClose }) {
  const [ticketId, setTicketId] = useState(initialTicketId);
  const [upgradeOptions, setUpgradeOptions] = useState(null);
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTicketId) {
      fetchUpgradeOptions(initialTicketId);
    }
  }, [initialTicketId]);

  async function fetchUpgradeOptions(id) {
    if (!id || id.length < 8) return;

    setLoading(true);
    setError('');

    try {
      const data = await getUpgradeOptions(id);
      setUpgradeOptions(data);
      
      if (data.available_upgrades.length === 0) {
        setError('No upgrades available for this ticket type.');
      }
    } catch (err) {
      console.error('Failed to fetch upgrade options:', err);
      setError(err.response?.data?.detail || 'Invalid ticket ID or no upgrades available.');
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
      console.error('Upgrade initialization failed:', err);
      setError(err.response?.data?.detail || 'Failed to initialize upgrade. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upgrade-modal-overlay" onClick={onClose}>
      <div className="upgrade-modal" onClick={(e) => e.stopPropagation()}>
        <button className="upgrade-modal-close" onClick={onClose}>×</button>

        <h2 className="upgrade-modal-title">Upgrade Your Ticket</h2>
        <p className="upgrade-modal-subtitle">
          Unlock VIP access, priority seating, and exclusive benefits
        </p>

        {!upgradeOptions ? (
          <form className="upgrade-ticket-form" onSubmit={handleTicketIdSubmit}>
            <div className="upgrade-form-group">
              <label htmlFor="ticketId">Enter Your Ticket ID</label>
              <input
                type="text"
                id="ticketId"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="e.g., CONNEXA2026-ABC123"
                required
              />
              <small>You can find your ticket ID in your confirmation email</small>
            </div>

            {error && <div className="upgrade-error">{error}</div>}

            <button 
              type="submit" 
              className="upgrade-submit-btn"
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Check Upgrade Options'}
            </button>
          </form>
        ) : (
          <div className="upgrade-options">
            <div className="upgrade-current">
              <h3>Current Ticket</h3>
              <div className="upgrade-current-card">
                <div className="upgrade-ticket-type">{upgradeOptions.current_ticket_type}</div>
                <div className="upgrade-attendee">{upgradeOptions.attendee_name}</div>
                <div className="upgrade-ticket-id">ID: {upgradeOptions.ticket_id}</div>
              </div>
            </div>

            {upgradeOptions.available_upgrades.length > 0 ? (
              <>
                <h3 className="upgrade-options-title">Available Upgrades</h3>
                <div className="upgrade-options-grid">
                  {upgradeOptions.available_upgrades.map((upgrade) => (
                    <div
                      key={upgrade.ticket_type}
                      className={`upgrade-option-card ${selectedUpgrade?.ticket_type === upgrade.ticket_type ? 'selected' : ''}`}
                      onClick={() => setSelectedUpgrade(upgrade)}
                    >
                      <div className="upgrade-option-header">
                        <div className="upgrade-option-name">{upgrade.ticket_type}</div>
                        <div className="upgrade-option-price">
                          <span className="upgrade-full-price">₦{upgrade.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="upgrade-option-difference">
                        Pay only: <strong>₦{upgrade.upgrade_amount.toLocaleString()}</strong>
                      </div>
                      {selectedUpgrade?.ticket_type === upgrade.ticket_type && (
                        <div className="upgrade-option-selected">✓ Selected</div>
                      )}
                    </div>
                  ))}
                </div>

                {error && <div className="upgrade-error">{error}</div>}

                <button
                  className="upgrade-submit-btn"
                  onClick={handleUpgradeSubmit}
                  disabled={loading || !selectedUpgrade}
                >
                  {loading ? 'Processing...' : `Upgrade for ₦${selectedUpgrade?.upgrade_amount.toLocaleString() || '0'}`}
                </button>

                <button
                  className="upgrade-back-btn"
                  onClick={() => {
                    setUpgradeOptions(null);
                    setSelectedUpgrade(null);
                    setTicketId('');
                  }}
                >
                  Use Different Ticket
                </button>
              </>
            ) : (
              <div className="upgrade-no-options">
                <p>🎉 You already have the best ticket tier available!</p>
                <button className="upgrade-back-btn" onClick={onClose}>
                  Close
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}