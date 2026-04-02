import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../components/admin/admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
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
        <h1>Dashboard</h1>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">🎟️</div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Tickets Bought</span>
            <span className="admin-stat-value">{stats?.tickets.bought ?? stats?.tickets.total ?? 0}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">✅</div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Tickets Used</span>
            <span className="admin-stat-value">{stats?.tickets.used ?? stats?.tickets.scanned ?? 0}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">💰</div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Revenue</span>
            <span className="admin-stat-value">₦{(stats?.payments.revenue || 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">🗳️</div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Votes</span>
            <span className="admin-stat-value">{stats?.votes.total || 0}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">📦</div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Orders</span>
            <span className="admin-stat-value">{stats?.merch.total_orders || 0}</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Tickets by Type</h2>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {stats?.tickets.by_type?.map((item) => (
                <tr key={item.type}>
                  <td>{item.type}</td>
                  <td><strong>{item.count}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}