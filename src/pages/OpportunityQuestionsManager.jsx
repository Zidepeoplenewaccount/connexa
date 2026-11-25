import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://zidepeople-backend.onrender.com';
const TOKEN_KEY = 'connexa_opportunity_manager_token';

const styles = {
  page: { minHeight: '100vh', background: '#f5f6f8', color: '#20242b', padding: '28px 18px', fontFamily: 'Inter, Arial, sans-serif' },
  shell: { maxWidth: 1400, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 24 },
  brand: { color: '#183d32', fontWeight: 800, letterSpacing: '.04em', fontSize: 14 },
  title: { margin: '8px 0 4px', fontSize: 30, color: '#242033' },
  muted: { color: '#6b7280', margin: 0 },
  card: { background: '#fff', border: '1px solid #e7e8ed', borderRadius: 14, padding: 20, boxShadow: '0 8px 28px rgba(20,24,40,.05)' },
  button: { border: 0, borderRadius: 8, padding: '10px 14px', background: '#4d32df', color: '#fff', fontWeight: 700, cursor: 'pointer' },
  input: { width: '100%', boxSizing: 'border-box', padding: 13, border: '1px solid #d8dbe2', borderRadius: 8, marginTop: 6, marginBottom: 14, fontSize: 15 },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 980 },
  th: { textAlign: 'left', padding: '13px 12px', background: '#f7f7fa', color: '#555', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap' },
  td: { padding: '14px 12px', borderTop: '1px solid #eceef2', verticalAlign: 'top', fontSize: 14 },
  smallButton: { border: '1px solid #d9dbe3', borderRadius: 7, padding: '7px 9px', background: '#fff', color: '#29243b', fontWeight: 650, cursor: 'pointer', margin: '2px' },
  danger: { borderColor: '#f0c7c7', color: '#a42b2b' }
};

export default function OpportunityQuestionsManager() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const client = () => axios.create({ baseURL: API, headers: { Authorization: `Bearer ${token}` } });

  async function login(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const response = await axios.post(`${API}/connexa-activities/admin/questions-manager/login`, { username, password });
      sessionStorage.setItem(TOKEN_KEY, response.data.access_token);
      setToken(response.data.access_token);
      setPassword('');
    } catch (e) {
      setError(e.response?.data?.detail || 'Unable to sign in. Check your username and password.');
    } finally { setBusy(false); }
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken('');
    setItems([]);
  }

  async function load() {
    if (!token) return;
    setBusy(true);
    setError('');
    try {
      const response = await client().get('/connexa-activities/admin/questions', { params: filter ? { status: filter } : {} });
      setItems(response.data);
    } catch (e) {
      if (e.response?.status === 401) logout();
      setError(e.response?.data?.detail || 'Could not load opportunity questions.');
    } finally { setBusy(false); }
  }

  useEffect(() => { if (token) load(); }, [token, filter]);

  async function act(id, action) {
    try {
      await client().patch(`/connexa-activities/admin/questions/${id}`, { action });
      await load();
    } catch (e) { setError(e.response?.data?.detail || 'The action could not be completed.'); }
  }

  async function removeQuestion(q) {
    if (!window.confirm(`Delete the question submitted by ${q.attendee_name}? This cannot be undone.`)) return;
    try {
      await client().delete(`/connexa-activities/admin/questions/${q.id}`);
      await load();
    } catch (e) { setError(e.response?.data?.detail || 'Could not delete question.'); }
  }

  if (!token) return (
    <main style={{ ...styles.page, display: 'grid', placeItems: 'center' }}>
      <section style={{ ...styles.card, width: 'min(100%, 430px)', boxSizing: 'border-box' }}>
        <div style={styles.brand}>CONNEXA · THE OPPORTUNITY PLAYGROUND</div>
        <h1 style={styles.title}>The Big Question</h1>
        <p style={{ ...styles.muted, marginBottom: 22 }}>Sign in to manage submitted opportunity questions.</p>
        <form onSubmit={login}>
          <label>Username<input autoComplete="username" required value={username} onChange={e=>setUsername(e.target.value)} style={styles.input}/></label>
          <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} style={styles.input}/></label>
          {error && <p role="alert" style={{ color: '#b42318', margin: '0 0 14px' }}>{error}</p>}
          <button disabled={busy} type="submit" style={{ ...styles.button, width: '100%', padding: 13 }}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p style={{ ...styles.muted, fontSize: 12, marginTop: 18 }}>This portal is restricted to authorised question managers.</p>
      </section>
    </main>
  );

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div><div style={styles.brand}>CONNEXA · THE OPPORTUNITY PLAYGROUND</div><h1 style={styles.title}>The Big Question</h1><p style={styles.muted}>Manage attendee questions and their progress.</p></div>
          <button onClick={logout} style={styles.smallButton}>Log out</button>
        </header>
        <section style={{ ...styles.card, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <select aria-label="Filter questions by status" value={filter} onChange={e=>setFilter(e.target.value)} style={{ ...styles.input, width: 'auto', minWidth: 190, margin: 0 }}>
            <option value="">All statuses</option>{['pending','approved','called','skipped','completed','rejected'].map(x=><option key={x} value={x}>{x[0].toUpperCase()+x.slice(1)}</option>)}
          </select>
          <strong>{items.length} questions</strong><span style={styles.muted}>{busy ? 'Updating…' : 'Latest available records'}</span>
          <button onClick={load} style={{ ...styles.button, marginLeft: 'auto' }}>Refresh</button>
        </section>
        {error && <p role="alert" style={{ color: '#b42318', marginBottom: 14 }}>{error}</p>}
        <section style={styles.card}>
          <div style={styles.tableWrap}><table style={styles.table}>
            <thead><tr>{['Attendee','Ticket','Type / Category','Question','Date asked','Status','Actions'].map(x=><th key={x} style={styles.th}>{x}</th>)}</tr></thead>
            <tbody>{items.map(q=><tr key={q.id}>
              <td style={styles.td}>{q.attendee_name}</td><td style={styles.td}>{q.ticket_id}</td>
              <td style={styles.td}>{q.participant_type}<br/>{q.category}</td>
              <td style={{ ...styles.td, minWidth: 240 }}>{q.question_text}</td>
              <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>{q.created_at ? new Date(q.created_at).toLocaleString('en-GB') : '—'}</td>
              <td style={styles.td}><strong>{q.status}</strong></td>
              <td style={{ ...styles.td, minWidth: 180 }}>
                {q.status==='pending' && <><button style={styles.smallButton} onClick={()=>act(q.id,'approve')}>Approve</button><button style={styles.smallButton} onClick={()=>act(q.id,'reject')}>Reject</button></>}
                {q.status==='approved' && <button style={styles.smallButton} onClick={()=>act(q.id,'call')}>Call next</button>}
                {q.status==='called' && <><button style={styles.smallButton} onClick={()=>act(q.id,'resend')}>Resend alert</button><button style={styles.smallButton} onClick={()=>act(q.id,'complete')}>Complete</button><button style={styles.smallButton} onClick={()=>act(q.id,'skip')}>Skip</button></>}
                <button style={{ ...styles.smallButton, ...styles.danger }} onClick={()=>removeQuestion(q)}>Delete</button>
              </td>
            </tr>)}</tbody>
          </table></div>
          {!items.length && <p style={{ ...styles.muted, padding: 18 }}>{busy ? 'Loading questions…' : 'No questions in this view.'}</p>}
        </section>
      </div>
    </main>
  );
}
