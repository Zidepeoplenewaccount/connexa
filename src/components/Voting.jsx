import { useState, useEffect } from 'react';
import './Voting.css';

const PAYSTACK_PLACEHOLDER = '';

const businessEntries = [
  {
    id: 1,
    name: 'Sample Business Co.',
    category: 'Business Award',
    desc: '',
  },
  {
    id: 2,
    name: 'Another Sample Business',
    category: 'Business Award',
    desc: '',
  },
];

const talentEntries = [
  {
    id: 3,
    name: 'Test Individual',
    category: 'Talent Award',
    desc: '',
  },
  {
    id: 4,
    name: 'Sample Professional',
    category: 'Talent Award',
    desc: '',
  },
];

export default function Voting() {
  const [activeTab, setActiveTab] = useState('business');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });

  const entries = activeTab === 'business' ? businessEntries : talentEntries;

  function openModal(entry) {
    setSelected(entry);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelected(null);
    setForm({ name: '', email: '' });
  }

  function handleVote(e) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    // In production: hit Paystack with the collected info
    window.open(PAYSTACK_PLACEHOLDER, '_blank');
  }

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
    }, { threshold: 0.1 });

    document.querySelectorAll('.voting-card').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [activeTab]);

  return (
    <section className="voting section" id="voting">
      <div className="container">
        <div className="voting-header reveal">
          <div className="section-tag">Voting</div>
          <h2 className="section-title">
            Vote for the <span className="highlight-orange">Connexa</span> Award
          </h2>
          <p>Support your favourite business or individual. Every vote counts (₦100 per vote).</p>
        </div>

        <div className="voting-tabs reveal">
          <button
            className={`voting-tab${activeTab === 'business' ? ' active' : ''}`}
            onClick={() => setActiveTab('business')}
          >
            🏢 Businesses
          </button>
          <button
            className={`voting-tab${activeTab === 'talent' ? ' active' : ''}`}
            onClick={() => setActiveTab('talent')}
          >
            🌟 Talents
          </button>
        </div>

        <div className="voting-list">
          {entries.map((entry, i) => (
            <div
              key={entry.id}
              className="voting-card reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="voting-card-header">
                <div className="voting-card-name">{entry.name}</div>
                <div className="voting-card-category">{entry.category}</div>
              </div>
              <p className="voting-card-desc">{entry.desc}</p>
              <button
                className="voting-card-btn"
                onClick={() => openModal(entry)}
              >
                Vote Now →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Vote Modal */}
      <div
        className={`vote-modal-overlay${modalOpen ? ' open' : ''}`}
        onClick={(e) => e.target === e.currentTarget && closeModal()}
      >
        <div className="vote-modal">
          <button className="vote-modal-close" onClick={closeModal}>×</button>

          <h3 className="vote-modal-title">Cast Your Vote</h3>
          <p className="vote-modal-subtitle">Fill in your details to proceed to payment.</p>

          {selected && (
            <div className="vote-modal-for">
              Voting for: {selected.name}
            </div>
          )}

          <form className="vote-form" onSubmit={handleVote}>
            <div className="vote-input-group">
              <label>Full Name</label>
              <input
                type="text"
                className="vote-input"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="vote-input-group">
              <label>Email Address</label>
              <input
                type="email"
                className="vote-input"
                placeholder="Enter your email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="vote-price-info">
              <span>Cost per vote</span>
              <strong>₦100</strong>
            </div>

            <button type="submit" className="vote-submit">
              Proceed to Payment →
            </button>

            <p className="vote-note">
              Powered by Paystack · Multiple votes allowed
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}




