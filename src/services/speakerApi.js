import axios from 'axios';

const BACKEND_URL = 'https://connexa-aahsexcjcfakfhbd.southafricanorth-01.azurewebsites.net';
//const BACKEND_URL = 'http://127.0.0.1:8000';

const getSpeakerToken = () => localStorage.getItem('speaker_token');

const speakerAxios = axios.create({ baseURL: BACKEND_URL });

speakerAxios.interceptors.request.use((config) => {
  const token = getSpeakerToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const speakerLogin = async (email, password) => {
  const response = await axios.post(`${BACKEND_URL}/connexers/login`, { email, password });
  const { token, speaker } = response.data;
  localStorage.setItem('speaker_token', token);
  localStorage.setItem('speaker_profile', JSON.stringify(speaker));
  return response.data;
};

export const speakerSignup = async (payload) => {
  const response = await axios.post(`${BACKEND_URL}/connexers/signup`, payload);
  const { token, speaker } = response.data;
  localStorage.setItem('speaker_token', token);
  localStorage.setItem('speaker_profile', JSON.stringify(speaker));
  return response.data;
};

export const speakerLogout = async () => {
  try {
    await speakerAxios.post('/connexers/logout');
  } catch {
    // ignore
  }
  localStorage.removeItem('speaker_token');
  localStorage.removeItem('speaker_profile');
};

export const isSpeakerAuthenticated = () => !!getSpeakerToken();

export const getSpeakerProfile = () => {
  const raw = localStorage.getItem('speaker_profile');
  return raw ? JSON.parse(raw) : null;
};

// Dashboard
export const fetchSpeakerProfile = async () => {
  const response = await speakerAxios.get('/connexers/me');
  localStorage.setItem('speaker_profile', JSON.stringify(response.data));
  return response.data;
};

export const fetchSpeakerStats = async () => {
  const response = await speakerAxios.get('/connexers/me/stats');
  return response.data;
};

export const fetchSpeakerCommissions = async () => {
  const response = await speakerAxios.get('/connexers/me/commissions');
  return response.data;
};

export const fetchSpeakerAnalytics = async () => {
  const response = await speakerAxios.get('/connexers/me/analytics');
  return response.data;
};

export const fetchSpeakerQuestions = async () => {
  const response = await speakerAxios.get('/connexers/me/questions');
  return response.data;
};

export const updateSpeakerAccount = async ({ account_number, bank_name }) => {
  const response = await speakerAxios.patch('/connexers/me', { account_number, bank_name });
  localStorage.setItem('speaker_profile', JSON.stringify(response.data));
  return response.data;
};
