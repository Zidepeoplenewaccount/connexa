import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyPayment } from '../services/api';

export default function MerchSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false);

  useEffect(() => {
    const reference = searchParams.get('reference');
    
    if (!reference) {
      setStatus('error');
      setMessage('No payment reference found');
      return;
    }

    if (!hasVerified.current) {
      hasVerified.current = true;
      handleVerification(reference);
    }
  }, [searchParams]);

  async function handleVerification(reference) {
    try {
      const data = await verifyPayment(reference);

      if (data.status === 'success' || data.status === 'already_processed') {
        setStatus('success');
        setMessage(data.message || 'Order placed successfully!');
      } else {
        setStatus('error');
        setMessage('Order verification failed');
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
          <h1>Verifying Order...</h1>
          <p>Please wait while we confirm your order.</p>
        </div>
      )}

      {status === 'success' && (
        <div>
          <h1 style={{ color: '#2db84b' }}>✅ Order Successful!</h1>
          <p>{message}</p>
          <p>Check your email for order details.</p>
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
          <h1 style={{ color: '#e8312a' }}>❌ Order Failed</h1>
          <p>{message}</p>
          <a href="/#merch" style={{ 
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