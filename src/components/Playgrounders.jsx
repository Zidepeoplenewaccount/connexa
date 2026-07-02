import './speakers.css';
import { useState } from 'react';
import AskQuestionModal from './AskQuestionModal';
import MosunmoluwaPhoto from '../assets/mosunmoluwa_david.webp';
import OmobolanlePhoto from '../assets/omobolanle_adigun.webp';
import OlalekanPhoto from '../assets/olalekan_asani.webp';
import DavidOgooPhoto from '../assets/david_ogooluwa.webp';
import OluwatomiPhoto from '../assets/oluwatomi_adeife.webp';
import JonathanPhoto from '../assets/jonathan_makinde.png';
import CadmusPhoto from '../assets/Cadmus.webp';

import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaTiktok, FaXTwitter } from "react-icons/fa6";


const playgrounders = [
  {
    id: 1,
    name: 'Barr. Mosunmoluwa David-Gbemisola',
    connexerType: 'BUSINESS PLAYGROUNDER',
    title: 'Legal Practitioner, Founding Partner',
    company: 'M&D Legal Consults',
    topic: null,
    photo: MosunmoluwaPhoto,
    featured: false,
    askLabel: 'Ask MOSUNMOLUWA',
    bio: 'Barr. Mosunmoluwa David-Gbemisola is a legal practitioner with over five years of experience advising businesses on corporate, commercial, regulatory, and compliance matters. She holds a Master\'s degree in Corporate and Commercial Law from the prestigious University of Lagos and is the Founding Partner of M&D Legal Consults, a business-focused law firm dedicated to helping entrepreneurs, investors, and business owners protect and grow their ventures. Beyond legal practice, Barr. Mosunmoluwa is passionate about entrepreneurship, business development, and creating pathways for growth. Through her work, she has supported individuals and businesses in navigating legal complexities, identifying opportunities, and building sustainable ventures. As a speaker, she is committed to sharing practical insights, empowering professionals, and connecting people with real opportunities that drive personal and business success.',
    socials: {
      instagram: 'https://www.instagram.com/themosunmoluwa',
      tiktok: 'https://www.tiktok.com/@mosununfiltered',
      twitter: 'https://x.com/themosunmoluwa',
      linkedin: 'https://www.linkedin.com/in/mosunakomolede',
    },
  },
  {
    id: 2,
    name: 'Omobolanle Adigun (The Vibe Queen)',
    connexerType: 'TALENT PLAYGROUNDER',
    title: 'Actor, TV & Event Host, Brand & Communications Executive, Writer, Content Creator & Entrepreneur',
    company: 'Creatrix Empire',
    topic: null,
    photo: OmobolanlePhoto,
    featured: false,
    photoClass: 'zoom-out-photo',
    askLabel: 'ASK THE VIBE QUEEN',
    bio: 'Omobolanle Valentina Adigun popularly known as Omobola Val or The Vibe Queen is a multi-talented media and communications professional who is passionate about connecting people with opportunities that transform their lives. As the Head of Brands & communications at Creatrix Empire, an actor, media presenter, event host, and content creator, she has built a strong career around entertainment, personal branding, and meaningful collaborations. Through her work, she has helped talents, brands, and organizations amplify their voices and create lasting impact. As a Talent Playgrounder, she believes that authentic relationships and strategic visibility are powerful tools for career growth.',
    socials: {
      instagram: 'https://www.instagram.com/omobolanleadigun_',
      tiktok: 'https://www.tiktok.com/@omobola_val',
      twitter: 'https://x.com/omobola_val',
      linkedin: 'https://linkedin.com/in/omobolanle-adigun-508253120',
    },
  },
  {
    id: 3,
    name: 'Olalekan Asani',
    connexerType: 'BUSINESS PLAYGROUNDER',
    title: 'Brand Naming Consultant & Brand Identity Designer',
    company: '',
    topic: null,
    photo: OlalekanPhoto,
    featured: false,
    askLabel: 'Ask Olalekan',
    bio: 'Olalekan Asani is a brand naming consultant and brand identity designer who helps founders and growing businesses turn unclear ideas into clear, ownable, and memorable brand identities. Through his work, he helps businesses clarify what they stand for, how they should be perceived, what they should be called, and how they should visually present themselves to attract the right audience and opportunities. As a Business Playgrounder at Connexa 2026, Olalekan brings practical experience in branding, naming, storytelling, and visual identity to help entrepreneurs think more clearly about how their business can move from just existing to being properly seen, understood, and trusted.',
    socials: {
      instagram: 'https://www.instagram.com/ola_asani?igsh=Znd4cWFlYmQzaHQ3',
      tiktok: 'https://www.tiktok.com/@ola_asani?_r=1&_t=ZS-97DAAeKYcFh',
      twitter: 'https://x.com/ola_asani?s=21',
      linkedin: 'https://www.linkedin.com/in/olalekan-asani-502727191',
    },
  },
  {
    id: 4,
    name: 'David Ogooluwa (Dotify)',
    connexerType: 'TALENT PLAYGROUNDER',
    title: 'Founder & Chief Host (Founders Corner), Host (BlockFestAfrica)',
    company: 'Founders Corner',
    topic: null,
    photo: DavidOgooPhoto,
    featured: false,
    askLabel: 'Ask Dotify',
    bio: 'With over 5 years experience in the blockchain ecosystem, Dotify helps founders and builders turn ideas into simple and relatable narratives that people can understand and act on. Through his platform Founders Corner, he connects talent, products, and opportunities by making complex thinking very simple and visible.',
    socials: {
      instagram: 'https://www.instagram.com/iamdotify',
      tiktok: 'https://www.tiktok.com/@iamdotify',
      twitter: 'https://x.com/Iamdotify',
      linkedin: 'https://www.linkedin.com/in/iamdotify/',
    },
  },
  {
    id: 5,
    name: 'Adeife Oluwatomi',
    connexerType: 'TALENT & BUSINESS PLAYGROUNDER',
    title: 'Founder and CEO of ProfilePro',
    company: 'ProfilePro',
    topic: null,
    photo: OluwatomiPhoto,
    featured: false,
    photoClass: 'zoom-out-face',
    askLabel: 'Ask Oluwatomi',
    bio: 'Oluwatomi Adeife is the Founder and CEO of ProfilePro and Founder of CarryHer Nigeria. She is a startup founder, talent ecosystem builder, and brand strategist passionate about connecting skilled young people to real opportunities. Through her work, she has trained, mentored, and connected talents with brands while helping businesses grow through effective marketing and brand strategy. Oluwatomi is committed to helping individuals turn their skills into income and guiding founders to build sustainable, opportunity-driven businesses.',
    socials: {
      instagram: 'https://www.instagram.com/oluwatomiadeife?igsh=bDZ2OTViMXA3YXky&utm_source=qr',
      tiktok: 'https://www.tiktok.com/@oluwatomiadeife?_r=1&_t=ZS-97TtOSdzUGn',
      twitter: 'https://x.com/oluwatomiadeife?s=21',
    },
  },
  {
    id: 6,
    name: 'Jonathan Makinde',
    connexerType: 'TALENT & BUSINESS PLAYGROUNDER',
    title: 'Learning and Development Professional',
    company: '',
    topic: null,
    photo: JonathanPhoto,
    featured: false,
    photoClass: 'zoom-out-face',
    askLabel: 'Ask Jonathan',
    bio: 'Jonathan Makinde is an HR professional specializing in Learning & Development, dedicated to helping people grow, learn, and reach their full potential. Through his work in corporate learning, he collaborates with leaders, subject-matter experts, and professionals to create impactful learning experiences that equip individuals with the skills and confidence to seize new opportunities while helping organizations unlock the full potential of their people and build high-performing teams. As a Talent & Business Playgrounder, he is passionate about connecting people with insights, opportunities, and meaningful relationships that drive career growth, business success, and lasting impact.',
    socials: {
      instagram: 'https://www.instagram.com/that__hr_guy?igsh=MTlkbXZnc3Nwd3Y4aw==',
      tiktok: 'https://www.tiktok.com/@jay_mankind?_r=1&_t=ZS-97aq64xvt1I',
      linkedin: 'https://www.linkedin.com/in/jonathanmakinde',
    },
  },

  {
    id: 7,
    name: 'Sonayon Cadmus',
    connexerType: 'TALENT & BUSINESS PLAYGROUNDER',
    title: 'Fashion Business Strategist | Fashion Educationist | Founder',
    company: 'Dear Fashion Designers & Cadmus de Vogue',
    topic: null,
    photo: CadmusPhoto,
    featured: false,
    photoClass: '',
    askLabel: 'Ask Sonayon',
    bio: `Sonayon Cadmus is a Fashion Business Strategist, Fashion Educationist, and founder of the Dear Fashion Designers Community. She equips fashion entrepreneurs with the knowledge and strategy to build sustainable brands through initiatives like the Ready-to-Wear Blueprint Masterclass, Vision Board Retreat for Fashion Designers, Fashion Beyond Borders, and personalized business mentorship. She is passionate about connecting creatives to opportunities, global exposure, and the right networks for growth.

    At Connexa, Sonayon will share how intentional networking, value creation, and strategic positioning can open doors that talent alone cannot.
    `,
    socials: {
      instagram: 'https://www.instagram.com/sonayon_cadmus?igsh=MTN3Z2xoMmVsdWNleg==',
      tiktok: 'https://www.tiktok.com/@sonayon_cadmus?_r=1&_t=ZS-97gufKeQj3s',
      linkedin: 'https://www.linkedin.com/in/sonayon-cadmus-b163b91a2?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
      twitter: 'https://x.com/sonayoncadmus?s=21',
    },
  },
];

