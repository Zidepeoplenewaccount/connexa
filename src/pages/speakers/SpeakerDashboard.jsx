import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchSpeakerProfile,
  fetchSpeakerStats,
  fetchSpeakerCommissions,
  fetchSpeakerAnalytics,
  fetchSpeakerQuestions,
  updateSpeakerAccount,
  speakerLogout,
  isSpeakerAuthenticated,
  getSpeakerProfile,
} from '../../services/speakerApi';
import './speaker-portal.css';

export default function SpeakerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => getSpeakerProfile());
  const [stats, setStats] = useState(null);
  const [commissions, setCommissions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeChart, setActiveChart] = useState('earnings');
  const [questionTab, setQuestionTab] = useState('talent'); // 'talent' | 'business'

  // Account number editing
  const [editingAccount, setEditingAccount] = useState(false);
  const [accountForm, setAccountForm] = useState({ account_number: '', bank_name: '' });
  const [savingAccount, setSavingAccount] = useState(false);

  const loadData = useCallback(async () => {
    if (!isSpeakerAuthenticated()) {
      navigate('/connexers/login', { replace: true });
      return;
    }
    try {
      const [p, s, c, a, q] = await Promise.all([
        fetchSpeakerProfile(),
        fetchSpeakerStats(),
        fetchSpeakerCommissions(),
        fetchSpeakerAnalytics(),
        fetchSpeakerQuestions(),
      ]);
      setProfile(p);
      setStats(s);
      setCommissions(c);
      setAnalytics(a);
      setQuestions(q);
      setAccountForm({ account_number: p.account_number || '', bank_name: p.bank_name || '' });
    } catch {
      navigate('/connexers/login', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleLogout() {
    await speakerLogout();
    navigate('/connexers/login', { replace: true });
  }

  async function handleSaveAccount(e) {
    e.preventDefault();
    setSavingAccount(true);
    try {
      const updated = await updateSpeakerAccount(accountForm);
      setProfile(updated);
      setEditingAccount(false);
    } catch {
      alert('Failed to save account details');
    } finally {
      setSavingAccount(false);
    }
  }

  function copyCode() {
    if (!profile) return;
    const link = `${window.location.origin}?connexer=${profile.discount_code}`;
    navigator.clipboard.writeText(profile.discount_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copyLink() {
    if (!profile) return;
    const link = `${window.location.origin}?connexer=${profile.discount_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading && !profile) {
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
            <h1>Connexer Dashboard</h1>
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
              value={`${window.location.origin}?connexer=${profile?.discount_code}`}
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

        {/* Account Details */}
        <section className="speaker-account-section">
          <div className="speaker-account-header">
            <h2>Payout Account</h2>
            {!editingAccount && (
              <button onClick={() => { setEditingAccount(true); setAccountForm({ account_number: profile?.account_number || '', bank_name: profile?.bank_name || '' }); }} className="speaker-btn-outline-sm">
                {profile?.account_number ? '✏️ Edit' : '+ Add Account'}
              </button>
            )}
          </div>
          {editingAccount ? (
            <form onSubmit={handleSaveAccount} className="speaker-account-form">
              <div className="speaker-account-fields">
                <div className="speaker-form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    value={accountForm.account_number}
                    onChange={(e) => setAccountForm({ ...accountForm, account_number: e.target.value })}
                    placeholder="Enter your account number"
                    required
                    maxLength={20}
                  />
                </div>
                <div className="speaker-form-group">
                  <label>Bank Name</label>
                  <input
                    type="text"
                    value={accountForm.bank_name}
                    onChange={(e) => setAccountForm({ ...accountForm, bank_name: e.target.value })}
                    placeholder="e.g. GTBank, Access Bank"
                    required
                  />
                </div>
              </div>
              <div className="speaker-account-actions">
                <button type="submit" className="speaker-btn-save" disabled={savingAccount}>
                  {savingAccount ? 'Saving...' : 'Save Account'}
                </button>
                <button type="button" onClick={() => setEditingAccount(false)} className="speaker-btn-outline-sm">Cancel</button>
              </div>
            </form>
          ) : profile?.account_number ? (
            <div className="speaker-account-info">
              <div><span className="speaker-account-label">Account</span> <strong>{profile.account_number}</strong></div>
              <div><span className="speaker-account-label">Bank</span> <strong>{profile.bank_name || '—'}</strong></div>
            </div>
          ) : (
            <p className="speaker-account-empty">No payout account added yet. Add your bank details to receive payouts.</p>
          )}
        </section>

        {/* Approved Questions */}
        {questions.length > 0 && (
          <section className="speaker-questions-section">
            <h2>Questions for You ({questions.length})</h2>
            <div className="speaker-questions-list">
              {questions.map((q) => (
                <div key={q.id} className="speaker-question-card">
                  <div className="speaker-question-meta">
                    <span className="speaker-question-from">{q.attendee_name}</span>
                    <span className={`speaker-badge ${q.status}`}>
                      {q.status === 'selected' ? '⭐ Selected' : q.status === 'answered' ? '✓ Answered' : q.status}
                    </span>
                  </div>
                  <p className="speaker-question-text">"{q.question_text}"</p>
                  <div className="speaker-question-footer">
                    <span>{q.ticket_type}</span>
                    <span>{new Date(q.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Analytics Chart */}
        {analytics && analytics.daily && (
          <section className="speaker-analytics-section">
            <div className="speaker-analytics-header">
              <h2>Sales Analytics (Last 30 Days)</h2>
              <div className="speaker-chart-toggle">
                <button
                  className={activeChart === 'earnings' ? 'active' : ''}
                  onClick={() => setActiveChart('earnings')}
                >Earnings</button>
                <button
                  className={activeChart === 'tickets' ? 'active' : ''}
                  onClick={() => setActiveChart('tickets')}
                >Tickets</button>
              </div>
            </div>
            <SalesChart data={analytics.daily} metric={activeChart} />

            {/* Ticket Type Breakdown */}
            {analytics.by_ticket_type && analytics.by_ticket_type.length > 0 && (
              <div className="speaker-type-breakdown">
                <h3>Sales by Ticket Type</h3>
                <div className="speaker-type-bars">
                  {(() => {
                    const maxCount = Math.max(...analytics.by_ticket_type.map(t => t.count), 1);
                    return analytics.by_ticket_type.map((t) => (
                      <div key={t.ticket_type} className="speaker-type-bar-row">
                        <span className="speaker-type-label">{t.ticket_type}</span>
                        <div className="speaker-type-bar-track">
                          <div
                            className="speaker-type-bar-fill"
                            style={{ width: `${(t.count / maxCount) * 100}%` }}
                          />
                        </div>
                        <span className="speaker-type-count">{t.count} sold</span>
                        <span className="speaker-type-earnings">₦{t.earnings.toLocaleString()}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </section>
        )}

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


/* ── Lightweight bar chart (pure SVG, no dependencies) ────────── */

function SalesChart({ data, metric }) {
  if (!data || data.length === 0) return null;

  const values = data.map(d => metric === 'earnings' ? d.earnings : d.tickets);
  const maxVal = Math.max(...values, 1);
  const chartW = 700;
  const chartH = 200;
  const barGap = 2;
  const barW = Math.max((chartW - barGap * data.length) / data.length, 2);

  // Build Y-axis labels
  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => {
    const val = (maxVal / ySteps) * (ySteps - i);
    return metric === 'earnings' ? `₦${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0)}` : val.toFixed(0);
  });

  return (
    <div className="speaker-chart-container">
      <div className="speaker-chart-y-axis">
        {yLabels.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
      <div className="speaker-chart-scroll">
        <svg
          viewBox={`0 0 ${chartW} ${chartH + 24}`}
          preserveAspectRatio="none"
          className="speaker-chart-svg"
        >
          {/* Grid lines */}
          {Array.from({ length: ySteps + 1 }, (_, i) => {
            const y = (chartH / ySteps) * i;
            return <line key={i} x1={0} y1={y} x2={chartW} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />;
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const val = metric === 'earnings' ? d.earnings : d.tickets;
            const h = maxVal > 0 ? (val / maxVal) * chartH : 0;
            const x = i * (barW + barGap);
            const y = chartH - h;
            const isWeekStart = new Date(d.date).getDay() === 1;
            return (
              <g key={d.date}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={Math.max(h, 0)}
                  rx={2}
                  fill={val > 0 ? (metric === 'earnings' ? '#2db84b' : '#f5a623') : 'rgba(255,255,255,0.04)'}
                  opacity={val > 0 ? 0.85 : 1}
                >
                  <title>{d.date}: {metric === 'earnings' ? `₦${val.toLocaleString()}` : `${val} tickets`}</title>
                </rect>
                {isWeekStart && (
                  <text
                    x={x + barW / 2}
                    y={chartH + 16}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.35)"
                    fontSize="9"
                  >
                    {new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="speaker-chart-summary">
        <span>
          Total: {metric === 'earnings'
            ? `₦${values.reduce((a, b) => a + b, 0).toLocaleString()}`
            : `${values.reduce((a, b) => a + b, 0)} tickets`}
        </span>
        <span>
          Daily Avg: {metric === 'earnings'
            ? `₦${Math.round(values.reduce((a, b) => a + b, 0) / data.length).toLocaleString()}`
            : `${(values.reduce((a, b) => a + b, 0) / data.length).toFixed(1)} tickets`}
        </span>
      </div>
    </div>
  );
}
