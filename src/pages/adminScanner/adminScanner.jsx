import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { getAllTickets } from '../../services/adminApi';
import '../../components/admin/admin.css';
import './adminScanner.css';

export default function AdminScanner() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [scannerName, setScannerName] = useState(
    localStorage.getItem('scanner_name') || ''
  );
  const [showNameInput, setShowNameInput] = useState(!localStorage.getItem('scanner_name'));
  
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  function saveScannerName() {
    if (scannerName.trim()) {
      localStorage.setItem('scanner_name', scannerName.trim());
      setShowNameInput(false);
    }
  }

  async function fetchTickets() {
    try {
      setLoading(true);
      const data = await getAllTickets();
      setTickets(data.attendees);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  }

  function startScanning() {
    setScanning(true);
    setScanResult(null);
    setScanError('');
    setShowSuccess(false);

    setTimeout(() => {
      if (scannerRef.current && !html5QrCodeRef.current) {
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          false
        );

        scanner.render(onScanSuccess, onScanFailure);
        html5QrCodeRef.current = scanner;
      }
    }, 100);
  }

  function stopScanning() {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.clear();
      html5QrCodeRef.current = null;
    }
    setScanning(false);
  }

  async function onScanSuccess(decodedText, decodedResult) {
    console.log(`QR Code detected: ${decodedText}`);
    
    // Stop scanner immediately
    stopScanning();
    
    // Scan the ticket
    await scanTicket(decodedText);
  }

  function onScanFailure(error) {
    // Don't log errors, they happen constantly during scanning
  }

  
   async function scanTicket(ticketId) {
        try {
            // Get scanner name from localStorage or use default
            const scannerName = localStorage.getItem('scanner_name') || 'Scanner Staff';
            
            const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL || 'http://10.250.9.87:8000'}/tickets/${ticketId}/scan?scanned_by=${encodeURIComponent(scannerName)}`, 
            {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('admin_token')
                }
            }
            );

            const data = await response.json();

            if (response.ok) {
            // Success!
            setScanResult(data.ticket);
            setScanError('');
            setShowSuccess(true);
            
            // Play success sound (optional)
            //const audio = new Audio('/success-beep.mp3');
            //audio.play().catch(() => {});
            
            // Refresh ticket list
            fetchTickets();
            
            // Hide success animation after 3 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
            } else {
            // Error
            setScanError(data.detail || 'Scan failed');
            setScanResult(null);
            setShowSuccess(false);
            }
        } catch (error) {
            console.error('Scan error:', error);
            setScanError('❌ NETWORK ERROR - Unable to connect to server. Please check your internet connection.');
            setScanResult(null);
            setShowSuccess(false);
        }
    }

  function exportTickets() {
    const dataStr = JSON.stringify(tickets, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `connexa_tickets_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_role');
    window.location.href = '/admin/login';
  }

  const checkedInCount = tickets ? tickets?.filter(t => t.scanned_at !== null).length : 0;
  const totalCount = tickets ? tickets?.length : 0;

  return (
    <div className="scanner-container">
      {/* Header */}
       <div className="scanner-header">
        <div>
          <h1>🎫 Connexa 2026 Scanner</h1>
          {!showNameInput && (
            <small style={{ color: 'rgba(255,255,255,0.6)' }}>
              Scanning as: <strong style={{ color: 'var(--orange)' }}>{scannerName}</strong>
              {' '}
              <button 
                onClick={() => setShowNameInput(true)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--orange)', 
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '12px'
                }}
              >
                (change)
              </button>
            </small>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={exportTickets} className="scanner-btn scanner-btn-secondary">
            📥 Export JSON
          </button>
          <button onClick={logout} className="scanner-btn scanner-btn-secondary">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Scanner Name Input Modal */}
      {showNameInput && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#1a1a1a',
            border: '2px solid var(--orange)',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '16px' }}>Enter Your Name</h2>
            <p style={{ marginBottom: '24px', color: 'rgba(255,255,255,0.6)' }}>
              This will be recorded with each scan
            </p>
            <input
              type="text"
              value={scannerName}
              onChange={(e) => setScannerName(e.target.value)}
              placeholder="e.g., John Smith"
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '16px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px'
              }}
              autoFocus
            />
            <button 
              onClick={saveScannerName}
              className="scanner-btn scanner-btn-primary"
              style={{ width: '100%' }}
              disabled={!scannerName.trim()}
            >
              Start Scanning
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="scanner-stats">
        <div className="scanner-stat-card">
          <div className="scanner-stat-value">{checkedInCount}</div>
          <div className="scanner-stat-label">Checked In</div>
        </div>
        <div className="scanner-stat-card">
          <div className="scanner-stat-value">{totalCount - checkedInCount}</div>
          <div className="scanner-stat-label">Pending</div>
        </div>
        <div className="scanner-stat-card">
          <div className="scanner-stat-value">{totalCount}</div>
          <div className="scanner-stat-label">Total Tickets</div>
        </div>
      </div>

      {/* Scanner Section */}
      <div className="scanner-section">
        {!scanning ? (
          <button onClick={startScanning} className="scanner-btn scanner-btn-primary">
            📷 Start Scanning
          </button>
        ) : (
          <div>
            <div id="qr-reader" ref={scannerRef}></div>
            <button onClick={stopScanning} className="scanner-btn scanner-btn-danger" style={{ marginTop: '16px' }}>
              ❌ Stop Scanning
            </button>
          </div>
        )}

        {/* Success Animation */}
        {showSuccess && scanResult && (
          <div className="scan-success-overlay">
            <div className="scan-success-card">
              <div className="scan-success-icon">✅</div>
              <h2 style={{ color: '#2db84b', marginBottom: '24px' }}>ENTRY APPROVED!</h2>
              <div className="scan-ticket-info">
                <div className="scan-info-row">
                  <span className="scan-info-label">Ticket ID:</span>
                  <span className="scan-info-value">{scanResult.ticket_id}</span>
                </div>
                <div className="scan-info-row">
                  <span className="scan-info-label">Name:</span>
                  <span className="scan-info-value">{scanResult.attendee_name}</span>
                </div>
                <div className="scan-info-row">
                  <span className="scan-info-label">Email:</span>
                  <span className="scan-info-value">{scanResult.buyer_email}</span>
                </div>
                <div className="scan-info-row">
                  <span className="scan-info-label">Type:</span>
                  <span className="scan-info-value">{scanResult.ticket_type}</span>
                </div>
                {scanResult.business_name && (
                  <div className="scan-info-row">
                    <span className="scan-info-label">Business:</span>
                    <span className="scan-info-value">{scanResult.business_name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {scanError && (
          <div className="scan-error-card">
            <h3 style={{ color: '#e8312a', marginBottom: '12px' }}>SCAN FAILED</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{scanError}</p>
            <button 
              onClick={() => {
                setScanError('');
                startScanning();
              }} 
              className="scanner-btn scanner-btn-primary"
              style={{ marginTop: '16px' }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Tickets Table */}
      <div className="scanner-table-section">
        <h2>All Tickets</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                    <th>Ticket ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Scanned At</th>
                    <th>Scanned By</th>
                </tr>
                </thead>
                <tbody>
                {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                    <td>
                        <code style={{ 
                        background: 'rgba(245,166,35,0.2)', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        fontSize: '12px'
                        }}>
                        {ticket.ticket_id}
                        </code>
                    </td>
                    <td>{ticket.attendee_name}</td>
                    <td>{ticket.buyer_email}</td>
                    <td><small>{ticket.ticket_type}</small></td>
                    <td>
                        {ticket.scanned_at ? (
                        <span style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: 'rgba(45,184,75,0.15)',
                            color: '#2db84b'
                        }}>
                            ✅ Checked In
                        </span>
                        ) : (
                        <span style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: 'rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.5)'
                        }}>
                            ⏳ Pending
                        </span>
                        )}
                    </td>
                    <td>
                        {ticket.scanned_at ? new Date(ticket.scanned_at).toLocaleString() : '—'}
                    </td>
                    <td>
                        {ticket.scanned_by || '—'}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}