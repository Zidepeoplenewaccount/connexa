import { useEffect, useRef, useState } from 'react';
import { validateActivityTicket, submitOpportunityQuestion, getOpportunityQuestionStatus } from '../services/activityApi';

const page = { minHeight:'100vh', background:'#021C1B', color:'#fff', padding:'28px 18px', fontFamily:'DM Sans, sans-serif' };
const card = { maxWidth:620, margin:'34px auto', padding:28, background:'#092b29', border:'1px solid rgba(255,255,255,.14)', borderRadius:20 };
const field = { width:'100%', padding:14, borderRadius:10, border:'1px solid #46605d', background:'#031d1b', color:'#fff', marginTop:8, fontSize:16 };
const button = { padding:'14px 20px', border:0, borderRadius:10, background:'#FD6025', color:'#fff', fontWeight:800, cursor:'pointer', marginTop:18 };

export default function BigQuestionPage() {
  const [ticketId,setTicketId]=useState('');
  const [ticket,setTicket]=useState(null);
  const [participant,setParticipant]=useState('Talent');
  const [category,setCategory]=useState('Opportunities');
  const [question,setQuestion]=useState('');
  const [submitted,setSubmitted]=useState(false);
  const [status,setStatus]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [soundEnabled,setSoundEnabled]=useState(false);
  const [acknowledged,setAcknowledged]=useState(false);
  const audioRef=useRef(null);
  const ticketRef=useRef('');

  async function unlockSound() {
    try {
      const Ctx=window.AudioContext||window.webkitAudioContext;
      if(!Ctx) return;
      if(!audioRef.current) audioRef.current=new Ctx();
      if(audioRef.current.state==='suspended') await audioRef.current.resume();
      setSoundEnabled(true);
    } catch { setSoundEnabled(false); }
  }

  function playAlert() {
    const ctx=audioRef.current;
    if(!ctx || ctx.state!=='running') return;
    const oscillator=ctx.createOscillator();
    const gain=ctx.createGain();
    oscillator.type='sine'; oscillator.frequency.value=880;
    gain.gain.value=0.18;
    oscillator.connect(gain); gain.connect(ctx.destination);
    oscillator.start(); oscillator.stop(ctx.currentTime+0.35);
  }

  async function validate(e) {
    e.preventDefault(); setBusy(true); setError('');
    try { const data=await validateActivityTicket(ticketId.trim()); setTicket(data); ticketRef.current=data.ticket_id; await unlockSound(); }
    catch(err) { setError(err.response?.data?.detail||'We could not validate that ticket ID. Check it and try again.'); }
    finally { setBusy(false); }
  }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      await submitOpportunityQuestion({ticket_id:ticket.ticket_id,participant_type:participant,category,question_text:question});
      setSubmitted(true);
    } catch(err) { setError(err.response?.data?.detail||'Your question could not be submitted. Please try again.'); }
    finally { setBusy(false); }
  }

  useEffect(()=>{
    if(!submitted || !ticketRef.current) return;
    let active=true;
    const poll=async()=>{
      try {
        const data=await getOpportunityQuestionStatus(ticketRef.current);
        if(!active) return;
        setStatus(data.status);
        if(data.called && !acknowledged && soundEnabled) playAlert();
      } catch {}
    };
    poll();
    const timer=window.setInterval(poll,4000);
    return ()=>{active=false;window.clearInterval(timer);};
  },[submitted,acknowledged,soundEnabled]);

  return <main style={page}><div style={{maxWidth:620,margin:'0 auto',paddingTop:20}}>
    <div style={{fontWeight:900,letterSpacing:3,color:'#FD6025'}}>CONNEXA</div>
    <h1 style={{fontSize:'clamp(36px,7vw,58px)',lineHeight:1.02,margin:'18px 0 10px'}}>THE BIG QUESTION</h1>
    <p style={{color:'#c8d7d5',lineHeight:1.6}}>There is something you want to ask. Put it forward. The facilitator may bring it into the room.</p>
    <section style={card}>
      {!ticket && <form onSubmit={validate}>
        <label>Enter your ticket ID<input style={field} value={ticketId} onChange={e=>setTicketId(e.target.value)} placeholder="Your Connexa ticket ID" required /></label>
        <button style={button} disabled={busy}>{busy?'Checking…':'Continue'}</button>
      </form>}
      {ticket && !submitted && <form onSubmit={submit}>
        <p style={{color:'#c8d7d5',marginBottom:20}}>Ticket verified for <strong style={{color:'#fff'}}>{ticket.attendee_name}</strong></p>
        <label>Your perspective<select style={field} value={participant} onChange={e=>setParticipant(e.target.value)}><option>Talent</option><option>Business owner</option><option>Both</option><option>Other</option></select></label>
        <label style={{display:'block',marginTop:18}}>Question category<select style={field} value={category} onChange={e=>setCategory(e.target.value)}>{['Skills','Career','Money','Business','Opportunities','Personal Growth'].map(x=><option key={x}>{x}</option>)}</select></label>
        <label style={{display:'block',marginTop:18}}>Your question<textarea style={{...field,minHeight:130,resize:'vertical'}} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What would you like to ask?" required maxLength={2000}/></label>
        <button style={button} disabled={busy}>{busy?'Submitting…':'Submit question'}</button>
      </form>}
      {submitted && <div>
        <h2 style={{fontSize:26}}>Your question is in.</h2>
        <p style={{color:'#c8d7d5',lineHeight:1.6,marginTop:10}}>Keep this page open and your phone volume on. Approval does not mean you are being called yet. We will alert you here when the facilitator is ready for your question.</p>
        <p style={{marginTop:20,fontWeight:800}}>STATUS: <span style={{color:status==='called'?'#FD6025':'#b9d4d0'}}>{status.toUpperCase()||'PENDING'}</span></p>
        {status==='called' && !acknowledged && <div style={{marginTop:22,padding:20,background:'#FD6025',borderRadius:14}}>
          <h2 style={{fontSize:28}}>IT’S YOUR TURN!</h2><p style={{marginTop:8}}>Your question is up next. Please make your way to the facilitator.</p>
          <button style={{...button,background:'#021C1B'}} onClick={()=>setAcknowledged(true)}>I’m on my way</button>
        </div>}
        {acknowledged && <p style={{marginTop:18}}>Thank you. The facilitator has been alerted that you acknowledged the call.</p>}
        {!soundEnabled && <button style={button} onClick={unlockSound}>Enable sound alert</button>}
      </div>}
      {error && <p role="alert" style={{color:'#ff9b8b',marginTop:16}}>{error}</p>}
    </section>
    <p style={{color:'#8da7a3',fontSize:12,lineHeight:1.5}}>For the alert to sound, keep this page open in your browser. Browser audio may not play if your phone is locked, muted or the browser is suspended.</p>
  </div></main>;
}
