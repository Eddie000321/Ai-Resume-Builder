import { api } from './api';

export const authKeys = {
  me: ['auth', 'me'],
};

export async function fetchCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data.user;
}

export async function login(payload) {
  const { data } = await api.post('/auth/login', payload);
  if (data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  return data.user;
}

export async function signup(payload) {
  const { data } = await api.post('/auth/signup', payload);
  if (data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  return data.user;
}

export async function logout() {
  await api.post('/auth/logout');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}
