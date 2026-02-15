import './Footer.css';
import connexaLogo from '../assets/CONNEXA_LOGO-BLACK(3).png';
import zideLogo from '../assets/IMG_5735.PNG';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <img src={connexaLogo} alt="Connexa" className="footer-brand-logo" />
            <p className="footer-brand-desc">
              Lagos' most energetic one-day business event. Where vendors sell,
              brands grow, and opportunities happen in real time.
            </p>
            <div className="footer-socials">
              <a href="https://www.instagram.com/techexpohq" target="_blank" rel="noreferrer" className="footer-social">
                📸
              </a>
              <a href="#" className="footer-social">🎵</a>
              <a href="#" className="footer-social">🐦</a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Navigate</div>
            <div className="footer-col-links">
              <a href="#about">About</a>
              <a href="#tickets">Tickets</a>
              <a href="#awards">Awards</a>
              <a href="#voting">Vote</a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Event</div>
            <div className="footer-col-links">
              <a href="#">Lagos Island</a>
              <a href="#">2026</a>
              <a href="#">Contact Us</a>
              <a href="#">Become a Sponsor</a>
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2026 Connexa. All rights reserved.
          </div>

          <div className="footer-colors">
            <div className="footer-color-dot" style={{ background: 'var(--red)' }} />
            <div className="footer-color-dot" style={{ background: 'var(--orange)' }} />
            <div className="footer-color-dot" style={{ background: 'var(--green)' }} />
            <div className="footer-color-dot" style={{ background: 'var(--blue)' }} />
          </div>

          <a href="https://www.zidepeople.com/" target="_blank" rel="noreferrer" className="footer-powered">
            Organised by
            <img src={zideLogo} alt="Zidepeople" className="footer-zide-logo" />
          </a>
        </div>
      </div>
    </footer>
  );
}
