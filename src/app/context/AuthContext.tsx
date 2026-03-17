'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/axiosConfig';
import {
  login as loginService,
  logout as logoutService,
  register as registerService,
} from '../services/auth.service';
import type { User } from '../types/user';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const freshUser = await getMe();
        setUser(freshUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const user = await loginService(email, password);
    setUser(user);
    router.push('/profil');
  };

  const register = async (name: string, email: string, password: string) => {
    const user = await registerService(name, email, password);
    setUser(user);
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch {
      // même si la requête logout échoue, on nettoie l'état local
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      await logout();
    } catch {
      throw new Error('Failed to change password');
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      setUser,
      changePassword,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get('/auth/me');
  return data.data.user;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
