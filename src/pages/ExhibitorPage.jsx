import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Tickets from '../components/Tickets';
import Footer from '../components/Footer';
import './ExhibitorPage.css';

export default function ExhibitorPage() {
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute('content');
    document.title = 'Exhibit at Connexa Lagos 2026 | Product Showcase & Market Vendor Passes';
    if (description) {
      description.setAttribute(
        'content',
        'Showcase your products, sell to customers, and grow your brand at Connexa Lagos 2026. Compare Showcase Vendor and Market Vendor exhibition passes for the 28 November event in Lagos.'
      );
    }
    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.setAttribute('content', previousDescription);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="exhibitor-page">
        <section className="exhibitor-hero">
          <div className="container exhibitor-hero-inner">
            <p className="exhibitor-eyebrow">CONNEXA LAGOS · 28 NOVEMBER 2026</p>
            <h1>Exhibit at Connexa Lagos 2026. <span>Showcase your products. Meet your next customers.</span></h1>
            <p className="exhibitor-hero-copy">
              Looking for an exhibition opportunity in Lagos? Bring your brand to Connexa’s Opportunity Playground at the University of Lagos Indoor Sports Hall. Meet attendees, demonstrate your products or services, make sales, and build valuable business connections.
            </p>
            <div className="exhibitor-hero-actions">
              <a className="exhibitor-primary-cta" href="#tickets">Explore Exhibitor Passes</a>
              <a className="exhibitor-secondary-cta" href="mailto:partnerships@zidepeople.com?subject=Connexa%20Lagos%202026%20Partnership%20Enquiry">Ask about partnerships</a>
            </div>
            <div className="exhibitor-event-facts">
              <div><span>DATE</span><strong>Saturday, 28 November 2026</strong></div>
              <div><span>VENUE</span><strong>University of Lagos Indoor Sports Hall, Lagos</strong></div>
              <div><span>OPTIONS</span><strong>Product showcase or direct selling</strong></div>
            </div>
          </div>
        </section>

        <section className="exhibitor-benefits">
          <div className="container">
            <div className="exhibitor-section-heading">
              <p className="exhibitor-eyebrow">YOUR BRAND, IN THE ROOM</p>
              <h2>Turn an event into a market opportunity.</h2>
              <p>Connexa brings together professionals, founders, businesses, talents, and people looking to discover products, services, and new brands.</p>
            </div>
            <div className="exhibitor-benefit-grid">
              <article><span>01</span><h3>Show what you do</h3><p>Let people experience your products or understand your services in person.</p></article>
              <article><span>02</span><h3>Meet potential buyers</h3><p>Talk directly with attendees, answer questions, and create opportunities for sales.</p></article>
              <article><span>03</span><h3>Grow your visibility</h3><p>Introduce your brand to new customers, collaborators, and business connections.</p></article>
            </div>
          </div>
        </section>

        <Tickets vendorOnly />

        <section className="exhibitor-faq">
          <div className="container">
            <div className="exhibitor-section-heading">
              <p className="exhibitor-eyebrow">BEFORE YOU BOOK</p>
              <h2>Which exhibitor pass should you choose?</h2>
            </div>
            <div className="exhibitor-faq-grid">
              <article><h3>Showcase Vendor Pass</h3><p>Choose this if your priority is brand presentation, product demonstrations, and visibility. A dedicated exhibition space is provided; bring your own branded booth materials. Not suitable for large physical product displays. Maximum two staff members per booth.</p></article>
              <article><h3>Market Vendor Pass</h3><p>Choose this if your priority is direct selling. Connexa provides the tent and booth setup, giving you a dedicated marketplace space to display and sell your products or services.</p></article>
            </div>
            <p className="exhibitor-contact-note">Need help choosing? <a href="mailto:partnerships@zidepeople.com">Contact the Connexa team</a> before purchasing.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
