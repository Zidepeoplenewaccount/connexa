import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../components/admin/admin.css';

export default function AdminLoginFeaturePage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    if (password === 'admin123') {
      localStorage.setItem('admin_token', 'Bearer admin-secret-token');
      localStorage.setItem('admin_role', 'full');
      navigate('/admin/dashboard');
    } else if (password === 'admin000') {
      localStorage.setItem('admin_token', 'Bearer admin-secret-token');
      localStorage.setItem('admin_role', 'scanner');
      navigate('/admin/scanner');
    } else {
      setError('Invalid password');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#1a1a1a',
        border: '2px solid var(--orange)',
        borderRadius: '12px',
        padding: '48px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(245,166,35,0.2)'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '32px',
          color: 'var(--orange)',
          fontSize: '32px'
        }}>
          Admin Login
        </h1>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.7)'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px'
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              background: 'rgba(232,49,42,0.15)',
              border: '1px solid rgba(232,49,42,0.3)',
              borderRadius: '8px',
              color: '#e8312a',
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-btn"
            style={{ width: '100%', padding: '14px', fontSize: '16px' }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
