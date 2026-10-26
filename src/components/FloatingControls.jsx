import { useEffect, useRef, useState } from 'react';

export default function FloatingControls() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setShowBackToTop(window.scrollY > 420);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Connexa music could not start:', error);
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/zidepeople%20audio.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        aria-label="Connexa background music"
      />
      <button
        type="button"
        className={`connexa-music-control${isPlaying ? ' is-playing' : ''}`}
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Pause Connexa music' : 'Play Connexa music'}
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        <span className="connexa-music-icon" aria-hidden="true">{isPlaying ? 'Ⅱ' : '♫'}</span>
        <span className="connexa-music-label">{isPlaying ? 'Pause music' : 'Play music'}</span>
        {isPlaying && <span className="connexa-music-equalizer" aria-hidden="true"><i /><i /><i /></span>}
      </button>
      {showBackToTop && (
        <button
          type="button"
          className="connexa-back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          title="Back to top"
        >
          <span aria-hidden="true">↑</span>
          <span className="connexa-back-to-top-label">Back to top</span>
        </button>
      )}
    </>
  );
}
