import { useState, useEffect } from 'react';
import { getAllPayments, exportPayments } from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../components/admin/admin.css';

export default function AdminPaymentsFeaturePage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      const data = await getAllPayments();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    try {
      const blob = await exportPayments();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'payments.csv';
      a.click();
    } catch (error) {
      alert('Export failed');
    }
  }

  const filtered = payments.filter(p =>
    p.buyer_email.toLowerCase().includes(search.toLowerCase()) ||
    p.payment_reference.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = filtered
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

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
        <h1>Payments</h1>
        <button className="admin-btn" onClick={handleExport}>📥 Export CSV</button>
      </div>

      <input
        type="text"
        className="admin-search-bar"
        placeholder="Search by email or reference..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="admin-card">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Type</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    No payments found
                  </td>
                </tr>
              ) : (
                filtered.map((payment) => (
                  <tr key={payment.id}>
                    <td><code>{payment.payment_reference}</code></td>
                    <td>{payment.buyer_email}</td>
                    <td><strong>₦{payment.amount.toLocaleString()}</strong></td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: payment.status === 'success'
                          ? 'rgba(45,184,75,0.15)'
                          : 'rgba(232,49,42,0.15)',
                        color: payment.status === 'success' ? '#2db84b' : '#e8312a'
                      }}>
                        {payment.status}
                      </span>
                    </td>
                    <td>{payment.metadata?.type || 'ticket'}</td>
                    <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '14px'
      }}>
        <span>Showing {filtered.length} payment(s)</span>
        <span style={{ color: '#f5a623', fontWeight: '700' }}>
          Total Revenue: ₦{totalRevenue.toLocaleString()}
        </span>
      </div>
    </AdminLayout>
  );
}
