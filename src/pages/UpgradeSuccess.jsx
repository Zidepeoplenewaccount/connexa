import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../services/api';

export default function UpgradeSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const reference = searchParams.get('reference');

    if (!reference) {
      setStatus('error');
      setMessage('No payment reference found');
      return;
    }

    async function verify() {
      try {
        const response = await verifyPayment(reference);
        
        if (response.status === 'success' || response.status === 'already_processed') {
          setStatus('success');
          setMessage(response.message || 'Ticket upgraded successfully!');
        } else {
          setStatus('error');
          setMessage('Upgrade verification failed');
        }
      } catch (error) {
        console.error('Upgrade verification error:', error);
        setStatus('error');
        setMessage('Failed to verify upgrade');
      }
    }

    verify();
  }, [searchParams]);

  if (status === 'verifying') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--white)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Verifying upgrade...</h1>
          <p>Please wait</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--white)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '40px' }}>
          <h1 style={{ color: 'var(--red)', marginBottom: '20px' }}>❌ Upgrade Failed</h1>
          <p style={{ marginBottom: '30px' }}>{message}</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '12px 32px',
              background: 'var(--orange)',
              color: 'var(--black)',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg)',
      color: 'var(--white)'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '40px' }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: 'var(--green)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '60px',
          margin: '0 auto 30px'
        }}>
          ✓
        </div>
        <h1 style={{ color: 'var(--green)', marginBottom: '20px', fontSize: '2.5rem' }}>
          Upgrade Successful! 🎉
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '20px', lineHeight: '1.7' }}>
          Your ticket has been upgraded successfully! Check your email for the updated ticket.
        </p>
        <p style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
          {message}
        </p>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '16px 40px',
            background: 'var(--orange)',
            color: 'var(--black)',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '800',
            fontSize: '16px',
            textTransform: 'uppercase',
            cursor: 'pointer'
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}