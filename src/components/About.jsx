import './About.css';

const contrasts = [
  { other: 'You sit and listen.', connexa: 'You meet people and take part.' },
  { other: 'You exchange contacts and hope.', connexa: 'You discover people, brands and real opportunities face to face.' },
  { other: 'You leave with notes.', connexa: 'You leave with new conversations, ideas, connections and possibilities.' },
];

const highlights = [
  { title: 'Meet businesses', desc: 'Talk directly with founders, brands and people building things.' },
  { title: 'Show what you can do', desc: 'Bring your talent, ideas, products or services into the room.' },
  { title: 'Learn by engaging', desc: 'Get practical insights from people who have built their own paths.' },
  { title: 'Buy, sell and discover', desc: 'Explore the marketplace, find new brands and create opportunities.' },
];

export default function About() {
  return (
    <section className="about section conversion-about" id="about">
      <div className="container">
        <div className="conversion-section-heading">
          <p className="section-tag">So, what is CONNEXA?</p>
          <h2 className="section-title">Not another event where you just <span>sit and listen.</span></h2>
          <p>CONNEXA is a live, interactive Opportunity Playground where talent meets businesses face to face, in one room, on one day.</p>
        </div>
        <div className="conversion-contrast-grid">
          <article className="conversion-contrast-card conversion-contrast-muted">
            <span className="conversion-card-kicker">THE USUAL EVENT</span>
            <h3>Listen. Clap. Go home.</h3>
            {contrasts.map((item) => <p key={item.other}><span aria-hidden="true">−</span>{item.other}</p>)}
          </article>
          <article className="conversion-contrast-card conversion-contrast-highlight">
            <span className="conversion-card-kicker">THE CONNEXA EXPERIENCE</span>
            <h3>Meet. Explore. Make it happen.</h3>
            {contrasts.map((item) => <p key={item.connexa}><span aria-hidden="true">✓</span>{item.connexa}</p>)}
          </article>
        </div>
        <div className="conversion-benefit-grid">
          {highlights.map((item, index) => (
            <article className="conversion-benefit" key={item.title}>
              <span className="conversion-benefit-number">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
        <div className="conversion-inline-cta"><a href="#tickets" className="conversion-text-link">Find your pass and be in the room <span aria-hidden="true">→</span></a></div>
      </div>
    </section>
  );
}
