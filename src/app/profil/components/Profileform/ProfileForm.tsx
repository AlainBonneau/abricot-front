'use client';

import { useAuth } from '@/app/context/AuthContext';
import { updateUserProfile } from '@/app/services/user.service';
import type { User } from '@/app/types/user';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import EditPasswordModal from './EditPasswordModal/EditPasswordModal';
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
  const { setUser, changePassword, logout } = useAuth();

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
      if (fullName !== user.name) toast.success('Nom mis à jour');
      if (email !== user.email) toast.success('Email mis à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour du profil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (isChangingPassword) return;

    const current = currentPassword.trim();
    const next = newPassword.trim();
    const confirm = confirmNewPassword.trim();

    if (!current || !next || !confirm) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }

    if (next.length < 8) {
      toast.error('Minimum 8 caractères.');
      return;
    }

    if (next !== confirm) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      setIsChangingPassword(true);

      await changePassword(current, next);

      toast.success('Mot de passe changé');
      handleClosePasswordModal();
    } catch {
      toast.error('Erreur lors du changement.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleClosePasswordModal = () => {
    setIsPasswordOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="firstName">Prénom</label>
        <input
          id="firstName"
          value={firstName}
          disabled={!isCustomizable || isSaving}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Nom</label>
        <input
          id="lastName"
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

      <div className="buttons-container">
        <button type="button" onClick={() => setIsPasswordOpen(true)}>
          Modifier le mot de passe
        </button>

        {isCustomizable ? (
          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        ) : (
          <button type="button" onClick={handleIsCustomizable}>
            Modifier
          </button>
        )}

        <button type="button" onClick={logout}>
          Déconnexion
        </button>
      </div>

      <EditPasswordModal
        isOpen={isPasswordOpen}
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmNewPassword={confirmNewPassword}
        setCurrentPassword={setCurrentPassword}
        setNewPassword={setNewPassword}
        setConfirmNewPassword={setConfirmNewPassword}
        isLoading={isChangingPassword}
        onClose={handleClosePasswordModal}
        onSubmit={handleChangePassword}
      />
    </form>
  );
}
