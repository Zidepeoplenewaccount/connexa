import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyPayment } from '../services/api';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const reference = searchParams.get('reference');
    
    if (!reference) {
      setStatus('error');
      setMessage('No payment reference found');
      return;
    }

    // Verify payment
    handleVerification(reference);
  }, [searchParams]);

  async function handleVerification(reference) {
    try {
      const data = await verifyPayment(reference);

      if (data.status === 'success') {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage('Payment verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please contact support.');
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center'
    }}>
      {status === 'verifying' && (
        <div>
          <h1>Verifying Payment...</h1>
          <p>Please wait while we confirm your payment.</p>
        </div>
      )}

      {status === 'success' && (
        <div>
          <h1 style={{ color: '#2db84b' }}>✅ Payment Successful!</h1>
          <p>{message}</p>
          <p>Check your email for ticket details.</p>
          <a href="/" style={{ 
            display: 'inline-block', 
            marginTop: '20px',
            padding: '12px 24px',
            background: '#f5a623',
            color: '#000',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Back to Home
          </a>
        </div>
      )}

      {status === 'error' && (
        <div>
          <h1 style={{ color: '#e8312a' }}>❌ Payment Failed</h1>
          <p>{message}</p>
          <a href="/#tickets" style={{ 
            display: 'inline-block', 
            marginTop: '20px',
            padding: '12px 24px',
            background: '#f5a623',
            color: '#000',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Try Again
          </a>
        </div>
      )}
    </div>
  );
}