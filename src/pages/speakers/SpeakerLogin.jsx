import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { speakerLogin, speakerSignup, speakerForgotPassword } from '../../services/speakerApi';
import { getUserFriendlyError, logTechnicalError } from '../../utils/errorMessages';
import './speaker-portal.css';

export default function SpeakerLogin() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isSignup = mode === 'signup';

  async function handleSubmit(e) {
    e.preventDefault();
    const debugApi =
      window.__CONNEXA_WEB_DEBUG__ ||
      window.__ZIDE_ADMIN_WEB_DEBUG__ ||
      window.__ZIDE_WEB_DEBUG__;
    setError('');
    setLoading(true);

    debugApi?.addManualLog?.({
      tag: 'REGISTRATION',
      level: 'info',
      phase: 'manual_intent',
      message: isSignup ? 'Speaker signup initiated' : 'Speaker login initiated',
      payload: {
        mode,
        email_domain: email.includes('@') ? email.split('@')[1] : null,
      },
    });

    try {
      if (isSignup) {
        const normalizedCode = discountCode.trim().toUpperCase().replace(/\s+/g, '-');
        await speakerSignup({
          name: name.trim(),
          email: email.trim(),
          password,
          discount_code: normalizedCode,
        });
      } else {
        await speakerLogin(email.trim(), password);
      }
      debugApi?.addManualLog?.({
        tag: 'REGISTRATION',
        level: 'info',
        phase: 'manual_result',
        message: isSignup ? 'Speaker signup successful' : 'Speaker login successful',
        payload: { mode },
      });
      navigate('/connexers/dashboard');
    } catch (err) {
      logTechnicalError(err, 'SPEAKER_LOGIN_OR_SIGNUP');
      debugApi?.addManualLog?.({
        tag: 'REGISTRATION',
        level: 'error',
        phase: 'manual_error',
        message: isSignup ? 'Speaker signup failed' : 'Speaker login failed',
        payload: {
          mode,
          error: err?.message || 'unknown_error',
        },
      });
      setError(getUserFriendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError('');
    setForgotMessage('');
    setShowForgotPassword(false);
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    const debugApi =
      window.__CONNEXA_WEB_DEBUG__ ||
      window.__ZIDE_ADMIN_WEB_DEBUG__ ||
      window.__ZIDE_WEB_DEBUG__;
    setError('');
    setForgotMessage('');
    setForgotLoading(true);

    debugApi?.addManualLog?.({
      tag: 'REGISTRATION',
      level: 'info',
      phase: 'manual_intent',
      message: 'Speaker forgot-password initiated',
      payload: {
        email_domain: (forgotEmail || email).includes('@')
          ? (forgotEmail || email).split('@')[1]
          : null,
      },
    });

    try {
      await speakerForgotPassword((forgotEmail || email).trim());
      debugApi?.addManualLog?.({
        tag: 'REGISTRATION',
        level: 'info',
        phase: 'manual_result',
        message: 'Speaker forgot-password request sent',
      });
      setForgotMessage('If this email is registered, a reset link has been sent.');
    } catch (err) {
      logTechnicalError(err, 'SPEAKER_FORGOT_PASSWORD');
      debugApi?.addManualLog?.({
        tag: 'REGISTRATION',
        level: 'error',
        phase: 'manual_error',
        message: 'Speaker forgot-password failed',
        payload: {
          error: err?.message || 'unknown_error',
        },
      });
      setError(getUserFriendlyError(err));
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="speaker-portal-root">
      <div className="speaker-login-wrapper">
        <div className="speaker-login-box">
          <div className="speaker-login-logo">CONNEXA</div>
          <h1>{isSignup ? 'Create Connexer Account' : 'Connexer Portal'}</h1>
          <p className="speaker-login-subtitle">
              {isSignup 
                ? 'Choose your code once.'
              : 'Log in to access your connexer dashboard.'}
          </p>

          <div className="speaker-auth-switch">
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => switchMode('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => switchMode('signup')}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="speaker-form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                />
              </div>
            )}

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

            {isSignup && (
              <div className="speaker-form-group">
                <label htmlFor="discountCode">Your Discount Code</label>
                <input
                  id="discountCode"
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SPK-ANNA01"
                  required
                  minLength={4}
                  maxLength={30}
                />
                <small className="speaker-field-help">Only letters, numbers and dashes are allowed.</small>
              </div>
            )}

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

            {!isSignup && (
              <div className="speaker-forgot-wrap">
                <button
                  type="button"
                  className="speaker-forgot-btn"
                  onClick={() => { setShowForgotPassword((prev) => !prev); setForgotMessage(''); }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {!isSignup && showForgotPassword && (
              <div className="speaker-forgot-box">
                <form onSubmit={handleForgotPassword}>
                  <div className="speaker-form-group" style={{ marginBottom: 12 }}>
                    <label htmlFor="forgotEmail">Reset Email</label>
                    <input
                      id="forgotEmail"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <button type="submit" className="speaker-btn-outline-full" disabled={forgotLoading}>
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
                {forgotMessage && <div className="speaker-info-msg">{forgotMessage}</div>}
              </div>
            )}

            {error && <div className="speaker-error">{error}</div>}

            <button type="submit" className="speaker-btn-primary" disabled={loading}>
              {loading ? (isSignup ? 'Creating account...' : 'Signing in...') : (isSignup ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <p className="speaker-login-footer">
            {isSignup
              ? 'Already have a connexer account? Switch to Sign In.'
              : 'No account yet? Switch to Sign Up and create one.'}
          </p>
        </div>
      </div>
    </div>
  );
}
