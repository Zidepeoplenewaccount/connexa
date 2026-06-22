import zideLogo from '../assets/IMG_6707.PNG';

export default function PoweredBy() {
  return (
    <section className="about-powered reveal" style={{ padding: '40px 0', textAlign: 'center' }}>
      <div className="about-powered-label">Powered By</div>
      <a
        href="https://www.zidepeople.com"
        target="_blank"
        rel="noreferrer"
        className="about-powered-logo-container"
      >
        <img
          src={zideLogo}
          alt="Zidepeople"
          className="about-powered-logo"
        />
      </a>
      <p className="about-powered-tagline">"The future of flexible work"</p>
    </section>
  );
}
