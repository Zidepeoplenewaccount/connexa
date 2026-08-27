import axios from 'axios';
import { setupAxiosErrorHandling } from '../utils/errorMessages';

const BACKEND_URL = 'https://connexa-backend-i53r.onrender.com';
//const BACKEND_URL = 'http://127.0.0.1:8000';

const getAuthToken = () => localStorage.getItem('admin_token');

const adminAxios = axios.create({ baseURL: BACKEND_URL });
setupAxiosErrorHandling(adminAxios);

adminAxios.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = token;
  return config;
});

// Auth
export const adminLogin = (password) => {
  if (password === 'admin123') {
    const token = 'Bearer admin-secret-token';
    localStorage.setItem('admin_token', token);
    return { success: true, token };
  }
  return { success: false, error: 'Invalid password' };
};

export const adminLogout = () => localStorage.removeItem('admin_token');
export const isAuthenticated = () => !!getAuthToken();

// Dashboard
export const getDashboardStats = async () => {
  console.log('Fetching dashboard stats with token:', getAuthToken());
  const response = await adminAxios.get('/admin/dashboard', {
    headers: { Authorization: getAuthToken() }
  });
  return response.data;
};

// Tickets
export const getAllTickets = async (filters = {}) => {
  const response = await adminAxios.get('/admin/tickets', { params: filters });
  console.log('Fetched tickets:', response.data);
  return response.data;
};

export const deleteTicket = async (ticketId) => {
  const response = await adminAxios.delete(`/admin/tickets/${ticketId}`);
  return response.data;
};

export const exportTickets = async () => {
  const response = await adminAxios.get('/admin/export/tickets', { responseType: 'blob' });
  return response.data;
};

// Get all candidates (admin - includes pending)
export const getAllCandidatesAdmin = async (filters = {}) => {
  const response = await adminAxios.get('/candidates/admin/all', { params: filters });
  return response.data;
};

// Candidates
export const createBusinessCandidate = async (data) => {
  const response = await adminAxios.post('/candidates/admin/business', data);
  return response.data;
};

export const createIndividualCandidate = async (data) => {
  const response = await adminAxios.post('/candidates/admin/individual', data);
  return response.data;
};

export const approveCandidate = async (id, notes) => {
  const response = await adminAxios.patch(`/candidates/${id}/approve`, null, {
    params: { admin_notes: notes },
  });
  return response.data;
};

export const rejectCandidate = async (id, notes) => {
  const response = await adminAxios.patch(`/candidates/${id}/reject`, null, {
    params: { admin_notes: notes },
  });
  return response.data;
};

export const deleteCandidate = async (id) => {
  const response = await adminAxios.delete(`/candidates/${id}`);
  return response.data;
};

// Orders
export const getAllOrders = async (filters = {}) => {
  const response = await adminAxios.get('/merch/orders', { params: filters });
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await adminAxios.patch(`/merch/orders/${orderId}/status`, { status });
  return response.data;
};

export const exportOrders = async () => {
  const response = await adminAxios.get('/admin/export/orders', { responseType: 'blob' });
  return response.data;
};

// Payments
export const getAllPayments = async (filters = {}) => {
  const response = await adminAxios.get('/admin/payments', { params: filters });
  return response.data;
};

export const exportPayments = async () => {
  const response = await adminAxios.get('/admin/export/payments', { responseType: 'blob' });
  return response.data;
};

// Votes
export const exportVotes = async () => {
  const response = await adminAxios.get('/admin/export/votes', { responseType: 'blob' });
  return response.data;
};



// Affiliates
export const generateAffiliate = async (name, description) => {
  const response = await adminAxios.post('/affiliates/generate', null, {
    params: { name, description },
  });
  return response.data;
};

// Affiliates and Commissions
export const getAllAffiliates = async () => {
  const response = await adminAxios.get('/affiliates/');
  return response.data;
};

export const getAffiliateStats = async () => {
  const response = await adminAxios.get('/affiliates/admin/stats');
  return response.data;
};

export const getAllCommissions = async (params = {}) => {
  const response = await adminAxios.get('/affiliates/admin/commissions', { params });
  return response.data;
};

export const markCommissionPaid = async (commissionId) => {
  const response = await adminAxios.patch(`/affiliates/admin/commissions/${commissionId}/mark-paid`);
  return response.data;
};

export const bulkMarkCommissionsPaid = async (commissionIds) => {
  const response = await adminAxios.patch('/affiliates/admin/commissions/bulk-mark-paid', commissionIds);
  return response.data;
};

export const toggleAffiliate = async (code) => {
  const response = await adminAxios.patch(`/affiliates/${code}/toggle`);
  return response.data;
};

export const deleteAffiliate = async (code) => {
  const response = await adminAxios.delete(`/affiliates/${code}`);
  return response.data;
};
export const createAffiliate = async (data) => {
  const response = await adminAxios.post('/affiliates/admin/create', data);
  return response.data;
};






// Speaker Questions (Admin)
export const getAllQuestions = async (filters = {}) => {
  const response = await adminAxios.get('/speaker-questions/admin/all', { params: filters });
  return response.data;
};

export const updateQuestion = async (questionId, updateData) => {
  const response = await adminAxios.patch(`/speaker-questions/admin/${questionId}`, updateData);
  return response.data;
};

export const deleteQuestion = async (questionId) => {
  const response = await adminAxios.delete(`/speaker-questions/admin/${questionId}`);
  return response.data;
};


// Discount Codes
export const createDiscountCode = async (codeData) => {
  const response = await axios.post(`${BACKEND_URL}/discount-codes/create`, codeData, {
    headers: { Authorization: getAuthToken() }
  });
  console.log('Request data for creating discount code:', codeData);
  console.log('Created discount code:', response.data);
  return response.data;
};

export const getDiscountCodeUses = async (code) => {
  const response = await axios.get(`${BACKEND_URL}/discount-codes/${code}/uses`, {
    headers: { Authorization: getAuthToken() }
  });
  return response.data;
};


export const getAllDiscountCodes = async () => {
  const response = await axios.get(`${BACKEND_URL}/discount-codes/all`, {
    headers: { Authorization: getAuthToken() }
  });
  console.log('Fetched discount codes:', response.data);
  return response.data;
};

export const updateDiscountCode = async (code, updateData) => {
  const response = await axios.patch(`${BACKEND_URL}/discount-codes/${code}`, updateData, {
    headers: { Authorization: getAuthToken() }
  });
  return response.data;
};

export const deleteDiscountCode = async (code) => {
  const response = await axios.delete(`${BACKEND_URL}/discount-codes/${code}`, {
    headers: { Authorization: getAuthToken() }
  });
  return response.data;
};

export const getDiscountStats = async () => {
  const response = await axios.get(`${BACKEND_URL}/discount-codes/stats/summary`, {
    headers: { Authorization: getAuthToken() }
  });
  return response.data;
};