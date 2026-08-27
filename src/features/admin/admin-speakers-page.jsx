import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';
import { getUserFriendlyError, logTechnicalError } from '../../utils/errorMessages';

const BACKEND_URL = 'https://connexa-backend-i53r.onrender.com';
//const BACKEND_URL = 'http://127.0.0.1:8000';

const getAuth = () => ({ headers: { Authorization: localStorage.getItem('admin_token') } });

export default function AdminSpeakersFeaturePage() {
  function buildExpiryDateTime(expiryDate, expiryTime) {
    if (!expiryDate && !expiryTime) {
      return null;
    }

    if (!expiryDate || !expiryTime) {
      throw new Error('Please provide both expiry date and expiry time.');
    }

    const localDateTime = new Date(`${expiryDate}T${expiryTime}`);
    if (Number.isNaN(localDateTime.getTime())) {
      throw new Error('Invalid expiry date or time.');
    }

    return localDateTime.toISOString();
  }

  function splitExpiryDateTime(isoDateTime) {
    if (!isoDateTime) {
      return { date: '', time: '' };
    }

    const value = new Date(isoDateTime);
    if (Number.isNaN(value.getTime())) {
      return { date: '', time: '' };
    }

    const localDate = value.toLocaleDateString('en-CA');
    const localTime = value.toTimeString().slice(0, 5);
    return { date: localDate, time: localTime };
  }

  function getExpiryStatus(isoDateTime) {
    if (!isoDateTime) {
      return {
        label: 'No Expiry',
        style: {
          background: 'rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.7)',
        },
      };
    }

    const expiry = new Date(isoDateTime);
    if (Number.isNaN(expiry.getTime())) {
      return {
        label: 'Invalid Date',
        style: {
          background: 'rgba(232,49,42,0.15)',
          color: '#e8312a',
        },
      };
    }

    const now = new Date();
    const msLeft = expiry.getTime() - now.getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    if (msLeft <= 0) {
      return {
        label: 'Expired',
        style: {
          background: 'rgba(232,49,42,0.15)',
          color: '#e8312a',
        },
      };
    }

    if (msLeft <= 3 * dayMs) {
      return {
        label: 'Expiring Soon',
        style: {
          background: 'rgba(245,166,35,0.15)',
          color: '#f5a623',
        },
      };
    }

    return {
      label: 'Active',
      style: {
        background: 'rgba(45,184,75,0.15)',
        color: '#2db84b',
      },
    };
  }

  function getCodeSourceMeta(source) {
    if (source === 'self_signup') {
      return {
        label: 'Self Signup',
        style: {
          background: 'rgba(45,184,75,0.15)',
          color: '#2db84b',
        },
      };
    }

    if (source === 'admin') {
      return {
        label: 'Admin Created',
        style: {
          background: 'rgba(26,115,232,0.15)',
          color: '#1a73e8',
        },
      };
    }

    return {
      label: 'Self Signup',
      style: {
        background: 'rgba(45,184,75,0.15)',
        color: '#2db84b',
      },
    };
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getProfileMetrics(rows) {
    const totalTickets = rows.length;
    const totalDiscount = rows.reduce((acc, row) => acc + Number(row.discount_given || 0), 0);
    const totalCommission = rows.reduce((acc, row) => acc + Number(row.commission_amount || 0), 0);
    const paidCommission = rows
      .filter((row) => row.status === 'paid')
      .reduce((acc, row) => acc + Number(row.commission_amount || 0), 0);
    const pendingCommission = totalCommission - paidCommission;
    const totalTicketRevenue = rows.reduce((acc, row) => acc + Number(row.ticket_price || 0), 0);

    return {
      totalTickets,
      totalDiscount,
      totalCommission,
      paidCommission,
      pendingCommission,
      totalTicketRevenue,
    };
  }

  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileCommissions, setProfileCommissions] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [selectedSpeakerForExpiry, setSelectedSpeakerForExpiry] = useState(null);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [expiryForm, setExpiryForm] = useState({ date: '', time: '' });
  const [expirySaving, setExpirySaving] = useState(false);
  const [expiryError, setExpiryError] = useState('');
  const [expirySortDirection, setExpirySortDirection] = useState('asc');
  const [form, setForm] = useState({ name: '', email: '', password: '', discount_percentage: 5, discount_expiry_date: '', discount_expiry_time: '', commission_rate: 75, account_number: '', bank_name: '' });
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const sortedSpeakers = useMemo(() => {
    function expirySortMeta(isoDateTime) {
      if (!isoDateTime) {
        return { group: 3, timestamp: Number.MAX_SAFE_INTEGER };
      }

      const expiry = new Date(isoDateTime);
      if (Number.isNaN(expiry.getTime())) {
        return { group: 4, timestamp: Number.MAX_SAFE_INTEGER };
      }

      const nowMs = Date.now();
      const msLeft = expiry.getTime() - nowMs;
      const dayMs = 24 * 60 * 60 * 1000;

      if (msLeft <= 0) {
        return { group: 0, timestamp: expiry.getTime() };
      }

      if (msLeft <= 3 * dayMs) {
        return { group: 1, timestamp: expiry.getTime() };
      }

      return { group: 2, timestamp: expiry.getTime() };
    }

    const direction = expirySortDirection === 'asc' ? 1 : -1;
    return [...speakers].sort((a, b) => {
      const aMeta = expirySortMeta(a.discount_expires_at);
      const bMeta = expirySortMeta(b.discount_expires_at);

      if (aMeta.group !== bMeta.group) {
        return (aMeta.group - bMeta.group) * direction;
      }

      if (aMeta.timestamp !== bMeta.timestamp) {
        return (aMeta.timestamp - bMeta.timestamp) * direction;
      }

      return a.name.localeCompare(b.name);
    });
  }, [speakers, expirySortDirection]);

  async function loadSpeakers() {
    try {
      const res = await axios.get(`${BACKEND_URL}/connexers/admin/all`, getAuth());
      setSpeakers(res.data);
    } catch (err) {
      console.error('Failed to load connexers', err);
    } finally {
      setLoading(false);
    }
  }

  async function openProfileModal(speaker) {
    setSelectedProfile(speaker);
    setShowProfileModal(true);
    setProfileLoading(true);
    setProfileError('');
    setProfileCommissions([]);

    try {
      const res = await axios.get(`${BACKEND_URL}/connexers/admin/commissions`, {
        ...getAuth(),
        params: { speaker_id: speaker.id },
      });
      setProfileCommissions(res.data || []);
    } catch (err) {
      logTechnicalError(err, 'ADMIN_LOAD_SPEAKER_PROFILE_COMMISSIONS');
      setProfileError(getUserFriendlyError(err, { fallback: 'Unable to load profile performance data.' }));
    } finally {
      setProfileLoading(false);
    }
  }

  function exportProfileToPdf() {
    if (!selectedProfile) return;

    const metrics = getProfileMetrics(profileCommissions);
    const profile = selectedProfile;
    const sourceMeta = getCodeSourceMeta(profile.code_source);
    const nowLabel = new Date().toLocaleString();

    const tableRows = profileCommissions.length
      ? profileCommissions.map((row) => `
          <tr>
            <td>${escapeHtml(row.buyer_name || row.buyer_email || '—')}</td>
            <td>${escapeHtml(row.buyer_email || '—')}</td>
            <td>${escapeHtml(row.ticket_type || '—')}</td>
            <td>${Number(row.ticket_price || 0).toLocaleString()}</td>
            <td>${Number(row.discount_given || 0).toLocaleString()}</td>
            <td>${Number(row.commission_amount || 0).toLocaleString()}</td>
            <td>${escapeHtml(row.status || 'pending')}</td>
            <td>${row.created_at ? new Date(row.created_at).toLocaleString() : '—'}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="8" style="text-align:center;color:#666;">No commission records yet.</td></tr>';

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Connexer Profile Report - ${escapeHtml(profile.name)}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
            h1, h2 { margin: 0 0 8px; }
            .muted { color: #666; font-size: 12px; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 14px 0 20px; }
            .card { border: 1px solid #ddd; border-radius: 8px; padding: 10px; }
            .label { font-size: 11px; color: #666; text-transform: uppercase; }
            .value { font-size: 16px; font-weight: bold; margin-top: 4px; }
            .details { margin: 8px 0 20px; }
            .details div { margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; text-align: left; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>Connexer Profile Report</h1>
          <p class="muted">Generated: ${escapeHtml(nowLabel)}</p>

          <div class="details">
            <div><strong>Name:</strong> ${escapeHtml(profile.name)}</div>
            <div><strong>Email:</strong> ${escapeHtml(profile.email)}</div>
            <div><strong>Discount Code:</strong> ${escapeHtml(profile.discount_code)}</div>
            <div><strong>Code Source:</strong> ${escapeHtml(sourceMeta.label)}</div>
            <div><strong>Discount %:</strong> ${Number(profile.discount_percentage || 0)}%</div>
            <div><strong>Commission %:</strong> ${Number(profile.commission_rate || 0)}%</div>
            <div><strong>Account Number:</strong> ${escapeHtml(profile.account_number || '—')}</div>
            <div><strong>Bank Name:</strong> ${escapeHtml(profile.bank_name || '—')}</div>
            <div><strong>Code Expiry:</strong> ${profile.discount_expires_at ? escapeHtml(new Date(profile.discount_expires_at).toLocaleString()) : 'No expiry'}</div>
            <div><strong>Status:</strong> ${profile.is_active ? 'Active' : 'Inactive'}</div>
            <div><strong>Created At:</strong> ${profile.created_at ? escapeHtml(new Date(profile.created_at).toLocaleString()) : '—'}</div>
          </div>

          <h2>Performance Tracker</h2>
          <div class="grid">
            <div class="card"><div class="label">Total Tickets</div><div class="value">${metrics.totalTickets}</div></div>
            <div class="card"><div class="label">Ticket Revenue</div><div class="value">₦${metrics.totalTicketRevenue.toLocaleString()}</div></div>
            <div class="card"><div class="label">Discount Given</div><div class="value">₦${metrics.totalDiscount.toLocaleString()}</div></div>
            <div class="card"><div class="label">Total Commission</div><div class="value">₦${metrics.totalCommission.toLocaleString()}</div></div>
            <div class="card"><div class="label">Paid Commission</div><div class="value">₦${metrics.paidCommission.toLocaleString()}</div></div>
            <div class="card"><div class="label">Pending Commission</div><div class="value">₦${metrics.pendingCommission.toLocaleString()}</div></div>
          </div>

          <h2>Commission History</h2>
          <table>
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Email</th>
                <th>Ticket</th>
                <th>Price (₦)</th>
                <th>Discount (₦)</th>
                <th>Commission (₦)</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=1200,height=900');
    if (!printWindow) {
      alert('Unable to open print window. Please allow popups and try again.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  }

  useEffect(() => { loadSpeakers(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setCreating(true);

    let discountExpiresAt = null;
    try {
      discountExpiresAt = buildExpiryDateTime(form.discount_expiry_date, form.discount_expiry_time);
    } catch (err) {
      setError(err.message || 'Please provide a valid discount expiry date and time.');
      setCreating(false);
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/connexers/admin/create`, {
        ...form,
        discount_expires_at: discountExpiresAt,
      }, getAuth());
      setShowCreate(false);
      setForm({ name: '', email: '', password: '', discount_percentage: 5, discount_expiry_date: '', discount_expiry_time: '', commission_rate: 75, account_number: '', bank_name: '' });
      loadSpeakers();
    } catch (err) {
      logTechnicalError(err, 'ADMIN_CREATE_SPEAKER');
      setError(getUserFriendlyError(err, { fallback: 'Unable to create speaker. Please try again.' }));
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(speaker) {
    try {
      await axios.patch(`${BACKEND_URL}/connexers/admin/${speaker.id}`, { is_active: !speaker.is_active }, getAuth());
      loadSpeakers();
    } catch (err) {
      alert('Failed to update speaker');
    }
  }

  async function deleteSpeaker(speaker) {
    if (!confirm(`Delete connexer ${speaker.name}? This cannot be undone.`)) return;
    try {
      await axios.delete(`${BACKEND_URL}/connexers/admin/${speaker.id}`, getAuth());
      loadSpeakers();
    } catch (err) {
      logTechnicalError(err, 'ADMIN_DELETE_SPEAKER');
      alert(getUserFriendlyError(err, { fallback: 'Unable to delete speaker. Please try again.' }));
    }
  }

  function openExpiryModal(speaker) {
    const split = splitExpiryDateTime(speaker.discount_expires_at);
    setSelectedSpeakerForExpiry(speaker);
    setExpiryForm({ date: split.date, time: split.time });
    setExpiryError('');
    setShowExpiryModal(true);
  }

  async function saveExpiry() {
    if (!selectedSpeakerForExpiry) return;

    setExpirySaving(true);
    setExpiryError('');

    let discountExpiresAt = null;
    try {
      discountExpiresAt = buildExpiryDateTime(expiryForm.date, expiryForm.time);
    } catch (err) {
      setExpiryError(err.message || 'Please provide a valid expiry date and time.');
      setExpirySaving(false);
      return;
    }

    try {
      await axios.patch(
        `${BACKEND_URL}/connexers/admin/${selectedSpeakerForExpiry.id}`,
        { discount_expires_at: discountExpiresAt },
        getAuth(),
      );
      setShowExpiryModal(false);
      setSelectedSpeakerForExpiry(null);
      loadSpeakers();
    } catch (err) {
      logTechnicalError(err, 'ADMIN_UPDATE_SPEAKER_EXPIRY');
      setExpiryError(getUserFriendlyError(err, { fallback: 'Unable to update expiry. Please try again.' }));
    } finally {
      setExpirySaving(false);
    }
  }

  return (
    <AdminLayout>
      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Connexers</h1>
          <button
            onClick={() => setShowCreate(!showCreate)}
            style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: '#f5a623', color: '#000', fontWeight: 700, cursor: 'pointer',
            }}
          >
            {showCreate ? 'Cancel' : '+ Create Connexer'}
          </button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div style={{
            background: '#1a1a1a', border: '1px solid #333', borderRadius: 12,
            padding: 24, marginBottom: 24,
          }}>
            <h3 style={{ color: '#fff', marginBottom: 16 }}>New Connexer</h3>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Name', name: 'name', type: 'text', required: true },
                  { label: 'Email', name: 'email', type: 'email', required: true },
                  { label: 'Password', name: 'password', type: 'text', required: true, placeholder: 'Generate a password for them' },
                  { label: 'Discount %', name: 'discount_percentage', type: 'number', step: '0.1' },
                  { label: 'Expiry Date (optional)', name: 'discount_expiry_date', type: 'date' },
                  { label: 'Expiry Time (optional)', name: 'discount_expiry_time', type: 'time' },
                  { label: 'Commission %', name: 'commission_rate', type: 'number', step: '0.1' },
                  { label: 'Account Number', name: 'account_number', type: 'text', placeholder: 'Bank account number' },
                  { label: 'Bank Name', name: 'bank_name', type: 'text', placeholder: 'e.g. GTBank, Access Bank' },
                ].map(({ label, name, ...props }) => (
                  <div key={name}>
                    <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{label}</label>
                    <input
                      value={form[name]}
                      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: 8,
                        border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14,
                      }}
                      {...props}
                    />
                  </div>
                ))}
              </div>
              {error && <div style={{ color: '#ff6b6b', marginTop: 12, fontSize: 13 }}>{error}</div>}
              <button
                type="submit"
                disabled={creating}
                style={{
                  marginTop: 16, padding: '10px 24px', borderRadius: 8, border: 'none',
                  background: '#2db84b', color: '#fff', fontWeight: 700, cursor: 'pointer',
                }}
              >
                {creating ? 'Creating...' : 'Create Connexer Account'}
              </button>
            </form>
          </div>
        )}

        {/* Speakers Table */}
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</p>
        ) : speakers.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 48 }}>No connexers created yet</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Code', 'Source', 'Account', 'Discount'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '12px 14px', fontSize: 11, fontWeight: 700,
                      color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1,
                      borderBottom: '1px solid #333',
                    }}>{h}</th>
                  ))}
                  <th style={{
                    textAlign: 'left', padding: '12px 14px', fontSize: 11, fontWeight: 700,
                    color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1,
                    borderBottom: '1px solid #333',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }} onClick={() => setExpirySortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}>
                    Expiry {expirySortDirection === 'asc' ? '↑' : '↓'}
                  </th>
                  {['Commission', 'Uses', 'Earned', 'Pending', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '12px 14px', fontSize: 11, fontWeight: 700,
                      color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1,
                      borderBottom: '1px solid #333',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedSpeakers.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '14px', color: '#fff', fontWeight: 600 }}>{s.name}</td>
                      <td style={{ padding: '14px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{s.email}</td>
                      <td style={{ padding: '14px' }}>
                        <code style={{ color: '#f5a623', fontWeight: 700, fontSize: 13 }}>{s.discount_code}</code>
                      </td>
                      <td style={{ padding: '14px' }}>
                        {(() => {
                          const sourceMeta = getCodeSourceMeta(s.code_source);
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  width: 'fit-content',
                                  padding: '3px 8px',
                                  borderRadius: 12,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  ...sourceMeta.style,
                                }}
                              >
                                {sourceMeta.label}
                              </span>
                              {s.code_created_by && (
                                <small style={{ color: 'rgba(255,255,255,0.45)' }}>{s.code_created_by}</small>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td style={{ padding: '14px', color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                        {s.account_number ? (
                          <div>
                            <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{s.account_number}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.bank_name || '—'}</div>
                          </div>
                        ) : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px', color: 'rgba(255,255,255,0.7)' }}>{s.discount_percentage}%</td>
                      <td style={{ padding: '14px', color: 'rgba(255,255,255,0.7)' }}>
                        {(() => {
                          const expiryStatus = getExpiryStatus(s.discount_expires_at);
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <span>{s.discount_expires_at ? new Date(s.discount_expires_at).toLocaleString() : 'No expiry'}</span>
                              <span
                                style={{
                                  display: 'inline-block',
                                  width: 'fit-content',
                                  padding: '3px 8px',
                                  borderRadius: 12,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  ...expiryStatus.style,
                                }}
                              >
                                {expiryStatus.label}
                              </span>
                            </div>
                          );
                        })()}
                      </td>
                      <td style={{ padding: '14px', color: 'rgba(255,255,255,0.7)' }}>{s.commission_rate}%</td>
                      <td style={{ padding: '14px', color: '#fff', fontWeight: 700 }}>{s.total_uses}</td>
                      <td style={{ padding: '14px', color: '#2db84b', fontWeight: 700 }}>₦{s.total_earned.toLocaleString()}</td>
                      <td style={{ padding: '14px', color: '#f5a623', fontWeight: 700 }}>₦{s.pending.toLocaleString()}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: s.is_active ? 'rgba(45,184,75,0.15)' : 'rgba(255,100,100,0.15)',
                          color: s.is_active ? '#2db84b' : '#ff6464',
                        }}>
                          {s.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '14px', display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                        <button onClick={() => openProfileModal(s)} style={btnSmall('#8d6ad8')}>
                          Profile
                        </button>
                        <button onClick={() => toggleActive(s)} style={btnSmall(s.is_active ? '#666' : '#2db84b')}>
                          {s.is_active ? 'Disable' : 'Enable'}
                        </button>
                        <button onClick={() => openExpiryModal(s)} style={btnSmall('#f5a623')}>
                          Set Expiry
                        </button>
                        <button onClick={() => deleteSpeaker(s)} style={btnSmall('#e8312a')}>
                          Delete
                        </button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showExpiryModal && selectedSpeakerForExpiry && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !expirySaving) {
              setShowExpiryModal(false);
            }
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 460,
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h3 style={{ color: '#fff', marginBottom: 12 }}>Set Discount Code Expiry</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 16, fontSize: 13 }}>
              {selectedSpeakerForExpiry.name} ({selectedSpeakerForExpiry.discount_code})
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Expiry Date</label>
                <input
                  type="date"
                  value={expiryForm.date}
                  onChange={(e) => setExpiryForm({ ...expiryForm, date: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Expiry Time</label>
                <input
                  type="time"
                  value={expiryForm.time}
                  onChange={(e) => setExpiryForm({ ...expiryForm, time: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14 }}
                />
              </div>
            </div>

            {expiryError && <div style={{ color: '#ff6b6b', marginTop: 12, fontSize: 13 }}>{expiryError}</div>}

            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              <button
                type="button"
                disabled={expirySaving}
                onClick={saveExpiry}
                style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#2db84b', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >
                {expirySaving ? 'Saving...' : 'Save Expiry'}
              </button>
              <button
                type="button"
                disabled={expirySaving}
                onClick={() => {
                  setExpiryForm({ date: '', time: '' });
                  setExpiryError('');
                }}
                style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #555', background: 'transparent', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
              >
                Clear Inputs
              </button>
              <button
                type="button"
                disabled={expirySaving}
                onClick={() => {
                  setShowExpiryModal(false);
                  setSelectedSpeakerForExpiry(null);
                }}
                style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #555', background: 'transparent', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && selectedProfile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.78)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowProfileModal(false);
              setSelectedProfile(null);
            }
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 1200,
              maxHeight: '92vh',
              overflowY: 'auto',
              background: '#161616',
              border: '1px solid #333',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ color: '#fff', margin: 0 }}>Connexer Profile Tracker</h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', margin: '6px 0 0', fontSize: 13 }}>
                  View submitted profile details, discount code activity, and performance history.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={exportProfileToPdf}
                  style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#1a73e8', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Export PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileModal(false);
                    setSelectedProfile(null);
                  }}
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #555', background: 'transparent', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(220px, 1fr))', gap: 12, marginBottom: 18 }}>
              {[
                { label: 'Full Name', value: selectedProfile.name },
                { label: 'Email', value: selectedProfile.email },
                { label: 'Discount Code', value: selectedProfile.discount_code },
                { label: 'Code Source', value: getCodeSourceMeta(selectedProfile.code_source).label },
                { label: 'Discount Percentage', value: `${selectedProfile.discount_percentage}%` },
                { label: 'Commission Rate', value: `${selectedProfile.commission_rate}%` },
                { label: 'Account Number', value: selectedProfile.account_number || '—' },
                { label: 'Bank Name', value: selectedProfile.bank_name || '—' },
                { label: 'Code Expiry', value: selectedProfile.discount_expires_at ? new Date(selectedProfile.discount_expires_at).toLocaleString() : 'No expiry' },
                { label: 'Profile Status', value: selectedProfile.is_active ? 'Active' : 'Inactive' },
                { label: 'Created At', value: selectedProfile.created_at ? new Date(selectedProfile.created_at).toLocaleString() : '—' },
                { label: 'Created By', value: selectedProfile.code_created_by || '—' },
              ].map((item) => (
                <div key={item.label} style={{ border: '1px solid #2a2a2a', borderRadius: 10, padding: 10, background: '#101010' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{item.label}</div>
                  <div style={{ marginTop: 5, color: '#fff', fontWeight: 600, fontSize: 14 }}>{item.value}</div>
                </div>
              ))}
            </div>

            {profileLoading ? (
              <p style={{ color: 'rgba(255,255,255,0.55)' }}>Loading profile performance...</p>
            ) : profileError ? (
              <p style={{ color: '#ff6b6b' }}>{profileError}</p>
            ) : (
              <>
                {(() => {
                  const metrics = getProfileMetrics(profileCommissions);
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: 10, marginBottom: 18 }}>
                      <MetricCard label="Total Tickets" value={metrics.totalTickets} color="#fff" />
                      <MetricCard label="Ticket Revenue" value={`₦${metrics.totalTicketRevenue.toLocaleString()}`} color="#1a73e8" />
                      <MetricCard label="Discount Given" value={`₦${metrics.totalDiscount.toLocaleString()}`} color="#f5a623" />
                      <MetricCard label="Total Commission" value={`₦${metrics.totalCommission.toLocaleString()}`} color="#2db84b" />
                      <MetricCard label="Paid Commission" value={`₦${metrics.paidCommission.toLocaleString()}`} color="#2db84b" />
                      <MetricCard label="Pending Commission" value={`₦${metrics.pendingCommission.toLocaleString()}`} color="#f5a623" />
                    </div>
                  );
                })()}

                <div style={{ border: '1px solid #2a2a2a', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid #2a2a2a', color: '#fff', fontWeight: 700 }}>
                    Commission History ({profileCommissions.length})
                  </div>
                  {profileCommissions.length === 0 ? (
                    <p style={{ padding: 12, color: 'rgba(255,255,255,0.55)' }}>No commission records yet.</p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            {['Buyer', 'Email', 'Ticket', 'Price', 'Discount', 'Commission', 'Status', 'Date'].map((header) => (
                              <th key={header} style={{ textAlign: 'left', padding: '10px', fontSize: 11, color: 'rgba(255,255,255,0.45)', borderBottom: '1px solid #2a2a2a', textTransform: 'uppercase' }}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {profileCommissions.map((row) => (
                            <tr key={row.id}>
                              <td style={{ padding: '10px', borderBottom: '1px solid #222', color: '#fff' }}>{row.buyer_name || row.buyer_email}</td>
                              <td style={{ padding: '10px', borderBottom: '1px solid #222', color: 'rgba(255,255,255,0.75)' }}>{row.buyer_email}</td>
                              <td style={{ padding: '10px', borderBottom: '1px solid #222', color: 'rgba(255,255,255,0.75)' }}>{row.ticket_type}</td>
                              <td style={{ padding: '10px', borderBottom: '1px solid #222', color: '#fff' }}>₦{Number(row.ticket_price || 0).toLocaleString()}</td>
                              <td style={{ padding: '10px', borderBottom: '1px solid #222', color: '#f5a623' }}>₦{Number(row.discount_given || 0).toLocaleString()}</td>
                              <td style={{ padding: '10px', borderBottom: '1px solid #222', color: '#2db84b', fontWeight: 700 }}>₦{Number(row.commission_amount || 0).toLocaleString()}</td>
                              <td style={{ padding: '10px', borderBottom: '1px solid #222', color: row.status === 'paid' ? '#2db84b' : '#f5a623' }}>{row.status}</td>
                              <td style={{ padding: '10px', borderBottom: '1px solid #222', color: 'rgba(255,255,255,0.65)' }}>{row.created_at ? new Date(row.created_at).toLocaleString() : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <div style={{ border: '1px solid #2a2a2a', borderRadius: 10, padding: 10, background: '#101010' }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</div>
      <div style={{ marginTop: 5, color: color || '#fff', fontWeight: 700, fontSize: 16 }}>{value}</div>
    </div>
  );
}

function btnSmall(bg) {
  return {
    padding: '4px 10px', borderRadius: 6, border: 'none',
    background: `${bg}22`, color: bg, fontSize: 12, fontWeight: 600,
    cursor: 'pointer',
  };
}
