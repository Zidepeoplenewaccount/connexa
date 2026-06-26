import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaChartBar, FaTicketAlt, FaTrophy, FaVoteYea, FaBox, FaCreditCard, FaLink, FaQuestionCircle, FaMicrophone, FaCamera, FaGlobe, FaSignOutAlt, FaTags } from 'react-icons/fa';
import { adminLogout } from '../../services/adminApi';
import './admin.css';

export default function AdminLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('admin_role');

  function handleLogout() {
    adminLogout();
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_role');
    navigate('/admin/login');
  }

  if (role === 'scanner') {
    navigate('/admin/scanner');
    return null;
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
              <FaChartBar size={14} /> Dashboard
            </Link>
            <Link to="/admin/tickets" className={isActive('/admin/tickets') ? 'active' : ''}>
              <FaTicketAlt size={14} /> Tickets
            </Link>
            <Link to="/admin/candidates" className={isActive('/admin/candidates') ? 'active' : ''}>
              <FaTrophy size={14} /> Candidates
            </Link>
            <Link to="/admin/votes" className={isActive('/admin/votes') ? 'active' : ''}>
              <FaVoteYea size={14} /> Votes
            </Link>
            <Link to="/admin/orders" className={isActive('/admin/orders') ? 'active' : ''}>
              <FaBox size={14} /> Orders
            </Link>
            <Link to="/admin/payments" className={isActive('/admin/payments') ? 'active' : ''}>
              <FaCreditCard size={14} /> Payments
            </Link>
            <Link to="/admin/affiliates" className={isActive('/admin/affiliates') ? 'active' : ''}>
              <FaLink size={14} /> Affiliates
            </Link>
            <Link to="/admin/questions" className={isActive('/admin/questions') ? 'active' : ''}>
              <FaQuestionCircle size={14} /> Questions
            </Link>
            <Link to="/admin/discount-codes" className="admin-nav-link">
              <FaTags size={14} /> Discount Codes
            </Link>
            <Link to="/admin/connexers" className={isActive('/admin/connexers') ? 'active' : ''}>
              <FaMicrophone size={14} /> Connexers
            </Link>
            <Link to="/admin/scanner" className="admin-nav-link">
              <FaCamera size={14} /> Scanner
            </Link>
          </nav>

          <div className="admin-nav-footer">
            <a href="/"><FaGlobe size={14} /> View Site</a>
            <button onClick={handleLogout}><FaSignOutAlt size={14} /> Logout</button>
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