'use client';

import { api } from '@/app/api/axiosConfig';
import { useProjects } from '@/app/context/ProjectsContext';
import { X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
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

  const modalRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const firstSentinelRef = useRef<HTMLSpanElement | null>(null);
  const lastSentinelRef = useRef<HTMLSpanElement | null>(null);
  const contributorTriggerRef = useRef<HTMLButtonElement | null>(null);
  const firstContributorCheckboxRef = useRef<HTMLInputElement | null>(null);

  // Reset le state de la modal à chaque ouverture et focus le titre
  useEffect(() => {
    if (!isOpen) return;
    setTitle('');
    setDescription('');
    setSelectedContributorIds([]);
    setIsContributorOpen(false);
    setContributorsError(null);
    lastActiveElementRef.current = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => titleInputRef.current?.focus());
    return () => {
      lastActiveElementRef.current?.focus?.();
    };
  }, [isOpen]);

  // Charger les contributeurs quand la modal s'ouvre
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

  // Permet de focus le premier élément focusable de la modal
  const focusFirst = () => {
    const root = modalRef.current;
    if (!root) return;
    const focusables = root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusables[0]?.focus();
  };

  // Permet de focus le dernier élément focusable de la modal
  const focusLast = () => {
    const root = modalRef.current;
    if (!root) return;
    const focusables = root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusables[focusables.length - 1]?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="create-project-modal-overlay" onClick={onClose} role="presentation">
      <div
        ref={modalRef}
        className="create-project-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        aria-describedby="create-project-desc"
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            if (isContributorOpen) {
              setIsContributorOpen(false);
              requestAnimationFrame(() => contributorTriggerRef.current?.focus());
              return;
            }
            onClose();
          }
        }}
      >
        {/* sentinel pour empêcher le focus de sortir de la modal */}
        <span
          ref={firstSentinelRef}
          tabIndex={0}
          aria-hidden="true"
          className="sr-only"
          onFocus={focusLast}
        />

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
              ref={titleInputRef}
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
                ref={contributorTriggerRef}
                type="button"
                className="contributor-select-trigger"
                aria-label="Ouvrir le sélecteur de contributeurs"
                aria-haspopup="true"
                aria-expanded={isContributorOpen}
                disabled={isLoadingContributors}
                onClick={() => {
                  setIsContributorOpen((prev) => !prev);
                  if (!isContributorOpen) {
                    requestAnimationFrame(() => firstContributorCheckboxRef.current?.focus());
                  }
                }}
                onKeyDown={(e) => {
                  if (isLoadingContributors) return;

                  if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    setIsContributorOpen(true);
                    requestAnimationFrame(() => firstContributorCheckboxRef.current?.focus());
                  }
                }}
              >
                {isLoadingContributors
                  ? 'Chargement...'
                  : selectedContributorIds.length === 0
                    ? 'Choisir un ou plusieurs contributeurs'
                    : `${selectedContributorIds.length} contributeur(s) sélectionné(s)`}
              </button>

              {contributorsError && <p className="contributors-error">{contributorsError}</p>}

              {isContributorOpen && !isLoadingContributors && (
                <div className="contributor-select-dropdown">
                  {users.length === 0 ? (
                    <p className="contributors-empty">Aucun contributeur disponible.</p>
                  ) : (
                    users.map((user, index) => {
                      const checked = selectedContributorIds.includes(user.id);

                      return (
                        <label key={user.id} className="contributor-option">
                          <input
                            ref={index === 0 ? firstContributorCheckboxRef : undefined}
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

        {/* sentinel pour empêcher le focus de sortir de la modal */}
        <span
          ref={lastSentinelRef}
          tabIndex={0}
          aria-hidden="true"
          className="sr-only"
          onFocus={focusFirst}
        />
      </div>
    </div>
  );
}
