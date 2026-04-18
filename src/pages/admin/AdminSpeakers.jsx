import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';
import { getUserFriendlyError, logTechnicalError } from '../../utils/errorMessages';

const BACKEND_URL = 'https://connexa-aahsexcjcfakfhbd.southafricanorth-01.azurewebsites.net';
//const BACKEND_URL = 'http://127.0.0.1:8000';

const getAuth = () => ({ headers: { Authorization: localStorage.getItem('admin_token') } });

export default function AdminSpeakers() {
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
      label: 'Unknown',
      style: {
        background: 'rgba(255,255,255,0.12)',
        color: 'rgba(255,255,255,0.7)',
      },
    };
  }

  const [speakers, setSpeakers] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedSpeaker, setExpandedSpeaker] = useState(null);
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

  async function loadCommissions(speakerId) {
    try {
      const res = await axios.get(`${BACKEND_URL}/connexers/admin/commissions`, {
        ...getAuth(),
        params: speakerId ? { speaker_id: speakerId } : {},
      });
      setCommissions(res.data);
    } catch (err) {
      console.error('Failed to load commissions', err);
    }
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

  async function markPaid(commissionId) {
    try {
      await axios.patch(`${BACKEND_URL}/connexers/admin/commissions/${commissionId}/mark-paid`, null, getAuth());
      if (expandedSpeaker) loadCommissions(expandedSpeaker);
      loadSpeakers();
    } catch (err) {
      logTechnicalError(err, 'ADMIN_MARK_COMMISSION_PAID');
      alert(getUserFriendlyError(err, { fallback: 'Unable to mark this commission as paid. Please try again.' }));
    }
  }

  function handleExpand(speakerId) {
    if (expandedSpeaker === speakerId) {
      setExpandedSpeaker(null);
      setCommissions([]);
    } else {
      setExpandedSpeaker(speakerId);
      loadCommissions(speakerId);
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
                  <>
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
                        <button onClick={() => handleExpand(s.id)} style={btnSmall('#1a73e8')}>
                          {expandedSpeaker === s.id ? 'Hide' : 'Sales'}
                        </button>
                        <button onClick={() => toggleActive(s)} style={btnSmall(s.is_active ? '#666' : '#2db84b')}>
                          {s.is_active ? 'Disable' : 'Enable'}
                        </button>
                        <button onClick={() => openExpiryModal(s)} style={btnSmall('#f5a623')}>
                          Expiry
                        </button>
                        <button onClick={() => deleteSpeaker(s)} style={btnSmall('#e8312a')}>
                          Delete
                        </button>
                      </td>
                    </tr>
                    {/* Expanded commissions */}
                    {expandedSpeaker === s.id && (
                      <tr key={`${s.id}-detail`}>
                        <td colSpan={13} style={{ padding: '0 14px 14px', background: '#111' }}>
                          <h4 style={{ color: 'rgba(255,255,255,0.5)', padding: '12px 0 8px', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Sales by {s.name}
                          </h4>
                          {commissions.length === 0 ? (
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '8px 0' }}>No sales yet</p>
                          ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr>
                                  {['Buyer', 'Ticket', 'Price', 'Discount', 'Commission', 'Status', 'Date', ''].map(h => (
                                    <th key={h} style={{
                                      textAlign: 'left', padding: '8px 10px', fontSize: 10,
                                      color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
                                      borderBottom: '1px solid #222',
                                    }}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {commissions.map(c => (
                                  <tr key={c.id}>
                                    <td style={{ padding: '8px 10px', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                                      {c.buyer_name || c.buyer_email}
                                    </td>
                                    <td style={{ padding: '8px 10px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{c.ticket_type}</td>
                                    <td style={{ padding: '8px 10px', fontSize: 13, color: '#fff' }}>₦{c.ticket_price.toLocaleString()}</td>
                                    <td style={{ padding: '8px 10px', fontSize: 13, color: '#f5a623' }}>₦{c.discount_given.toLocaleString()}</td>
                                    <td style={{ padding: '8px 10px', fontSize: 13, color: '#2db84b', fontWeight: 700 }}>₦{c.commission_amount.toLocaleString()}</td>
                                    <td style={{ padding: '8px 10px' }}>
                                      <span style={{
                                        padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                                        background: c.status === 'paid' ? 'rgba(45,184,75,0.15)' : 'rgba(245,166,35,0.15)',
                                        color: c.status === 'paid' ? '#2db84b' : '#f5a623',
                                      }}>
                                        {c.status === 'paid' ? '✓ Paid' : 'Pending'}
                                      </span>
                                    </td>
                                    <td style={{ padding: '8px 10px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                                      {new Date(c.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '8px 10px' }}>
                                      {c.status === 'pending' && (
                                        <button onClick={() => markPaid(c.id)} style={btnSmall('#2db84b')}>
                                          Mark Paid
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
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
            <h3 style={{ color: '#fff', marginBottom: 12 }}>Update Discount Expiry</h3>
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
    </AdminLayout>
  );
}

function btnSmall(bg) {
  return {
    padding: '4px 10px', borderRadius: 6, border: 'none',
    background: `${bg}22`, color: bg, fontSize: 12, fontWeight: 600,
    cursor: 'pointer',
  };
}
