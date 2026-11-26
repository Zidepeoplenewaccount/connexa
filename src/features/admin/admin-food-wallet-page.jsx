import { useCallback, useEffect, useMemo, useState } from 'react';
import { getFoodWalletOverview, deleteFoodWalletTransaction } from '../../services/adminApi';
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
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [ticketFilter, setTicketFilter] = useState('');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

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

  useEffect(() => {
    load();
    const interval = window.setInterval(() => load(true), 10000);
    return () => window.clearInterval(interval);
  }, [load]);

  async function deleteTransaction(row) {
    const confirmed = window.confirm(
      'Delete this food wallet transaction for ' + row.attendee_name + ' (' + row.ticket_id + ')? The amount will be restored to the attendee\'s available allowance.'
    );
    if (!confirmed) return;

    setDeletingId(row.id);
    setError('');
    try {
      await deleteFoodWalletTransaction(row.id);
      await load(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to delete this food wallet transaction.');
    } finally {
      setDeletingId(null);
    }
  }
  const transactions = data?.transactions || [];
  const filtered = useMemo(() => transactions.filter((row) => {
    const matchesVendor = !vendorFilter || row.vendor_name === vendorFilter;
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [
      row.ticket_id, row.attendee_name, row.item_name, row.confirmation_code,
    ].some((value) => String(value || '').toLowerCase().includes(term));
    const matchesTicket = !ticketFilter.trim() || String(row.ticket_id || '').toLowerCase().includes(ticketFilter.trim().toLowerCase());
    const date = row.created_at ? new Date(row.created_at) : null;
    const dateKey = date && !Number.isNaN(date.getTime()) ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '';
    const matchesFrom = !dateFrom || dateKey >= dateFrom;
    const matchesTo = !dateTo || dateKey <= dateTo;
    return matchesVendor && matchesSearch && matchesTicket && matchesFrom && matchesTo;
  }), [transactions, vendorFilter, search, ticketFilter, dateFrom, dateTo]);

  function exportCsv() {
    const headings = ['Date', 'Time', 'Attendee Name', 'Ticket ID', 'Ticket Category', 'Vendor', 'Item', 'Quantity', 'Purchase Amount', 'Connexa Subsidy', 'Customer Payment', 'Four-digit Code'];
    const rows = filtered.map((row) => [
      row.created_at ? new Date(row.created_at).toLocaleDateString('en-NG') : '',
      row.created_at ? new Date(row.created_at).toLocaleTimeString('en-NG') : '',
      row.attendee_name, row.ticket_id, row.ticket_type, row.vendor_name,
      row.item_name, row.quantity, row.purchase_amount ?? row.amount,
      row.subsidy_amount ?? row.amount, row.customer_payment ?? 0, row.confirmation_code,
    ]);
    const csv = [headings, ...rows].map((line) => line.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'connexa-salsar-cakes-reconciliation.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <AdminLayout><div className="admin-loading-msg">Loading food wallet records…</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1>Salsar Cakes Food Wallet</h1>
          <p style={{ color: 'rgba(255,255,255,.55)', marginTop: 6 }}>Live transaction tracker and subsidy reconciliation for Salsar Cakes.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="admin-btn admin-btn-outline" onClick={() => { window.location.href = '/admin/food-wallet/registers'; }}>Print vendor registers</button>
          <button className="admin-btn admin-btn-outline" onClick={() => load(true)} disabled={refreshing}>{refreshing ? 'Refreshing…' : '↻ Refresh'}</button>
          <button className="admin-btn" onClick={exportCsv}>Export CSV</button>
        </div>
      </div>

      {error && <div style={{ padding: 14, marginBottom: 18, borderRadius: 8, color: '#ffb7b7', background: 'rgba(232,49,42,.12)', border: '1px solid rgba(232,49,42,.3)' }}>{error}</div>}

      <div className="admin-stats-grid">
        <div className="admin-stat-card"><div className="admin-stat-value">{money(data?.total_spent)}</div><div className="admin-stat-label">Total Connexa subsidy used</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">{data?.total_transactions || 0}</div><div className="admin-stat-label">Confirmed transactions</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">{money(data?.total_purchase_amount)}</div><div className="admin-stat-label">Total purchase value</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">{money(data?.total_customer_payment)}</div><div className="admin-stat-label">Total customer payments</div></div>
      </div>

      <div className="admin-card">
        <h2>Salsar Cakes reconciliation summary</h2>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead><tr><th>Vendor</th><th>Transactions</th><th>Purchase value</th><th>Connexa subsidy</th><th>Customer payments</th></tr></thead>
            <tbody>
              {(data?.vendor_summaries || []).map((vendor) => (
                <tr key={vendor.vendor_name}>
                  <td><strong>{vendor.vendor_name}</strong></td>
                  <td>{vendor.transactions}</td>
                  <td>{money(vendor.total_sales)}</td>
                  <td style={{ color: '#fd9a70', fontWeight: 800 }}>{money(vendor.total_subsidy)}</td>
                  <td>{money(vendor.total_customer_payment)}</td>
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
          <input className="admin-search-bar" style={{ margin: 0 }} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search attendee, item or code" />
          <input className="admin-search-bar" style={{ margin: 0 }} value={ticketFilter} onChange={(event) => setTicketFilter(event.target.value)} placeholder="Filter by ticket ID" />
          <label style={{ color: 'rgba(255,255,255,.65)', fontSize: 12 }}>From <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} style={{ display: 'block', marginTop: 5, padding: '10px', background: '#101010', border: '1px solid #333', borderRadius: 8, color: '#fff' }} /></label>
          <label style={{ color: 'rgba(255,255,255,.65)', fontSize: 12 }}>To <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} style={{ display: 'block', marginTop: 5, padding: '10px', background: '#101010', border: '1px solid #333', borderRadius: 8, color: '#fff' }} /></label>
          <select value={vendorFilter} onChange={(event) => setVendorFilter(event.target.value)} style={{ padding: '12px 14px', background: '#101010', border: '1px solid #333', borderRadius: 8, color: '#fff' }}>
            <option value="">All vendors</option>
            {(data?.vendors || []).map((vendor) => <option key={vendor} value={vendor}>{vendor}</option>)}
          </select>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead><tr><th>Date</th><th>Time</th><th>Attendee</th><th>Ticket ID</th><th>Ticket Category</th><th>Vendor</th><th>Item</th><th>Qty</th><th>Purchase</th><th>Connexa subsidy</th><th>Customer pays</th><th>4-digit code</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="13" style={{ textAlign: 'center', padding: 36, color: 'rgba(255,255,255,.5)' }}>No food wallet transactions yet.</td></tr>
              ) : filtered.map((row) => (
                <tr key={row.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{row.created_at ? new Date(row.created_at).toLocaleDateString('en-NG') : '—'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{row.created_at ? new Date(row.created_at).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                  <td><strong>{row.attendee_name}</strong></td>
                  <td><code>{row.ticket_id}</code></td>
                  <td>{row.ticket_type}</td>
                  <td>{row.vendor_name}</td>
                  <td>{row.item_name}</td>
                  <td>{row.quantity}</td>
                  <td>{money(row.purchase_amount ?? row.amount)}</td>
                  <td style={{ fontWeight: 800, color: '#fd9a70' }}>{money(row.subsidy_amount ?? row.amount)}</td>
                  <td>{money(row.customer_payment ?? 0)}</td>
                  <td><code>{row.confirmation_code}</code></td>
                  <td>
                    <button
                      className="admin-btn admin-btn-outline"
                      style={{ color: '#ff8b8b', borderColor: 'rgba(255,100,100,.45)', padding: '7px 10px' }}
                      onClick={() => deleteTransaction(row)}
                      disabled={deletingId === row.id}
                    >
                      {deletingId === row.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
