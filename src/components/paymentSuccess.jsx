import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaEnvelope, FaExclamationTriangle, FaVoteYea } from 'react-icons/fa';
import { verifyPayment } from '../services/api';
import connexaLogo from '../assets/CONNEXA_LOGO-BLACK(3)-Photoroom.webp';

const s = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px',
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    color: 'rgba(255,255,255,0.87)',
  },
  logo: {
    width: '140px',
    marginBottom: '32px',
    filter: 'invert(1)',
  },
  card: {
    background: '#141414',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '40px 32px',
    maxWidth: '520px',
    width: '100%',
    textAlign: 'center',
  },
  icon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '8px',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '15px',
    marginBottom: '24px',
  },
  divider: {
    borderColor: 'rgba(255,255,255,0.08)',
    margin: '24px 0',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    fontSize: '14px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    textAlign: 'left',
  },
  rowLabel: {
    color: 'rgba(255,255,255,0.45)',
    minWidth: '100px',
  },
  rowValue: {
    fontWeight: '600',
    wordBreak: 'break-all',
    textAlign: 'right',
    marginLeft: '12px',
  },
  ticketBlock: {
    background: 'rgba(245,166,35,0.06)',
    border: '1px solid rgba(245,166,35,0.2)',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '10px',
    textAlign: 'left',
  },
  ticketId: {
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#f5a623',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  ticketName: {
    fontSize: '14px',
    marginTop: '4px',
    color: 'rgba(255,255,255,0.75)',
  },
  emailNote: {
    background: 'rgba(45,184,75,0.08)',
    border: '1px solid rgba(45,184,75,0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '13px',
    color: 'rgba(45,184,75,0.9)',
    marginTop: '20px',
    textAlign: 'left',
  },
  upgradeNote: {
    background: 'rgba(245,166,35,0.08)',
    border: '1px solid rgba(245,166,35,0.25)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.86)',
    marginTop: '12px',
    textAlign: 'left',
  },
  btn: {
    display: 'inline-block',
    marginTop: '24px',
    padding: '14px 32px',
    background: '#f5a623',
    color: '#000',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '15px',
    width: '100%',
    boxSizing: 'border-box',
  },
  btnOutline: {
    display: 'inline-block',
    marginTop: '12px',
    padding: '12px 32px',
    background: 'transparent',
    color: 'rgba(255,255,255,0.6)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTop: '3px solid #f5a623',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 20px',
  },
};

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [reference, setReference] = useState('');
  const [emailFailedCount, setEmailFailedCount] = useState(0);
  const hasVerified = useRef(false);

  useEffect(() => {
    const ref = searchParams.get('reference');
    if (!ref) {
      setStatus('error');
      setMessage('No payment reference found');
      return;
    }
    setReference(ref);
    if (!hasVerified.current) {
      hasVerified.current = true;
      handleVerification(ref);
    }
  }, [searchParams]);

  async function handleVerification(ref) {
    try {
      if (ref.startsWith('FREE-')) {
        const freeFailedCount = parseInt(searchParams.get('email_failed_count') || '0', 10) || 0;
        setEmailFailedCount(freeFailedCount);
        setStatus('success');
        setMessage('Your free ticket has been issued!');
        return;
      }

      const data = await verifyPayment(ref);

      if (data.status === 'success' || data.status === 'already_processed') {
        setStatus('success');
        setMessage(data.message || 'Payment successful!');
        setTickets(data.tickets || []);
        setEmailFailedCount(data?.email_delivery?.failed_count || 0);
      } else {
        setStatus('error');
        setMessage('Payment verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please contact support.');
    }
  }

  const ticketItems = tickets.filter(t => t.ticket_id && t.ticket_type !== 'upgrade');
  const upgradeItems = tickets.filter(t => t.type === 'upgrade');
  const voteItems = tickets.filter(t => t.type === 'vote');
  const merchItems = tickets.filter(t => t.type === 'merch');

  const nonUpgradeableTypes = new Set(['Connectors Pass', 'Connexa Pass']);
  const eligibleUpgradeTicket = ticketItems.find((t) => {
    const ticketType = t?.ticket_type || '';
    return Boolean(t?.ticket_id) && !nonUpgradeableTypes.has(ticketType);
  });
  const upgradeUrl = eligibleUpgradeTicket
    ? `/upgrade-ticket?ticket=${encodeURIComponent(eligibleUpgradeTicket.ticket_id)}`
    : null;

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={s.page}>
        <img src={connexaLogo} alt="Connexa" style={s.logo} />

        <div style={s.card}>
          {status === 'verifying' && (
            <>
              <div style={s.spinner} />
              <h2 style={s.title}>Verifying Payment…</h2>
              <p style={s.subtitle}>Please wait while we confirm your payment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={s.icon}><FaCheckCircle size={48} color="#2db84b" /></div>
              <h2 style={{ ...s.title, color: '#2db84b' }}>Payment Confirmed!</h2>
              <p style={s.subtitle}>{message}</p>

              {/* Ticket summaries */}
              {ticketItems.length > 0 && (
                <>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', textAlign: 'left' }}>
                    YOUR TICKET{ticketItems.length > 1 ? 'S' : ''}
                  </p>
                  {ticketItems.map((t, i) => (
                    <div key={i} style={s.ticketBlock}>
                      <div style={s.ticketId}>{t.ticket_id}</div>
                      <div style={s.ticketName}>
                        {t.attendee_name || t.business_name || t.full_name || ''}
                        {t.ticket_type ? ` · ${t.ticket_type}` : ''}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {upgradeItems.length > 0 && (
                <>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', textAlign: 'left' }}>
                    UPGRADED TICKET
                  </p>
                  {upgradeItems.map((t, i) => (
                    <div key={i} style={s.ticketBlock}>
                      <div style={s.ticketId}>{t.ticket_id}</div>
                      <div style={s.ticketName}>Upgraded to {t.upgraded_to}</div>
                    </div>
                  ))}
                </>
              )}

              {voteItems.length > 0 && (
                <div style={s.ticketBlock}>
                  <div style={s.ticketId}><FaVoteYea size={14} /> {voteItems.length} Vote{voteItems.length > 1 ? 's' : ''} Recorded</div>
                </div>
              )}

              {merchItems.length > 0 && merchItems.map((t, i) => (
                <div key={i} style={s.ticketBlock}>
                  <div style={s.ticketId}>Order #{t.order_id}</div>
                  <div style={s.ticketName}>{t.product_name}</div>
                </div>
              ))}

              {/* Reference */}
              <div style={{ marginTop: '20px' }}>
                <div style={s.row}>
                  <span style={s.rowLabel}>Reference</span>
                  <span style={{ ...s.rowValue, fontFamily: 'monospace', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{reference}</span>
                </div>
              </div>

              {/* Email note */}
              <div style={s.emailNote}>
                {emailFailedCount > 0
                  ? <><FaExclamationTriangle size={14} /> Your payment was successful, but we could not deliver some confirmation email(s) yet. Please contact support with your payment reference below.</>
                  : <><FaEnvelope size={14} /> Your ticket has been sent to your email. Check your inbox (and spam folder).</>}
              </div>

              {upgradeUrl && (
                <div style={s.upgradeNote}>
                  Want more access? Upgrade your ticket and pay only the difference.
                </div>
              )}

              <a href="/" style={s.btn}>Back to Home</a>
              <a href="/#tickets" style={s.btnOutline}>Buy More Tickets</a>
              {upgradeUrl && <a href={upgradeUrl} style={s.btnOutline}>Upgrade My Ticket</a>}
            </>
          )}

          {status === 'error' && (
            <>
              <div style={s.icon}><FaTimesCircle size={48} color="#e8312a" /></div>
              <h2 style={{ ...s.title, color: '#e8312a' }}>Payment Failed</h2>
              <p style={s.subtitle}>{message}</p>
              <a href="/#tickets" style={s.btn}>Try Again</a>
              <a href="/" style={s.btnOutline}>Back to Home</a>
            </>
          )}
        </div>
      </div>
    </>
  );
}