import { useState, useEffect } from 'react';
import { getAllTickets, getAllPayments, getAllDiscountCodes, deleteTicket, exportTickets } from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../components/admin/admin.css';


export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [discountLookup, setDiscountLookup] = useState({});
  const [discountCodeMap, setDiscountCodeMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const [ticketData, paymentData, discountCodeData] = await Promise.all([
        getAllTickets(),
        getAllPayments({ limit: 1000 }),
        getAllDiscountCodes(),
      ]);
      setTickets(ticketData.attendees || []);

      const lookup = {};
      const payments = paymentData.payments || [];
      const codeMap = {};

      (discountCodeData || []).forEach((entry) => {
        const code = (entry.code || '').trim().toUpperCase();
        const percentage = Number(entry.discount_percentage);
        if (code && !Number.isNaN(percentage) && percentage > 0) {
          codeMap[code] = percentage;
        }
      });

      payments.forEach((payment) => {
        const metadata = payment.metadata || {};
        const discountCode = (metadata.discount_code || '').trim().toUpperCase();
        const speakerCode = (metadata.speaker_code || '').trim().toUpperCase();

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

        if ((percentage === null || Number.isNaN(percentage)) && metadata.discount_percentage !== null && metadata.discount_percentage !== undefined) {
          percentage = Number(metadata.discount_percentage);
        }

        const hasDiscount = percentage !== null && !Number.isNaN(percentage) && percentage > 0;
        if (!hasDiscount) return;

        const email = (payment.buyer_email || '').trim().toLowerCase();
        const ticketType = (metadata.ticket_type || '').trim().toLowerCase();
        const amount = Number(payment.amount || 0).toFixed(2);
        const key = `${email}|${ticketType}|${amount}`;

        lookup[key] = {
          percentage,
          source: discountCode ? 'discount' : (speakerCode ? 'connexer' : 'pricing'),
        };
      });

      setDiscountLookup(lookup);
      setDiscountCodeMap(codeMap);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  }

  function resolveTicketDiscount(ticket) {
    if (ticket.discount_percentage !== undefined && ticket.discount_percentage !== null) {
      const directPercentage = Number(ticket.discount_percentage);
      if (!Number.isNaN(directPercentage) && directPercentage > 0) {
        return {
          percentage: directPercentage,
          source: ticket.discount_code_source || 'pricing',
        };
      }
    }

    const email = (ticket.buyer_email || '').trim().toLowerCase();
    const ticketType = (ticket.ticket_type || '').trim().toLowerCase();
    const amount = Number(ticket.amount || 0).toFixed(2);
    const key = `${email}|${ticketType}|${amount}`;
    const resolvedFromPayment = discountLookup[key] || null;
    if (resolvedFromPayment) {
      return resolvedFromPayment;
    }

    if (ticket.used_discount_code && ticket.applied_discount_code) {
      const code = (ticket.applied_discount_code || '').trim().toUpperCase();
      const percentageFromCode = discountCodeMap[code];
      if (percentageFromCode !== undefined) {
        return {
          percentage: percentageFromCode,
          source: ticket.discount_code_source || 'discount',
        };
      }

      return {
        percentage: null,
        source: ticket.discount_code_source || 'discount',
      };
    }

    return null;
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
                      {resolvedDiscount && resolvedDiscount.percentage !== null && resolvedDiscount.percentage !== undefined ? (
                        <span style={{ fontWeight: 700 }}>
                          {`${resolvedDiscount.percentage.toFixed(1).replace(/\.0$/, '')}%`}
                        </span>
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