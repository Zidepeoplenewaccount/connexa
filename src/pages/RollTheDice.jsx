import { useEffect, useState } from 'react';
import { validateActivityTicket, assignDiceTeam, submitDiceRoll, completeDiceRound } from '../services/activityApi';

const page={minHeight:'100vh',background:'#021C1B',color:'#fff',padding:'28px 18px',fontFamily:'DM Sans,sans-serif'};
const card={maxWidth:680,margin:'34px auto',padding:28,background:'#092b29',border:'1px solid rgba(255,255,255,.14)',borderRadius:20};
const field={width:'100%',padding:14,borderRadius:10,border:'1px solid #46605d',background:'#031d1b',color:'#fff',marginTop:8,fontSize:16};
const button={padding:'14px 20px',border:0,borderRadius:10,background:'#FD6025',color:'#fff',fontWeight:800,cursor:'pointer',marginTop:18};

export default function RollTheDicePage(){
 const [ticketId,setTicketId]=useState(''); const [ticket,setTicket]=useState(null); const [team,setTeam]=useState(null);
 const [die,setDie]=useState(''); const [round,setRound]=useState(null); const [note,setNote]=useState('');
 const [busy,setBusy]=useState(false); const [error,setError]=useState('');
 async function enter(e){e.preventDefault();setBusy(true);setError('');try{const valid=await validateActivityTicket(ticketId.trim());const assigned=await assignDiceTeam(valid.ticket_id);setTicket(valid);setTeam(assigned);}catch(err){setError(err.response?.data?.detail||'We could not find your team assignment. Please ask a Connexa team member.');}finally{setBusy(false);}}
 async function roll(e){e.preventDefault();setBusy(true);setError('');try{const data=await submitDiceRoll({ticket_id:ticket.ticket_id,die_value:Number(die)});setRound(data);}catch(err){setError(err.response?.data?.detail||'The roll could not be recorded.');}finally{setBusy(false);}}
 async function finish(){setBusy(true);setError('');try{await completeDiceRound(round.round_id,{ticket_id:ticket.ticket_id,completion_note:note});setRound({...round,completed:true});}catch(err){setError(err.response?.data?.detail||'Could not mark the challenge complete.');}finally{setBusy(false);}}
 return <main style={page}><div style={{maxWidth:680,margin:'0 auto',paddingTop:20}}><div style={{fontWeight:900,letterSpacing:3,color:'#FD6025'}}>CONNEXA</div><h1 style={{fontSize:'clamp(36px,7vw,58px)',lineHeight:1.02,margin:'18px 0 10px'}}>ROLL THE DICE</h1><p style={{color:'#c8d7d5',lineHeight:1.6}}>One team. One physical die. One challenge at a time. See what your table can create together.</p>
 <section style={card}>
 {!team && <form onSubmit={enter}><label>Enter your ticket ID<input style={field} value={ticketId} onChange={e=>setTicketId(e.target.value)} placeholder="Your Connexa ticket ID" required/></label><button style={button} disabled={busy}>{busy?'Checking…':'Find my team'}</button></form>}
 {team && <><p style={{color:'#a8d9b8',fontWeight:800,letterSpacing:1}}>YOU'VE BEEN ASSIGNED</p><h2 style={{fontSize:32,marginTop:10}}>{team.team.name}</h2><p style={{color:'#c8d7d5',marginTop:6}}>{team.team.table_label||'Your Connexa opportunity team'} · {team.team.member_count}/10 members</p><p style={{marginTop:12,color:'#c8d7d5'}}>Your team assignment is saved. Entering this ticket ID again will always bring you back to this team.</p>
 {team.is_captain && !round && <form onSubmit={roll} style={{marginTop:24}}><p><strong>You are this team's captain.</strong> Roll the physical die at your table, then enter the number shown.</p><label style={{display:'block',marginTop:12}}>Number rolled<select style={field} value={die} onChange={e=>setDie(e.target.value)} required><option value="">Choose 1–6</option>{[1,2,3,4,5,6].map(n=><option key={n}>{n}</option>)}</select></label><button style={button} disabled={busy}>{busy?'Revealing…':'Reveal our challenge'}</button></form>}
 {!team.is_captain && <p style={{marginTop:22,color:'#c8d7d5'}}>Your team captain controls the digital roll. Roll the physical die together and follow the challenge on the captain’s screen.</p>}
 {round && <div style={{marginTop:24,padding:22,borderRadius:16,background:'#031d1b',border:'1px solid #FD6025'}}><p style={{color:'#FD6025',fontWeight:800}}>YOU ROLLED {round.die_value}</p><h2 style={{fontSize:28,marginTop:8}}>{round.challenge.title}</h2><p style={{lineHeight:1.7,marginTop:10}}>{round.challenge.description}</p>{team.is_captain && !round.completed && <><label style={{display:'block',marginTop:18}}>Optional note about your team’s solution<textarea style={{...field,minHeight:90}} value={note} onChange={e=>setNote(e.target.value)} placeholder="What did your team come up with?"/></label><button style={button} onClick={finish} disabled={busy}>{busy?'Saving…':'Mark challenge complete'}</button></>}{round.completed&&<p style={{marginTop:16,color:'#a8d9b8'}}>Challenge marked complete. Your Connexa facilitator will record any bonus points.</p>}</div>}
 </>}
 {error&&<p role="alert" style={{color:'#ff9b8b',marginTop:16}}>{error}</p>}
 </section></div></main>;
}
