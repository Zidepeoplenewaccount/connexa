import { useState, useEffect } from 'react';
import { 
  getAllAffiliates, 
  getAffiliateStats,
  getAllCommissions,
  markCommissionPaid,
  bulkMarkCommissionsPaid,
  toggleAffiliate,
  deleteAffiliate 
} from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../components/admin/admin.css';

export default function AdminAffiliates() {
  const [activeTab, setActiveTab] = useState('affiliates'); // 'affiliates' or 'commissions'
  const [affiliates, setAffiliates] = useState([]);
  const [stats, setStats] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommissions, setSelectedCommissions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);  
  const [formData, setFormData] = useState({  
    fullName: '',
    email: '',
    phone: '',
    cityState: '',
    socialMedia: '',
    bankName: '',
    accountName: '',
    accountNumber: ''
  });

  const nigerianBanks = [  
    'Access Bank',
    'GTBank',
    'First Bank',
    'UBA',
    'Zenith Bank',
    'Fidelity Bank',
    'Union Bank',
    'Sterling Bank',
    'Stanbic IBTC',
    'FCMB',
    'Ecobank',
    'Wema Bank',
    'OPay',
    'PalmPay',
    'Kuda Bank',
    'Other'
  ];


  useEffect(() => {
    if (activeTab === 'affiliates') {
      fetchAffiliatesAndStats();
    } else {
      fetchCommissions();
    }
  }, [activeTab, filterStatus]);

  async function fetchAffiliatesAndStats() {
    try {
      setLoading(true);
      const [affiliatesData, statsData] = await Promise.all([
        getAllAffiliates(),
        getAffiliateStats()
      ]);
      setAffiliates(affiliatesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch affiliates:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCommissions() {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const data = await getAllCommissions(params);
      setCommissions(data);
    } catch (error) {
      console.error('Failed to fetch commissions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkPaid(commissionId) {
    if (!confirm('Mark this commission as paid?')) return;
    try {
      await markCommissionPaid(commissionId);
      fetchCommissions();
      alert('Commission marked as paid');
    } catch (error) {
      alert('Failed to mark as paid');
    }
  }

  async function handleBulkMarkPaid() {
    if (selectedCommissions.length === 0) {
      alert('Please select commissions to mark as paid');
      return;
    }
    if (!confirm(`Mark ${selectedCommissions.length} commission(s) as paid?`)) return;
    try {
      await bulkMarkCommissionsPaid(selectedCommissions);
      setSelectedCommissions([]);
      fetchCommissions();
      alert(`${selectedCommissions.length} commission(s) marked as paid`);
    } catch (error) {
      alert('Failed to mark commissions as paid');
    }
  }

  async function handleToggleAffiliate(code) {
    if (!confirm('Toggle affiliate status?')) return;
    try {
      await toggleAffiliate(code);
      fetchAffiliatesAndStats();
    } catch (error) {
      alert('Failed to toggle affiliate');
    }
  }

  async function handleDeleteAffiliate(code) {
    if (!confirm('Delete this affiliate? This cannot be undone.')) return;
    try {
      await deleteAffiliate(code);
      fetchAffiliatesAndStats();
    } catch (error) {
      alert('Failed to delete affiliate');
    }
  }

  function toggleCommissionSelection(id) {
    setSelectedCommissions(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  }

  function toggleAllCommissions() {
    if (selectedCommissions.length === commissions.length) {
      setSelectedCommissions([]);
    } else {
      setSelectedCommissions(commissions.map(c => c.id));
    }
  }

  function openCreateModal() {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      cityState: '',
      socialMedia: '',
      bankName: '',
      accountName: '',
      accountNumber: ''
    });
    setShowModal(true);
  }

  // ADD THIS FUNCTION
  async function handleCreateAffiliate(e) {
    e.preventDefault();
    
    try {
      await createAffiliate({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city_state: formData.cityState || null,
        social_media: formData.socialMedia || null,
        bank_name: formData.bankName,
        account_name: formData.accountName,
        account_number: formData.accountNumber
      });
      
      alert('Affiliate created successfully!');
      setShowModal(false);
      fetchAffiliatesAndStats();
    } catch (error) {
      alert('Failed to create affiliate: ' + (error.response?.data?.detail || error.message));
    }
  }


  // Calculate totals
  const totalEarned = stats.reduce((sum, s) => sum + s.total_earned, 0);
  const totalPaid = stats.reduce((sum, s) => sum + s.total_paid, 0);
  const totalPending = stats.reduce((sum, s) => sum + s.pending, 0);
  const totalSales = stats.reduce((sum, s) => sum + s.total_sales, 0);

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
        <h1>Affiliates & Commissions</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          {activeTab === 'affiliates' && (
            <button
              className="admin-btn"
              onClick={openCreateModal}
            >
              ➕ Create Affiliate
            </button>
          )}

          <button
            className={`admin-btn ${activeTab === 'affiliates' ? '' : 'admin-btn-outline'}`}
            onClick={() => setActiveTab('affiliates')}
          >
            👥 Affiliates
          </button>
          <button
            className={`admin-btn ${activeTab === 'commissions' ? '' : 'admin-btn-outline'}`}
            onClick={() => setActiveTab('commissions')}
          >
            💰 Commissions
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {activeTab === 'affiliates' && (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-value">₦{totalEarned.toLocaleString()}</div>
            <div className="admin-stat-label">Total Earned</div>
          </div>
          <div className="admin-stat-card" style={{ borderColor: '#2db84b' }}>
            <div className="admin-stat-value" style={{ color: '#2db84b' }}>₦{totalPaid.toLocaleString()}</div>
            <div className="admin-stat-label">Total Paid</div>
          </div>
          <div className="admin-stat-card" style={{ borderColor: '#f5a623' }}>
            <div className="admin-stat-value" style={{ color: '#f5a623' }}>₦{totalPending.toLocaleString()}</div>
            <div className="admin-stat-label">Pending Payout</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{totalSales}</div>
            <div className="admin-stat-label">Total Sales</div>
          </div>
        </div>
      )}

      {/* Affiliates Tab */}
      {activeTab === 'affiliates' && (
        <div className="admin-card">
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Sales</th>
                  <th>Earned</th>
                  <th>Paid</th>
                  <th>Pending</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>
                      No affiliates found
                    </td>
                  </tr>
                ) : (
                  stats.map((affiliate) => (
                    <tr key={affiliate.code}>
                      <td>
                        <code style={{ 
                          background: 'rgba(245,166,35,0.2)', 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          color: '#f5a623',
                          fontWeight: '700'
                        }}>
                          {affiliate.code}
                        </code>
                      </td>
                      <td><strong>{affiliate.full_name}</strong></td>
                      <td>{affiliate.email}</td>
                      <td>
                        {affiliates.find(a => a.code === affiliate.code)?.phone || 'N/A'}
                      </td>
                      <td>{affiliate.total_sales}</td>
                      <td>₦{affiliate.total_earned.toLocaleString()}</td>
                      <td style={{ color: '#2db84b' }}>₦{affiliate.total_paid.toLocaleString()}</td>
                      <td style={{ color: '#f5a623' }}>₦{affiliate.pending.toLocaleString()}</td>
                      <td>
                        {affiliates.find(a => a.code === affiliate.code)?.is_active ? (
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
                            background: 'rgba(232,49,42,0.15)',
                            color: '#e8312a'
                          }}>
                            Inactive
                          </span>
                        )}
                      </td>
                      <td>
                        <button 
                          className="admin-table-btn"
                          onClick={() => handleToggleAffiliate(affiliate.code)}
                          style={{ marginRight: '8px' }}
                        >
                          {affiliates.find(a => a.code === affiliate.code)?.is_active ? '🚫' : '✅'}
                        </button>
                        <button 
                          className="admin-table-btn"
                          onClick={() => handleDeleteAffiliate(affiliate.code)}
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
      )}

      {/* Commissions Tab */}
      {activeTab === 'commissions' && (
        <>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '10px 16px',
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px'
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>

            {selectedCommissions.length > 0 && (
              <button 
                className="admin-btn"
                onClick={handleBulkMarkPaid}
              >
                💰 Mark {selectedCommissions.length} as Paid
              </button>
            )}
          </div>

          <div className="admin-card">
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedCommissions.length === commissions.length && commissions.length > 0}
                        onChange={toggleAllCommissions}
                      />
                    </th>
                    <th>Date</th>
                    <th>Affiliate</th>
                    <th>Ticket Type</th>
                    <th>Ticket Price</th>
                    <th>Commission (20%)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                        No commissions found
                      </td>
                    </tr>
                  ) : (
                    commissions.map((commission) => (
                      <tr key={commission.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedCommissions.includes(commission.id)}
                            onChange={() => toggleCommissionSelection(commission.id)}
                            disabled={commission.commission_status === 'paid'}
                          />
                        </td>
                        <td>{new Date(commission.created_at).toLocaleDateString()}</td>
                        <td>
                          <code style={{ 
                            background: 'rgba(245,166,35,0.2)', 
                            padding: '4px 8px', 
                            borderRadius: '4px',
                            color: '#f5a623'
                          }}>
                            {commission.affiliate_code}
                          </code>
                        </td>
                        <td>{commission.ticket_type}</td>
                        <td>₦{commission.ticket_price.toLocaleString()}</td>
                        <td style={{ color: '#2db84b', fontWeight: '700' }}>
                          ₦{commission.commission_amount.toLocaleString()}
                        </td>
                        <td>
                          {commission.commission_status === 'paid' ? (
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: 'rgba(45,184,75,0.15)',
                              color: '#2db84b'
                            }}>
                              Paid {commission.paid_at && `(${new Date(commission.paid_at).toLocaleDateString()})`}
                            </span>
                          ) : (
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: 'rgba(245,166,35,0.15)',
                              color: '#f5a623'
                            }}>
                              Pending
                            </span>
                          )}
                        </td>
                        <td>
                          {commission.commission_status === 'pending' && (
                            <button 
                              className="admin-table-btn"
                              onClick={() => handleMarkPaid(commission.id)}
                            >
                              ✅ Mark Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}


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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ marginBottom: '24px' }}>Create New Affiliate</h2>
            
            <form onSubmit={handleCreateAffiliate}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
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

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
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

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  City / State (optional)
                </label>
                <input
                  type="text"
                  value={formData.cityState}
                  onChange={(e) => setFormData({...formData, cityState: e.target.value})}
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
                  Social Media (optional)
                </label>
                <input
                  type="text"
                  value={formData.socialMedia}
                  onChange={(e) => setFormData({...formData, socialMedia: e.target.value})}
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
                  Bank Name *
                </label>
                <select
                  value={formData.bankName}
                  onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                >
                  <option value="">Select bank</option>
                  {nigerianBanks.map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Account Name *
                </label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => setFormData({...formData, accountName: e.target.value})}
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

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Account Number *
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  required
                  maxLength="10"
                  pattern="[0-9]{10}"
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

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="admin-btn" style={{ flex: 1 }}>
                  Create Affiliate
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
    </AdminLayout>
  );
}