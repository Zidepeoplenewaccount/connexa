import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchSpeakerProfile,
  fetchSpeakerStats,
  fetchSpeakerCommissions,
  speakerLogout,
  isSpeakerAuthenticated,
} from '../../services/speakerApi';
import './speaker-portal.css';

export default function SpeakerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const loadData = useCallback(async () => {
    if (!isSpeakerAuthenticated()) {
      navigate('/speakers/login', { replace: true });
      return;
    }
    try {
      const [p, s, c] = await Promise.all([
        fetchSpeakerProfile(),
        fetchSpeakerStats(),
        fetchSpeakerCommissions(),
      ]);
      setProfile(p);
      setStats(s);
      setCommissions(c);
    } catch {
      navigate('/speakers/login', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleLogout() {
    await speakerLogout();
    navigate('/speakers/login', { replace: true });
  }

  function copyCode() {
    if (!profile) return;
    const link = `${window.location.origin}?speaker=${profile.discount_code}`;
    navigator.clipboard.writeText(profile.discount_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copyLink() {
    if (!profile) return;
    const link = `${window.location.origin}?speaker=${profile.discount_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="speaker-portal-root">
        <div className="speaker-loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="speaker-portal-root">
      <div className="speaker-dashboard">
        {/* Header */}
        <header className="speaker-dash-header">
          <div>
            <div className="speaker-dash-logo">CONNEXA</div>
            <h1>Speaker Dashboard</h1>
          </div>
          <div className="speaker-dash-header-right">
            <span className="speaker-dash-name">{profile?.name}</span>
            <button onClick={handleLogout} className="speaker-btn-outline">Log Out</button>
          </div>
        </header>

        {/* Discount Code Card */}
        <section className="speaker-code-card">
          <h2>Your Discount Code</h2>
          <div className="speaker-code-display">
            <span className="speaker-code-value">{profile?.discount_code}</span>
            <button onClick={copyCode} className="speaker-btn-copy">
              {copied ? '✓ Copied' : '📋 Copy Code'}
            </button>
          </div>
          <p className="speaker-code-info">
            Anyone who uses this code gets <strong>{profile?.discount_percentage}%</strong> off their ticket.
            You earn <strong>{profile?.commission_rate}%</strong> on each ticket sold with your code.
          </p>
          <div className="speaker-link-row">
            <input
              readOnly
              value={`${window.location.origin}?speaker=${profile?.discount_code}`}
              onClick={(e) => e.target.select()}
            />
            <button onClick={copyLink} className="speaker-btn-copy">Copy Link</button>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="speaker-stats-grid">
          <div className="speaker-stat-card">
            <span className="speaker-stat-label">Tickets Sold</span>
            <span className="speaker-stat-value">{stats?.total_uses ?? 0}</span>
          </div>
          <div className="speaker-stat-card accent-green">
            <span className="speaker-stat-label">Total Earned</span>
            <span className="speaker-stat-value">₦{(stats?.total_earned ?? 0).toLocaleString()}</span>
          </div>
          <div className="speaker-stat-card accent-orange">
            <span className="speaker-stat-label">Pending Payout</span>
            <span className="speaker-stat-value">₦{(stats?.pending ?? 0).toLocaleString()}</span>
          </div>
          <div className="speaker-stat-card accent-blue">
            <span className="speaker-stat-label">Total Paid</span>
            <span className="speaker-stat-value">₦{(stats?.total_paid ?? 0).toLocaleString()}</span>
          </div>
        </section>

        {/* Commission Table */}
        <section className="speaker-table-section">
          <h2>Ticket Sales History</h2>
          {commissions.length === 0 ? (
            <div className="speaker-empty">
              <p>No ticket sales yet. Share your discount code to start earning!</p>
            </div>
          ) : (
            <div className="speaker-table-wrap">
              <table className="speaker-table">
                <thead>
                  <tr>
                    <th>Buyer</th>
                    <th>Ticket Type</th>
                    <th>Ticket Price</th>
                    <th>Discount Given</th>
                    <th>Your Earnings</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div>{c.buyer_name || '—'}</div>
                        <small>{c.buyer_email}</small>
                      </td>
                      <td>{c.ticket_type}</td>
                      <td>₦{c.ticket_price.toLocaleString()}</td>
                      <td>₦{c.discount_given.toLocaleString()}</td>
                      <td className="speaker-earnings">₦{c.commission_amount.toLocaleString()}</td>
                      <td>
                        <span className={`speaker-badge ${c.status}`}>
                          {c.status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                        </span>
                      </td>
                      <td>{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
