import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { getDiceOverviewAdmin, scoreDiceRoundAdmin, getDiceChallenges, updateDiceChallengeAdmin } from '../services/activityApi';
import '../components/admin/admin.css';

export default function AdminDice(){
 const [teams,setTeams]=useState([]);const [challenges,setChallenges]=useState([]);
 async function load(){try{const [t,c]=await Promise.all([getDiceOverviewAdmin(),getDiceChallenges()]);setTeams(t);setChallenges(c);}catch(e){alert(e.response?.data?.detail||'Could not load dice dashboard');}}
 useEffect(()=>{load();},[]);
 async function score(round){const base=window.prompt('Base points (0–5)',String(round.base_points||5));if(base===null)return;const bonus=window.prompt('Bonus points (0–15)',String(round.bonus_points||0));if(bonus===null)return;try{await scoreDiceRoundAdmin(round.id,{base_points:Number(base),bonus_points:Number(bonus),scored_by:'Connexa admin'});await load();}catch(e){alert(e.response?.data?.detail||'Could not save score');}}
 async function editChallenge(c){const title=window.prompt('Challenge title',c.title);if(title===null)return;const description=window.prompt('Challenge description',c.description);if(description===null)return;try{await updateDiceChallengeAdmin(c.number,{title,description,is_active:c.is_active});await load();}catch(e){alert(e.response?.data?.detail||'Could not update challenge');}}
 const totalMembers=teams.reduce((sum,t)=>sum+(t.members?.length||0),0);
 return <AdminLayout><div className="admin-page-header"><h1>Roll the Dice</h1><button className="admin-btn" onClick={load}>Refresh</button></div>
 <div className="admin-card" style={{padding:20,marginBottom:20}}><h2>Automatic team allocation</h2><p style={{color:'#aaa',marginTop:8}}>Attendees are assigned automatically when they enter a valid ticket ID. Teams are capped at 10, with the allocator aiming for 5 talents and 5 business owners. New opportunity teams are created automatically when existing teams reach their allocation limits.</p><p style={{marginTop:12,fontWeight:700}}>Teams: {teams.length} · Assigned attendees: {totalMembers}</p></div>
 <div className="admin-card" style={{padding:20,marginBottom:20}}><h2>Teams and scores</h2>{teams.map(t=><div key={t.id} style={{borderBottom:'1px solid #333',padding:'16px 0'}}><h3>{t.name} · {t.table_label||'No table'} · {t.members?.length||0}/10 · {t.score} points</h3><p style={{color:'#aaa',margin:'6px 0'}}>Captain ticket: {t.captain_ticket_id||'Not set'}</p><p>{t.members.map(m=>m.attendee_name+' ('+m.participant_type+')').join(' · ')||'Awaiting members'}</p>{t.rounds.map(r=><div key={r.id} style={{marginTop:10,padding:10,background:'#111',borderRadius:8}}>Challenge {r.die_value} · {r.completed?'Completed':'In progress'} · {r.total_points} points <button className="admin-btn" style={{marginLeft:8}} onClick={()=>score(r)}>Score / adjust</button></div>)}</div>)}</div>
 <div className="admin-card" style={{padding:20}}><h2>Challenge library</h2><p style={{color:'#aaa',margin:'6px 0 14px'}}>Edit the six prompts without changing the code.</p>{challenges.map(c=><div key={c.number} style={{padding:'12px 0',borderBottom:'1px solid #333',display:'flex',justifyContent:'space-between',gap:12}}><div><strong>{c.number}. {c.title}</strong><p style={{color:'#aaa',marginTop:5}}>{c.description}</p></div><button className="admin-btn" onClick={()=>editChallenge(c)}>Edit</button></div>)}</div>
 </AdminLayout>;
}
