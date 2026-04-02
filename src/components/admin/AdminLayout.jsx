import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { adminLogout, getDashboardStats, ADMIN_API_BASE_URL } from '../../services/adminApi';
import './admin.css';

export default function AdminLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const navigate = useNavigate();
  const location = useLocation();

  const backendHost = useMemo(() => {
    try {
      return new URL(ADMIN_API_BASE_URL).host;
    } catch {
      return ADMIN_API_BASE_URL;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const checkApiStatus = async () => {
      try {
        await getDashboardStats();
        if (mounted) setApiStatus('connected');
      } catch (error) {
        if (!mounted) return;
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          setApiStatus('auth');
          return;
        }
        setApiStatus('offline');
      }
    };

    checkApiStatus();
    const intervalId = setInterval(checkApiStatus, 30000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const statusMeta = {
    checking: { label: 'Checking API', cls: 'checking' },
    connected: { label: 'API Connected', cls: 'connected' },
    auth: { label: 'Auth Required', cls: 'auth' },
    offline: { label: 'API Offline', cls: 'offline' },
  };

  function handleLogout() {
    adminLogout();
    navigate('/admin/login');
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-root">
      <div className="admin-wrapper">
        <button 
          className="admin-mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <aside className={`admin-sidebar ${menuOpen ? 'menu-open' : ''}`}>
          <div className="admin-logo">
            <h2>Connexa</h2>
          </div>

          <nav className="admin-nav">
            <Link to="/admin/dashboard" className={isActive('/admin/dashboard') ? 'active' : ''}>
              📊 Dashboard
            </Link>
            <Link to="/admin/tickets" className={isActive('/admin/tickets') ? 'active' : ''}>
              🎟️ Tickets
            </Link>
            <Link to="/admin/candidates" className={isActive('/admin/candidates') ? 'active' : ''}>
              🏆 Candidates
            </Link>
            <Link to="/admin/votes" className={isActive('/admin/votes') ? 'active' : ''}>
              🗳️ Votes
            </Link>
            <Link to="/admin/orders" className={isActive('/admin/orders') ? 'active' : ''}>
              📦 Orders
            </Link>
            <Link to="/admin/payments" className={isActive('/admin/payments') ? 'active' : ''}>
              💳 Payments
            </Link>
            <Link to="/admin/affiliates" className={isActive('/admin/affiliates') ? 'active' : ''}>
              🔗 Affiliates
            </Link>
            <Link to="/admin/questions" className={isActive('/admin/questions') ? 'active' : ''}>
              ❓ Questions
            </Link>
            <Link to="/admin/discount-codes" className="admin-nav-link">
              🎟️ Discount Codes
            </Link>
          </nav>

          <div className="admin-nav-footer">
            <a href="/">🌐 View Site</a>
            <button onClick={handleLogout}>🚪 Logout</button>
          </div>
        </aside>

        <div className="admin-content-wrapper">
          <div className="admin-top-status-row">
            <div className={`admin-api-badge ${statusMeta[apiStatus].cls}`}>
              <span className="admin-api-dot" />
              <span>{statusMeta[apiStatus].label}</span>
              <span className="admin-api-host">{backendHost}</span>
            </div>
          </div>
          <div className="admin-page-inner">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}