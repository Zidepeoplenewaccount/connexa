import { useEffect, useRef, useState } from 'react';

const melody = [261.63, 329.63, 392.00, 329.63, 293.66, 349.23, 440.00, 349.23];

export default function FloatingControls() {
  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const musicTimerRef = useRef(null);
  const noteIndexRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setShowBackToTop(window.scrollY > 420);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateScrollState);
      if (musicTimerRef.current) window.clearInterval(musicTimerRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playNote = (context, master, frequency) => {
    const oscillator = context.createOscillator();
    const noteGain = context.createGain();
    const now = context.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.055, now + 0.06);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);
    oscillator.connect(noteGain);
    noteGain.connect(master);
    oscillator.start(now);
    oscillator.stop(now + 0.62);
  };

  const toggleMusic = async () => {
    if (isPlaying) {
      if (musicTimerRef.current) window.clearInterval(musicTimerRef.current);
      musicTimerRef.current = null;
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        await audioContextRef.current.close();
      }
      audioContextRef.current = null;
      masterGainRef.current = null;
      setIsPlaying(false);
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('Web Audio is unavailable in this browser.');
      const context = new AudioContextClass();
      const master = context.createGain();
      master.gain.setValueAtTime(0.72, context.currentTime);
      master.connect(context.destination);
      await context.resume();

      audioContextRef.current = context;
      masterGainRef.current = master;
      noteIndexRef.current = 0;
      playNote(context, master, melody[noteIndexRef.current]);
      noteIndexRef.current = 1;
      musicTimerRef.current = window.setInterval(() => {
        if (context.state !== 'running') return;
        playNote(context, master, melody[noteIndexRef.current]);
        noteIndexRef.current = (noteIndexRef.current + 1) % melody.length;
      }, 560);
      setIsPlaying(true);
    } catch (error) {
      console.error('Connexa music could not start:', error);
      setIsPlaying(false);
    }
  };

  return (
    <>
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
