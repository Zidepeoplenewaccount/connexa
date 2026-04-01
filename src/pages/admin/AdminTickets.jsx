import { useState, useEffect } from 'react';
import { getAllTickets, deleteTicket, exportTickets } from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../components/admin/admin.css';


export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const data = await getAllTickets();
      setTickets(data.attendees || []);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(ticketId) {
    if (!confirm('Delete this ticket?')) return;
    try {
      await deleteTicket(ticketId);
      fetchTickets();
    } catch (error) {
      alert('Failed to delete');
    }
  }

  async function handleExport() {
    try {
      const blob = await exportTickets();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tickets.csv';
      a.click();
    } catch (error) {
      alert('Export failed');
    }
  }

  const filtered = tickets.filter(t =>
    t.attendee_name.toLowerCase().includes(search.toLowerCase()) ||
    t.buyer_email.toLowerCase().includes(search.toLowerCase())
  );

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
        <h1>Tickets</h1>
        <button className="admin-btn" onClick={handleExport}>📥 Export CSV</button>
      </div>

      <input
        type="text"
        className="admin-search-bar"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="admin-card">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    No tickets found
                  </td>
                </tr>
              ) : (
                filtered.map((ticket) => (
                  <tr key={ticket.ticket_id}>
                    <td><code>{ticket.ticket_id}</code></td>
                    <td>{ticket.attendee_name}</td>
                    <td>{ticket.buyer_email}</td>
                    <td>{ticket.ticket_type}</td>
                    <td>₦{ticket.amount?.toLocaleString()}</td>
                    <td>
                      <button 
                        className="admin-table-btn"
                        onClick={() => handleDelete(ticket.ticket_id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '16px', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
        Showing {filtered.length} ticket(s)
      </div>
    </AdminLayout>
  );
}