const socialIcons = {
  instagram: FaInstagram,
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
  tiktok: FaTiktok,
};


export default function Playgrounders() {
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);

  function openQuestionModal(speaker) {
    setSelectedSpeaker(speaker);
  }

  function closeQuestionModal() {
    setSelectedSpeaker(null);
  }


  return (
    <section className="speakers section" id="playgrounders">
      <div className="container">

        <div className="speakers-header reveal">
          <div className="section-tag">MEET THE</div>
          <h2 className="section-title">
            Playgrounders <span className="highlight-blue"></span>
          </h2>
          <p>
            Learn from people who have built careers, created impact, and unlocked opportunities.
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
          {playgrounders.map((speaker, i) => (
            <div
              key={speaker.id}
              className="speaker-card reveal"
              style={{ transitionDelay: `${(i % 5) * 0.1}s` }}
            >
              {/* ── Photo ── */}
              <div className="speaker-photo">
                {speaker.photo ? (
                  <img 
                    src={speaker.photo} 
                    alt={speaker.name}
                    className={speaker.photoClass || ''}
                    loading="lazy"
                  />
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
                      href={speaker.socials?.instagram || '#'} 
                      target="_blank" 
                      rel="noreferrer"
                      className="speaker-read-more"
                    >
                      Read more
                    </a>
                  </div>
                )}

                {/* ── Quote ── */}
                {speaker.quote && (
                  <div className="speaker-quote">
                    <em>"{speaker.quote}"</em>
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
                    {speaker.askLabel}
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
