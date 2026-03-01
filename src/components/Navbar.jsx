import { useState, useEffect } from 'react';
import connexaLogo from '../assets/CONNEXA_LOGO-BLACK(3)-Photoroom.png';
import './Navbar.css';
//CONNEXA_LOGO-BLACK(3)-Photoroom.png

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
    { label: 'Merch', href: '#merch' },
    { label: 'Become A Sponsor', href: '#partner-form' },
  ];

  const navLinksMobile = [
    { label: 'About', href: '#about' },
    { label: 'Awards', href: '#awards' },
    { label: 'Vote', href: '#voting' },
    { label: 'Merch', href: '#merch' },
    { label: 'Become A Sponsor', href: '#partner-form' },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}${mobileOpen ? ' open' : ''}`}>
        <div className="container navbar-inner">
          <a href="#" className="navbar-logo">
            <img src={connexaLogo} alt="Connexa" />
          </a>

          <div className="navbar-links">
            {navLinks.map(link => (
              <a key={link.label} href={link.href}>{link.label}</a>
            ))}
            <a href="#tickets" className="navbar-cta">Get Tickets</a>
          </div>

          <button
            className={`navbar-hamburger${mobileOpen ? ' open' : ''}`}
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
        {navLinksMobile.map(link => (
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
