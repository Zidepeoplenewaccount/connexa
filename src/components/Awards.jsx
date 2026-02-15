import './Awards.css';

export default function Awards() {
  return (
    <section className="awards section" id="awards">
      <div className="container">
        <div className="awards-header reveal">
          <div className="section-tag">Recognition</div>
          <h2 className="section-title">
            The Connexa <span className="highlight-orange">Opportunity</span> Award
          </h2>
          <p>Two categories. Real prizes. Public recognition that money can't buy.</p>
        </div>

        <div className="awards-grid">
          {/* Business Award */}
          <div className="award-card award-card-1 reveal">
            <span className="award-trophy">🏆</span>
            <div className="award-subtitle">Category 1 · Pre-Event</div>
            <h3 className="award-title">Business Opportunity Award</h3>
            <p className="award-description">
              For registered businesses ready to showcase their story and win
              real visibility. From Market Vendor to VIP Partner, if you're
              in the marketplace, you're eligible.
            </p>

            <div className="award-steps">
              <div className="award-step">
                <div className="award-step-num">1</div>
                <div className="award-step-text">
                  Apply on the Connexa website and submit your entry
                </div>
              </div>
              <div className="award-step">
                <div className="award-step-num">2</div>
                <div className="award-step-text">
                  Post a 1–2 minute video on Instagram or TikTok, tag us, explain
                  what your business does, your challenge, and why you deserve to win
                </div>
              </div>
              <div className="award-step">
                <div className="award-step-num">3</div>
                <div className="award-step-text">
                  Drive public votes, likes, shares, and comments count
                </div>
              </div>
              <div className="award-step">
                <div className="award-step-num">4</div>
                <div className="award-step-text">
                  Showcase live at Connexa and be judged on stage
                </div>
              </div>
            </div>

            <div className="award-voting-info">
              <h4>How the Winner is Selected</h4>
              <div className="voting-breakdown">
                <div className="voting-part">
                  <div className="voting-percentage">50%</div>
                  <div className="voting-label">Online votes & engagement</div>
                </div>
                <div className="voting-part">
                  <div className="voting-percentage">50%</div>
                  <div className="voting-label">Live showcase at Connexa</div>
                </div>
              </div>
            </div>

            <div className="award-actions">
              <a href="#apply" className="award-cta">Apply for Award →</a>
              <a href="#voting" className="award-cta award-cta-outline">Vote Now →</a>
            </div>
          </div>

          {/* Individual Award */}
          <div className="award-card award-card-2 reveal reveal-delay-2">
            <span className="award-trophy">🌟</span>
            <div className="award-subtitle">Category 2 · Pre-Event</div>
            <h3 className="award-title">Individual Talent Award</h3>
            <p className="award-description">
              For VIP Individual Pass holders ready to show the world what
              they're made of. Talent, skill, expertise, if it adds value,
              it belongs at Connexa.
            </p>

            <div className="award-steps">
              <div className="award-step">
                <div className="award-step-num">1</div>
                <div className="award-step-text">
                  Must hold a VIP Individual Pass to enter
                </div>
              </div>
              <div className="award-step">
                <div className="award-step-num">2</div>
                <div className="award-step-text">
                  Create a 30–60 second video showcasing your talent, what you
                  do, and the value you bring
                </div>
              </div>
              <div className="award-step">
                <div className="award-step-num">3</div>
                <div className="award-step-text">
                  Post on TikTok or Instagram Reels with <strong>#Connexa2026</strong> and
                  tag both Zidepeople and Connexa accounts
                </div>
              </div>
              <div className="award-step">
                <div className="award-step-num">4</div>
                <div className="award-step-text">
                  Public votes decide, multiple votes allowed at ₦100 per vote
                </div>
              </div>
            </div>

            <div className="award-voting-info">
              <h4>Voting Details</h4>
              <div className="voting-breakdown">
                <div className="voting-part">
                  <div className="voting-percentage">₦100</div>
                  <div className="voting-label">per vote</div>
                </div>
                <div className="voting-part">
                  <div className="voting-percentage">∞</div>
                  <div className="voting-label">Multiple votes allowed</div>
                </div>
              </div>
            </div>

            <a href="#voting" className="award-cta">Vote for Talents →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
