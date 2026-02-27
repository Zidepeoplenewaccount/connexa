import { useState, useEffect } from 'react';
import { getAllAffiliates, getAffiliateStats, generateAffiliate, toggleAffiliate, deleteAffiliate } from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../components/admin/admin.css';

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [affiliateData, statsData] = await Promise.all([
        getAllAffiliates(),
        getAffiliateStats()
      ]);
      setAffiliates(affiliateData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch affiliates:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate(e) {
    e.preventDefault();
    try {
      const result = await generateAffiliate(newName, newDescription);
      alert(`Affiliate created!\n\nCode: ${result.code}\nLink: ${result.link}`);
      setShowModal(false);
      setNewName('');
      setNewDescription('');
      fetchData();
    } catch (error) {
      alert('Failed to create affiliate');
    }
  }

  async function handleToggle(code) {
    try {
      await toggleAffiliate(code);
      fetchData();
    } catch (error) {
      alert('Failed to toggle affiliate');
    }
  }

  async function handleDelete(code) {
    if (!confirm('Delete this affiliate link?')) return;
    try {
      await deleteAffiliate(code);
      fetchData();
    } catch (error) {
      alert('Failed to delete');
    }
  }

  function copyLink(code) {
    navigator.clipboard.writeText(`https://connexa.com?ref=${code}`);
    alert('Link copied to clipboard!');
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
        <h1>Affiliate Links</h1>
        <button className="admin-btn" onClick={() => setShowModal(true)}>
          ➕ Generate Link
        </button>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <div key={stat.code} className="admin-stat-card">
            <div className="admin-stat-info">
              <span className="admin-stat-label">{stat.name} ({stat.code})</span>
              <span className="admin-stat-value">{stat.total_tickets}</span>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                ₦{stat.total_revenue.toLocaleString()} revenue
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Affiliates Table */}
      <div className="admin-card">
        <h2>All Affiliate Links</h2>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Link</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    No affiliate links yet
                  </td>
                </tr>
              ) : (
                affiliates.map((affiliate) => (
                  <tr key={affiliate.code}>
                    <td>
                      <strong>{affiliate.name}</strong>
                      {affiliate.description && (
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                          {affiliate.description}
                        </div>
                      )}
                    </td>
                    <td><code>{affiliate.code}</code></td>
                    <td>
                      <code style={{ fontSize: '12px' }}>
                        connexa.com?ref={affiliate.code}
                      </code>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        background: affiliate.is_active ? 'rgba(45,184,75,0.15)' : 'rgba(232,49,42,0.15)',
                        color: affiliate.is_active ? '#2db84b' : '#e8312a'
                      }}>
                        {affiliate.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(affiliate.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="admin-table-btn"
                        onClick={() => copyLink(affiliate.code)}
                        style={{ marginRight: '8px' }}
                      >
                        📋 Copy
                      </button>
                      <button 
                        className="admin-table-btn"
                        onClick={() => handleToggle(affiliate.code)}
                        style={{ marginRight: '8px' }}
                      >
                        {affiliate.is_active ? '❌' : '✅'}
                      </button>
                      <button 
                        className="admin-table-btn"
                        onClick={() => handleDelete(affiliate.code)}
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

      {/* Create Modal */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div style={{
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '32px',
            width: '100%',
            maxWidth: '500px'
          }}>
            <h2 style={{ marginBottom: '24px' }}>Generate Affiliate Link</h2>
            <form onSubmit={handleGenerate}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Name (required)
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. John Doe"
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
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g. Marketing team lead"
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
                  Generate
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