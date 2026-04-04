import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { speakerLogin } from '../../services/speakerApi';
import './speaker-portal.css';

export default function SpeakerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await speakerLogin(email.trim(), password);
      navigate('/speakers/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="speaker-portal-root">
      <div className="speaker-login-wrapper">
        <div className="speaker-login-box">
          <div className="speaker-login-logo">CONNEXA</div>
          <h1>Speaker Portal</h1>
          <p className="speaker-login-subtitle">Log in with the credentials provided to you</p>

          <form onSubmit={handleSubmit}>
            <div className="speaker-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="speaker-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            {error && <div className="speaker-error">{error}</div>}

            <button type="submit" className="speaker-btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="speaker-login-footer">
            Don't have an account? Contact the Connexa team.
          </p>
        </div>
      </div>
    </div>
  );
}
