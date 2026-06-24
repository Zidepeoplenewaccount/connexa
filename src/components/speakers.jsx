import './speakers.css';
import { useState } from 'react';
import AskQuestionModal from './AskQuestionModal';
import JoshuaPhoto from '../assets/joshua_oluwadepo.webp';
import ItunuoluwaPhoto from '../assets/itunuoluwa_soniregun.webp';
import RichardPhoto from '../assets/richard_essangabasi.webp';

import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaTiktok, FaXTwitter } from "react-icons/fa6";


const speakers = [
  {
    id: 1,
    name: 'Joshua Oluwadepo',
    connexerType: 'TALENT CONNEXER',
    title: 'Senior Recruitment Consultant',
    company: 'Jobberman',
    topic: null, 
    photo: JoshuaPhoto,
    featured: false,
    askLabel: 'Ask Joshua',
    bio: 'Joshua Oluwadepo is a Senior Recruitment Consultant at Jobberman (The African Talent Company) with years of experience helping Nigerian talents access opportunities across Africa and globally. Specializing in recruitment, talent positioning, remote opportunities, and tech hiring, he has helped connect talents to opportunities across multiple industries and continents. As a Talent Connexer, Joshua will be answering questions around how to get connected to real opportunities, especially breaking down how hiring works and how talent positioning can significantly improve your chances in today\'s job market.',
    instagramUrl: 'https://www.instagram.com/connexalagos',
    socials: {
      instagram: 'https://www.instagram.com/connexalagos',
      linkedin: 'https://www.linkedin.com/in/joshuaoluwadepo?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
    },
  },
  {
    id: 2,
    name: 'Rt. Hon Itunuoluwa Maria Soniregun',
    connexerType: 'TALENT CONNEXER',
    title: 'First Female Speaker, Lagos State Youth Parliament',
    company: 'Lagos State Youth Parliament',
    topic: null,
    photo: ItunuoluwaPhoto,
    featured: false,
    askLabel: 'Ask RT. HON ITUNUOLUWA',
    bio: 'Itunuoluwa Maria Soniregun is a youth leader and policy advocate committed to advancing youth inclusion, leadership development, and civic participation. As the first female Speaker of Lagos State Youth Parliament and the youngest State Youth Parliament Speaker in Nigeria, she has consistently leveraged her platform to bridge the gap between young people and meaningful opportunities in leadership, governance, and personal development. Her journey reflects a deep commitment to preparing young people not only to access opportunities, but to be fully ready to maximize them when they arrive.',
    instagramUrl: 'https://www.instagram.com/soniregunitunuoluwa',
    socials: {
      instagram: 'https://www.instagram.com/soniregunitunuoluwa',
      tiktok: 'https://www.tiktok.com/@itunuoluwasoniregun1',
      twitter: 'https://x.com/SoniregunItunu1',
      linkedin: 'https://www.linkedin.com/in/rt-hon-soniregun-itunuoluwa-5a571a1aa',
    },
  },
  {
    id: 3,
    name: 'Richard Essangabasi',
    connexerType: 'TALENT & BUSINESS CONNEXER',
    title: 'Co-founder/CEO Shard Network',
    company: 'Shard Network',
    topic: null,
    photo: RichardPhoto,
    featured: false,
    askLabel: 'Ask Richard',
    bio: 'Richard Essangabasi is a speaker, investor, business developer, and entrepreneur who has built and scaled brands such as Shard Network, Campus Pitch Africa, and Offar. He has spoken on global stages hosted by Google, Figma, Solana, Ethereum, and Base, empowering builders and entrepreneurs across Africa. At Connexa, his mission is to help attendees understand how to think globally, position strategically, and build opportunities that transcend borders.',
    socials: {
      instagram: 'https://www.instagram.com/theessangabasi',
      tiktok: 'https://www.tiktok.com/@theessangabasi',
      twitter: 'https://x.com/TheEssangabasi',
      linkedin: 'https://www.linkedin.com/in/theessangabasi',
    },
  },
];

