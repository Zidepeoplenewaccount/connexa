import { useEffect, useState } from 'react';
import { getUpgradeOptions } from '../../services/api';
import { adminUpgradeTicket } from '../../services/adminApi';
import './UpgradeTicketModal.css';

export default function AdminFreeTicketUpgradeModal({ ticket, onClose, onUpgraded }) {
  const [options, setOptions] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    getUpgradeOptions(ticket.ticket_id)
      .then((data) => {
        if (!active) return;
        const available = data.available_upgrades || [];
        setOptions(available);
        setSelectedType(available[0]?.ticket_type || '');
        if (!available.length) setError('No higher ticket tier is available for this ticket.');
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.detail || 'Could not load upgrade options.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [ticket.ticket_id]);

  async function handleUpgrade() {
    if (!selectedType) return;
    setSaving(true);
    setError('');
    try {
      await adminUpgradeTicket(ticket.ticket_id, selectedType);
      setSuccess('Ticket upgraded successfully. No payment was charged.');
      onUpgraded?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'The ticket could not be upgraded.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="upgrade-modal-overlay" onClick={onClose}>
      <div className="upgrade-modal" onClick={(event) => event.stopPropagation()}>
        <button className="upgrade-modal-close" onClick={onClose}>×</button>
        <h2 className="upgrade-modal-title">Admin Ticket Upgrade</h2>
        <p className="upgrade-modal-subtitle">Grant a complimentary upgrade. No Paystack payment is required.</p>
        <div className="upgrade-current-card">
          <div className="upgrade-ticket-type">{ticket.ticket_type}</div>
          <div className="upgrade-attendee">{ticket.attendee_name}</div>
          <div className="upgrade-ticket-id">ID: {ticket.ticket_id}</div>
        </div>
        {loading ? <p>Loading upgrade options...</p> : (
          <>
            {options.length > 0 && (
              <div className="upgrade-form-group">
                <label htmlFor="adminUpgradeType">Upgrade to</label>
                <select id="adminUpgradeType" value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
                  {options.map((option) => (
                    <option key={option.ticket_type} value={option.ticket_type}>{option.ticket_type}</option>
                  ))}
                </select>
              </div>
            )}
            {options.length > 0 && <p><strong>Amount payable: ₦0</strong> <span>Complimentary admin upgrade</span></p>}
          </>
        )}
        {error && <div className="upgrade-error">{error}</div>}
        {success && <div className="upgrade-no-options"><p>{success}</p></div>}
        <button className="upgrade-submit-btn" onClick={handleUpgrade} disabled={loading || saving || !selectedType || !!success}>
          {saving ? 'Updating...' : 'Confirm Free Upgrade'}
        </button>
        <button className="upgrade-back-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
