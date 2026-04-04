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
  const response = await axios.post(`${BACKEND_URL}/speakers/login`, { email, password });
  const { token, speaker } = response.data;
  localStorage.setItem('speaker_token', token);
  localStorage.setItem('speaker_profile', JSON.stringify(speaker));
  return response.data;
};

export const speakerLogout = async () => {
  try {
    await speakerAxios.post('/speakers/logout');
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
  const response = await speakerAxios.get('/speakers/me');
  localStorage.setItem('speaker_profile', JSON.stringify(response.data));
  return response.data;
};

export const fetchSpeakerStats = async () => {
  const response = await speakerAxios.get('/speakers/me/stats');
  return response.data;
};

export const fetchSpeakerCommissions = async () => {
  const response = await speakerAxios.get('/speakers/me/commissions');
  return response.data;
};

export const fetchSpeakerAnalytics = async () => {
  const response = await speakerAxios.get('/speakers/me/analytics');
  return response.data;
};
