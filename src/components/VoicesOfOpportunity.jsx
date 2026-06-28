import './VoicesOfOpportunity.css';
import { useState, useEffect } from 'react';

const quotes = [
  {
    text: "Opportunities don't always go to the most qualified person in the room. They often go to the person who is visible, prepared, and willing to take action when the opportunity appears.",
    name: 'Barr. Mosunmoluwa David-Gbemisola',
  },
  {
    text: "I didn't get where I am by having all the answers. I got here by staying curious, taking opportunities seriously and willing to learn along the way.",
    name: 'Barr. Mosunmoluwa David-Gbemisola',
  },
  {
    text: "I didn't get here because I knew the right people. I got here by consistently showing up, adding value, and creating opportunities even when none seemed available.",
    name: 'Omobolanle Adigun (THE VIBE QUEEN)',
  },
  {
    text: "Your talent may open the door, but your visibility, discipline, reputation and relationships determine how long you stay in the room. Invest in all.",
    name: 'Omobolanle Adigun (THE VIBE QUEEN)',
  },
  {
    text: "I was not always the most connected person in the room. I often had to show up where I knew no one, stay when it felt uncomfortable, and keep showing up in silence—until preparation became my loudest introduction.",
    name: 'Rt. Hon Itunuoluwa Maria Soniregun',
  },
  {
    text: "Too many people lose opportunities they prayed for because they were not prepared for the moment it finally arrived. The real work is not just getting access—it is becoming ready enough not to waste it.",
    name: 'Rt. Hon Itunuoluwa Maria Soniregun',
  },
  {
    text: "Experience gave me knowledge, but one intentional year turned me into a uniquely positioned talent.",
    name: 'Joshua Oluwadepo',
  },
  {
    text: "Talent alone is not enough. If you don't know how to connect your skills to opportunities, your expertise may remain invisible.",
    name: 'Joshua Oluwadepo',
  },
  {
    text: "I know what it means to have the skill, the idea, and the ambition, but still need clarity, language, and positioning before people take you seriously.",
    name: 'Olalekan Asani',
  },
  {
    text: "Many businesses are not ignored because they are bad. They are ignored because people cannot quickly understand what they do, why it matters, and why they should trust them.",
    name: 'Olalekan Asani',
  },
  {
    text: "If I am worth anything later, then I am worth something now. For wheat is wheat, even if people think it is grass in the beginning.",
    name: 'David Ogooluwa (Dotify)',
  },
  {
    text: "Building something valuable is hard, but making people understand it is harder, and that is where most people lose.",
    name: 'David Ogooluwa (Dotify)',
  },
  {
    text: "You don't need to have everything figured out before you start. Start with what you have, and grow as you go.",
    name: 'Adeife Oluwatomi',
  },
  {
    text: "Talent alone is not enough. If people can't see your value, they can't pay for it. Learn to position yourself.",
    name: 'Adeife Oluwatomi',
  },
  {
    text: "Cook until you become the recipe.",
    name: 'Richard Essangabasi',
  },
  {
    text: "Access is one of the major things standing between an African builder and the global stage, but if you don't have the ability to unlearn and relearn then even Access becomes useless.",
    name: 'Richard Essangabasi',
  },
  {
    text: "I believe opportunities don't just happen — they're prepared for. Through continuous learning, meaningful relationships, and intentional growth, we can position ourselves for the opportunities we hope to attract.",
    name: 'Jonathan Makinde',
  },
  {
    text: "Don't just search for opportunities. Invest in becoming the kind of person opportunities are looking for.",
    name: 'Jonathan Makinde',
  },
];

export default function VoicesOfOpportunity() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  function goTo(index) {
    setCurrent(index);
  }

  return (
    <section className="voices section" id="voices">
      <div className="container">
        <div className="voices-header reveal">
          <div className="section-tag">HEAR FROM THOSE WHO'VE BEEN THERE</div>
          <h2 className="section-title">
            Voices of Opportunity
          </h2>
        </div>

        <div className="voices-slider">
          <div className="voices-slide">
            <div className="voices-quote-mark">"</div>
            <p className="voices-quote-text">{quotes[current].text}</p>
            <div className="voices-quote-author">— {quotes[current].name}</div>
          </div>

          <div className="voices-dots">
            {quotes.map((_, i) => (
              <button
                key={i}
                className={`voices-dot ${i === current ? 'active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to quote ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
