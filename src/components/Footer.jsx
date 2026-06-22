import './Footer.css';
import connexaLogo from '../assets/CONNEXA_LOGO-BLACK(3).png';
import zideLogo from '../assets/IMG_6707.PNG';
import ArcLogo from '../assets/ARC_LOGO.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <img src={connexaLogo} alt="Connexa" className="footer-brand-logo" />
            <p className="footer-brand-desc">
              Connexa is an opportunity playground in Lagos, Nigeria where talents,
              business owners, brands, and decision-makers connect to real opportunities.
            </p>
            
            <p className="footer-brand-desc">
              For more info email us at
            </p>

            {/* ADD CONTACT INFO */}
            <div className="footer-contact">
              <div className="footer-contact-item email">
                <span className="footer-contact-icon">✉️</span>
                <a href="mailto:partnerships@zidepeople.com" className="footer-contact-link">
                  partnerships@zidepeople.com.
                </a>

                <a href="mailto:partnerships@zidepeople.com" className="footer-contact-link-mobile">
                  ✉️ partnerships@zidepeople.com.
                </a>
              </div>

              <div className="footer-contact-item">
                <span className="footer-contact-icon">💬</span>
                <a href="https://wa.me/+2349067756473" target="_blank" rel="noreferrer" className="footer-contact-link">
                  Chat with us
                </a>

                <a href="https://wa.me/+2349067756473" target="_blank" rel="noreferrer" className="footer-contact-link-mobile">
                  💬 Chat with us
                </a>
              </div>

              <div className="footer-contact-item">
                <span className="footer-contact-icon">📞</span>
                <a href="tel:+2348101422732" className="footer-contact-link">
                  (+234) 810 142 2732
                </a>

                <a href="tel:+2348101422732" className="footer-contact-link-mobile">
                  📞 (+234) 810 142 2732
                </a>
              </div>
            </div>

            <div className="footer-socials">
              {/*<a href="https://www.instagram.com/techexpohq" target="_blank" rel="noreferrer" className="footer-social">
                📸
              </a>
              <a href="#" className="footer-social">🎵</a>
              <a href="#" className="footer-social">🐦</a>*/}
            </div>
          </div>

          <div>
            <div className="footer-col-title">Navigate</div>
            <div className="footer-col-links">
              <a href="#about">About</a>
              <a href="#tickets">Tickets</a>
              <a href="/upgrade-ticket">Upgrade Ticket</a>
              <a href="#awards">Awards</a>
              <a href="#voting">Vote</a>
              <a href="#merch">Merch</a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Event</div>
            <div className="footer-col-links">
              <p href="#">University of Lagos Indoor Sports Hall</p>
              <p href="#">Lagos · 2026</p>
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
            Powered by
            <img src={zideLogo} alt="Zidepeople" className="footer-zide-logo" />
          </a>
        </div>
      </div>
    </footer>
  );
}