const socialIcons = {
  instagram: FaInstagram,
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
  tiktok: FaTiktok,
};


export default function Speakers() {
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);

  function openQuestionModal(speaker) {
    setSelectedSpeaker(speaker);
  }

  function closeQuestionModal() {
    setSelectedSpeaker(null);
  }


  return (
    <section className="speakers section" id="speakers">
      <div className="container">

        <div className="speakers-header reveal">
          <div className="section-tag">ASK THE PEOPLE BEHIND THE OPPORTUNITIES</div>
          <h2 className="section-title">
            Connexers <span className="highlight-blue"></span>
          </h2>
          <p>
            Get answers from talents and business connexers who are 
            building, hiring, growing, and creating opportunities.
          </p>
        </div>
        <div className="question-priority-notice">
          <div className="priority-icon">⭐</div>
          <div className="priority-text">
            <strong>Priority Questions:</strong>
            <p>Questions from Talent VIP, Business Owner, Market Vendor, Showcase Vendor, and VIP Partner ticket holders will be prioritized.</p>
          </div>
        </div>

        <div className="speakers-grid">
          {speakers.map((speaker, i) => (
            <div
              key={speaker.id}
              className="speaker-card reveal"
              style={{ transitionDelay: `${(i % 5) * 0.1}s` }}
            >
              {/* ── Photo ── */}
              <div className="speaker-photo">
                {speaker.photo ? (
                  <img src={speaker.photo} alt={speaker.name} loading="lazy" />
                ) : (
                  <div className="speaker-photo-placeholder">
                    <span>{/*🎤*/}</span>
                    <p>Photo</p>
                  </div>
                )}

                {/* ── Featured badge ── */}
                {speaker.featured && (
                  <div className="speaker-featured-badge">Featured</div>
                )}
              </div>

              <div className="speaker-body">
                {/* ── Name ── */}
                <div className="speaker-name">{speaker.name}</div>

                {/* ── Connexer Type ── */}
                {speaker.connexerType && (
                  <div className="speaker-connexer-type">
                    {speaker.connexerType}
                  </div>
                )}

                {/* ── Title ── */}
                {speaker.title && (
                  <div className="speaker-title">{speaker.title}</div>
                )}

                {/* ── Company ── */}
                {speaker.company && (
                  <div className="speaker-company">{speaker.company}</div>
                )}

                {/* ── Bio with Read More ── */}
                {speaker.bio && (
                  <div className="speaker-bio">
                    <p>{speaker.bio.substring(0, 200)}...</p>
                    <a 
                      href={speaker.socials?.instagram || speaker.instagramUrl || '#'} 
                      target="_blank" 
                      rel="noreferrer"
                      className="speaker-read-more"
                    >
                      Read more
                    </a>
                  </div>
                )}

                {/* ── Talk topic (OPTIONAL - only show if exists) ── */}
                {speaker.topic && (
                  <div className="speaker-topic">
                    <strong>Speaking On:</strong> {speaker.topic}
                  </div>
                )}

                {/* ── Social links ── */}
                {speaker.socials && Object.keys(speaker.socials).length > 0 && (
                  <div className="speaker-socials">
                    {Object.entries(speaker.socials).map(([platform, url]) => {
                      const Icon = socialIcons[platform];

                      return (
                        <a
                          key={platform}
                          href={url}
                          className="speaker-social"
                          target="_blank"
                          rel="noreferrer"
                          aria-label={platform}
                        >
                          {Icon ? <Icon size={18} /> : '🔗'}
                        </a>
                      );
                    })}
                  </div>
                )}

                {speaker.name !== 'Coming Soon' && (
                  <button 
                    className="speaker-ask-btn"
                    onClick={() => openQuestionModal(speaker)}
                  >
                    {speaker.askLabel || `Ask ${speaker?.name?.split(' ')[0]}`}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {selectedSpeaker && (
        <AskQuestionModal 
          speaker={selectedSpeaker} 
          onClose={closeQuestionModal}
        />
      )}
    </section>
  );
}