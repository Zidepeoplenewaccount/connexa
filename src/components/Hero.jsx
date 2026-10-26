import './Hero.css';

export default function Hero() {
  return (
    <section className="hero conversion-hero" id="home">
      <div className="conversion-hero-glow" aria-hidden="true" />
      <div className="hero-content conversion-hero-content">
        <div className="hero-badge"><span className="hero-badge-dot" /> Lagos, Nigeria · 28 November 2026</div>
        <p className="conversion-eyebrow">AFRICA'S FIRST OPPORTUNITY PLAYGROUND</p>
        <h1 className="hero-title conversion-hero-title">Your next opportunity could be <span>in this room.</span></h1>
        <p className="hero-description conversion-hero-description">
          CONNEXA brings talent and businesses together face to face for one powerful day of discovering opportunities, meeting the people who can move you forward, shopping, selling and making things happen.
        </p>
        <div className="conversion-hero-proof" aria-label="Event highlights">
          <span><strong>2,000+</strong> people expected</span>
          <span><strong>₦1 million</strong> in prizes</span>
          <span><strong>20+</strong> Connexers & Playgrounders</span>
        </div>
        <a href="#tickets" className="btn-primary conversion-primary-cta">Get Your Ticket <span aria-hidden="true">→</span></a>
        <p className="conversion-hero-note">Saturday, 28 November 2026 · UNILAG Indoor Sports Hall, Akoka · Doors open 8 AM</p>
      </div>
    </section>
  );
}
