import { useState } from 'react';
import './OpportunityPlaygroundSessions.css';
import QuestionsClosedNotice from './QuestionsClosedNotice';

// Reuse the exact participant image assets already used by the Connexers
// and Playgrounders sections of the Connexa website.
import JoshuaPhoto from '../assets/joshua_oluwadepo.webp';
import ItunuoluwaPhoto from '../assets/itunuoluwa_soniregun.webp';
import RichardPhoto from '../assets/richard_essangabasi.webp';
import AmarachiPhoto from '../assets/AmarachiIMG_1222.webp';
import AnuliPhoto from '../assets/AnuliIMG_1242.JPG.webp';
import SeyiPhoto from '../assets/SeyiIMG_1257.webp';
import StellaIjeomaPhoto from '../assets/StellaIjeoma-copy.webp';
import SeyiBusariImage from '../assets/SeyiBusariImage.webp';
import TobiMakindeImage from '../assets/TobiMakindeImage.webp';
import EniolaOyeleyeImage from '../assets/EniolaOyeleyeImage.webp';

import MosunmoluwaPhoto from '../assets/mosunmoluwa_david.webp';
import OmobolanlePhoto from '../assets/omobolanle_adigun.webp';
import OlalekanPhoto from '../assets/olalekan_asani.webp';
import DavidOgooPhoto from '../assets/david_ogooluwa.webp';
import OluwatomiPhoto from '../assets/oluwatomi_adeife.webp';
import JonathanPhoto from '../assets/jonathan_makinde.png';
import CadmusPhoto from '../assets/Cadmus.webp';
import SamuelPhoto from '../assets/SamuelPhoto.webp';
import OlansilePhoto from '../assets/OlansilePhoto.webp';
import TamaraPhoto from '../assets/Tamara.webp';

const PEOPLE = {
  am: [
    ['CONNEXERS', 'Barr. (Mrs) Anulika Enemuo', 'Business', 'Live Sales Coaching', AnuliPhoto],
    ['CONNEXERS', 'Mrs Stella Ijeoma Olugbemi', 'Business', 'Opportunity Conversations', StellaIjeomaPhoto],
    ['CONNEXERS', 'Richard Essangabasi', 'Talent & Business', 'Opportunity Conversations', RichardPhoto],
    ['CONNEXERS', 'Joshua Oluwadepo', 'Talent', 'Opportunity Conversations', JoshuaPhoto],
    ['CONNEXERS', 'Rt. Hon Itunuoluwa Maria Soniregun', 'Talent', 'Opportunity Conversations', ItunuoluwaPhoto],
    ['PLAYGROUNDERS', 'Omobolanle Adigun', 'Talent', 'Opportunity Conversations', OmobolanlePhoto],
    ['PLAYGROUNDERS', 'Barr. (Mrs) Mosunmoluwa David-Gbemisola', 'Business', 'Opportunity Conversations', MosunmoluwaPhoto],
    ['PLAYGROUNDERS', 'Olalekan Asani', 'Business', 'Mini Opportunity Conversations & Live Business Advisory', OlalekanPhoto],
    ['PLAYGROUNDERS', 'Samuel Olatunde', 'Business', 'Opportunity Conversations', SamuelPhoto],
    ['PLAYGROUNDERS', 'Jonathan Makinde', 'Talent & Business', 'Opportunity Conversations', JonathanPhoto]
  ],
  pm: [
    ['CONNEXERS', 'Tobi Makinde', 'Headline', 'Opportunity Conversations', TobiMakindeImage],
    ['CONNEXERS', 'Seyi Busari', 'Talent', 'Opportunity Conversations', SeyiBusariImage],
    ['CONNEXERS', 'Seyi Olaniyan', 'Business', 'Opportunity Conversations', SeyiPhoto],
    ['CONNEXERS', 'Amarachi Agu', 'Talent & Business', 'Opportunity Conversations', AmarachiPhoto],
    ['CONNEXERS', 'Eniola Oyeleye', 'Talent & Business', 'Mini Opportunity Conversations & Live Sales Coaching', EniolaOyeleyeImage],
    ['PLAYGROUNDERS', 'Sonayon Cadmus', 'Talent & Business', 'Opportunity Conversations', CadmusPhoto],
    ['PLAYGROUNDERS', 'Tamara Edwards', 'Talent', 'Opportunity Conversations', TamaraPhoto],
    ['PLAYGROUNDERS', 'Olansile Olanrewaju', 'Business', 'Mini Opportunity Conversations & Live Sales Coaching', OlansilePhoto],
    ['PLAYGROUNDERS', 'Adeife Oluwatomi', 'Talent & Business', 'Opportunity Conversations', OluwatomiPhoto],
    ['PLAYGROUNDERS', 'David Ogooluwa (Dotify)', 'Talent', 'Opportunity Conversations', DavidOgooPhoto]
  ]
};

