import CandidateSignup from './CandidateSignup';
import { FaLightbulb, FaStopwatch, FaFire } from '../utils/icons';
import './Awards.css';

const BriefcaseIcon = () => (
  <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
  </svg>
);
 
const StarIcon = () => (
  <svg width="70" height="70" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5">
    <polygon points="12 2 15.09 10.26 24 10.27 17.18 16.29 20.27 24.54 12 18.53 3.73 24.54 6.82 16.29 0 10.27 8.91 10.26 12 2"></polygon>
  </svg>
);

export const TALENT_CATEGORIES = [
  'What Connexa Means To Me (Talent)',
  'Career Breakthrough of the Year',
  'Remote Talent of the Year',
  'Future Leader Award',
  'Opportunity Creator Award',
  'Creative Talent of the Year',
  'Talent of the Year',
];

export const BUSINESS_CATEGORIES = [
  'What Connexa Means To Me (Business)',
  'Business of the Year',
  'Startup of the Year',
  'Small Business Excellence Award',
  'Innovation Award',
  'Customer Experience Award',
  'Employer of Opportunity Award',
  'Community Impact Business Award',
];

export default function Awards() {
  return (
    <section className="awards-section" id="awards">
      <div className="container">
        <div className="awards-header">
          <span className="section-tag">AWARDS</span>
          <h2 className="section-title">
            Connexa 2026 <span className="highlight-red">Awards</span>
          </h2>
          <p className="awards-subtitle">
            Multiple categories. Big prizes. Real visibility.
          </p>
        </div>

        {/* Award Categories */}
        <div className="awards-categories">
          <div className="awards-categories-grid">
            <div className="awards-category-column">
              <div className="awards-question-card">
                <div className="awards-question-icon">
                  <StarIcon />
                </div>
                <p><strong>Talent Awards</strong></p>
                <ul className="awards-category-list">
                  {TALENT_CATEGORIES.map((cat) => (
                    <li key={cat}>{cat}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="awards-category-column">
              <div className="awards-question-card">
                <div className="awards-question-icon">
                  <BriefcaseIcon />
                </div>
                <p><strong>Business Awards</strong></p>
                <ul className="awards-category-list">
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <li key={cat}>{cat}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* "What Connexa Means To Me" Section */}
        <div className="awards-intro">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px', color: 'var(--white)' }}>
            "What Connexa Means To Me"
          </h3>
          <p>
            Connexa is more than an event - it's a movement. Now we want to hear what it means to you.
          </p>
          <p>
            Create a <strong>60–90 second video</strong> answering:
          </p>
          <div className="awards-questions">
            <div className="awards-question-card">
              <div className="awards-question-icon">
                <BriefcaseIcon />
              </div>
              <p><strong>For Business Owners:</strong></p>
              <p>"Connexa means to my business..."</p>
            </div>
            <div className="awards-question-card">
              <div className="awards-question-icon">
                <StarIcon />
              </div>
              <p><strong>For Talent:</strong></p>
              <p>"Connexa means to me as a Talent..."</p>
            </div>
          </div>
          <div className="awards-note">
            <strong>Important:</strong> Each category has its own prize pool, winners in one category do not affect the other.
          </div>
        </div>

        {/* Prizes */}
        <div className="awards-prizes">
          <h3>Prizes</h3>
          <div className="awards-prize-grid">
            <div className="awards-prize-card">
              <div className="awards-prize-category">Business Owners</div>
              <div className="awards-prize-item">
                <span className="awards-prize-amount">Cash Prizes to be Won</span>
              </div>
            </div>

            <div className="awards-prize-card">
              <div className="awards-prize-category">Talent</div>
              <div className="awards-prize-item">
                <span className="awards-prize-amount">Cash Prizes to be Won</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="awards-rules">
          <h3>Platforms & Submission Rules</h3>
          <ol className="awards-rules-list">
            <li><strong>Primary Platform:</strong> Videos must be posted on Instagram to be eligible for judging.</li>
            <li><strong>Optional Sharing:</strong> Participants may also post on TikTok for extra reach, but TikTok engagement will not count toward selecting finalists.</li>
            <li>
              <strong>Hashtag & Tagging:</strong>
              <ul>
                <li>Use <code>#ConnexaMeansToMe</code></li>
                <li>Tag the official Connexa Instagram account</li>
              </ul>
            </li>
            <li><strong>Engagement Metric:</strong> Only comments where people acknowledge they know what you do will count toward engagement.</li>
            <li><strong>Deadline:</strong> Submissions close November 1st.</li>
          </ol>
        </div>

        {/* What to Include */}
        <div className="awards-guidelines">
          <h3>What to Include in Your Video / Pitch</h3>
          
          <div className="awards-guideline-section">
            <h4>For Business Owners:</h4>
            <ul>
              <li><strong>Your Story:</strong> Share what your business does and the dream or vision behind it.</li>
              <li><strong>How You Support Talent:</strong> Explain how your business creates opportunities and helps talented individuals grow.</li>
              <li><strong>Why Connexa Matters:</strong> Tell us why Connexa is important to your journey and how it can help both you and the talent you work with.</li>
            </ul>
          </div>

          <div className="awards-guideline-section">
            <h4>For Talent:</h4>
            <ul>
              <li><strong>Your Skills:</strong> Highlight what you do and what makes your skills unique.</li>
              <li><strong>How You Add Value:</strong> Show how your skills can help businesses solve problems and grow.</li>
              <li><strong>Why Connexa Matters:</strong> Explain how Connexa can support your growth, visibility, and future opportunities.</li>
            </ul>
          </div>
        </div>

        {/* Tips */}
        <div className="awards-tips">
          <h3>Tips for a Strong Video:</h3>
          <div className="awards-tips-grid">
            <div className="awards-tip">
              <div className="awards-tip-icon"><FaLightbulb size={20} /></div>
              <p>Be authentic - tell your story in your own words.</p>
            </div>
            <div className="awards-tip">
              <div className="awards-tip-icon"><FaStopwatch size={20} /></div>
              <p>Keep it engaging - aim for 60–90 seconds.</p>
            </div>
            <div className="awards-tip">
              <div className="awards-tip-icon"><FaFire size={20} /></div>
              <p>Show passion and vision - the panel is looking for meaningful connections and impact.</p>
            </div>
          </div>
        </div>

        {/* Final Stage */}
        <div className="awards-final">
          <h3>Final Stage</h3>
          <p>The Connexa Opportunity Awards winners will be crowned at Connexa 2026.</p>
        </div>

        <div className="awards-cta">
          <p className="awards-cta-text">
            Share your story. Inspire the community. Claim your spotlight.
          </p>

          <CandidateSignup />
        </div>

        
      </div>
    </section>
  );
}