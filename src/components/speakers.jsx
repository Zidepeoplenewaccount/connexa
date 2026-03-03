import './speakers.css';

const speakers = [
  {
    id: 1,
    name: 'Connexer',
    title: 'CEO',
    company: 'Company / Organisation',
    topic: 's',
    photo: null,
    featured: true,
    socials: {
      instagram: '#',
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    id: 2,
    name: 'Connexer',
    title: 'CEO',
    company: 'Company / Organisation',
    topic: 's',
    photo: null,
    featured: false,
    socials: {
      instagram: '#',
      linkedin: '#',
    },
  },
  {
    id: 3,
    name: 'Connexer',
    title: 'CEO',
    company: 'Company / Organisation',
    topic: 's',
    photo: null,
    featured: false,
    socials: {
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    id: 4,
    name: 'Connexer',
    title: 'CEO',
    company: 'Company / Organisation',
    topic: 's',
    photo: null,
    featured: false,
    socials: {
      instagram: '#',
    },
  },
];

const socialIcons = {
  instagram: '📸',
  twitter: '🐦',
  linkedin: '💼',
  tiktok: '🎵',
};

export default function Speakers() {
  return (
    <section className="speakers section" id="speakers">
      <div className="container">

        <div className="speakers-header reveal">
          <div className="section-tag">Connexers</div>
          <h2 className="section-title">
            Learn From The <span className="highlight-blue">Best</span>
          </h2>
          <p>
            Industry leaders, founders, and experts sharing real insights
            you can act on immediately.
          </p>
        </div>

        <div className="speakers-grid">
          {speakers.map((speaker, i) => (
            <div
              key={speaker.id}
              className="speaker-card reveal"
              style={{ transitionDelay: `${(i % 4) * 0.1}s` }}
            >
              {/* ── Photo ── */}
              <div className="speaker-photo">
                {speaker.photo ? (
                  <img src={speaker.photo} alt={speaker.name} />
                ) : (
                  <div className="speaker-photo-placeholder">
                    <span>{/*🎤*/}</span>
                    <p>Photo</p>
                  </div>
                )}

                {/* ── Featured badge — remove this block to hide ── */}
                {speaker.featured && (
                  <div className="speaker-featured-badge">Featured</div>
                )}
              </div>

              <div className="speaker-body">
                {/* ── Name — required ── */}
                <div className="speaker-name">{speaker.name}</div>

                {/* ── Title — remove this line to hide ── */}
                {speaker.title && (
                  <div className="speaker-title">{speaker.title}</div>
                )}

                {/* ── Company — remove this line to hide ── */}
                {speaker.company && (
                  <div className="speaker-company">{speaker.company}</div>
                )}

                {/* ── Talk topic — remove this block to hide ── */}
                {speaker.topic && (
                  <div className="speaker-topic">
                    <strong>Speaking On</strong>
                    {speaker.topic}
                  </div>
                )}

                {/* ── Social links — remove this block to hide ── */}
                {/*speaker.socials && Object.keys(speaker.socials).length > 0 && (
                  <div className="speaker-socials">
                    {Object.entries(speaker.socials).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        className="speaker-social"
                        target="_blank"
                        rel="noreferrer"
                        aria-label={platform}
                      >
                        {socialIcons[platform] || '🔗'}
                      </a>
                    ))}
                  </div>
                )*/}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}