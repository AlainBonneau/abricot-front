'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '../components/Loader/Loader';
import { useAuth } from '../context/AuthContext';
import ProfileForm from './components/Profileform/ProfileForm';
import './page.scss';

export default function ProfilPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) return <Loader />;
  if (!user) return null;

  return (
    <div className='profil-page'>
      <section className="profil-container">
        <h5>Mon compte</h5>
        <p>{user.name || 'Utilisateur inconnu'}</p>
        <ProfileForm user={user} />
      </section>
    </div>
  );
}
