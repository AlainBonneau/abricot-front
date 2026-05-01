import { useEffect, useRef } from 'react';
import './EditPasswordModal.scss';

type Props = {
  isOpen: boolean;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  setCurrentPassword: (v: string) => void;
  setNewPassword: (v: string) => void;
  setConfirmNewPassword: (v: string) => void;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export default function EditPasswordModal({
  isOpen,
  currentPassword,
  newPassword,
  confirmNewPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmNewPassword,
  isLoading,
  onClose,
  onSubmit,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="edit-password-overlay" onClick={onClose}>
      <div className="edit-password-modal" ref={ref} onClick={(e) => e.stopPropagation()}>
        <h2>Changer le mot de passe</h2>

        <input
          type="password"
          placeholder="Mot de passe actuel"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmation"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />

        <div className="actions">
          <button onClick={onClose}>Annuler</button>
          <button onClick={onSubmit}>{isLoading ? '...' : 'Valider'}</button>
        </div>
      </div>
    </div>
  );
}
