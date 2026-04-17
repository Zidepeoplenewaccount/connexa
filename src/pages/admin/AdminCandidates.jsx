import { useState, useEffect } from 'react';
import { getAllCandidatesAdmin } from '../../services/adminApi';
import { 
  approveCandidate, 
  rejectCandidate, 
  deleteCandidate,
  createBusinessCandidate,
  createIndividualCandidate 
} from '../../services/adminApi';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../components/admin/admin.css';
import { getUserFriendlyError, logTechnicalError } from '../../utils/errorMessages';

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('business'); 
  
  const pendingCount = candidates.filter(c => c.status === 'pending').length;
  
  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    videoUrl: '',
    instagram: '',
    tiktok: '',
    description: '',
    challenge: '',
    whyDeserve: ''
  });

  useEffect(() => {
    fetchCandidates();
  }, [filterType]);

  async function fetchCandidates() {
    try {
      setLoading(true);
      const params = {};
      if (filterType) params.candidate_type = filterType;
      if (filterStatus) params.status = filterStatus;
      
      const data = await getAllCandidatesAdmin(params);  // USE ADMIN ENDPOINT
      setCandidates(data);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal(type) {
    setModalType(type);
    setFormData({
      name: '',
      email: '',
      phone: '',
      videoUrl: '',
      instagram: '',
      tiktok: '',
      description: '',
      challenge: '',
      whyDeserve: ''
    });
    setShowModal(true);
  }

  async function handleCreate(e) {
    e.preventDefault();
    
    try {
      if (modalType === 'business') {
        await createBusinessCandidate({
          business_name: formData.name,
          business_description: formData.description,
          email: formData.email,
          phone: formData.phone || null,
          video_url: formData.videoUrl || null,
          instagram_handle: formData.instagram || null,
          tiktok_handle: formData.tiktok || null,
          challenge: formData.challenge || null,
          why_deserve: formData.whyDeserve || null
        });
      } else {
        await createIndividualCandidate({
          individual_name: formData.name,
          individual_bio: formData.description,
          email: formData.email,
          phone: formData.phone || null,
          video_url: formData.videoUrl || null,
          instagram_handle: formData.instagram || null,
          tiktok_handle: formData.tiktok || null
        });
      }
      
      alert('Candidate created successfully!');
      setShowModal(false);
      fetchCandidates();
    } catch (error) {
      logTechnicalError(error, 'ADMIN_CREATE_CANDIDATE');
      alert(getUserFriendlyError(error, { fallback: 'Unable to create candidate. Please try again.' }));
    }
  }

  async function handleApprove(candidateId) {
    if (!confirm('Approve this candidate?')) return;
    try {
      await approveCandidate(candidateId);
      fetchCandidates();
    } catch (error) {
      alert('Failed to approve');
    }
  }

  async function handleReject(candidateId) {
    const notes = prompt('Reason for rejection (optional):');
    if (notes === null) return;
    try {
      await rejectCandidate(candidateId, notes);
      fetchCandidates();
    } catch (error) {
      alert('Failed to reject');
    }
  }

  async function handleDelete(candidateId) {
    if (!confirm('Delete this candidate?')) return;
    try {
      await deleteCandidate(candidateId);
      fetchCandidates();
    } catch (error) {
      alert('Failed to delete');
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
        <h1>
          Candidates
          {pendingCount > 0 && (
            <span style={{
              marginLeft: '12px',
              padding: '4px 12px',
              background: '#f5a623',
              color: '#000',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '700'
            }}>
              {pendingCount} pending
            </span>
          )}
        </h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '10px 16px',
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px'
            }}
          >
            <option value="">All Types</option>
            <option value="business">Business</option>
            <option value="individual">Individual</option>
          </select>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 16px',
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px'
            }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <button 
            className="admin-btn" 
            onClick={() => openCreateModal('business')}
          >
            ➕ Business
          </button>
          
          <button 
            className="admin-btn" 
            onClick={() => openCreateModal('individual')}
          >
            ➕ Individual
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Email</th>
                <th>Votes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    No candidates found
                  </td>
                </tr>
              ) : (
                candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      <strong>{candidate.business_name || candidate.individual_name}</strong>
                      {candidate.video_url && (
                        <div style={{ marginTop: '4px' }}>
                          <a 
                            href={candidate.video_url} 
                            target="_blank" 
                            rel="noreferrer"
                            style={{ color: '#f5a623', fontSize: '13px' }}
                          >
                            📹 Video
                          </a>
                        </div>
                      )}
                    </td>
                    <td>{candidate.candidate_type}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.vote_count || 0}</td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: candidate.status === 'approved' 
                          ? 'rgba(45,184,75,0.15)' 
                          : candidate.status === 'pending'
                          ? 'rgba(245,166,35,0.15)'
                          : 'rgba(232,49,42,0.15)',
                        color: candidate.status === 'approved' 
                          ? '#2db84b' 
                          : candidate.status === 'pending'
                          ? '#f5a623'
                          : '#e8312a'
                      }}>
                        {candidate.status}
                      </span>
                    </td>
                    <td>
                      {candidate.status !== 'approved' && (
                        <>
                          <button 
                            className="admin-table-btn"
                            onClick={() => handleApprove(candidate.id)}
                            style={{ marginRight: '8px' }}
                          >
                            ✅ Approve
                          </button>
                          <button 
                            className="admin-table-btn"
                            onClick={() => handleReject(candidate.id)}
                            style={{ marginRight: '8px' }}
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                      <button 
                        className="admin-table-btn"
                        onClick={() => handleDelete(candidate.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Candidate Modal */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            overflowY: 'auto'
          }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div style={{
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '32px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ marginBottom: '24px' }}>
              Create {modalType === 'business' ? 'Business' : 'Individual'} Candidate
            </h2>
            
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  {modalType === 'business' ? 'Business Name' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  {modalType === 'business' ? 'Business Description' : 'Bio'} *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Phone (optional)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Video URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                  placeholder="https://instagram.com/reel/..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Instagram Handle (optional)
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                  placeholder="@username"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  TikTok Handle (optional)
                </label>
                <input
                  type="text"
                  value={formData.tiktok}
                  onChange={(e) => setFormData({...formData, tiktok: e.target.value})}
                  placeholder="@username"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </div>

              {modalType === 'business' && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                      Challenge (optional)
                    </label>
                    <textarea
                      value={formData.challenge}
                      onChange={(e) => setFormData({...formData, challenge: e.target.value})}
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0a0a0a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: '#fff',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                      Why Deserve Award (optional)
                    </label>
                    <textarea
                      value={formData.whyDeserve}
                      onChange={(e) => setFormData({...formData, whyDeserve: e.target.value})}
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0a0a0a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: '#fff',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="admin-btn" style={{ flex: 1 }}>
                  Create Candidate
                </button>
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}