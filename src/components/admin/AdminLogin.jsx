import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/adminApi';
import './admin.css';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const result = adminLogin(password);
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="admin-root">
      <div className="admin-login-wrapper">
        <div className="admin-login-box">
          <h1>Connexa Admin</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className="admin-error-msg">{error}</div>}
            <button type="submit">Login</button>
          </form>
          <a href="/">← Back to Website</a>
        </div>
      </div>
    </div>
  );
}