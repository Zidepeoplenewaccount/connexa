import { useState, useEffect } from 'react';
import { 
  getAllDiscountCodes,
  createDiscountCode,
  updateDiscountCode,
  deleteDiscountCode,
  getDiscountStats,
  getDiscountCodeUses
} from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../components/admin/admin.css';

export default function AdminDiscountCodes() {
  const [codes, setCodes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showUsesModal, setShowUsesModal] = useState(false);  
  const [selectedCodeUses, setSelectedCodeUses] = useState([]);  
  const [selectedCodeName, setSelectedCodeName] = useState('');  
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: 10,
    applies_to: 'both',
    auto_generate: false,
    max_uses: null,
    specific_ticket_type: '',
  });

  // Available ticket types for dropdown
  const ticketTypes = [
    'All Tickets',  // This means no restriction
    'General Access Ticket',
    'Individual Pass — Regular',
    'Connectors Pass',
    'Individual Pass — VIP',
    'Business Owner Pass',
    'Showcase Vendor Pass',
    'Market Vendor Pass',
    'VIP Partner Pass'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [codesData, statsData] = await Promise.all([
        getAllDiscountCodes(),
        getDiscountStats()
      ]);
      setCodes(codesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch discount codes:', error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setFormData({
      code: '',
      discount_percentage: 10,
      applies_to: 'both',
      auto_generate: false
    });
    setShowModal(true);
  }

  async function handleCreateCode(e) {
    e.preventDefault();
    
    try {
      await createDiscountCode({
        code: formData.auto_generate ? null : formData.code.toUpperCase(),
        discount_percentage: parseFloat(formData.discount_percentage),
        applies_to: formData.applies_to,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        specific_ticket_type: formData.specific_ticket_type && formData.specific_ticket_type !== 'All Tickets' ? formData.specific_ticket_type : null,
      });
      
      alert('Discount code created successfully!');
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert('Failed to create discount code: ' + (error.response?.data?.detail || error.message));
    }
  }

  async function viewCodeUses(code) {
    try {
      const uses = await getDiscountCodeUses(code);
      setSelectedCodeUses(uses);
      setSelectedCodeName(code);
      setShowUsesModal(true);
    } catch (error) {
      alert('Failed to fetch code uses');
    }
  }

  async function handleToggleActive(code, isActive) {
    if (!confirm(`${isActive ? 'Deactivate' : 'Activate'} this discount code?`)) return;
    
    try {
      await updateDiscountCode(code, { is_active: !isActive });
      fetchData();
    } catch (error) {
      alert('Failed to update discount code');
    }
  }

  async function handleDelete(code) {
    if (!confirm('Delete this discount code? This cannot be undone.')) return;
    
    try {
      await deleteDiscountCode(code);
      fetchData();
    } catch (error) {
      alert('Failed to delete discount code');
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading-msg">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Discount Codes</h1>
        <button className="admin-btn" onClick={openCreateModal}>
          ➕ Create Discount Code
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.total_codes}</div>
            <div className="admin-stat-label">Total Codes</div>
          </div>
          <div className="admin-stat-card" style={{ borderColor: '#2db84b' }}>
            <div className="admin-stat-value" style={{ color: '#2db84b' }}>{stats.active_codes}</div>
            <div className="admin-stat-label">Active Codes</div>
          </div>
          <div className="admin-stat-card" style={{ borderColor: '#f5a623' }}>
            <div className="admin-stat-value" style={{ color: '#f5a623' }}>{stats.exhausted_codes || 0}</div>
            <div className="admin-stat-label">Exhausted Codes</div>
          </div>
          <div className="admin-stat-card" style={{ borderColor: '#1a73e8' }}>
            <div className="admin-stat-value" style={{ color: '#1a73e8' }}>{stats.total_uses || 0}</div>
            <div className="admin-stat-label">Total Uses</div>
          </div>
        </div>
      )}

      {/* Codes Table */}
      <div className="admin-card">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Applies To</th>
                <th>Ticket Type</th>
                <th>Usage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {codes.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    No discount codes found
                  </td>
                </tr>
              ) : (
                codes.map((code) => (
                  <tr key={code.id}>
                    <td>
                      <code style={{ 
                        background: 'rgba(245,166,35,0.2)', 
                        padding: '6px 12px', 
                        borderRadius: '6px',
                        color: '#f5a623',
                        fontWeight: '700',
                        fontSize: '14px',
                        letterSpacing: '1px'
                      }}>
                        {code.code}
                      </code>
                    </td>
                    <td style={{ color: '#2db84b', fontWeight: '700' }}>
                      {code.discount_percentage}%
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: code.applies_to === 'both' 
                          ? 'rgba(26,115,232,0.15)' 
                          : code.applies_to === 'tickets'
                            ? 'rgba(245,166,35,0.15)'
                            : 'rgba(45,184,75,0.15)',
                        color: code.applies_to === 'both' 
                          ? '#1a73e8' 
                          : code.applies_to === 'tickets'
                            ? '#f5a623'
                            : '#2db84b'
                      }}>
                        {code.applies_to === 'both' ? 'Tickets & Merch' : code.applies_to.charAt(0).toUpperCase() + code.applies_to.slice(1)}
                      </span>
                    </td>
                    <td>
                      <small style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {code.specific_ticket_type || 'All Tickets'}
                      </small>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontWeight: '700' }}>
                          {code.times_used} {code.max_uses ? `/ ${code.max_uses}` : ''}
                        </span>
                        {code.times_used > 0 && (
                          <button
                            onClick={() => viewCodeUses(code.code)}
                            style={{
                              padding: '4px 8px',
                              fontSize: '11px',
                              background: 'rgba(26,115,232,0.15)',
                              border: '1px solid rgba(26,115,232,0.3)',
                              borderRadius: '4px',
                              color: '#1a73e8',
                              cursor: 'pointer'
                            }}
                          >
                            View Uses
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      {(code.max_uses && code.times_used >= code.max_uses) || code.is_used ? (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: 'rgba(232,49,42,0.15)',
                          color: '#e8312a'
                        }}>
                          Exhausted
                        </span>
                      ) : code.is_active && !code.is_used ? (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: 'rgba(45,184,75,0.15)',
                          color: '#2db84b'
                        }}>
                          Active
                        </span>
                      ) : (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.5)'
                        }}>
                          Inactive
                        </span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="admin-table-btn"
                        onClick={() => handleToggleActive(code.code, code.is_active)}
                        style={{ marginRight: '8px' }}
                        title={code.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {code.is_active ? '🚫' : '✅'}
                      </button>
                      <button 
                        className="admin-table-btn"
                        onClick={() => handleDelete(code.code)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            overflowY: 'auto'
          }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div style={{
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '32px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ marginBottom: '24px' }}>Create Discount Code</h2>
            
            <form onSubmit={handleCreateCode}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '12px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.auto_generate}
                    onChange={(e) => setFormData({...formData, auto_generate: e.target.checked, code: ''})}
                  />
                  <span>Auto-generate code</span>
                </label>
                
                {!formData.auto_generate && (
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    required
                    placeholder="e.g., WELCOME10"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0a0a0a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: '#fff',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontWeight: '700'
                    }}
                  />
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Discount Percentage *
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({...formData, discount_percentage: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </div>

              {/* ADD MAX USES */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Max Uses (leave empty for unlimited)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_uses || ''}
                  onChange={(e) => setFormData({...formData, max_uses: e.target.value})}
                  placeholder="Unlimited"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Applies To *
                </label>
                <select
                  value={formData.applies_to}
                  onChange={(e) => setFormData({...formData, applies_to: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <option value="both">Tickets & Merch</option>
                  <option value="tickets">Tickets Only</option>
                  <option value="merch">Merch Only</option>
                </select>
              </div>

              {/* ADD SPECIFIC TICKET TYPE */}
              {formData.applies_to !== 'merch' && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                    Specific Ticket Type (optional)
                  </label>
                  <select
                    value={formData.specific_ticket_type}
                    onChange={(e) => setFormData({...formData, specific_ticket_type: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0a0a0a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    {ticketTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="admin-btn" style={{ flex: 1 }}>
                  Create Code
                </button>
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USES MODAL */}
      {showUsesModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={(e) => e.target === e.currentTarget && setShowUsesModal(false)}
        >
          <div style={{
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '32px',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Uses of Code: {selectedCodeName}</h2>
              <button 
                onClick={() => setShowUsesModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            {selectedCodeUses.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                This code has not been used yet.
              </p>
            ) : (
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>User</th>
                      <th>Type</th>
                      <th>Item</th>
                      <th>Original</th>
                      <th>Discount</th>
                      <th>Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCodeUses.map((use) => (
                      <tr key={use.id}>
                        <td>{new Date(use.used_at).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <strong>{use.user_name}</strong>
                            <small style={{ color: 'rgba(255,255,255,0.5)' }}>{use.user_email}</small>
                          </div>
                        </td>
                        <td>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            background: use.order_type === 'ticket' ? 'rgba(245,166,35,0.15)' : 'rgba(45,184,75,0.15)',
                            color: use.order_type === 'ticket' ? '#f5a623' : '#2db84b'
                          }}>
                            {use.order_type}
                          </span>
                        </td>
                        <td>
                          <small>{use.ticket_type || use.product_name}</small>
                        </td>
                        <td>₦{use.original_amount.toLocaleString()}</td>
                        <td style={{ color: '#e8312a' }}>-₦{use.discount_amount.toLocaleString()}</td>
                        <td style={{ fontWeight: '700' }}>₦{use.final_amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
