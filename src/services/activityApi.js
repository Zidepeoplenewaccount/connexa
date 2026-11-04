import axios from 'axios';

const BACKEND_URL = 'https://zidepeople-backend.onrender.com';
const activityApi = axios.create({ baseURL: BACKEND_URL });

// Reuse the existing Connexa admin session for protected activity endpoints.
activityApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = token;
  return config;
});

export const validateActivityTicket = async (ticket_id) =>
  (await activityApi.post('/connexa-activities/ticket/validate', { ticket_id })).data;
export const submitOpportunityQuestion = async (payload) =>
  (await activityApi.post('/connexa-activities/questions', payload)).data;
export const getOpportunityQuestionStatus = async (ticketId) =>
  (await activityApi.get(`/connexa-activities/questions/status/${encodeURIComponent(ticketId)}`)).data;
export const getDiceChallenges = async () =>
  (await activityApi.get('/connexa-activities/dice/challenges')).data;
export const getDiceTeam = async (ticketId) =>
  (await activityApi.get(`/connexa-activities/dice/team/${encodeURIComponent(ticketId)}`)).data;
export const assignDiceTeam = async (ticketId) =>
  (await activityApi.post('/connexa-activities/dice/team/assign', { ticket_id: ticketId })).data;
export const submitDiceRoll = async (payload) =>
  (await activityApi.post('/connexa-activities/dice/roll', payload)).data;
export const completeDiceRound = async (roundId, payload) =>
  (await activityApi.patch(`/connexa-activities/dice/rounds/${roundId}/complete`, payload)).data;
export const getOpportunityQuestionsAdmin = async (status = '') =>
  (await activityApi.get('/connexa-activities/admin/questions', { params: status ? { status } : {} })).data;
export const updateOpportunityQuestionAdmin = async (id, action) =>
  (await activityApi.patch(`/connexa-activities/admin/questions/${id}`, { action })).data;
export const getDiceOverviewAdmin = async () =>
  (await activityApi.get('/connexa-activities/admin/dice/overview')).data;
export const createDiceTeamAdmin = async (payload) =>
  (await activityApi.post('/connexa-activities/admin/dice/teams', payload)).data;
export const addDiceTeamMemberAdmin = async (teamId, payload) =>
  (await activityApi.post(`/connexa-activities/admin/dice/teams/${teamId}/members`, payload)).data;
export const updateDiceChallengeAdmin = async (number, payload) =>
  (await activityApi.put(`/connexa-activities/admin/dice/challenges/${number}`, payload)).data;
export const scoreDiceRoundAdmin = async (roundId, payload) =>
  (await activityApi.patch(`/connexa-activities/admin/dice/rounds/${roundId}/score`, payload)).data;
