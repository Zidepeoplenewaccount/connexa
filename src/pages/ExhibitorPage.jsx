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
        'Exhibit at Connexa Lagos 2026 to meet new customers, sell on the spot, build brand visibility and learn practical ways to grow your small business. Compare vendor passes for 28 November in Lagos.'
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
            <p className="exhibitor-eyebrow">FOR VENDORS, SMALL BUSINESSES & GROWING BRANDS · 28 NOVEMBER 2026</p>
            <h1>Don't just attend the event.<br /><span>Put your business in front of new customers.</span></h1>
            <p className="exhibitor-hero-copy">
              Connexa is a live Opportunity Playground where people come to discover businesses, learn practical ideas, meet new people and make things happen. Exhibit to show what you sell, talk directly to potential customers, make sales on the day and leave with connections you can follow up on.
            </p>
            <div className="exhibitor-hero-actions">
              <a className="exhibitor-primary-cta" href="#tickets">Find Your Vendor Pass <span aria-hidden="true">→</span></a>
              <a className="exhibitor-secondary-cta" href="#why-exhibit">Why exhibit at Connexa?</a>
            </div>
            <div className="exhibitor-event-facts">
              <div><span>WHEN</span><strong>Saturday, 28 November 2026</strong></div>
              <div><span>WHERE</span><strong>UNILAG Indoor Sports Hall, Akoka, Lagos</strong></div>
              <div><span>YOUR GOAL</span><strong>Learn, sell, meet customers and grow</strong></div>
            </div>
            <p className="exhibitor-small-business-note">Whether you sell products, offer a service, run a growing SME or are building a brand, there is a space designed around how you want to show up.</p>
          </div>
        </section>

        <section className="exhibitor-benefits" id="why-exhibit">
          <div className="container">
            <div className="exhibitor-section-heading">
              <p className="exhibitor-eyebrow">MORE THAN A TABLE AT AN EVENT</p>
              <h2>Come to sell. Leave with more ways to grow.</h2>
              <p>Exhibiting at Connexa is a chance to put your business in front of people, learn from others and test what works while you are face to face with your market.</p>
            </div>
            <div className="exhibitor-benefit-grid">
              <article><span>01</span><h3>Make sales on the spot</h3><p>Put your products or services in front of attendees, answer questions in person and make it easy for interested customers to buy from you.</p></article>
              <article><span>02</span><h3>Reach people beyond your usual circle</h3><p>Introduce your business to new customers, founders, professionals, creatives and potential collaborators you may not reach through your usual channels.</p></article>
              <article><span>03</span><h3>Let people experience your brand</h3><p>Show your product, demonstrate what it does, explain your service and give people a reason to remember your business.</p></article>
              <article><span>04</span><h3>Learn while you are selling</h3><p>Meet experienced business people and Playgrounders, hear practical ideas and take away insights you can apply to your business.</p></article>
              <article><span>05</span><h3>Build leads and relationships</h3><p>Start conversations, collect interested customers' details with their permission and create follow-up opportunities after the event.</p></article>
              <article><span>06</span><h3>Test what customers respond to</h3><p>Use real conversations and feedback to understand what catches attention, what people ask and how you can improve your offer.</p></article>
            </div>
          </div>
        </section>

        <section className="exhibitor-fit-section">
          <div className="container exhibitor-fit-inner">
            <div>
              <p className="exhibitor-eyebrow">MADE FOR BUSINESSES THAT WANT TO MOVE</p>
              <h2>Your business doesn't have to be big to be seen.</h2>
              <p>Connexa welcomes small businesses and growing brands ready to meet people and create new opportunities. You don't need a huge booth or a household name. Bring a clear offer, a way for people to pay or contact you, and the confidence to start conversations.</p>
            </div>
            <ul className="exhibitor-fit-list">
              <li><span>✓</span> Fashion, beauty and lifestyle brands</li>
              <li><span>✓</span> Food, drinks and packaged products</li>
              <li><span>✓</span> Handmade goods, crafts and accessories</li>
              <li><span>✓</span> Digital services, creative businesses and SMEs</li>
              <li><span>✓</span> Startups introducing a product or service</li>
              <li><span>✓</span> Businesses looking for customers and partnerships</li>
            </ul>
          </div>
        </section>

        <section className="exhibitor-how-section">
          <div className="container">
            <div className="exhibitor-section-heading">
              <p className="exhibitor-eyebrow">KEEP IT PRACTICAL</p>
              <h2>How to make your space work for you.</h2>
            </div>
            <div className="exhibitor-how-grid">
              <article><span>01</span><h3>Choose your goal</h3><p>Decide whether your priority is direct sales, product demonstrations, visibility or introducing your service.</p></article>
              <article><span>02</span><h3>Prepare your offer</h3><p>Bring clear pricing, payment options, samples or demonstrations where relevant, and a simple way to follow up with customers.</p></article>
              <article><span>03</span><h3>Show up ready to engage</h3><p>Start conversations, explain the value of what you offer, invite people to buy and make connections you can continue after Connexa.</p></article>
            </div>
          </div>
        </section>

        <Tickets vendorOnly />

        <section className="exhibitor-faq">
          <div className="container">
            <div className="exhibitor-section-heading">
              <p className="exhibitor-eyebrow">CHOOSE THE RIGHT SPACE</p>
              <h2>What kind of exhibitor are you?</h2>
              <p>Choose based on what you need your space to do for your business.</p>
            </div>
            <div className="exhibitor-faq-grid">
              <article className="exhibitor-pass-choice">
                <p className="exhibitor-pass-kicker">BEST FOR BRAND PRESENTATION</p>
                <h3>Showcase Vendor Pass</h3>
                <p>For brands that want to present products or services, demonstrate what they do and build visibility. A dedicated exhibition space is provided. Bring your own branded booth materials, such as banners, flyers and displays.</p>
                <ul><li>Showcase and demonstrate your offer</li><li>Build brand awareness and business connections</li><li>Maximum of 2 staff members per booth</li><li>Not suitable for large physical product displays</li></ul>
                <a href="#tickets" className="exhibitor-pass-link">View Showcase Vendor Pass <span aria-hidden="true">→</span></a>
              </article>
              <article className="exhibitor-pass-choice exhibitor-pass-choice-featured">
                <p className="exhibitor-pass-kicker">BEST FOR DIRECT SELLING</p>
                <h3>Market Vendor Pass</h3>
                <p>For vendors and small businesses who want a dedicated marketplace space to display products, meet buyers and sell during Connexa. The Connexa team provides the tent and booth setup.</p>
                <ul><li>Dedicated space to display and sell</li><li>Meet potential buyers face to face</li><li>Generate sales and leads on the day</li><li>Learn practical ideas while you sell</li></ul>
                <a href="#tickets" className="exhibitor-pass-link">View Market Vendor Pass <span aria-hidden="true">→</span></a>
              </article>
            </div>
            <div className="exhibitor-ticket-heading" id="tickets">
              <p className="exhibitor-eyebrow">RESERVE YOUR SPACE</p>
              <h2>Choose your exhibitor pass.</h2>
              <p>Review the pass details and select the option that fits your business. Spaces are limited.</p>
            </div>
            <p className="exhibitor-contact-note">Not sure which pass fits your setup? <a href="mailto:partnerships@zidepeople.com?subject=Help%20choosing%20a%20Connexa%20vendor%20pass">Talk to the Connexa team before purchasing.</a></p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
