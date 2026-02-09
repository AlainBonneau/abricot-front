'use client';

import { api } from '@/app/api/axiosConfig';
import { useProjects } from '@/app/context/ProjectsContext';
import type { ProjectMember } from '@/app/types/project';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import './EditProjectModal.scss';

type User = {
  id: string;
  name: string;
  email: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  project: { name: string; description: string } | null;
  onUpdated: (next: { name: string; description: string; members: ProjectMember[] }) => void;
};

export default function EditProjectModal({
  isOpen,
  onClose,
  projectId,
  project,
  onUpdated,
}: Props) {
  const { updateProject, addContributor, removeContributor } = useProjects();

  const [title, setTitle] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedContributorIds, setSelectedContributorIds] = useState<string[]>([]);
  const [initialContributorIds, setInitialContributorIds] = useState<string[]>([]);

  const [isContributorOpen, setIsContributorOpen] = useState(false);
  const isFormValid = title.trim() !== '' && description.trim() !== '';

  useEffect(() => {
    if (!isOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(project?.name ?? '');
    setDescription(project?.description ?? '');
  }, [isOpen, project]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchAllContributors = async () => {
      try {
        const res = await api.get('/contributors');
        setUsers(res.data.data.contributors ?? []);
      } catch (error) {
        console.error('Erreur chargement /contributors', error);
        setUsers([]);
      }
    };

    const fetchProjectContributors = async () => {
      try {
        const res = await api.get(`/projects/${projectId}/contributors`);
        const current: User[] = res.data.data.contributors ?? [];
        const ids = current.map((c) => c.id);

        setSelectedContributorIds(ids);
        setInitialContributorIds(ids);
      } catch (error) {
        console.error('Erreur chargement contributeurs projet', error);
        setSelectedContributorIds([]);
        setInitialContributorIds([]);
      }
    };

    fetchAllContributors();
    fetchProjectContributors();
  }, [isOpen, projectId]);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const nextName = title.trim();
    const nextDescription = description.trim();

    try {
      await updateProject(projectId, { name: nextName, description: nextDescription });

      const toAdd = selectedContributorIds.filter((id) => !initialContributorIds.includes(id));
      const toRemove = initialContributorIds.filter((id) => !selectedContributorIds.includes(id));

      const idToEmail = new Map(users.map((u) => [u.id, u.email]));

      const toAddEmails = toAdd
        .map((id) => idToEmail.get(id))
        .filter((email): email is string => typeof email === 'string' && email.length > 0);

      await Promise.all([
        ...toAddEmails.map((email) => addContributor(projectId, email)),
        ...toRemove.map((userId) => removeContributor(projectId, userId)),
      ]);

      const nextMembers: ProjectMember[] = users
        .filter((u) => selectedContributorIds.includes(u.id))
        .map((u) => ({
          id: u.id,
          user: {
            id: u.id,
            name: u.name,
            email: u.email,
          },
        }));

      onUpdated({
        name: nextName,
        description: nextDescription,
        members: nextMembers,
      });

      onClose();
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la mise à jour du projet');
    }
  };

  // Ferme la modal si l'utilisateur appuie sur Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isOpen]);

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
            Contributeurs :
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
