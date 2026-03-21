import './Hero.css';
import { useState, useEffect } from 'react';
import zideLogo from '../assets/IMG_5735-removebg-preview2.png';
import ArcLogo from '../assets/ARC_LOGO.png';

const marqueeItems = [
  { text: 'Network', color: 'var(--orange)' },
  { text: 'Grow', color: 'var(--green)' },
  { text: 'Sell', color: 'var(--red)' },
  { text: 'Connect', color: 'var(--blue)' },
  { text: 'Build', color: 'var(--orange)' },
  { text: 'Win', color: 'var(--green)' },
  { text: 'Showcase', color: 'var(--red)' },
  { text: 'Partner', color: 'var(--blue)' },
];

// Sponsors data - add your real sponsors here
const sponsors = [
  { name: '', logo: zideLogo },
  { name: '', logo: ArcLogo },
  { name: '', logo: zideLogo },
  { name: '', logo: ArcLogo },
  { name: '', logo: zideLogo },
  { name: '', logo: ArcLogo },
];

export default function Hero() {

  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const eventDate = new Date('2026-11-28T10:00:00');

    function calculateTimeLeft() {
      const now = new Date();
      const difference = eventDate - now;

      if (difference > 0) {
        // Calculate months properly
        let years = eventDate.getFullYear() - now.getFullYear();
        let months = eventDate.getMonth() - now.getMonth();
        let days = eventDate.getDate() - now.getDate();

        // Adjust for negative days
        if (days < 0) {
          months--;
          const lastMonth = new Date(eventDate.getFullYear(), eventDate.getMonth(), 0);
          days += lastMonth.getDate();
        }

        // Adjust for negative months
        if (months < 0) {
          years--;
          months += 12;
        }

        // Total months
        const totalMonths = years * 12 + months;

        // Calculate remaining time for hours, minutes, seconds
        const hours = eventDate.getHours() - now.getHours();
        const minutes = eventDate.getMinutes() - now.getMinutes();
        const seconds = eventDate.getSeconds() - now.getSeconds();

        // Adjust hours/minutes/seconds
        let finalHours = hours;
        let finalMinutes = minutes;
        let finalSeconds = seconds;

        if (finalSeconds < 0) {
          finalSeconds += 60;
          finalMinutes--;
        }

        if (finalMinutes < 0) {
          finalMinutes += 60;
          finalHours--;
        }

        if (finalHours < 0) {
          finalHours += 24;
        }

        setTimeLeft({
          months: totalMonths,
          days: days,
          hours: Math.abs(finalHours),
          minutes: Math.abs(finalMinutes),
          seconds: Math.abs(finalSeconds)
        });
      } else {
        setTimeLeft({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <section className="hero" id="home">
        {/* Background blobs */}
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />

        {/* Floating tags */}
        <div className="hero-floating-tags">
          <div className="hero-tag hero-tag-1">🏪 Market Vendors</div>
          <div className="hero-tag hero-tag-2">💡 Startups & Brands</div>
          <div className="hero-tag hero-tag-3">🤝 Networking</div>
          <div className="hero-tag hero-tag-4">🏆 Awards & Recognition</div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Lagos · 2026
          </div>

          <h1 className="hero-title">
            <span className="highlight-red">C</span>
            <span className="highlight-orange">O</span>
            <span>NN</span>
            <span className="highlight-green">E</span>
            <span className="highlight-blue">X</span>
            <span>A</span>
          </h1>
          <span className="hero-subtitle">The Future of Flexible Work</span>

          <p className="hero-title-sub">BUSINESS · TALENT · CONNECTIONS</p>

          <p className="hero-description">
            Lagos’ most energetic business and 
            talent event, where entrepreneurs, 
            brands, and individuals connect, 
            showcase, and discover opportunities. 
            One day. Endless possibilities.
          </p>

          <div className="hero-details">
            <div className="hero-detail-item">
              <span className="hero-detail-icon">📍</span>
              <span className="hero-detail-text">Lagos, Nigeria</span>
            </div>
            <div className="hero-detail-item">
              <span className="hero-detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </span>
              <span className="hero-detail-text">28th November, 2026</span>
            </div>
            <div className="hero-detail-item">
              <span className="hero-detail-icon">🕐</span>
              <span className="hero-detail-text">10:00 AM</span>
            </div>
          </div>

          {/* Countdown */}
          <div className="hero-countdown">
            <div className="countdown-item">
              <div className="countdown-value">{timeLeft.months}</div>
              <div className="countdown-label">Months</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-value">{timeLeft.days}</div> 
              <div className="countdown-label">Days</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="countdown-label">Hours</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="countdown-label">Minutes</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="countdown-label">Seconds</div>
            </div>
          </div>

          <div className="hero-actions">
            <a href="#tickets" className="btn-primary">
              <span>Get Your Ticket →</span>
            </a>
            <a href="#partner-form" className="btn-secondary">
              Become A Sponsor
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number highlight-orange">2000+</div>
              <div className="hero-stat-label">Attendees</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number highlight-green">150</div>
              <div className="hero-stat-label">Businesses</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number highlight-blue">10</div>
              <div className="hero-stat-label">Connexers</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number highlight-red">50+</div>
              <div className="hero-stat-label">Exhibitors</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number highlight-orange">10</div>
              <div className="hero-stat-label">Industry Panels</div>
            </div>
          </div>

          {/* Sponsors Marquee */}
          <div className="hero-sponsors">
            <div className="hero-sponsors-label">SPONSORS & PARTNERS</div>
            <div className="hero-sponsors-track">
              {/* Duplicate sponsors array for infinite scroll effect */}
              {[...sponsors, ...sponsors].map((sponsor, i) => (
                <div key={i} className="hero-sponsor-item">
                  {sponsor.logo ? (
                    <img 
                      src={sponsor.logo} 
                      alt={sponsor.name} 
                      className={`hero-sponsor-logo ${sponsor.logo === zideLogo ? 'zide-logo' : 'arc-logo'}`}
                    />
                  ) : (
                    <div className="hero-sponsor-placeholder">Logo</div>
                  )}
                  <span className="hero-sponsor-text">{sponsor.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-scroll-hint">Scroll</div>
      </section>

      {/* Marquee */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="marquee-item">
              <span className="marquee-dot" style={{ background: item.color }} />
              <span style={{ color: item.color }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
