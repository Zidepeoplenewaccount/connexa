import { useState } from 'react';
import './FAQ.css';

const faqs = [
  { question: 'Why is CONNEXA different?', answer: 'CONNEXA is Africa’s first Opportunity Playground: a live, interactive experience where talent and businesses meet face to face to discover opportunities, learn, showcase, buy, sell and make useful connections. It is designed for participation, not just sitting through presentations.' },
  { question: 'Why CONNEXA in Nigeria?', answer: 'People often say there are not enough opportunities in Nigeria, and the frustration is real. But opportunities can be difficult to find when we rely only on job posts, wait to be noticed, or stay away from the people and businesses doing the work. CONNEXA brings people together to ask questions, show what they can do, learn directly from others, discover practical leads and take action. It is not a promise that every attendee will leave with a job or a deal; it is a chance to make useful moves instead of only talking about what is missing.' },
  { question: 'Is CONNEXA for me?', answer: 'If you are a student, job seeker, professional, creative, entrepreneur, freelancer, founder or business owner, there is a place for you. Choose the ticket that matches what you want to do at the Playground.' },
  { question: 'What will I get from attending?', answer: 'Your experience depends on your pass, but you can expect to meet businesses and other attendees, explore the marketplace, engage with Connexers and Playgrounders, discover ideas and opportunities, and take part in interactive experiences. Check each ticket’s inclusions before buying.' },
  { question: 'When and where is CONNEXA?', answer: 'Saturday, 28 November 2026 at the University of Lagos Indoor Sports Hall, Akoka, Lagos. Doors open at 8:00 AM.' },
  { question: 'Is there parking?', answer: 'Yes, parking is available at the venue. Allow extra time to arrive, park and complete registration.' },
  { question: 'Are there speakers?', answer: 'CONNEXA is built around Connexers and Playgrounders rather than a conventional speaker-led conference. They are real people sharing experience, answering questions and engaging directly with attendees.' },
  { question: 'Can I buy a ticket at the gate?', answer: 'We recommend securing your pass online ahead of the event to confirm your place.' },
  { question: 'What is the difference between Talent and Business Owner passes?', answer: 'The Talent passes are designed for people looking to explore opportunities and engage with businesses and Connexers. The Business Owner Pass focuses on practical business growth, sales, operations and advice. Compare the full inclusions in the ticket section before checkout.' },
  { question: 'Can I get a refund if I can no longer attend?', answer: 'Refunds are available, but processing is not immediate and may depend on the payment channel and verification. Please contact the event team if you need help with a refund.' },
  { question: 'How do I secure my place?', answer: 'Choose your pass in the ticket section, select the relevant “Get” button and complete the checkout form and payment. Keep your confirmation details for event day.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="faq section conversion-faq" id="faq">
      <div className="container">
        <div className="faq-header">
          <h2 className="section-title faq-title">Before you book.</h2>
          <p>Everything you need to feel ready to be there.</p>
        </div>
        <div className="faq-list">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className={`faq-item${isOpen ? ' open' : ''}`}>
                <button type="button" className="faq-question" onClick={() => setOpenIndex(isOpen ? -1 : index)} aria-expanded={isOpen}>
                  <span>{item.question}</span><span className="faq-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
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
