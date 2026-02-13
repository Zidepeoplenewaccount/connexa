import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Tickets', href: '#tickets' },
    { label: 'Awards', href: '#awards' },
    { label: 'Vote', href: '#voting' },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container navbar-inner">
          <a href="#" className="navbar-logo">
          </a>

          <div className="navbar-links">
            {navLinks.map(link => (
              <a key={link.label} href={link.href}>{link.label}</a>
            ))}
            <a href="#tickets" className="navbar-cta">Get Tickets</a>
          </div>

          <button
            className="navbar-hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`navbar-mobile${mobileOpen ? ' open' : ''}`}>
        <button
          className="navbar-mobile-close"
          onClick={() => setMobileOpen(false)}
        >
          ×
        </button>
        {navLinks.map(link => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#tickets"
          onClick={() => setMobileOpen(false)}
          style={{ color: 'var(--orange)' }}
        >
          Get Tickets →
        </a>
      </div>
    </>
  );
}
