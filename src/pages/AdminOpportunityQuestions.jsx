import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { getOpportunityQuestionsAdmin, updateOpportunityQuestionAdmin } from '../services/activityApi';
import '../components/admin/admin.css';

export default function AdminOpportunityQuestions(){
 const [items,setItems]=useState([]);const [filter,setFilter]=useState('');const [busy,setBusy]=useState(false);
 async function load(){setBusy(true);try{setItems(await getOpportunityQuestionsAdmin(filter));}catch(e){alert(e.response?.data?.detail||'Could not load questions');}finally{setBusy(false);}}
 useEffect(()=>{load();},[filter]);
 async function act(id,action){try{await updateOpportunityQuestionAdmin(id,action);await load();}catch(e){alert(e.response?.data?.detail||'Action failed');}}
 return <AdminLayout><div className="admin-page-header"><h1>The Big Question</h1><button className="admin-btn" onClick={load}>Refresh</button></div>
 <div style={{display:'flex',gap:10,marginBottom:18,flexWrap:'wrap'}}><select value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:10,background:'#1a1a1a',color:'#fff',border:'1px solid #444',borderRadius:8}}><option value="">All statuses</option>{['pending','approved','called','skipped','completed','rejected'].map(x=><option key={x}>{x}</option>)}</select><span style={{alignSelf:'center',color:'#aaa'}}>{items.length} questions {busy?'· Updating':''}</span></div>
 <div className="admin-card"><div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Attendee</th><th>Ticket</th><th>Type / Category</th><th>Question</th><th>Status</th><th>Actions</th></tr></thead><tbody>{items.map(q=><tr key={q.id}><td>{q.attendee_name}</td><td>{q.ticket_id}</td><td>{q.participant_type}<br/>{q.category}</td><td style={{minWidth:260,whiteSpace:'normal'}}>{q.question_text}</td><td>{q.status}</td><td><div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{q.status==='pending'&&<><button className="admin-btn" onClick={()=>act(q.id,'approve')}>Approve</button><button className="admin-btn" onClick={()=>act(q.id,'reject')}>Reject</button></>}{q.status==='approved'&&<button className="admin-btn" onClick={()=>act(q.id,'call')}>Call next</button>}{q.status==='called'&&<><button className="admin-btn" onClick={()=>act(q.id,'resend')}>Resend alert</button><button className="admin-btn" onClick={()=>act(q.id,'complete')}>Complete</button><button className="admin-btn" onClick={()=>act(q.id,'skip')}>Skip</button></>}</div></td></tr>)}</tbody></table></div>{!items.length&&<p style={{padding:20,color:'#aaa'}}>No questions in this view.</p>}</div></AdminLayout>;
}
