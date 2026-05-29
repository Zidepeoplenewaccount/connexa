import { useState } from 'react';
import './FAQ.css';

const faqs = [
  {
    question: 'Can I get a refund if I can no longer attend?',
    answer: 'Yes. Refunds are available, but they are not immediate. Processing takes time based on payment channel and verification.'
  },
  {
    question: 'Is Connexa really different from regular events?',
    answer: 'Yes. Connexa is an opportunity playground in Lagos, Nigeria where people connect to real opportunities, not just conversations.'
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
    answer: 'Connexa is an opportunity playground in Lagos where you meet the right people, discover new paths, and access real opportunities in Nigeria.'
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
    answer: 'Refreshments are available for certain ticket types.'
  },
  {
    question: 'Are there speakers?',
    answer: 'There are no speakers. We have Connexers, and they will be doing something different.'
  },
  {
    question: 'Can I earn before the event?',
    answer: 'Yes. Sign up to be an affiliate and earn by referring ticket buyers before the event.'
  },
  {
    question: 'How many vendors are allowed on the playground?',
    answer: 'It is limited because not all vendors are Connexa vendors. Vendor slots are curated and capped.'
  },
  {
    question: 'Why are there different tickets?',
    answer: 'Different tickets are designed for different goals inside the Opportunity Playground, from direct sales to business growth and career opportunities.'
  },
  {
    question: 'What is the difference between Business Owner and Vendor tickets?',
    answer: 'Business Owners are coming primarily to learn and grow. Vendors are coming to learn and also sell.'
  },
  {
    question: 'When will ticket sales close?',
    answer: 'Tickets close one month before the event so the team can prepare properly, though sales may reopen in special circumstances.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq section" id="faq">
      <div className="container">
        <div className="faq-header reveal">
          <div className="section-tag">FAQ</div>
          <h2 className="section-title faq-title">FAQ</h2>
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
