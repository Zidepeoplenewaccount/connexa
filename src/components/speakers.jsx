import './speakers.css';
import { useState } from 'react';
import AskQuestionModal from './AskQuestionModal';
import JoshuaPhoto from '../assets/joshua_oluwadepo.webp';
import ItunuoluwaPhoto from '../assets/itunuoluwa_soniregun.webp';
import RichardPhoto from '../assets/richard_essangabasi.webp';
import AmarachiPhoto from '../assets/AmarachiIMG_1222.PNG';
import AnuliPhoto from '../assets/AnuliIMG_1242.JPG.jpeg';
import SeyiPhoto from '../assets/SeyiIMG_1257.PNG';

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


  {
    id: 4,
    name: 'Amarachi Agu',
    connexerType: 'BUSINESS CONNEXER',
    title: 'AI Educator and Consultant',
    company: '',
    topic: null,
    photo: AmarachiPhoto,
    featured: false,
    photoClass: 'photo-shift-down',
    askLabel: 'Ask Amarachi',
    bio: `Amarachi Agu is an AI Educator and Consultant who helps people understand not just AI tools, but how to use them to adapt, grow, and create real opportunities in a fast-changing world. Her work breaks down complex AI concepts into practical, everyday language that professionals,
    founders, and creators can immediately apply to their work. At Connexa 2026, she will connect with attendees as an AI Talent & Business Connexer, helping them see how AI can become a tool for growth rather than a source of anxiety and leaving them with clear, actionable ways to
    start using it in their own journey.
    `,
    socials: {
      instagram: 'https://www.instagram.com/hadassahh_e?igsh=MXYweWR6eGd2YW9n',
      tiktok: 'https://www.tiktok.com/@hadassah_e0?_r=1&_t=ZS-97dyx8qqPx7',
      linkedin: 'https://www.linkedin.com/in/amarachi-agu-h3',
    },
  },

  {
    id: 5,
    name: 'Barr. (Mrs) Anulika Enemuo',
    connexerType: 'BUSINESS CONNEXER',
    title: 'CEO, Ohan Corporate Services Ltd',
    company: 'Ohan Corporate Services Ltd',
    topic: null,
    photo: AnuliPhoto,
    featured: false,
    askLabel: 'Ask Barr. Anulika',
    bio: `Anulika Enemuo is a business coach, corporate trainer, and multi-industry entrepreneur with over 15 years of business experience. With a background in International Commercial Law and over a decade of building successful businesses, she is passionate about helping entrepreneurs and organizations achieve sustainable growth. A recognized expert in sales, marketing, and business strategy, Coach Anuli has trained over 5,000 business owners and professionals, equipping them with practical, high-conversion strategies to increase revenue and scale their businesses. She is the creator of the bestselling
    Marketing Made Easy course and regularly consults for organizations on workforce
    optimization, sales, and business growth. As a Talent & Business Connexer ,Coach Anuli will share practical, tested strategies that help business owners accelerate growth, improve sales, and position their businesses for measurable results in as little as 60 days when consistently applied. 
    `,
    socials: {
      instagram: ' https://www.instagram.com/coachanuli?igsh=MWlmYW9uZnZod2h1Mg==',
      tiktok: 'https://www.tiktok.com/@anulikaenemuo?_r=1&_t=ZS-97dyz9wWPKP',
      linkedin: 'https://www.linkedin.com/in/anulika-enemuo-116b93110?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
    },
  },

  {
    id: 6,
    name: 'Seyi Olaniyan',
    connexerType: 'BUSINESS CONNEXER',
    title: 'CEO/ Creative Director, YellowLyfe',
    company: 'YellowLyfe Hq',
    topic: null,
    photo: SeyiPhoto,
    featured: false,
    photoClass: 'zoom-out-face',
    askLabel: 'Ask Seyi',
    bio: `Seyi Olaniyan is a brand strategist, business builder, and Founder of YellowLyfe Company, a people-first experiences company focused on fostering meaningful connections, community, and
    work-life balance. With over a decade of experience in media, marketing, brand development, and project execution, Seyi has worked with local and international brands to shape culture, build strong
    brand identities, and drive business growth. His expertise spans brand strategy, storytelling, partnerships, and experiential marketing.

    Inspired by the growing disconnect between professional success and personal wellbeing, he
    founded YellowLyfe to create experiences that bring people together and help them thrive both personally and professionally.

    As a Business Connexer at Connxer 2026, Seyi will be connecting with founders, professionals, and business leaders seeking to expand their networks, build strategic partnerships, strengthen
    their brands, and unlock new opportunities for growth and collaboration.
    `,
    socials: {
      instagram: 'https://www.instagram.com/seyiolaniyan_?igsh=bmVtbjgwbm56emM2',
      linkedin: 'https://www.linkedin.com/in/seyi-olaniyan-0281b3173?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
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