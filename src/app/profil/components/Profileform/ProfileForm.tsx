'use client';

import { useAuth } from '@/app/context/AuthContext';
import { updateUserProfile } from '@/app/services/user.service';
import type { User } from '@/app/types/user';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
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
  const { setUser, changePassword } = useAuth();

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
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
      toast.success('Profil mis à jour avec succès !');
    } catch {
      toast.error('Une erreur est survenue lors de la mise à jour du profil. Veuillez réessayer.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isChangingPassword) return;

    const current = currentPassword.trim();
    const next = newPassword.trim();
    const confirm = confirmNewPassword.trim();

    if (!current || !next || !confirm) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }

    if (next.length < 8) {
      toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (next !== confirm) {
      toast.error('La confirmation ne correspond pas.');
      return;
    }

    try {
      setIsChangingPassword(true);

      await changePassword(current, next);

      toast.success('Mot de passe changé avec succès.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setIsPasswordOpen(false);
    } catch {
      toast.error('Erreur lors du changement de mot de passe. Veuillez réessayer.');
    } finally {
      setIsChangingPassword(false);
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

      <div className="form-group">
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          value="********"
          disabled
          aria-describedby="passwordHelp"
        />
      </div>

      <div className="password-section">
        {!isPasswordOpen ? (
          <button
            type="button"
            onClick={() => setIsPasswordOpen(true)}
            disabled={isSaving}
            aria-label="Modifier le mot de passe"
          >
            Modifier le mot de passe
          </button>
        ) : (
          <div className="password-card" role="region" aria-label="Changement de mot de passe">
            <h3>Changer le mot de passe</h3>

            <div className="form-group">
              <label htmlFor="currentPassword">Mot de passe actuel</label>
              <input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isChangingPassword}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nouveau mot de passe</label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isChangingPassword}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirmer le nouveau mot de passe</label>
              <input
                id="confirmNewPassword"
                type="password"
                autoComplete="new-password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                disabled={isChangingPassword}
              />
            </div>

            <div className="password-actions">
              <button
                type="button"
                onClick={() => {
                  setIsPasswordOpen(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                }}
                disabled={isChangingPassword}
              >
                Annuler
              </button>

              <button type="button" onClick={handleChangePassword} disabled={isChangingPassword}>
                {isChangingPassword ? 'Modification…' : 'Valider'}
              </button>
            </div>
          </div>
        )}
      </div>

      {isCustomizable ? (
        <button
          type="submit"
          disabled={isSaving}
          aria-label="Enregistrer les modifications du profil"
        >
          {isSaving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleIsCustomizable}
          disabled={isSaving}
          aria-label="Modifier les informations du profil"
        >
          Modifier les informations
        </button>
      )}
    </form>
  );
}
