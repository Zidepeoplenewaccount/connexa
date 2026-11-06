import { useState } from 'react';
import './OpportunityPlaygroundSessions.css';
const PEOPLE = {"am":[["CONNEXERS","Barr. (Mrs) Anulika Enemuo","Business","Live Sales Coaching"],["CONNEXERS","Mrs Stella Ijeoma Olugbemi","Business","Opportunity Conversations"],["CONNEXERS","Richard Essangabasi","Talent & Business","Opportunity Conversations"],["CONNEXERS","Joshua Oluwadepo","Talent","Opportunity Conversations"],["CONNEXERS","Rt. Hon Itunuoluwa Maria Soniregun","Talent","Opportunity Conversations"],["PLAYGROUNDERS","Omobolanle Adigun","Talent","Opportunity Conversations"],["PLAYGROUNDERS","Barr. (Mrs) Mosunmoluwa David-Gbemisola","Business","Opportunity Conversations"],["PLAYGROUNDERS","Olalekan Asani","Business","Mini Opportunity Conversations & Live Business Advisory"],["PLAYGROUNDERS","Samuel Olatunde","Business","Opportunity Conversations"],["PLAYGROUNDERS","Jonathan Makinde","Talent & Business","Opportunity Conversations"]],"pm":[["CONNEXERS","Tobi Makinde","Headline","Opportunity Conversations"],["CONNEXERS","Seyi Busari","Talent","Opportunity Conversations"],["CONNEXERS","Seyi Olaniyan","Business","Opportunity Conversations"],["CONNEXERS","Amarachi Agu","Talent & Business","Opportunity Conversations"],["CONNEXERS","Eniola Oyeleye","Talent & Business","Mini Opportunity Conversations & Live Sales Coaching"],["PLAYGROUNDERS","Sonayon Cadmus","Talent & Business","Opportunity Conversations"],["PLAYGROUNDERS","Tamara Edwards","Talent","Opportunity Conversations"],["PLAYGROUNDERS","Olansile Olanrewaju","Business","Mini Opportunity Conversations & Live Sales Coaching"],["PLAYGROUNDERS","Adeife Oluwatomi","Talent & Business","Opportunity Conversations"],["PLAYGROUNDERS","David Ogooluwa (Dotify)","Talent","Opportunity Conversations"]]};
const GROUP_COPY = {
 CONNEXERS: ['SHARING EXPERIENCE. OPENING DOORS.','The people creating opportunities and sharing what they have learned.'],
 PLAYGROUNDERS: ['SHOWING UP. EXPLORING WHAT IS POSSIBLE.','The people stepping into the room to explore and pursue new opportunities.']
};
function PersonCard({ person }) {
 const [group,name,category,activity]=person;
 const initials=name.trim().split(' ').filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
 const featured=activity!=='Opportunity Conversations';
 return <article className="ops-person-card">
  <div className="ops-person-photo" aria-label={`Photo of ${name} pending identity-matched upload`}>
   <span aria-hidden="true">{initials}</span><small>PHOTO TO BE ADDED</small>
  </div>
  <div className="ops-person-details"><span className="ops-person-category">{category}</span><h4>{name}</h4>
   <p className={featured?'ops-activity ops-activity-featured':'ops-activity'}>{featured&&<b aria-hidden="true">✦ </b>}{activity}</p>
  </div>
 </article>;
}
export default function OpportunityPlaygroundSessions(){
 const [active,setActive]=useState('am');
 const rows=PEOPLE[active];
 return <section className="ops-section section" id="sessions"><div className="container">
  <header className="ops-heading"><p className="ops-eyebrow">TWO SESSIONS. ONE OPPORTUNITY PLAYGROUND.</p>
   <h2>THE OPPORTUNITY <span>PLAYGROUND SESSIONS</span></h2>
   <p className="ops-intro-line">Two sessions. Different experiences. Real conversations. Real opportunities.</p>
   <p className="ops-intro-copy">Explore what is happening during the morning and afternoon sessions and discover the people bringing the Opportunity Playground to life.</p>
  </header>
  <div className="ops-session-switch" role="tablist" aria-label="Choose a session">
   <button type="button" role="tab" aria-selected={active==='am'} aria-controls="ops-session-panel" className={active==='am'?'ops-session-tab active':'ops-session-tab'} onClick={()=>setActive('am')}><span>AM SESSION</span><strong>10:00 AM</strong></button>
   <button type="button" role="tab" aria-selected={active==='pm'} aria-controls="ops-session-panel" className={active==='pm'?'ops-session-tab active':'ops-session-tab'} onClick={()=>setActive('pm')}><span>PM SESSION</span><strong>2:00 PM</strong></button>
  </div>
  <div id="ops-session-panel" className="ops-session-panel" role="tabpanel">
   <div className="ops-session-panel-heading"><span>{active.toUpperCase()} SESSION</span><strong>{active==='am'?'10:00 AM':'2:00 PM'}</strong></div>
   {['CONNEXERS','PLAYGROUNDERS'].map(group=><section className="ops-group" key={group}>
    <div className="ops-group-heading"><div><p>{GROUP_COPY[group][0]}</p><h3>{group}</h3><span>{GROUP_COPY[group][1]}</span></div><b>05 PEOPLE</b></div>
    <div className="ops-people-grid">{rows.filter(p=>p[0]===group).map(p=><PersonCard key={p[1]} person={p}/>)}</div>
   </section>)}
  </div>
  <div className="ops-ticket-cta"><p className="ops-ticket-kicker">YOUR PLACE IN THE ROOM IS WAITING</p>
   <h3>NOW THAT YOU KNOW WHAT'S HAPPENING, <span>WILL YOU BE THERE?</span></h3>
   <div className="ops-event-details"><strong>CONNEXA 2026</strong><span>28 NOVEMBER 2026</span><span>UNILAG INDOOR SPORTS HALL, AKOKA, LAGOS</span></div>
   <a className="ops-ticket-button" href="#tickets">GET YOUR TICKET <span aria-hidden="true">→</span></a>
  </div>
 </div></section>;
}
