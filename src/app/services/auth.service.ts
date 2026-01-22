import { api } from '../api/axiosConfig';
import type { AuthApiResponse } from '../types/auth';

export async function login(email: string, password: string) {
  const response = await api.post<AuthApiResponse>('/auth/login', { email, password });

  return response.data.data;
}

export async function register(name: string, email: string, password: string) {
  // adapte les champs si ton backend attend autre chose
  const res = await api.post<AuthApiResponse>('/auth/register', {
    name,
    email,
    password,
  });

  return res.data.data;
}
