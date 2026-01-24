'use client';

import { useAuth } from '@/app/context/AuthContext';
import { updateUserProfile } from '@/app/services/user.service';
import type { User } from '@/app/types/user';
import { useState } from 'react';
import './ProfileForm.scss';

export default function ProfileForm({ user }: { user: User }) {
  const { setUser } = useAuth();
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
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
      const updatedUser = await updateUserProfile(name, email);

      setUser(updatedUser);

      setName(updatedUser.name || '');
      setEmail(updatedUser.email || '');
      setIsCustomizable(false);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nom</label>
        <input
          id="name"
          type="text"
          value={name}
          disabled={!isCustomizable || isSaving}
          onChange={(e) => setName(e.target.value)}
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
        <button type="button" onClick={handleIsCustomizable}>
          Modifier les informations
        </button>
      )}
    </form>
  );
}
