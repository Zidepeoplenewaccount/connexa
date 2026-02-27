import CandidateSignup from './CandidateSignup';
import './Awards.css';

export default function Awards() {
  return (
    <section className="awards-section" id="awards">
      <div className="container">
        <div className="awards-header">
          <span className="section-tag">CHALLENGE</span>
          <h2 className="section-title">
            "What Connexa Means To Me" <span className="highlight-red">Challenge</span>
          </h2>
          <p className="awards-subtitle">
            Two categories. Big prizes. Real visibility.
          </p>
        </div>

        <div className="awards-intro">
          <p>
            Connexa is more than an event - it's a movement. Now we want to hear what it means to you.
          </p>
          <p>
            Create a <strong>60–90 second video</strong> answering:
          </p>
          <div className="awards-questions">
            <div className="awards-question-card">
              <div className="awards-question-icon">🏢</div>
              <p><strong>For Business Owners:</strong></p>
              <p>"Connexa means to my business..."</p>
            </div>
            <div className="awards-question-card">
              <div className="awards-question-icon">⭐</div>
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
                <span className="awards-prize-position">🥇 1st Runner-Up</span>
                <span className="awards-prize-amount">₦500,000</span>
              </div>
              <div className="awards-prize-item">
                <span className="awards-prize-position">🥈 2nd Runner-Up</span>
                <span className="awards-prize-amount">₦200,000</span>
              </div>
            </div>

            <div className="awards-prize-card">
              <div className="awards-prize-category">Talent</div>
              <div className="awards-prize-item">
                <span className="awards-prize-position">🥇 1st Runner-Up</span>
                <span className="awards-prize-amount">₦500,000</span>
              </div>
              <div className="awards-prize-item">
                <span className="awards-prize-position">🥈 2nd Runner-Up</span>
                <span className="awards-prize-amount">₦200,000</span>
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
              <div className="awards-tip-icon">💡</div>
              <p>Be authentic - tell your story in your own words.</p>
            </div>
            <div className="awards-tip">
              <div className="awards-tip-icon">⏱️</div>
              <p>Keep it engaging - aim for 60–90 seconds.</p>
            </div>
            <div className="awards-tip">
              <div className="awards-tip-icon">🔥</div>
              <p>Show passion and vision - the panel is looking for meaningful connections and impact.</p>
            </div>
          </div>
        </div>

        {/* Final Stage */}
        <div className="awards-final">
          <h3>Final Stage</h3>
          <p>The top 2 from each category (based on Instagram engagement) will be invited to pitch their story live at Connexa.</p>
          <p>A panel of judges at the event will select the winners from the finalists.</p>
        </div>

        <div className="awards-cta">
          <p className="awards-cta-text">
            Share your story. Inspire the community. Claim your spotlight.
          </p>
          <div className="awards-eligibility">
            <strong>Award Open To:</strong> Vendors, Brand Showcases, and Individual VIPs Only
          </div>
        </div>

        <CandidateSignup />
      </div>
    </section>
  );
}