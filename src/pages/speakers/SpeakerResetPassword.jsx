import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { speakerResetPassword } from '../../services/speakerApi';
import './speaker-portal.css';

export default function SpeakerResetPassword() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => (searchParams.get('token') || '').trim(), [searchParams]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Missing reset token. Please open the reset link from your email again.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await speakerResetPassword({ token, new_password: newPassword });
      setSuccess('Password reset successful. You can now sign in.');
      setTimeout(() => navigate('/connexers/login', { replace: true }), 1200);
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="speaker-portal-root">
      <div className="speaker-login-wrapper">
        <div className="speaker-login-box">
          <div className="speaker-login-logo">CONNEXA</div>
          <h1>Reset Connexer Password</h1>
          <p className="speaker-login-subtitle">Enter your new password to continue.</p>

          <form onSubmit={handleSubmit}>
            <div className="speaker-form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
              />
            </div>

            <div className="speaker-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
            </div>

            {error && <div className="speaker-error">{error}</div>}
            {success && <div className="speaker-info-msg">{success}</div>}

            <button type="submit" className="speaker-btn-primary" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
