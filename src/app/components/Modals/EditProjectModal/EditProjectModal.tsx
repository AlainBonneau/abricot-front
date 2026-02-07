'use client';

import { api } from '@/app/api/axiosConfig';
import { useProjects } from '@/app/context/ProjectsContext';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import './EditProjectModal.scss';

type User = {
  id: string;
  name: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  project: { name: string; description: string } | null;
  onUpdated: (next: { name: string; description: string }) => void;
};

export default function EditProjectModal({
  isOpen,
  onClose,
  projectId,
  project,
  onUpdated,
}: Props) {
  const { updateProject } = useProjects();
  const [title, setTitle] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedContributorIds, setSelectedContributorIds] = useState<string[]>([]);
  const [isContributorOpen, setIsContributorOpen] = useState(false);

  const isFormValid = title.trim() !== '' && description.trim() !== '';

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      try {
        const res = await api.get(`/projects/${projectId}/contributors`);
        setUsers(res.data.data.contributors ?? []);
      } catch (error) {
        console.error('Erreur chargement contributeurs', error);
      }
    };

    fetchUsers();
  }, [isOpen, projectId]);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      await updateProject(projectId, {
        name: title.trim(),
        description: description.trim(),
        contributorIds: selectedContributorIds,
      });

      onUpdated({ name: title.trim(), description: description.trim() });
      onClose();
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la mise à jour du projet');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-project-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="edit-project-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-project-title"
        aria-describedby="edit-project-desc"
      >
        <div className="edit-project-modal-header">
          <h4 id="edit-project-title">Modifier le projet</h4>
          <button className="close-btn" onClick={onClose} aria-label="Fermer la fenêtre d'édition">
            <X size={16} />
          </button>
        </div>

        <div className="edit-project-modal-body">
          <p id="edit-project-desc" className="sr-only">
            Modifie les informations du projet puis valide avec le bouton “Enregistrer”.
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
            Contributeur :
            <div className="contributor-select">
              <button
                type="button"
                className="contributor-select-trigger"
                aria-label="Ouvrir le sélecteur de contributeurs"
                aria-haspopup="listbox"
                aria-expanded={isContributorOpen}
                onClick={() => setIsContributorOpen((prev) => !prev)}
              >
                {selectedContributorIds.length === 0
                  ? 'Choisir un ou plusieurs contributeurs'
                  : `${selectedContributorIds.length} contributeur(s) sélectionné(s)`}
              </button>

              {isContributorOpen && (
                <div
                  className="contributor-select-dropdown"
                  role="listbox"
                  aria-multiselectable="true"
                >
                  {users.map((user) => {
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
                  })}
                </div>
              )}
            </div>
          </label>

          <div className="edit-project-modal-footer">
            <button
              type="button"
              aria-label="Enregistrer les modifications du projet"
              className={`submit-btn ${isFormValid ? 'enabled' : ''}`}
              disabled={!isFormValid}
              aria-disabled={!isFormValid}
              onClick={handleSubmit}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
