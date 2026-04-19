import { useState, useEffect } from 'react';
import { getAllQuestions, updateQuestion, deleteQuestion } from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../components/admin/admin.css';

export default function AdminQuestionsFeaturePage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSpeaker, setFilterSpeaker] = useState('');
  const [filterTicketType, setFilterTicketType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editText, setEditText] = useState('');

  const speakers = [...new Set(questions.map(q => q.speaker_name))];

  useEffect(() => {
    fetchQuestions();
  }, [filterSpeaker, filterTicketType, filterStatus]);

  async function fetchQuestions() {
    try {
      setLoading(true);
      const params = {};
      if (filterSpeaker) params.speaker_name = filterSpeaker;
      if (filterTicketType) params.ticket_type = filterTicketType;
      if (filterStatus) params.status = filterStatus;
      const data = await getAllQuestions(params);
      setQuestions(data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(questionId, newStatus) {
    try {
      await updateQuestion(questionId, { status: newStatus });
      fetchQuestions();
    } catch (error) {
      alert('Failed to update status');
    }
  }

  function startEditing(question) {
    setEditingQuestion(question.id);
    setEditText(question.question_text);
  }

  function cancelEditing() {
    setEditingQuestion(null);
    setEditText('');
  }

  async function saveEdit(questionId) {
    try {
      await updateQuestion(questionId, { question_text: editText });
      setEditingQuestion(null);
      setEditText('');
      fetchQuestions();
    } catch (error) {
      alert('Failed to update question');
    }
  }

  async function handleDelete(questionId) {
    if (!confirm('Delete this question?')) return;
    try {
      await deleteQuestion(questionId);
      fetchQuestions();
    } catch (error) {
      alert('Failed to delete question');
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading-msg">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Connexer Questions</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select value={filterSpeaker} onChange={(e) => setFilterSpeaker(e.target.value)} style={{ padding: '10px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px' }}>
            <option value="">All Speakers</option>
            {speakers.map(speaker => (<option key={speaker} value={speaker}>{speaker}</option>))}
          </select>
          <select value={filterTicketType} onChange={(e) => setFilterTicketType(e.target.value)} style={{ padding: '10px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px' }}>
            <option value="">All Ticket Types</option>
            <option value="General Access Ticket">General Access</option>
            <option value="Individual Pass — Regular">Regular</option>
            <option value="Connectors Pass">Connectors</option>
            <option value="Individual Pass — VIP">VIP</option>
            <option value="Business Owner Pass">Business Owner</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '10px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px' }}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="selected">Selected</option>
            <option value="answered">Answered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Speaker</th>
                <th>Question</th>
                <th>Attendee</th>
                <th>Ticket Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No questions found</td></tr>
              ) : (
                questions.map((question) => (
                  <tr key={question.id}>
                    <td><strong>{question.speaker_name}</strong></td>
                    <td>
                      {editingQuestion === question.id ? (
                        <div>
                          <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows="3" style={{ width: '100%', padding: '8px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', color: '#fff', fontSize: '13px' }} />
                          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                            <button onClick={() => saveEdit(question.id)} style={{ padding: '6px 12px', background: '#2db84b', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>Save</button>
                            <button onClick={cancelEditing} style={{ padding: '6px 12px', background: '#333', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p style={{ margin: '0 0 8px 0' }}>{question.question_text}</p>
                          <button onClick={() => startEditing(question)} className="admin-table-btn">✏️ Edit</button>
                        </div>
                      )}
                    </td>
                    <td>
                      <div>{question.attendee_name}</div>
                      <small style={{ color: 'rgba(255,255,255,0.5)' }}>{question.attendee_email}</small><br />
                      <small style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{question.ticket_id}</small>
                    </td>
                    <td>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: question.ticket_type.includes('VIP') || question.ticket_type.includes('Business') ? 'rgba(245,166,35,0.2)' : 'rgba(255,255,255,0.1)', color: question.ticket_type.includes('VIP') || question.ticket_type.includes('Business') ? '#f5a623' : 'rgba(255,255,255,0.6)' }}>
                        {question.ticket_type}
                      </span>
                    </td>
                    <td>
                      <select value={question.status} onChange={(e) => handleStatusChange(question.id, e.target.value)} style={{ padding: '6px 10px', background: question.status === 'selected' ? 'rgba(45,184,75,0.15)' : question.status === 'answered' ? 'rgba(26,115,232,0.15)' : question.status === 'rejected' ? 'rgba(232,49,42,0.15)' : 'rgba(245,166,35,0.15)', border: '1px solid', borderColor: question.status === 'selected' ? '#2db84b' : question.status === 'answered' ? '#1a73e8' : question.status === 'rejected' ? '#e8312a' : '#f5a623', borderRadius: '6px', color: question.status === 'selected' ? '#2db84b' : question.status === 'answered' ? '#1a73e8' : question.status === 'rejected' ? '#e8312a' : '#f5a623', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                        <option value="pending">Pending</option>
                        <option value="selected">Selected</option>
                        <option value="answered">Answered</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      <div>{new Date(question.created_at).toLocaleDateString()}</div>
                      <small style={{ color: 'rgba(255,255,255,0.5)' }}>{new Date(question.created_at).toLocaleTimeString()}</small>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {question.status === 'pending' && (
                          <button onClick={() => handleStatusChange(question.id, 'selected')} style={{ padding: '6px 14px', background: '#2db84b', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>✓ Approve</button>
                        )}
                        <button className="admin-table-btn" onClick={() => handleDelete(question.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-stats-grid" style={{ marginTop: '32px' }}>
        <div className="admin-stat-card"><div className="admin-stat-value">{questions.length}</div><div className="admin-stat-label">Total Questions</div></div>
        <div className="admin-stat-card" style={{ borderColor: '#f5a623' }}><div className="admin-stat-value" style={{ color: '#f5a623' }}>{questions.filter(q => q.status === 'pending').length}</div><div className="admin-stat-label">Pending</div></div>
        <div className="admin-stat-card" style={{ borderColor: '#2db84b' }}><div className="admin-stat-value" style={{ color: '#2db84b' }}>{questions.filter(q => q.status === 'selected').length}</div><div className="admin-stat-label">Selected</div></div>
        <div className="admin-stat-card" style={{ borderColor: '#1a73e8' }}><div className="admin-stat-value" style={{ color: '#1a73e8' }}>{questions.filter(q => q.status === 'answered').length}</div><div className="admin-stat-label">Answered</div></div>
      </div>
    </AdminLayout>
  );
}
