import type { User } from '@/app/types/user';
import { api } from '../api/axiosConfig';

export async function updateUserProfile(name: string, email: string): Promise<User> {
  const { data } = await api.put('/auth/profile', { name, email });
  return data.data.user;
}
