import { useEffect, useState } from 'react';
import { adminDowngradeTicket, getAdminTicketDowngradeOptions } from '../../services/adminApi';
import '../../components/UpgradeTicketModal.css';

export default function AdminTicketDowngradeModal({ ticket, onClose, onDowngraded }) {
  const [options, setOptions] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    getAdminTicketDowngradeOptions(ticket.ticket_id)
      .then((data) => {
        if (!active) return;
        const available = data.available_downgrades || [];
        setOptions(available);
        setSelectedType(available[0]?.ticket_type || '');
        if (!available.length) setError('There is no lower-priced ticket category available for this ticket.');
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.detail || 'Could not load downgrade options.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [ticket.ticket_id]);

  async function handleDowngrade() {
    if (!selectedType) return;
    const confirmed = window.confirm(
      `Change ${ticket.ticket_id} from ${ticket.ticket_type} to ${selectedType}? This changes the ticket category only. It does not automatically refund any money.`
    );
    if (!confirmed) return;

    setSaving(true);
    setError('');
    try {
      await adminDowngradeTicket(ticket.ticket_id, selectedType);
      setSuccess('Ticket downgraded successfully. No refund was issued.');
      onDowngraded?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'The ticket could not be downgraded.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="upgrade-modal-overlay" onClick={onClose}>
      <div className="upgrade-modal" onClick={(event) => event.stopPropagation()}>
        <button className="upgrade-modal-close" onClick={onClose}>×</button>
        <h2 className="upgrade-modal-title">Downgrade Ticket</h2>
        <p className="upgrade-modal-subtitle">Select any ticket category with a lower standard price.</p>
        <div className="upgrade-current-card">
          <div className="upgrade-ticket-type">{ticket.ticket_type}</div>
          <div className="upgrade-attendee">{ticket.attendee_name}</div>
          <div className="upgrade-ticket-id">ID: {ticket.ticket_id}</div>
        </div>
        {loading ? <p>Loading downgrade options...</p> : (
          options.length > 0 && (
            <div className="upgrade-form-group">
              <label htmlFor="adminDowngradeType">Downgrade to</label>
              <select id="adminDowngradeType" value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
                {options.map((option) => (
                  <option key={option.ticket_type} value={option.ticket_type}>
                    {option.ticket_type} (₦{Number(option.price).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          )
        )}
        <div className="upgrade-error" style={{ marginTop: 12 }}>
          **Important:** This changes the ticket category only. It does not process or promise a refund. Handle any refund separately.
        </div>
        {error && <div className="upgrade-error">{error}</div>}
        {success && <div className="upgrade-no-options"><p>{success}</p></div>}
        <button className="upgrade-submit-btn" onClick={handleDowngrade} disabled={loading || saving || !selectedType || !!success}>
          {saving ? 'Updating...' : 'Confirm Downgrade'}
        </button>
        <button className="upgrade-back-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
