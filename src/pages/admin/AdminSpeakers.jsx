import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';

const BACKEND_URL = 'https://connexa-aahsexcjcfakfhbd.southafricanorth-01.azurewebsites.net';
//const BACKEND_URL = 'http://127.0.0.1:8000';

const getAuth = () => ({ headers: { Authorization: localStorage.getItem('admin_token') } });

export default function AdminSpeakers() {
  const [speakers, setSpeakers] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedSpeaker, setExpandedSpeaker] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', discount_percentage: 5, commission_rate: 75 });
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  async function loadSpeakers() {
    try {
      const res = await axios.get(`${BACKEND_URL}/speakers/admin/all`, getAuth());
      setSpeakers(res.data);
    } catch (err) {
      console.error('Failed to load speakers', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadCommissions(speakerId) {
    try {
      const res = await axios.get(`${BACKEND_URL}/speakers/admin/commissions`, {
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
    try {
      await axios.post(`${BACKEND_URL}/speakers/admin/create`, form, getAuth());
      setShowCreate(false);
      setForm({ name: '', email: '', password: '', discount_percentage: 5, commission_rate: 75 });
      loadSpeakers();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create speaker');
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(speaker) {
    try {
      await axios.patch(`${BACKEND_URL}/speakers/admin/${speaker.id}`, { is_active: !speaker.is_active }, getAuth());
      loadSpeakers();
    } catch (err) {
      alert('Failed to update speaker');
    }
  }

  async function deleteSpeaker(speaker) {
    if (!confirm(`Delete speaker ${speaker.name}? This cannot be undone.`)) return;
    try {
      await axios.delete(`${BACKEND_URL}/speakers/admin/${speaker.id}`, getAuth());
      loadSpeakers();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete speaker');
    }
  }

  async function markPaid(commissionId) {
    try {
      await axios.patch(`${BACKEND_URL}/speakers/admin/commissions/${commissionId}/mark-paid`, null, getAuth());
      if (expandedSpeaker) loadCommissions(expandedSpeaker);
      loadSpeakers();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to mark as paid');
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

  return (
    <AdminLayout>
      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>Speakers</h1>
          <button
            onClick={() => setShowCreate(!showCreate)}
            style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: '#f5a623', color: '#000', fontWeight: 700, cursor: 'pointer',
            }}
          >
            {showCreate ? 'Cancel' : '+ Create Speaker'}
          </button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div style={{
            background: '#1a1a1a', border: '1px solid #333', borderRadius: 12,
            padding: 24, marginBottom: 24,
          }}>
            <h3 style={{ color: '#fff', marginBottom: 16 }}>New Speaker</h3>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Name', name: 'name', type: 'text', required: true },
                  { label: 'Email', name: 'email', type: 'email', required: true },
                  { label: 'Password', name: 'password', type: 'text', required: true, placeholder: 'Generate a password for them' },
                  { label: 'Discount %', name: 'discount_percentage', type: 'number', step: '0.1' },
                  { label: 'Commission %', name: 'commission_rate', type: 'number', step: '0.1' },
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
                {creating ? 'Creating...' : 'Create Speaker Account'}
              </button>
            </form>
          </div>
        )}

        {/* Speakers Table */}
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</p>
        ) : speakers.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 48 }}>No speakers created yet</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Code', 'Discount', 'Commission', 'Uses', 'Earned', 'Pending', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '12px 14px', fontSize: 11, fontWeight: 700,
                      color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1,
                      borderBottom: '1px solid #333',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {speakers.map((s) => (
                  <>
                    <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '14px', color: '#fff', fontWeight: 600 }}>{s.name}</td>
                      <td style={{ padding: '14px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{s.email}</td>
                      <td style={{ padding: '14px' }}>
                        <code style={{ color: '#f5a623', fontWeight: 700, fontSize: 13 }}>{s.discount_code}</code>
                      </td>
                      <td style={{ padding: '14px', color: 'rgba(255,255,255,0.7)' }}>{s.discount_percentage}%</td>
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
                        <button onClick={() => deleteSpeaker(s)} style={btnSmall('#e8312a')}>
                          Delete
                        </button>
                      </td>
                    </tr>
                    {/* Expanded commissions */}
                    {expandedSpeaker === s.id && (
                      <tr key={`${s.id}-detail`}>
                        <td colSpan={10} style={{ padding: '0 14px 14px', background: '#111' }}>
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
