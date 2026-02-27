import { useState, useEffect } from 'react';
import { getVotingStats } from '../../services/api';
import { exportVotes } from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../components/admin/admin.css';

export default function AdminVotes() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchStats();
  }, [filterType]);

  async function fetchStats() {
    try {
      setLoading(true);
      const data = await getVotingStats(filterType || null);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch voting stats:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    try {
      const blob = await exportVotes();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'votes.csv';
      a.click();
    } catch (error) {
      alert('Export failed');
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
        <h1>Voting Leaderboard</h1>
        <button className="admin-btn" onClick={handleExport}>📥 Export Votes</button>
      </div>

      <select 
        value={filterType} 
        onChange={(e) => setFilterType(e.target.value)}
        style={{
          padding: '10px 16px',
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '14px',
          marginBottom: '24px'
        }}
      >
        <option value="">All Categories</option>
        <option value="business">Business Award</option>
        <option value="individual">Individual Award</option>
      </select>

      <div className="admin-card">
        {stats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
            No votes yet
          </div>
        ) : (
          stats.map((candidate, index) => (
            <div 
              key={candidate.candidate_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '20px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '12px',
                marginBottom: '12px'
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: '800', minWidth: '60px', textAlign: 'center' }}>
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && `#${index + 1}`}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
                  {candidate.candidate_name}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                  {candidate.candidate_type}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#f5a623' }}>
                  {candidate.total_votes} votes
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                  ₦{candidate.total_amount.toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}