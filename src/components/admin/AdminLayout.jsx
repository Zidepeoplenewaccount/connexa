import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { adminLogout } from '../../services/adminApi';
import './admin.css';

export default function AdminLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
          </nav>

          <div className="admin-nav-footer">
            <a href="/">🌐 View Site</a>
            <button onClick={handleLogout}>🚪 Logout</button>
          </div>
        </aside>

        <div className="admin-content-wrapper">
          <div className="admin-page-inner">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}