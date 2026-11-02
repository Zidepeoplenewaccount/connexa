import './About.css';

const contrasts = [
  { other: 'You sit and listen.', connexa: 'You meet people and take part.' },
  { other: 'You exchange contacts and hope.', connexa: 'You discover people, brands and real opportunities face to face.' },
  { other: 'You leave with notes.', connexa: 'You leave with new conversations, ideas, connections and possibilities.' },
];

const highlights = [
  { title: 'Opportunity matching', desc: 'Meet businesses, founders and people looking for the skills, services and ideas you can bring to the table.' },
  { title: 'Skill matching', desc: 'Put your skills in front of people who may need them. Discover where your abilities fit and turn conversations into real opportunities.' },
  { title: 'Talent and business games', desc: 'Take part in interactive challenges that get talents and businesses talking, connecting and discovering what they can do together.' },
  { title: 'Meet businesses', desc: 'Talk directly with founders, brands and decision-makers. Ask questions, introduce yourself and make connections beyond exchanging contact details.' },
  { title: 'Show what you can do', desc: 'Bring your talent, ideas, products or services into the room. Let people experience what you offer instead of just telling them about it.' },
  { title: 'Learn by engaging', desc: 'Get practical insights from people who have built businesses and created opportunities. Learn through real conversations and hands-on experiences.' },
  { title: 'Buy, sell and discover', desc: 'Explore the marketplace, meet new brands, find actual customers, make sales and discover products and services worth knowing.' },
  { title: 'Stay for the after-party', desc: 'When the activities wind down, stay back to relax, celebrate and keep the conversations going at the Connexa after-party.' },
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
        <div className="conversion-why">
          <div className="conversion-why-heading">
            <p className="section-tag">WHY PEOPLE ARE GETTING THEIR TICKETS</p>
            <h2 className="section-title">There’s a reason people want to be in this room.</h2>
          </div>
          <div className="conversion-why-grid">
            <article className="conversion-why-card">
              <h3>“It’s a first.”</h3>
              <p>People are curious about experiencing Africa’s first Opportunity Playground — a space built around participation, discovery and real connections.</p>
            </article>
            <article className="conversion-why-card">
              <h3>“I’ve been before. It led somewhere.”</h3>
              <p>People who have attended previous Zidepeople experiences have shared how the connections they made helped them find job opportunities. They’re coming back because showing up can open doors.</p>
            </article>
            <article className="conversion-why-card">
              <h3>“There’s room for everyone.”</h3>
              <p>Whether you’re a professional, creative, student, service provider, founder or business owner, there’s a place for you to meet people and explore what’s possible.</p>
            </article>
            <article className="conversion-why-card">
              <h3>“My business can grow here.”</h3>
              <p>Business owners can meet actual customers, showcase what they sell, make sales on the spot and learn from other businesses while doing business.</p>
            </article>
          </div>
        </div>
        <div className="conversion-inline-cta"><a href="#tickets" className="conversion-text-link">Find your pass and be in the room <span aria-hidden="true">→</span></a></div>
      </div>
    </section>
  );
}
