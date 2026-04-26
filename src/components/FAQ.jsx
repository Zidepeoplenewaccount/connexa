import { useState } from 'react';
import './FAQ.css';

const faqs = [
  {
    question: 'What is Connexa?',
    answer: 'Connexa is a high-impact networking event in Lagos, Nigeria where founders, creatives, professionals, and job seekers meet the right people and get real opportunities.'
  },
  {
    question: 'Where is Connexa happening?',
    answer: 'Connexa is happening at the University of Lagos, Lagos, Nigeria.'
  },
  {
    question: 'Who should attend Connexa?',
    answer: 'Founders, entrepreneurs, students, freelancers, professionals, vendors, and anyone who wants to grow faster through quality connections should attend Connexa.'
  },
  {
    question: 'How can I buy Connexa tickets?',
    answer: 'Go to the ticket section and click Secure Your Ticket Now. Pick your pass, fill your details, and complete payment online.'
  },
  {
    question: 'Is Connexa worth attending?',
    answer: 'Yes. If you want to meet the right people, discover opportunities, and grow your network in Lagos, Connexa is worth attending.'
  },
  {
    question: 'Can I get a refund if I can no longer attend?',
    answer: 'Yes. Refunds are available, but they are not immediate. Processing takes time based on payment channel and verification.'
  },
  {
    question: 'Is Connexa really different from regular events?',
    answer: 'Yes. This is the first Opportunity Playground in Nigeria, and it is happening in Lagos. You need to be in the playground.'
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
    answer: 'Different tickets are designed for different experiences inside the Opportunity Playground.'
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
