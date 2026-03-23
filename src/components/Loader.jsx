import { useEffect, useState } from 'react';
import './Loader.css';

export default function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
    }, 2200);
    return () => clearTimeout(timer);
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


