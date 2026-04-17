import { useState } from 'react';
import './FAQ.css';

const faqs = [
  {
    question: 'Can I get a refund if I can no longer attend?',
    answer: 'Yes. Refunds are available, but they are not immediate. Processing takes time based on payment channel and verification.'
  },
  {
    question: 'Is Connexa really different from regular events?',
    answer: 'Yes. This is the first Opportunity Playground in Nigeria, and it is happening in Lagos. You need to be in the room.'
  },
  {
    question: 'What time do doors open?',
    answer: 'Doors open by 8:00 AM. Please come early so you can get registered on time.'
  },
  {
    question: 'What should I bring?',
    answer: 'Come with your energy, because you are about to level up.'
  },
  {
    question: 'What is Connexa about?',
    answer: 'Connexa is where talents get connected to businesses and opportunities at the spot. It is going to be massive.'
  },
  {
    question: 'Can I buy any ticket at the gate?',
    answer: 'Only Marketplace Pass tickets will be sold at the gate. Other passes should be secured online ahead of time.'
  },
  {
    question: 'Is there parking space?',
    answer: 'Yes, there is parking space available at the venue.'
  },
  {
    question: 'Will there be refreshments?',
    answer: 'Yes, refreshments will be available during the event.'
  },
  {
    question: 'Are there speakers?',
    answer: 'There are no speakers. We have Connexers, and they will be doing something different.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq section" id="faq">
      <div className="container">
        <div className="faq-header reveal">
          <div className="section-tag">FAQ</div>
          <h2 className="section-title">
            Before You Buy, <span className="highlight-orange">Know This</span>
          </h2>
          <p>Everything attendees ask before securing their Connexa ticket.</p>
        </div>

        <div className="faq-list reveal">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className={`faq-item${isOpen ? ' open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && <p className="faq-answer">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
