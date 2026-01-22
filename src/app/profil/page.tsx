'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) return <p>Chargement...</p>;
  if (!user) return null;

  return (
    <div>
      <h1>Page de Profil</h1>
      <p>{user.name || 'Utilisateur inconnu'}</p>
    </div>
  );
}
