import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyPayment } from '../services/api';  // Use verifyPayment

export default function VoteSuccess() {
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
        const voteCount = data.tickets?.filter(t => t.type === 'vote').length || 1;
        setMessage(`${voteCount} vote(s) cast successfully!`);
      } else {
        setStatus('error');
        setMessage('Vote verification failed');
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
          <h1>Verifying Vote...</h1>
          <p>Please wait while we confirm your vote.</p>
        </div>
      )}

      {status === 'success' && (
        <div>
          <h1 style={{ color: '#2db84b' }}>✅ Vote Successful!</h1>
          <p>{message}</p>
          <p>Thank you for supporting your favorite!</p>
          <a href="/#voting" style={{ 
            display: 'inline-block', 
            marginTop: '20px',
            padding: '12px 24px',
            background: '#f5a623',
            color: '#000',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Back to Voting
          </a>
        </div>
      )}

      {status === 'error' && (
        <div>
          <h1 style={{ color: '#e8312a' }}>❌ Vote Failed</h1>
          <p>{message}</p>
          <a href="/#voting" style={{ 
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