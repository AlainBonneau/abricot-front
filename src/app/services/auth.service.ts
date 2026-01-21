import { api } from '../api/axiosConfig';
import { LoginResponse } from '../types/auth';

export async function login(email: string, password: string) {
  const response = await api.post<LoginResponse>('/auth/login', { email, password });

  return response.data.data;
}
