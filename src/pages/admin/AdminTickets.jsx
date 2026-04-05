import { useState, useEffect } from 'react';
import { getAllTickets, getAllPayments, deleteTicket, exportTickets } from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../components/admin/admin.css';


export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [discountLookup, setDiscountLookup] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const [ticketData, paymentData] = await Promise.all([
        getAllTickets(),
        getAllPayments({ limit: 1000 }),
      ]);
      setTickets(ticketData.attendees || []);

      const lookup = {};
      const payments = paymentData.payments || [];

      payments.forEach((payment) => {
        const metadata = payment.metadata || {};
        const discountCode = (metadata.discount_code || '').trim().toUpperCase();
        const speakerCode = (metadata.speaker_code || '').trim().toUpperCase();
        const hasDiscount = Boolean(discountCode || speakerCode);
        if (!hasDiscount) return;

        let percentage = null;
        if (metadata.discount_code_percentage !== null && metadata.discount_code_percentage !== undefined) {
          percentage = Number(metadata.discount_code_percentage);
        } else {
          const speakerDiscountApplied = Number(metadata.speaker_discount_applied || 0);
          const finalAmount = Number(payment.amount || 0);
          const baseBeforeSpeakerDiscount = finalAmount + speakerDiscountApplied;
          if (speakerDiscountApplied > 0 && baseBeforeSpeakerDiscount > 0) {
            percentage = (speakerDiscountApplied / baseBeforeSpeakerDiscount) * 100;
          }
        }

        const email = (payment.buyer_email || '').trim().toLowerCase();
        const ticketType = (metadata.ticket_type || '').trim().toLowerCase();
        const amount = Number(payment.amount || 0).toFixed(2);
        const key = `${email}|${ticketType}|${amount}`;

        lookup[key] = {
          percentage,
          source: discountCode ? 'discount' : 'connexer',
        };
      });

      setDiscountLookup(lookup);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  }

  function resolveTicketDiscount(ticket) {
    if (ticket.used_discount_code && ticket.discount_percentage !== undefined && ticket.discount_percentage !== null) {
      return {
        percentage: Number(ticket.discount_percentage),
        source: ticket.discount_code_source || 'discount',
      };
    }

    const email = (ticket.buyer_email || '').trim().toLowerCase();
    const ticketType = (ticket.ticket_type || '').trim().toLowerCase();
    const amount = Number(ticket.amount || 0).toFixed(2);
    const key = `${email}|${ticketType}|${amount}`;
    return discountLookup[key] || null;
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
                <th>Discount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    No tickets found
                  </td>
                </tr>
              ) : (
                filtered.map((ticket) => {
                  const resolvedDiscount = resolveTicketDiscount(ticket);

                  return (
                  <tr key={ticket.ticket_id}>
                    <td><code>{ticket.ticket_id}</code></td>
                    <td>{ticket.attendee_name}</td>
                    <td>{ticket.buyer_email}</td>
                    <td>{ticket.ticket_type}</td>
                    <td>₦{ticket.amount?.toLocaleString()}</td>
                    <td>
                      {resolvedDiscount ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            width: 'fit-content',
                            background: 'rgba(45,184,75,0.15)',
                            color: '#2db84b',
                          }}>
                            Used
                          </span>
                          <span style={{ fontWeight: 700 }}>
                            {resolvedDiscount.percentage !== null && resolvedDiscount.percentage !== undefined
                              ? `${resolvedDiscount.percentage.toFixed(1).replace(/\.0$/, '')}%`
                              : 'Applied'}
                          </span>
                          {resolvedDiscount.source && (
                            <small style={{ color: 'rgba(255,255,255,0.55)' }}>
                              {resolvedDiscount.source === 'connexer' ? 'Connexer code' : 'Discount code'}
                            </small>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.45)' }}>None</span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="admin-table-btn"
                        onClick={() => handleDelete(ticket.ticket_id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                );
                })
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