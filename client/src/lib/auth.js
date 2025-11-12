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
  return data.user;
}

export async function signup(payload) {
  const { data } = await api.post('/auth/signup', payload);
  return data.user;
}

export async function logout() {
  await api.post('/auth/logout');
}