function PersonCard({ person, onAsk }) {
  const [group, name, category, activity, photo] = person;
  const featured = activity !== 'Opportunity Conversations';

  return (
    <article className="ops-person-card">
      <div className="ops-person-photo">
        <img className={name === 'Mrs Stella Ijeoma Olugbemi' ? 'ops-photo-stella' : undefined} src={photo} alt={name} loading="lazy" />
      </div>
      <div className="ops-person-details">
        <span className="ops-person-category">{category}</span>
        <h4>{name}</h4>
        <p className={featured ? 'ops-activity ops-activity-featured' : 'ops-activity'}>
          {featured && <b aria-hidden="true">✦ </b>}{activity}
        </p>
        <button
          type="button"
          className="ops-ask-button"
          onClick={() => onAsk({
            name,
            connexerType: `${group === 'CONNEXERS' ? 'CONNEXER' : 'PLAYGROUNDER'} · ${category}`,
            title: category,
            company: '',
            socials: {},
            topic: null
          })}
        >
          ASK A QUESTION
        </button>
      </div>
    </article>
  );
}

export default function OpportunityPlaygroundSessions() {
  const [active, setActive] = useState('am');
  const [showClosedNotice, setShowClosedNotice] = useState(false);
  const rows = PEOPLE[active];

  return (
    <section className="ops-section section" id="sessions">
      <div className="container">
        <header className="ops-heading">
          <p className="ops-eyebrow">TWO SESSIONS. ONE OPPORTUNITY PLAYGROUND.</p>
          <h2>THE OPPORTUNITY <span>PLAYGROUND SESSIONS</span></h2>
          <p className="ops-intro-line">Two sessions. Different experiences. Real conversations. Real opportunities.</p>
          <p className="ops-intro-copy">Explore what is happening during the morning and afternoon sessions and discover the people bringing the Opportunity Playground to life.</p>
        </header>

        <div className="ops-session-switch" role="tablist" aria-label="Choose a session">
          <button type="button" role="tab" aria-selected={active === 'am'} aria-controls="ops-session-panel" className={active === 'am' ? 'ops-session-tab active' : 'ops-session-tab'} onClick={() => setActive('am')}>
            <span>AM SESSION</span><strong>10:00 AM</strong>
          </button>
          <button type="button" role="tab" aria-selected={active === 'pm'} aria-controls="ops-session-panel" className={active === 'pm' ? 'ops-session-tab active' : 'ops-session-tab'} onClick={() => setActive('pm')}>
            <span>PM SESSION</span><strong>2:00 PM</strong>
          </button>
        </div>

        <div id="ops-session-panel" className="ops-session-panel" role="tabpanel">
          <div className="ops-session-panel-heading">
            <span>{active.toUpperCase()} SESSION</span><strong>{active === 'am' ? '10:00 AM' : '2:00 PM'}</strong>
          </div>
          {['CONNEXERS', 'PLAYGROUNDERS'].map(group => (
            <section className="ops-group" key={group}>
              <div className="ops-group-heading">
                <div><h3>{group}</h3></div>
              </div>
              <div className="ops-people-grid">
                {rows.filter(person => person[0] === group).map(person => <PersonCard key={person[1]} person={person} onAsk={() => setShowClosedNotice(true)} />)}
              </div>
            </section>
          ))}
        </div>

        <div className="ops-ticket-cta">
          <p className="ops-ticket-kicker">YOUR PLACE IN THE ROOM IS WAITING</p>
          <h3>NOW THAT YOU KNOW WHAT'S HAPPENING, <span>WILL YOU BE THERE?</span></h3>
          <div className="ops-event-details">
            <strong>CONNEXA 2026</strong><span>28 NOVEMBER 2026</span><span>UNILAG INDOOR SPORTS HALL, AKOKA, LAGOS</span>
          </div>
          <a className="ops-ticket-button" href="#tickets">GET YOUR TICKET <span aria-hidden="true">→</span></a>
        </div>
      </div>
      {showClosedNotice && <QuestionsClosedNotice onClose={() => setShowClosedNotice(false)} />}
    </section>
  );
}
