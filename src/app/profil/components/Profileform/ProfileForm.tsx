'use client';

import { useAuth } from '@/app/context/AuthContext';
import { updateUserProfile } from '@/app/services/user.service';
import type { User } from '@/app/types/user';
import { useMemo, useState } from 'react';
import './ProfileForm.scss';

const splitName = (fullName?: string) => {
  if (!fullName) return { firstName: '', lastName: '' };

  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
};

export default function ProfileForm({ user }: { user: User }) {
  const { setUser } = useAuth();

  const initial = useMemo(() => {
    const { firstName, lastName } = splitName(user.name);
    return {
      firstName,
      lastName,
      email: user.email || '',
    };
  }, [user.name, user.email]);

  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [email, setEmail] = useState(initial.email);
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleIsCustomizable = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCustomizable(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);

      const fullName = `${firstName} ${lastName}`.trim().replace(/\s+/g, ' ');
      const updatedUser = await updateUserProfile(fullName, email);

      setUser(updatedUser);

      const { firstName: newFirst, lastName: newLast } = splitName(updatedUser.name);
      setFirstName(newFirst);
      setLastName(newLast);
      setEmail(updatedUser.email || '');

      setIsCustomizable(false);
    } catch {
      alert('Une erreur est survenue lors de la mise à jour du profil. Veuillez réessayer.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="firstName">Prénom</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          disabled={!isCustomizable || isSaving}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Nom</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          disabled={!isCustomizable || isSaving}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          disabled={!isCustomizable || isSaving}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {isCustomizable ? (
        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      ) : (
        <button type="button" onClick={handleIsCustomizable} disabled={isSaving}>
          Modifier les informations
        </button>
      )}
    </form>
  );
}
