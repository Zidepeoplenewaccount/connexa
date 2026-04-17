import { useEffect, useState } from 'react';
import './Loader.css';

export default function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const MIN_SHOW = 1200; // always show for at least 1.2s so it doesn't flash
    const start = Date.now();

    function dismiss() {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_SHOW - elapsed);
      setTimeout(() => setHidden(true), remaining);
    }

    if (document.readyState === 'complete') {
      dismiss();
    } else {
      window.addEventListener('load', dismiss, { once: true });
      // Fallback: never block longer than 5s on very slow connections
      const fallback = setTimeout(() => setHidden(true), 5000);
      return () => {
        window.removeEventListener('load', dismiss);
        clearTimeout(fallback);
      };
    }
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


