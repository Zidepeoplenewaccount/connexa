import { useEffect, useState } from 'react';
import './Loader.css';

export default function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const MIN_SHOW = 950;
    const start = Date.now();
    let dismissTimer;
    let fallbackTimer;

    function dismiss() {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_SHOW - elapsed);
      dismissTimer = setTimeout(() => {
        requestAnimationFrame(() => {
          setHidden(true);
        });
      }, remaining);
    }

    if (document.readyState === 'complete') {
      dismiss();
    } else {
      window.addEventListener('load', dismiss, { once: true });
      fallbackTimer = setTimeout(() => setHidden(true), 4500);
    }

    return () => {
      window.removeEventListener('load', dismiss);
      clearTimeout(dismissTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <div className={`loader-overlay${hidden ? ' hidden' : ''}`}>
      <div className="loader-blocks">
        <div className="loader-block" />
        <div className="loader-block" />
        <div className="loader-block" />
        <div className="loader-block" />
        <div className="loader-block" />
        <div className="loader-block" />
      </div>
      <p className="loader-text">Connexa 2026</p>
    </div>
  );
}


