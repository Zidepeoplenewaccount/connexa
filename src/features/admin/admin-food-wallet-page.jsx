import { useCallback, useEffect, useMemo, useState } from 'react';
import { getFoodWalletOverview } from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../components/admin/admin.css';

const money = (value) => `₦${Number(value || 0).toLocaleString('en-NG', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})}`;

export default function AdminFoodWalletPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vendorFilter, setVendorFilter] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const result = await getFoodWalletOverview();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to load Connexa food wallet records.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const transactions = data?.transactions || [];
  const filtered = useMemo(() => transactions.filter((row) => {
    const matchesVendor = !vendorFilter || row.vendor_name === vendorFilter;
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [
      row.ticket_id, row.attendee_name, row.item_name, row.confirmation_code,
    ].some((value) => String(value || '').toLowerCase().includes(term));
    return matchesVendor && matchesSearch;
  }), [transactions, vendorFilter, search]);

  function exportCsv() {
    const headings = ['Date/Time', 'Vendor', 'Ticket ID', 'Attendee', 'Ticket Type', 'Item', 'Quantity', 'Amount', 'Confirmation'];
    const rows = filtered.map((row) => [
      row.created_at ? new Date(row.created_at).toLocaleString('en-NG') : '',
      row.vendor_name, row.ticket_id, row.attendee_name, row.ticket_type,
      row.item_name, row.quantity, row.amount, row.confirmation_code,
    ]);
    const csv = [headings, ...rows].map((line) => line.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'connexa-food-wallet-transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <AdminLayout><div className="admin-loading-msg">Loading food wallet records…</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1>Food Wallet</h1>
          <p style={{ color: 'rgba(255,255,255,.55)', marginTop: 6 }}>Attendee purchases, vendor totals and reimbursement records.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="admin-btn admin-btn-outline" onClick={() => { window.location.href = '/admin/food-wallet/registers'; }}>Print vendor registers</button>
          <button className="admin-btn admin-btn-outline" onClick={() => load(true)} disabled={refreshing}>{refreshing ? 'Refreshing…' : '↻ Refresh'}</button>
          <button className="admin-btn" onClick={exportCsv}>Export CSV</button>
        </div>
      </div>

      {error && <div style={{ padding: 14, marginBottom: 18, borderRadius: 8, color: '#ffb7b7', background: 'rgba(232,49,42,.12)', border: '1px solid rgba(232,49,42,.3)' }}>{error}</div>}

      <div className="admin-stats-grid">
        <div className="admin-stat-card"><div className="admin-stat-value">{money(data?.total_spent)}</div><div className="admin-stat-label">Total food allowance used</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">{data?.total_transactions || 0}</div><div className="admin-stat-label">Confirmed transactions</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">{(data?.vendor_summaries || []).length}</div><div className="admin-stat-label">Participating vendors</div></div>
      </div>

      <div className="admin-card">
        <h2>Vendor sales summary</h2>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead><tr><th>Vendor</th><th>Transactions</th><th>Total recorded sales</th></tr></thead>
            <tbody>
              {(data?.vendor_summaries || []).map((vendor) => (
                <tr key={vendor.vendor_name}>
                  <td><strong>{vendor.vendor_name}</strong></td>
                  <td>{vendor.transactions}</td>
                  <td style={{ color: '#fd9a70', fontWeight: 800 }}>{money(vendor.total_sales)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 12, marginTop: 12 }}>These totals are based on attendee-submitted transactions. Reconcile them against each vendor's paper sales register before reimbursement.</p>
      </div>

      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
          <h2 style={{ margin: 0 }}>Transaction records</h2>
          <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>{filtered.length} record(s)</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 12, marginBottom: 18 }}>
          <input className="admin-search-bar" style={{ margin: 0 }} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ticket, attendee, item or reference" />
          <select value={vendorFilter} onChange={(event) => setVendorFilter(event.target.value)} style={{ padding: '12px 14px', background: '#101010', border: '1px solid #333', borderRadius: 8, color: '#fff' }}>
            <option value="">All vendors</option>
            {(data?.vendors || []).map((vendor) => <option key={vendor} value={vendor}>{vendor}</option>)}
          </select>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead><tr><th>Time</th><th>Vendor</th><th>Attendee / Ticket ID</th><th>Item</th><th>Qty</th><th>Amount</th><th>Reference</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 36, color: 'rgba(255,255,255,.5)' }}>No food wallet transactions yet.</td></tr>
              ) : filtered.map((row) => (
                <tr key={row.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{row.created_at ? new Date(row.created_at).toLocaleString('en-NG', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</td>
                  <td>{row.vendor_name}</td>
                  <td><strong>{row.attendee_name}</strong><br /><code>{row.ticket_id}</code><br /><small style={{ color: 'rgba(255,255,255,.45)' }}>{row.ticket_type}</small></td>
                  <td>{row.item_name}</td>
                  <td>{row.quantity}</td>
                  <td style={{ fontWeight: 800 }}>{money(row.amount)}</td>
                  <td><code>{row.confirmation_code}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
