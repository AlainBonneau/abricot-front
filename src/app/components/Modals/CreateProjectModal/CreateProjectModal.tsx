'use client';

import { api } from '@/app/api/axiosConfig';
import { useProjects } from '@/app/context/ProjectsContext';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import './CreateProjectModal.scss';

type User = {
  id: string;
  name: string;
  email: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateProjectModal({ isOpen, onClose }: Props) {
  const { createProject } = useProjects();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedContributorIds, setSelectedContributorIds] = useState<string[]>([]);
  const [isContributorOpen, setIsContributorOpen] = useState(false);
  const [isLoadingContributors, setIsLoadingContributors] = useState(false);
  const [contributorsError, setContributorsError] = useState<string | null>(null);

  const isFormValid = title.trim() !== '' && description.trim() !== '';

  useEffect(() => {
    if (!isOpen) return;
    setTitle('');
    setDescription('');
    setSelectedContributorIds([]);
    setIsContributorOpen(false);
    setContributorsError(null);
  }, [isOpen]);

  // Charger tous les contributeurs disponibles
  useEffect(() => {
    if (!isOpen) return;

    const fetchAllContributors = async () => {
      try {
        setIsLoadingContributors(true);
        setContributorsError(null);

        const res = await api.get('/contributors');
        setUsers(res.data.data.contributors ?? []);
      } catch (e) {
        console.error('Erreur chargement /contributors', e);
        setUsers([]);
        setContributorsError('Impossible de charger la liste des contributeurs.');
      } finally {
        setIsLoadingContributors(false);
      }
    };

    fetchAllContributors();
  }, [isOpen]);

  const selectedUsers = useMemo(
    () => users.filter((u) => selectedContributorIds.includes(u.id)),
    [users, selectedContributorIds],
  );

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const payload = {
      name: title.trim(),
      description: description.trim(),
      contributors: selectedUsers.map((u) => u.email),
    };

    await createProject(payload);
    onClose();
  };

  // Ferme la modal lorsque l'utilisateur appuie sur echap
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="create-project-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="create-project-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        aria-describedby="create-project-desc"
      >
        {/* HEADER */}
        <div className="create-project-modal-header">
          <h4 id="create-project-title">Créer un projet</h4>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Fermer la fenêtre de création"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="create-project-modal-body">
          <p id="create-project-desc" className="sr-only">
            Renseigne le titre, la description et choisis des contributeurs, puis valide.
          </p>

          <label>
            Titre*
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nom du projet"
            />
          </label>

          <label>
            Description*
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du projet"
            />
          </label>

          <label>
            Contributeurs :
            <div className="contributor-select">
              <button
                type="button"
                className="contributor-select-trigger"
                aria-label="Ouvrir le sélecteur de contributeurs"
                aria-haspopup="listbox"
                aria-expanded={isContributorOpen}
                onClick={() => setIsContributorOpen((prev) => !prev)}
                disabled={isLoadingContributors}
              >
                {isLoadingContributors
                  ? 'Chargement...'
                  : selectedContributorIds.length === 0
                    ? 'Choisir un ou plusieurs contributeurs'
                    : `${selectedContributorIds.length} contributeur(s) sélectionné(s)`}
              </button>

              {contributorsError && <p className="contributors-error">{contributorsError}</p>}

              {isContributorOpen && !isLoadingContributors && (
                <div
                  className="contributor-select-dropdown"
                  role="listbox"
                  aria-multiselectable="true"
                >
                  {users.length === 0 ? (
                    <p className="contributors-empty">Aucun contributeur disponible.</p>
                  ) : (
                    users.map((user) => {
                      const checked = selectedContributorIds.includes(user.id);

                      return (
                        <label key={user.id} className="contributor-option">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setSelectedContributorIds((prev) =>
                                checked ? prev.filter((id) => id !== user.id) : [...prev, user.id],
                              )
                            }
                          />
                          <span>{user.name}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </label>

          {/* FOOTER */}
          <div className="create-project-modal-footer">
            <button
              type="button"
              aria-label="Créer le projet"
              className={`submit-btn ${isFormValid ? 'enabled' : ''}`}
              onClick={handleSubmit}
              disabled={!isFormValid}
              aria-disabled={!isFormValid}
            >
              + Créer le projet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
