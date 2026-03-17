import { api } from '../api/axiosConfig';
import type { User } from '../types/user';

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data.user;
}

export async function register(name: string, email: string, password: string): Promise<User> {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data.data.user;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
